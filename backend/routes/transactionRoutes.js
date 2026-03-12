// src/routes/transactionRoutes.js
import express from "express";
import { getAllTransactions, getUserTransactions } from "../controllers/transactionController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin: Get all transactions
router.get("/", verifyToken, attachUser, checkAdmin, getAllTransactions);

// User: Get only their transactions
router.get("/me", verifyToken, attachUser, getUserTransactions);

export default router;