import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = (order, orderId, filePath) => {

  return new Promise((resolve, reject) => {

    const doc = new PDFDocument();

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    doc.fontSize(22).text("Verdura Organic Store", { align: "center" });

    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${orderId}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);

    doc.moveDown();

    doc.text("Products");

    doc.moveDown();

    let total = 0;

    order.items.forEach((item) => {

      const subtotal = item.price * item.quantity;

      total += subtotal;

      doc.text(
        `${item.name} | ₹${item.price} x ${item.quantity} = ₹${subtotal}`
      );

    });

    doc.moveDown();

    doc.fontSize(14).text(`Total Amount: ₹${total}`);

    doc.moveDown();

    doc.text(`Status: ${order.status}`);

    doc.end();

    stream.on("finish", resolve);

    stream.on("error", reject);

  });

};