import React, { useEffect, useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import ConfirmDialog from "../Components/dashboard/ConfirmDialog";
import Header from "../Components/Header";
import PortfolioSummaryCards from "../Components/dashboard/PortfolioSummaryCards";
import HoldingsTable from "../Components/dashboard/HoldingsTable";
import EditHoldingDialog from "../Components/dashboard/EditHoldingDialog";
import useHoldings from "../hooks/useHoldings";
import useSocketPortfolio from "../hooks/useSocketPortfolio";
import { updateHolding, deleteHolding } from "../api/holdings";
import { getPortfolio } from "../api/portfolio";
import "../styles/Dashboard.css";
import PortfolioCharts from "../Components/dashboard/PortfolioCharts";
import { Skeleton } from "@mui/material";
import { getCookie } from '../utils/cookies';
const Dashboard = () => {
	// Get userId from cookies
	const userId = getCookie("userId");
	// Custom hook to fetch and manage holdings
	const {
		holdings,
		setHoldings,
		loading,
		error,
	} = useHoldings(userId);

	// State for portfolio summary, edit dialog, and delete confirmation
	const [portfolioData, setPortfolioData] = useState(null);
	const [editOpen, setEditOpen] = useState(false);
	const [editHolding, setEditHolding] = useState(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState(null);

	// --- Edit dialog handlers ---
	// Open edit dialog for a holding
	const openEdit = (holding) => {
		setEditHolding(holding);
		setEditOpen(true);
	};
	// Close edit dialog
	const closeEdit = () => {
		setEditOpen(false);
		setEditHolding(null);
	};
	// Handle changes in edit dialog fields
	const handleEditChange = (e) => {
		const { name, value } = e.target;
		setEditHolding((prev) => ({ ...prev, [name]: value }));
	};
	// Submit edited holding and refresh portfolio
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
			await updateHolding(id, payload);
			// Re-fetch portfolio after edit
			const data = await getPortfolio(userId);
			setPortfolioData({
				totalCost: Number(data.totalCost || 0).toFixed(2),
				totalValue: Number(data.currentValue || 0).toFixed(2),
				totalProfit: Number(data.totalProfit || 0).toFixed(2),
				totalProfitPercent: Number(data.roi || 0).toFixed(2),
				profitStatus: data.profitStatus || "profit",
			});
			setHoldings(Array.isArray(data.holdings) ? data.holdings : []);
			closeEdit();
		} catch (err) {
			alert("Failed to update holding: " + (err.message || err));
		}
	};

	// --- Delete dialog handlers ---
	// Open confirmation dialog for deleting a holding
	const handleDelete = async (holding) => {
		if (!holding || !holding._id) {
			alert("Invalid holding selected for deletion.");
			return;
		}
		setDeleteTarget(holding);
		setConfirmOpen(true);
	};

	// Confirm and delete the selected holding
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

	// --- Initial portfolio fetch on mount ---
	useEffect(() => {
		const seed = async () => {
			if (!userId) {
				return;
			}
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
				alert("Failed to fetch portfolio: " + (err.message || err));
			}
		};
		seed();
	}, [userId, setHoldings]);

	// --- Real-time portfolio updates via socket ---
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

	// --- Loading and error states ---
	if (loading) {
		return (
			<Container maxWidth="lg" sx={{ py: 4 }} className="dashboard-container">
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

	// --- Main dashboard UI ---
	return (
		<>
			<Header />
			<Container maxWidth="lg" sx={{ py: 4 }}>
				{/* Portfolio summary cards */}
				<PortfolioSummaryCards portfolioData={portfolioData} aria-label="Portfolio summary cards" />
				{/* Portfolio distribution chart */}
				<PortfolioCharts holdings={holdings} aria-label="Portfolio distribution chart" />
				{/* Holdings table */}
				<HoldingsTable holdingsList={holdings} onEditHolding={openEdit} onDeleteHolding={handleDelete} aria-label="Holdings table" />
			</Container>
			{/* Edit holding dialog */}
			<EditHoldingDialog
				open={editOpen}
				holding={editHolding}
				onChange={handleEditChange}
				onClose={closeEdit}
				onSave={submitEdit}
			/>
			{/* Confirm delete dialog */}
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
