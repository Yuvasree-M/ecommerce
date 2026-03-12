import express from "express";
import { downloadInvoice } from "../controllers/invoiceController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { attachUser } from "../middleware/attachUser.js";

const router = express.Router();

router.use(verifyToken, attachUser);

// Download invoice
router.get("/:id/download", downloadInvoice);

export default router;