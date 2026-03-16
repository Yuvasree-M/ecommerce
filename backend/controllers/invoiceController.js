import path from "path";
import fs from "fs";
import { db } from "../config/firebase.js";
import { generateInvoice } from "../utils/generateInvoice.js";

export const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;

    const orderDoc = await db.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderDoc.data();

    if (order.userId !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const tempDir = "temp";

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, `invoice-${orderId}.pdf`);

    await generateInvoice(order, orderId, filePath);

    res.download(filePath, `invoice-${orderId}.pdf`, () => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

  } catch (err) {
    console.error("Invoice download error:", err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
};