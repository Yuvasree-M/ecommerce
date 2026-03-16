import PDFDocument from "pdfkit";
import fs from "fs";
import axios from "axios";

/* ---------------- FETCH IMAGE ---------------- */

const fetchImageBuffer = async (url) => {
  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 2000, // faster timeout
    });

    return Buffer.from(res.data);
  } catch {
    return null;
  }
};

/* ---------------- GENERATE INVOICE ---------------- */

export const generateInvoice = async (order, orderId, filePath) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    const green = "#16a34a";
    const darkGray = "#374151";
    const lightGray = "#f9fafb";
    const borderGray = "#e5e7eb";
    const pageWidth = 495;

    /* ---------------- PREFETCH IMAGES (PARALLEL) ---------------- */

    const imageBuffers = await Promise.all(
      order.items.map((item) =>
        item.image ? fetchImageBuffer(item.image) : null
      )
    );

    /* ---------------- HEADER ---------------- */

    doc.rect(0, 0, 595, 90).fill(green);

    doc
      .fontSize(28)
      .fillColor("white")
      .font("Helvetica-Bold")
      .text("Verdura", 50, 20, { align: "center" });

    doc
      .fontSize(11)
      .fillColor("#bbf7d0")
      .font("Helvetica")
      .text("Organic Grocery Store", 50, 55, { align: "center" });

    doc.moveDown(3);

    /* ---------------- TITLE ---------------- */

    doc
      .fontSize(18)
      .fillColor(darkGray)
      .font("Helvetica-Bold")
      .text("INVOICE", { align: "center" });

    doc.moveDown(0.5);

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor(borderGray)
      .stroke();

    doc.moveDown(1);

    /* ---------------- ORDER INFO ---------------- */

    const infoY = doc.y;

    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .text("ORDER ID", 50, infoY);

    doc
      .fontSize(11)
      .fillColor(darkGray)
      .font("Helvetica-Bold")
      .text(`#${orderId}`, 50, infoY + 13);

    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .font("Helvetica")
      .text("ADDRESS", 300, infoY);

    doc
      .fontSize(11)
      .fillColor(darkGray)
      .text(order.address || "N/A", 300, infoY + 13, { width: 220 });

    doc.moveDown(3);

    const infoY2 = doc.y;

    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .text("PHONE", 50, infoY2);

    doc
      .fontSize(11)
      .fillColor(darkGray)
      .text(order.phone || "N/A", 50, infoY2 + 13);

    doc
      .fontSize(9)
      .fillColor("#6b7280")
      .text("STATUS", 300, infoY2);

    doc
      .fontSize(11)
      .fillColor(green)
      .font("Helvetica-Bold")
      .text(order.status || "N/A", 300, infoY2 + 13);

    doc.moveDown(3);

    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor(borderGray)
      .stroke();

    doc.moveDown(1);

    /* ---------------- TABLE HEADER ---------------- */

    const tableTop = doc.y;

    doc.rect(50, tableTop, pageWidth, 28).fill(green);

    doc
      .fontSize(10)
      .fillColor("white")
      .font("Helvetica-Bold")
      .text("PRODUCT", 115, tableTop + 9)
      .text("QTY", 340, tableTop + 9, { width: 50, align: "center" })
      .text("PRICE", 400, tableTop + 9, { width: 60, align: "right" })
      .text("SUBTOTAL", 460, tableTop + 9, { width: 80, align: "right" });

    let rowY = tableTop + 30;
    let total = 0;

    /* ---------------- TABLE ROWS ---------------- */

    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      const subtotal = item.price * item.quantity;

      total += subtotal;

      const rowHeight = 55;

      doc
        .rect(50, rowY, pageWidth, rowHeight)
        .fill(i % 2 === 0 ? lightGray : "white");

      /* IMAGE */

      const imgBuf = imageBuffers[i];

      if (imgBuf) {
        try {
          doc.image(imgBuf, 55, rowY + 7, {
            width: 40,
            height: 40,
          });
        } catch {}
      }

      /* TEXT */

      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font("Helvetica")
        .text(item.name, 105, rowY + 18, { width: 220, ellipsis: true })
        .text(String(item.quantity), 340, rowY + 18, {
          width: 50,
          align: "center",
        })
        .text(`Rs. ${item.price}`, 400, rowY + 18, {
          width: 60,
          align: "right",
        })
        .text(`Rs. ${subtotal}`, 460, rowY + 18, {
          width: 80,
          align: "right",
        });

      doc
        .moveTo(50, rowY + rowHeight)
        .lineTo(545, rowY + rowHeight)
        .strokeColor(borderGray)
        .lineWidth(0.5)
        .stroke();

      rowY += rowHeight;
    }

    /* ---------------- TOTAL ---------------- */

    const totalBoxY = rowY + 15;

    doc.rect(350, totalBoxY, 195, 38).fill(green);

    doc
      .fontSize(13)
      .fillColor("white")
      .font("Helvetica-Bold")
      .text(
        `Total: Rs. ${order.totalAmount}`,
        358,
        totalBoxY + 12,
        { width: 179, align: "right" }
      );

    /* ---------------- FOOTER ---------------- */

    const footerY = totalBoxY + 70;

    doc
      .moveTo(50, footerY)
      .lineTo(545, footerY)
      .strokeColor(borderGray)
      .stroke();

    doc
      .fontSize(10)
      .fillColor("#6b7280")
      .text(
        "Thank you for shopping with Verdura | support@verdura.com",
        50,
        footerY + 12,
        { align: "center" }
      );

    doc
      .fontSize(9)
      .fillColor("#9ca3af")
      .text(
        `(c) ${new Date().getFullYear()} Verdura Organic Store`,
        50,
        footerY + 28,
        { align: "center" }
      );

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};