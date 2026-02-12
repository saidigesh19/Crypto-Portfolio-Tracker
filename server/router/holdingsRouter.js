

import express from "express";
import {
  createHolding,
  getHoldingsByUser,
  updateHoldingById,
  deleteHoldingById,
} from "../Controller/holdingController.js";

// Middleware to inject io instance into req

function injectIO(io) {
  return (req, res, next) => {
    req.io = io;
    next();
  };
}


const router = express.Router();

// POST /api/holdings - Create a new holding
router.post("/", createHolding);
// GET /api/holdings/:userId - Get all holdings for a user
router.get("/:userId", getHoldingsByUser);
// PUT /api/holdings/:id - Update a holding by ID
router.put("/:id", updateHoldingById);
// DELETE /api/holdings/:id - Delete a holding by ID
router.delete("/:id", deleteHoldingById);

// These will be wrapped with injectIO in server/index.js
export default router;
export { injectIO };