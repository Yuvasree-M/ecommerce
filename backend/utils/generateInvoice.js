import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = async (order, orderId, filePath) => {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    const green = "#16a34a";

    /* HEADER */

    doc
      .fontSize(26)
      .fillColor(green)
      .text("Verdura Organic Store", { align: "center" });

    doc.moveDown();

    doc
      .fontSize(18)
      .fillColor("black")
      .text("INVOICE", { align: "center" });

    doc.moveDown();

    /* ORDER INFO */

    doc.fontSize(12);

    doc.text(`Order ID: ${orderId}`);
    doc.text(`Customer: ${order.name}`);
    doc.text(`Email: ${order.email}`);
    doc.text(`Phone: ${order.phone}`);
    doc.text(`Address: ${order.address}`);

    doc.moveDown();

    /* TABLE HEADER */

    doc.fontSize(13).text("Items", { underline: true });

    doc.moveDown();

    doc.fontSize(11);

    let total = 0;

    order.items.forEach((item) => {

      const subtotal = item.price * item.quantity;

      total += subtotal;

      doc.text(
        `${item.name}  |  Qty: ${item.quantity}  |  Price: ₹${item.price}  |  Subtotal: ₹${subtotal}`
      );

    });

    doc.moveDown();

    doc
      .fontSize(14)
      .fillColor(green)
      .text(`Total Amount: ₹${order.totalAmount}`, { align: "right" });

    doc.moveDown();

    doc
      .fontSize(10)
      .fillColor("gray")
      .text("Thank you for shopping with Verdura!", { align: "center" });

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);

  });
};