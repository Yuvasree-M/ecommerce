import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.get("/", getCategories);

// Admin only
router.post("/", verifyToken, attachUser, checkAdmin, createCategory);
router.put("/:id", verifyToken, attachUser, checkAdmin, updateCategory);
router.delete("/:id", verifyToken, attachUser, checkAdmin, deleteCategory);

export default router;