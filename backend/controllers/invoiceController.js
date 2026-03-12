import PDFDocument from "pdfkit";
import { db } from "../config/firebase.js";

export const downloadInvoice = async (req, res) => {
  try {
    const orderId = req.params.id;

    /* FETCH ORDER */

    const orderDoc = await db.collection("orders").doc(orderId).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderDoc.data();

    /* SECURITY CHECK */

    if (order.userId !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    /* SET HEADERS */

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${orderId}.pdf`
    );

    /* CREATE PDF */

    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(res);

    /* HEADER */

    doc
      .fontSize(22)
      .fillColor("#16a34a")
      .text("Verdura", { align: "center" });

    doc
      .fontSize(12)
      .fillColor("black")
      .text("Organic Grocery Store", { align: "center" });

    doc.moveDown(2);

    /* ORDER INFO */

    doc.fontSize(14).text(`Order ID: ${orderId}`);
    doc.text(`Date: ${order.createdAt.toDate().toLocaleDateString()}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);

    doc.moveDown(2);

    /* TABLE HEADER */

    doc.fontSize(12).text("Product", 50);
    doc.text("Qty", 300);
    doc.text("Price", 350);
    doc.text("Subtotal", 450);

    doc.moveDown();

    let total = 0;

    order.items.forEach((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      doc.text(item.name, 50);
      doc.text(item.quantity, 300);
      doc.text(`₹ ${item.price}`, 350);
      doc.text(`₹ ${subtotal}`, 450);

      doc.moveDown();
    });

    doc.moveDown();

    /* TOTAL */

    doc
      .fontSize(14)
      .text(`Total Amount: ₹ ${order.totalAmount}`, {
        align: "right",
      });

    doc.moveDown(2);

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Thank you for shopping with Verdura 🌿", {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: "Invoice generation failed" });
  }
};