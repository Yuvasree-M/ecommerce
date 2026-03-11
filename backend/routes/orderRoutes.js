import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import {
  placeOrder,
  getOrders,
  softDeleteOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PLACE ORDER (after Razorpay payment success)
router.post("/place-order", verifyToken, attachUser, placeOrder);

// USER ORDERS
router.get("/", verifyToken, attachUser, getOrders);

// HIDE USER ORDERS
router.delete("/clear", verifyToken, attachUser, softDeleteOrders);


// ---------------- ADMIN ROUTES ----------------

// GET ALL ORDERS
router.get("/all", verifyToken, attachUser, checkAdmin, getAllOrders);

// UPDATE ORDER STATUS
router.put("/:id/status", verifyToken, attachUser, checkAdmin, updateOrderStatus);

export default router;