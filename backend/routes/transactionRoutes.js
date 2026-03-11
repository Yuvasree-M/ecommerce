import express from "express";
import {  getTransactions } from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();
// Get all transactions (for admin)
router.get("/", verifyToken, attachUser, getTransactions);

export default router;