import React, { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import ConfirmDialog from "./dashboard/ConfirmDialog";
import Header from "../Components/Header";
import PortfolioSummaryCards from "./dashboard/PortfolioSummaryCards";
import HoldingsTable from "./dashboard/HoldingsTable";
import EditHoldingDialog from "./dashboard/EditHoldingDialog";
import useHoldings from "../hooks/useHoldings";
import useSocketPortfolio from "../hooks/useSocketPortfolio";
import { updateHolding, deleteHolding } from "../api/holdings";
import { getPortfolio } from "../api/portfolio";
import "../styles/Dashboard.css";
import PortfolioCharts from "./dashboard/PortfolioCharts";
import { Skeleton } from "@mui/material";
import { memo } from "react";

const Dashboard = () => {
  const userId = localStorage.getItem("userId");
  const {
    holdings,
    setHoldings,
    loading,
    error,
  } = useHoldings(userId);

  const [portfolioData, setPortfolioData] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editHolding, setEditHolding] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Edit dialog handlers
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
    setEditHolding((prev) => ({ ...prev, [name]: value }));
  };
  const submitEdit = async () => {
    if (!editHolding || !editHolding._id) return;
    try {
      const id = editHolding._id;
      const payload = {
        coinId: editHolding.coinId,
        symbol: editHolding.symbol,
        amount: Number(editHolding.amount),
        buyPrice: Number(editHolding.buyPrice),
      };
      const updated = await updateHolding(id, payload);
      setHoldings((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
      closeEdit();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDelete = async(holding) => {
    if (!holding || !holding._id) {
      alert("Invalid holding selected for deletion.");
      return;
    }
    setDeleteTarget(holding);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !deleteTarget._id) {
      setConfirmOpen(false);
      return;
    }
    try {
      await deleteHolding(deleteTarget._id);
      setHoldings((prev) => prev.filter((h) => h._id !== deleteTarget._id));
      setConfirmOpen(false);
      setDeleteTarget(null);
      alert("Holding deleted successfully.");
    } catch (err) {
      setConfirmOpen(false);
      setDeleteTarget(null);
      alert("Failed to delete holding: " + (err.message || err));
    }
  };

  useEffect(() => {
    const seed = async () => {
      if (!userId) return;
      try {
        const data = await getPortfolio(userId);
        setPortfolioData({
          totalCost: Number(data.totalCost || 0).toFixed(2),
          totalValue: Number(data.currentValue || 0).toFixed(2),
          totalProfit: Number(data.totalProfit || 0).toFixed(2),
          totalProfitPercent: Number(data.roi || 0).toFixed(2),
          profitStatus: data.profitStatus || "profit",
        });
        setHoldings(Array.isArray(data.holdings) ? data.holdings : []);
      } catch (err) {
        console.warn("Initial portfolio fetch failed", err?.message || err);
      }
    };
    seed();
  }, [userId, setHoldings]);

  useSocketPortfolio({
    userId,
    onUpdate: ({ payload }) => {
      if (!payload) return;
      setPortfolioData({
        totalCost: payload.totalCost.toFixed(2),
        totalValue: payload.currentValue.toFixed(2),
        totalProfit: payload.totalProfit.toFixed(2),
        totalProfitPercent: payload.roi.toFixed(2),
        profitStatus: payload.profitStatus,
      });
      if (Array.isArray(payload.holdings)) {
        setHoldings(payload.holdings);
      }
    },
  });

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={220} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={400} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" role="alert">Error: {error}</Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <PortfolioSummaryCards portfolioData={portfolioData} aria-label="Portfolio summary cards" />
        <PortfolioCharts holdings={holdings} aria-label="Portfolio distribution chart" />
        <HoldingsTable holdingsList={holdings} onEditHolding={openEdit} onDeleteHolding={handleDelete} aria-label="Holdings table" />
      </Container>
      <EditHoldingDialog
        open={editOpen}
        holding={editHolding}
        onChange={handleEditChange}
        onClose={closeEdit}
        onSave={submitEdit}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete Holding"
        content={deleteTarget ? `Are you sure you want to delete holding for ${deleteTarget.symbol}?` : "Are you sure you want to delete this holding?"}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default Dashboard;
