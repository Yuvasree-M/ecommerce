import express from "express";
import { downloadInvoice } from "../controllers/invoiceController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();

router.get("/:id/download", verifyToken, attachUser, downloadInvoice);

export default router;