
import express from "express";
import { computeUserPortfolio } from "../service/portfolioCompute.js";


const router = express.Router();

// GET /api/portfolio/:userId - Get computed portfolio summary for a user
router.get("/:userId", async (req, res) => {
  try {
    const data = await computeUserPortfolio(req.params.userId);
    res.json(data);
  } catch (err) {
    console.error("portfolio endpoint error", err?.message || err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
