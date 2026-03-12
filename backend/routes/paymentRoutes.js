// src/routes/paymentRoutes.js
import express from "express";
import { createRazorpayOrder, saveOrder } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();

// All payment routes require authentication
router.use(verifyToken, attachUser);

// Create Razorpay order
router.post("/razorpay/order", createRazorpayOrder);

// Save order and transaction (after payment)
router.post("/order/save", saveOrder);

export default router;