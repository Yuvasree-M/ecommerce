import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";
import * as productController from "../controllers/productController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public
router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

// ADMIN
router.post(
  "/",
  verifyToken,
  attachUser,
  checkAdmin,
  upload.single("image"),
  productController.createProduct
);

router.put(
  "/:id",
  verifyToken,
  attachUser,
  checkAdmin,
  upload.single("image"),
  productController.updateProduct
);

router.delete("/:id", verifyToken, attachUser, checkAdmin, productController.deleteProduct);

export default router;