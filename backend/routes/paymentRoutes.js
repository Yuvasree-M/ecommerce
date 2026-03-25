
import express from "express";
import { createRazorpayOrder, saveOrder } from "../controllers/paymentController.js";
import { razorpayWebhook } from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

// Protected routes
router.post("/razorpay/order", verifyToken, attachUser, createRazorpayOrder);

router.post("/order/save", verifyToken, attachUser, saveOrder);

export default router;