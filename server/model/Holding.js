import mongoose from "mongoose";

// Defines the Holding document structure
const HoldingSchema = new mongoose.Schema({
    userId:   { type: String }, // User who owns this holding
    coinId:   { type: String, required: true }, // CoinGecko coin ID
    symbol:   { type: String, required: true }, // Ticker symbol (e.g., BTC)
    amount:   { type: Number, required: true }, // Amount of coin held
    buyPrice: { type: Number, required: true }  // Price at which bought
});

export default mongoose.model("Holding", HoldingSchema);
