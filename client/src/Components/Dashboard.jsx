import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import PortfolioSummaryCards from "./dashboard/PortfolioSummaryCards";
import PortfolioCharts from "./dashboard/PortfolioCharts";
import HoldingsTable from "./dashboard/HoldingsTable";
import EditHoldingDialog from "./dashboard/EditHoldingDialog";
import useHoldings from "../hooks/useHoldings";
import useSocketPortfolio from "../hooks/useSocketPortfolio";
import { updateHolding, deleteHolding } from "../api/holdings";
import { fetchCoinPrices, fetchCoinList, buildPortfolio, buildPerCoinPnL } from "../utils/portfolio";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const { holdings: rawHoldings, setHoldings: setRawHoldings, loading, error } = useHoldings(userId);
  const [displayHoldings, setDisplayHoldings] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [chartPoints, setChartPoints] = useState([]);
  const [coinSeries, setCoinSeries] = useState({});
  const [chartWindow, setChartWindow] = useState("1d");
  const [editOpen, setEditOpen] = useState(false);
  const [editHolding, setEditHolding] = useState(null);

  const openEdit = (holding) => {
    setEditHolding(holding);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditHolding(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditHolding(prev => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    if (!editHolding || !editHolding._id) return;
    try {
      const id = editHolding._id;
      const payload = {
        coinId: editHolding.coinId,
        symbol: editHolding.symbol,
        amount: Number(editHolding.amount),
        buyPrice: Number(editHolding.buyPrice)
      };
      const updated = await updateHolding(id, payload);
      setRawHoldings((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
      closeEdit();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (holding) => {
    if (!holding || !holding._id) return;
    if (!confirm('Delete this holding?')) return;
    try {
      await deleteHolding(holding._id);
      setRawHoldings((prev) => prev.filter((h) => h._id !== holding._id));
    } catch (err) {
      console.error(err);
    }
  };
  const calculatePortfolioStats = useCallback(async () => {
    if (!rawHoldings.length) return;

    try {
      const coinIds = [...new Set(rawHoldings.map((h) => h.coinId).filter(Boolean))];
      if (coinIds.length === 0) return;

      const prices = await fetchCoinPrices(coinIds);
      let combinedPrices = { ...prices };

      const missingIds = coinIds.filter((id) => !combinedPrices[id]);
      if (missingIds.length > 0) {
        try {
          const coinList = await fetchCoinList();
          const symbolToId = {};
          coinList.forEach((c) => {
            if (c?.symbol) symbolToId[c.symbol.toLowerCase()] = c.id;
          });

          const fallbackIds = [];
          rawHoldings.forEach((h) => {
            if (!combinedPrices[h.coinId] && h.symbol) {
              const mapped = symbolToId[h.symbol.toLowerCase()];
              if (mapped) fallbackIds.push(mapped);
            }
          });

          if (fallbackIds.length > 0) {
            const unique = [...new Set(fallbackIds)];
            const fallbackPrices = await fetchCoinPrices(unique);
            combinedPrices = { ...combinedPrices, ...fallbackPrices };
          }
        } catch (err) {
          console.warn("CoinGecko fallback symbol->id mapping failed", err);
        }
      }

      const { portfolioData: nextPortfolio, updatedHoldings } = buildPortfolio({
        holdings: rawHoldings,
        prices: combinedPrices,
      });

      setPortfolioData(nextPortfolio);
      setDisplayHoldings(updatedHoldings);

      const nowISO = new Date().toISOString();
      setChartPoints((prev) => {
        const next = [...prev, { time: nowISO, value: Number(nextPortfolio.totalValue) }];
        return next.slice(-288);
      });

      const perCoin = buildPerCoinPnL(updatedHoldings);
      setCoinSeries((prev) => {
        const next = { ...prev };
        Object.entries(perCoin).forEach(([sym, pnl]) => {
          next[sym] = [...(next[sym] || []), { time: nowISO, value: pnl }].slice(-288);
        });
        return next;
      });
    } catch (err) {
      console.error("Error calculating portfolio stats:", err);
    }
  }, [rawHoldings]);

  useEffect(() => {
    calculatePortfolioStats();
  }, [calculatePortfolioStats]);

  useSocketPortfolio({
    userId,
    onUpdate: ({ payload, nowISO, perCoin }) => {
      if (!payload) return;
      setPortfolioData({
        totalCost: payload.totalCost.toFixed(2),
        totalValue: payload.currentValue.toFixed(2),
        totalProfit: payload.totalProfit.toFixed(2),
        totalProfitPercent: payload.roi.toFixed(2),
        profitStatus: payload.profitStatus,
      });

      setChartPoints((prev) => {
        const next = [...prev, { time: nowISO, value: Number(payload.currentValue) }];
        return next.slice(-288);
      });

      setCoinSeries((prev) => {
        const next = { ...prev };
        Object.entries(perCoin).forEach(([sym, pnl]) => {
          next[sym] = [...(next[sym] || []), { time: nowISO, value: pnl }].slice(-288);
        });
        return next;
      });
    },
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading portfolio...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PortfolioSummaryCards portfolioData={portfolioData} />

        <div style={{ marginBottom: 16 }}>
          <Button variant="contained" color="primary" onClick={() => navigate("/add-holding")}>
            Add Holding
          </Button>
        </div>

        <PortfolioCharts
          chartWindow={chartWindow}
          setChartWindow={setChartWindow}
          chartPoints={chartPoints}
          coinSeries={coinSeries}
          holdings={displayHoldings}
        />

        <HoldingsTable holdings={displayHoldings} onEdit={openEdit} onDelete={handleDelete} />
      </Container>

      <EditHoldingDialog
        open={editOpen}
        holding={editHolding}
        onChange={handleEditChange}
        onClose={closeEdit}
        onSave={submitEdit}
      />
    </>
  );
};

export default Dashboard;
