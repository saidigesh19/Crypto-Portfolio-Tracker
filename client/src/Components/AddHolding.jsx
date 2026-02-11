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
  // State for form fields
  const [formData, setFormData] = useState({
    coinId: "",
    symbol: "",
    amount: "",
    buyPrice: "",
  });

  // State for loading, error, and success messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  // Handle form submission to add a new holding
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for required fields and positive numbers
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
      // Get userId from localStorage or cookies
      let userId = localStorage.getItem("userId");
      if (!userId) {
        userId = getCookie("userId");
      }

      // Prepare payload for API
      const payload = {
        userId,
        coinId: formData.coinId.toLowerCase(),
        symbol: formData.symbol.toLowerCase(),
        amount: parseFloat(formData.amount),
        buyPrice: parseFloat(formData.buyPrice),
      };

      // Call API to add holding
      const newHolding = await addHolding(payload);

      setSuccess(true);
      setFormData({
        coinId: "",
        symbol: "",
        amount: "",
        buyPrice: "",
      });

      setTimeout(() => setSuccess(false), 3000);

      // Notify parent component of new holding
      if (onHoldingAdded) {
        onHoldingAdded(newHolding);
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Render add holding form UI
  return (
    <Card sx={{ mb: 3, maxWidth: 600 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Add New Holding
        </Typography>

        {/* Show error message if any */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Show success message if holding added */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Holding added successfully!
          </Alert>
        )}

        {/* Holding form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Coin ID input */}
          <TextField
            label="Coin ID (e.g., bitcoin, ethereum)"
            name="coinId"
            value={formData.coinId}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="bitcoin"
          />

          {/* Symbol input */}
          <TextField
            label="Symbol (e.g., BTC, ETH)"
            name="symbol"
            value={formData.symbol}
            onChange={handleChange}
            fullWidth
            size="small"
            placeholder="BTC"
          />

          {/* Amount input */}
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

          {/* Buy Price input */}
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

          {/* Submit button */}
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
