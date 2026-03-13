import express from "express";
import {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin only: Get all users
router.get("/", verifyToken, attachUser, checkAdmin, getAllUsers);

// Logged-in user: Get their profile
router.get("/profile", verifyToken, attachUser, getUserProfile);

// Logged-in user: Update phone or address
router.put("/profile", verifyToken, attachUser, updateUserProfile);

export default router;