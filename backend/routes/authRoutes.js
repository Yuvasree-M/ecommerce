// src/routes/authRoutes.js
import express from "express";
import { registerUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();

// ✅ Registration route for logged-in users
// Order is important: verifyToken → attachUser → registerUser
router.post("/register", verifyToken, attachUser, registerUser);

export default router;