import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

/* PROTECT ALL CART ROUTES */

router.use(verifyToken, attachUser);

/* CART ROUTES */

router.get("/", getCart);

router.post("/", addToCart);

router.delete("/:productId", removeFromCart);

router.post("/clear", clearCart);

export default router;