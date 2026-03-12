import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = (order, orderId, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const formatPrice = (num) => num.toLocaleString("en-IN");

    doc.fontSize(22).text("Verdura Organic Store", { align: "center" }).moveDown();
    doc.fontSize(12).text(`Order ID: ${orderId}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`).moveDown();

    doc.text("Products").moveDown();

    let total = 0;
    order.items.forEach(item => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      doc.text(`${item.name} | ₹${formatPrice(item.price)} x ${item.quantity} = ₹${formatPrice(subtotal)}`);
    });

    doc.moveDown().fontSize(14).text(`Total Amount: ₹${formatPrice(total)}`);
    doc.moveDown().text(`Status: ${order.status}`);

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};