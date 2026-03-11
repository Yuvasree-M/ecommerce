import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { createRazorpayOrder, saveOrder } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/create-order", verifyToken, attachUser, createRazorpayOrder);


export default router;