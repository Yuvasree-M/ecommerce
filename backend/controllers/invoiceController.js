import { generateInvoice } from "../utils/generateInvoice.js";
import { sendInvoiceMail } from "../utils/sendInvoiceMail.js";
import path from "path";
import fs from "fs";
import Order from "../models/Order.js"; // your Order model

export const downloadInvoice = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await Order.findById(orderId);

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    const filePath = path.join("tmp", `invoice_${orderId}.pdf`);
    await generateInvoice(order, orderId, filePath);

    // Send invoice to email asynchronously
    sendInvoiceMail(req.user.email, filePath).catch(console.error);

    res.download(filePath, "invoice.pdf", (err) => {
      fs.unlink(filePath, () => {}); // delete after sending
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate invoice" });
  }
};