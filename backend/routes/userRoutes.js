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
router.get("/", verifyToken, attachUser, checkAdmin, getAllUsers);
router.get("/profile", verifyToken, attachUser, getUserProfile);
router.put("/profile", verifyToken, attachUser, updateUserProfile);

export default router;