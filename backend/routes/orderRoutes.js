// src/routes/orderRoutes.js
import express from "express";
import {
  placeOrder,
  getOrders,
   getOrderById,
  getAllOrders,
  updateOrderStatus,
  softDeleteOrders,
} from "../controllers/orderController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ All routes require authentication
router.use(verifyToken, attachUser);

// User routes
router.post("/", placeOrder);               // Place order
router.get("/", getOrders);                 // Get current user's orders
router.delete("/soft-delete", softDeleteOrders); // Hide user's orders
router.get("/:id", getOrderById);
// Admin routes
router.get("/all", checkAdmin, getAllOrders);          // Admin: all orders
router.patch("/:id/status", checkAdmin, updateOrderStatus); // Admin: update status

export default router;