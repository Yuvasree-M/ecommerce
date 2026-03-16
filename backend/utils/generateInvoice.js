import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = async (order, orderId, filePath) => {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    const green = "#16a34a";

    /* ---------------- HEADER ---------------- */

    doc
      .fontSize(26)
      .fillColor(green)
      .text("VERDURA ORGANIC STORE", { align: "center" });

    doc
      .fontSize(11)
      .fillColor("gray")
      .text("Fresh & Organic Grocery", { align: "center" });

    doc.moveDown(2);

    doc
      .fontSize(18)
      .fillColor("black")
      .text("INVOICE", { align: "center" });

    doc.moveDown(2);

    /* ---------------- ORDER INFO ---------------- */

    const infoTop = doc.y;

    doc
      .fontSize(11)
      .text(`Order ID: ${orderId}`, 50, infoTop)
      .text(`Date: ${new Date().toLocaleDateString()}`, 400, infoTop);

    doc.moveDown();

    doc
      .text(`Customer: ${order.name}`)
      .text(`Email: ${order.email}`)
      .text(`Phone: ${order.phone}`)
      .text(`Address: ${order.address}`);

    doc.moveDown(2);

    /* ---------------- TABLE HEADER ---------------- */

    const tableTop = doc.y;

    const itemX = 50;
    const qtyX = 300;
    const priceX = 360;
    const subtotalX = 440;

    doc
      .fontSize(12)
      .fillColor(green)
      .text("Item", itemX, tableTop)
      .text("Qty", qtyX, tableTop)
      .text("Price", priceX, tableTop)
      .text("Subtotal", subtotalX, tableTop);

    doc.moveTo(50, tableTop + 15)
       .lineTo(550, tableTop + 15)
       .stroke();

    /* ---------------- TABLE ITEMS ---------------- */

    let position = tableTop + 30;
    let total = 0;

    order.items?.forEach((item) => {

      const subtotal = item.price * item.quantity;
      total += subtotal;

      doc
        .fontSize(11)
        .fillColor("black")
        .text(item.name, itemX, position)
        .text(item.quantity, qtyX, position)
        .text(`Rs. ${item.price}`, priceX, position)
        .text(`Rs. ${subtotal}`, subtotalX, position);

      position += 25;

    });

    doc.moveDown(2);

    /* ---------------- TOTAL BOX ---------------- */

    const totalBoxY = position + 20;

    doc
      .rect(350, totalBoxY, 200, 40)
      .fillAndStroke("#f0fdf4", green);

    doc
      .fillColor("black")
      .fontSize(13)
      .text("Total", 370, totalBoxY + 12)
      .text(`Rs. ${order.totalAmount}`, 450, totalBoxY + 12);

    doc.moveDown(3);

    /* ---------------- FOOTER ---------------- */

    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for shopping with Verdura Organic Store!",
        50,
        doc.page.height - 80,
        { align: "center" }
      );

    doc
      .fontSize(9)
      .text(
        "For support contact: support@verdura.com",
        { align: "center" }
      );

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);

  });
};