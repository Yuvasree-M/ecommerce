import express from "express";
import {
  getAllTransactions,
  getUserTransactions,
} from "../controllers/transactionController.js";

import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";
import { checkAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/me", verifyToken, attachUser, getUserTransactions);

router.get("/", verifyToken, attachUser, checkAdmin, getAllTransactions);

export default router;