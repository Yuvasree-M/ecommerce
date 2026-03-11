import express from "express";
import {
  registerUser,
  getAllUsers,
  getUserProfile
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Logged-in user profile
router.get("/profile", verifyToken, attachUser, getUserProfile);

// Admin only users list
router.get("/", verifyToken, attachUser, checkAdmin, getAllUsers);

export default router;