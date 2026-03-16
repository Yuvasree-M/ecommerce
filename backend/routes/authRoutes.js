import express from "express";
import { registerUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();


router.post("/register", verifyToken, attachUser, registerUser);

export default router;