import Holding from "../model/Holding.js";

export const createHolding = async (req, res) => {
  try {
    const holding = await Holding.create(req.body);
    res.status(201).json(holding);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getHoldingsByUser = async (req, res) => {
  try {
    const holding = await Holding.find({ userId: req.params.userId });
    res.json(holding);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateHoldingById = async (req, res) => {
  try {
    const updated = await Holding.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteHoldingById = async (req, res) => {
  try {
    await Holding.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
