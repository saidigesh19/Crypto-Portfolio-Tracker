import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { addHolding } from "../api/holdings";
import { getCookie } from '../utils/cookies';

const AddHolding = ({ onHoldingAdded }) => {
  const [formData, setFormData] = useState({
    coinId: "",
    symbol: "",
    amount: "",
    buyPrice: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.coinId || !formData.symbol || !formData.amount || !formData.buyPrice) {
      setError("All fields are required");
      return;
    }

    if (isNaN(formData.amount) || formData.amount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    if (isNaN(formData.buyPrice) || formData.buyPrice <= 0) {
      setError("Buy Price must be a positive number");
      return;
    }

    try {
      setLoading(true);
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = getCookie("userId");
      }

      const payload = {
        userId,
        coinId: formData.coinId.toLowerCase(),
        symbol: formData.symbol.toLowerCase(),
        amount: parseFloat(formData.amount),
        buyPrice: parseFloat(formData.buyPrice),
      };

      const newHolding = await addHolding(payload);

      setSuccess(true);
      setFormData({
        coinId: "",
        symbol: "",
        amount: "",
        buyPrice: "",
      });

      setTimeout(() => setSuccess(false), 3000);

      // Notify parent component
      if (onHoldingAdded) {
        onHoldingAdded(newHolding);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 3, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Add New Holding
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Holding added successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Coin ID (e.g., bitcoin, ethereum)"
            name="coinId"
            value={formData.coinId}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="bitcoin"
          />

          <TextField
            label="Symbol (e.g., BTC, ETH)"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="BTC"
          />

          <TextField
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            fullWidth
            size="small"
            inputProps={{ step: "0.00000001" }}
            placeholder="0.5"
          />

          <TextField
            label="Buy Price (USD)"
            name="buyPrice"
            type="number"
            value={formData.buyPrice}
            onChange={handleChange}
            fullWidth
            size="small"
            inputProps={{ step: "0.01" }}
            placeholder="45000"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : "Add Holding"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddHolding;
