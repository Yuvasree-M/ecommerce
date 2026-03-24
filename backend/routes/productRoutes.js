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

const upload = multer({ dest: "uploads/" });

router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/", verifyToken, attachUser, checkAdmin, upload.single("image"), createProduct);
router.put("/:id", verifyToken, attachUser, checkAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, attachUser, checkAdmin, deleteProduct);

export default router;