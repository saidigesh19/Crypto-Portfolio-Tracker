import express from "express";
import {
  createHolding,
  getHoldingsByUser,
  updateHoldingById,
  deleteHoldingById,
} from "../Controller/holdingController.js";

const router = express.Router();

router.post("/", createHolding);
router.get("/:userId", getHoldingsByUser);
router.put("/:id", updateHoldingById);
router.delete("/:id", deleteHoldingById);

export default router;