import Holding from "../model/Holding.js";
import { computeAndEmitUser } from "../service/portfolioCompute.js";

// Create a new holding
export const createHolding = async (req, res) => {
  try {
    const holding = await Holding.create(req.body);
    res.status(201).json(holding);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all holdings for a specific user
export const getHoldingsByUser = async (req, res) => {
  try {
    const holding = await Holding.find({ userId: req.params.userId });
    res.json(holding);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a holding by its ID

// Expects req.io to be set by router
export const updateHoldingById = async (req, res) => {
  try {
    const updated = await Holding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    // Emit updated portfolio to user socket room
    if (req.io && updated.userId) {
      await computeAndEmitUser(req.io, updated.userId);
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a holding by its ID

export const deleteHoldingById = async (req, res) => {
  try {
    // Find holding to get userId before deleting
    const holding = await Holding.findById(req.params.id);
    if (!holding) return res.status(404).json({ message: "Not found" });
    await Holding.findByIdAndDelete(req.params.id);
    // Emit updated portfolio to user socket room
    if (req.io && holding.userId) {
      await computeAndEmitUser(req.io, holding.userId);
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
