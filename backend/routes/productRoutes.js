// src/routes/productRoutes.js
import express from "express";
import multer from "multer";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Multer setup for image upload
const upload = multer({ dest: "uploads/" });

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", verifyToken, attachUser, checkAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyToken, attachUser, checkAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, attachUser, checkAdmin, deleteProduct);

export default router;