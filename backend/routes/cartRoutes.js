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


router.use(verifyToken, attachUser);


router.get("/", getCart);

router.post("/", addToCart);

router.delete("/:productId", removeFromCart);

router.post("/clear", clearCart);

export default router;