// src/routes/paymentRoutes.js
import express from "express";
import { createRazorpayOrder, saveOrder } from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();

router.use(verifyToken, attachUser);

router.post("/razorpay/order", createRazorpayOrder);

router.post("/order/save", saveOrder);

export default router;