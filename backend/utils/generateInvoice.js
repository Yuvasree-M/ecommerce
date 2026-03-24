// import PDFDocument from "pdfkit";
// import fs from "fs";

// // Generates a PDF invoice for the given order 
// export const generateInvoice = async (order, orderId, filePath) => {
//   return new Promise((resolve, reject) => {

//     const doc = new PDFDocument({ margin: 0, size: "A4" });
//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);
//     const name    = order.name    || order.shippingInfo?.name    || "N/A";
//     const email   = order.email   || order.shippingInfo?.email   || "N/A";
//     const phone   = order.phone   || order.shippingInfo?.phone   || "N/A";
//     const address = order.address || order.shippingInfo?.address || "N/A";
//     const items   = order.items   || [];
//     const total   = order.totalAmount ?? items.reduce((s, i) => s + i.price * i.quantity, 0);

//     const G600    = "#16a34a";
//     const G800    = "#166534";
//     const G50     = "#f0fdf4";
//     const G100    = "#dcfce7";
//     const G200    = "#bbf7d0";
//     const SLATE900= "#0f172a";
//     const SLATE600= "#475569";
//     const SLATE400= "#94a3b8";
//     const SLATE50 = "#f8fafc";
//     const WHITE   = "#ffffff";
//     const BORDER  = "#e2e8f0";

//     const PAGE_W  = 595.28;
//     const PAGE_H  = 841.89;
//     const M       = 44;
//     const CW      = PAGE_W - M * 2;

//     doc.rect(0, 0, PAGE_W, PAGE_H).fill(SLATE50);

   
//     doc.rect(0, 0, PAGE_W, 72).fill(SLATE900);

    
//     doc.rect(0, 72, PAGE_W, 5).fill(G600);

   
//     doc.rect(0, 77, PAGE_W, PAGE_H - 77).fill(WHITE);


//     for (let row = 110; row < PAGE_H - 80; row += 22) {
//       for (let col = M; col < PAGE_W - M; col += 22) {
//         doc.circle(col, row, 0.6).fillOpacity(0.05).fill(SLATE400);
//       }
//     }
//     doc.fillOpacity(1);

//     doc
//       .font("Helvetica-Bold").fontSize(88).fillColor(G600).fillOpacity(0.035)
//       .text("VERDURA", 0, 270, { align: "center", width: PAGE_W });
//     doc.fillOpacity(1);


//     doc
//       .font("Helvetica-Bold").fontSize(20).fillColor(WHITE)
//       .text("VERDURA", M, 20);

//     doc
//       .font("Helvetica").fontSize(9).fillColor(G200)
//       .text("ORGANIC  STORE", M, 44);

//     doc
//       .font("Helvetica-Bold").fontSize(26).fillColor(WHITE)
//       .text("INVOICE", 0, 22, { align: "right", width: PAGE_W - M });


//     let y = 98;

//     const dateStr = new Date().toLocaleDateString("en-IN", {
//       day: "2-digit", month: "short", year: "numeric",
//     });
//     const statusText = (order.status || "ORDER PLACED").replace(/_/g, " ");

//     const metaItems = [
//       { label: "ORDER ID", value: `#${orderId}` },
//       { label: "DATE",     value: dateStr       },
//       { label: "PAYMENT",  value: "Online · Razorpay" },
//     ];

//     metaItems.forEach((m, i) => {
//       const x = M + i * 158;
//       doc.font("Helvetica-Bold").fontSize(7.5).fillColor(SLATE400).text(m.label, x, y);
//       doc.font("Helvetica").fontSize(10).fillColor(SLATE900)
//          .text(m.value, x, y + 13, { width: 148, ellipsis: true });
//     });

//     const pillW = 108;
//     const pillX = PAGE_W - M - pillW;
//     doc.roundedRect(pillX, y + 2, pillW, 22, 11).fill(G50);
//     doc.roundedRect(pillX, y + 2, pillW, 22, 11).lineWidth(0.8).strokeColor(G200).stroke();
//     doc.font("Helvetica-Bold").fontSize(8).fillColor(G600)
//        .text(statusText, pillX, y + 9, { width: pillW, align: "center" });

//     y += 50;

//     doc.moveTo(M, y).lineTo(PAGE_W - M, y).lineWidth(0.4).strokeColor(BORDER).stroke();
//     y += 20;


//     const cardGap = 10;
//     const cardW   = (CW - cardGap * 3) / 4;
//     const cardH   = 54;

//     const details = [
//       { label: "CUSTOMER NAME", value: name    },
//       { label: "EMAIL",         value: email   },
//       { label: "PHONE",         value: phone   },
//       { label: "DELIVERY ADDRESS", value: address },
//     ];

//     details.forEach((d, i) => {
//       const cx = M + i * (cardW + cardGap);

 
//       doc.roundedRect(cx, y, cardW, cardH, 6).fill(SLATE50);
//       doc.roundedRect(cx, y, cardW, cardH, 6).lineWidth(0.5).strokeColor(BORDER).stroke();


//       doc.roundedRect(cx, y, cardW, 3, 3).fill(G600);


//       doc.font("Helvetica-Bold").fontSize(7).fillColor(SLATE400)
//          .text(d.label, cx + 10, y + 12);
  
//       doc.font("Helvetica").fontSize(9.5).fillColor(SLATE900)
//          .text(d.value, cx + 10, y + 25, { width: cardW - 20, height: 20, ellipsis: true });
//     });

//     y += cardH + 24;

 
//     const C = {
//       no:       M,
//       item:     M + 28,
//       qty:      M + 295,
//       price:    M + 365,
//       subtotal: M + 440,
//     };

//     doc.roundedRect(M, y, CW, 30, 5).fill(SLATE900);

//     doc.font("Helvetica-Bold").fontSize(8).fillColor(WHITE)
//        .text("#",        C.no,         y + 11, { width: 22, align: "center" })
//        .text("ITEM",     C.item + 4,   y + 11)
//        .text("QTY",      C.qty,        y + 11, { width: 55, align: "center"  })
//        .text("PRICE",    C.price,      y + 11, { width: 62, align: "right"   })
//        .text("SUBTOTAL", C.subtotal,   y + 11, { width: 62, align: "right"   });

//     y += 34;

//     items.forEach((item, idx) => {
//       const sub  = item.price * item.quantity;
//       const rowH = 36;
//       const even = idx % 2 === 0;


//       doc.rect(M, y - 2, CW, rowH).fill(even ? SLATE50 : WHITE);


//       if (even) {
//         doc.rect(M, y - 2, 3, rowH).fill(G600);
//       }

//       doc.font("Helvetica").fontSize(8).fillColor(SLATE400)
//          .text(String(idx + 1), C.no, y + 11, { width: 22, align: "center" });

  
//       doc.font("Helvetica-Bold").fontSize(10.5).fillColor(SLATE900)
//          .text(item.name, C.item + 4, y + 9, { width: 255, ellipsis: true });

//       doc.roundedRect(C.qty + 8, y + 7, 38, 18, 9).fill(G50);
//       doc.roundedRect(C.qty + 8, y + 7, 38, 18, 9).lineWidth(0.5).strokeColor(G200).stroke();
//       doc.font("Helvetica-Bold").fontSize(9).fillColor(G600)
//          .text(String(item.quantity), C.qty + 8, y + 11, { width: 38, align: "center" });


//       doc.font("Helvetica").fontSize(10).fillColor(SLATE600)
//          .text(`Rs. ${item.price}`, C.price, y + 11, { width: 62, align: "right" });

//       doc.font("Helvetica-Bold").fontSize(10.5).fillColor(SLATE900)
//          .text(`Rs. ${sub}`, C.subtotal, y + 11, { width: 62, align: "right" });

//       y += rowH;

//       doc.moveTo(M + 3, y).lineTo(PAGE_W - M, y).lineWidth(0.25).strokeColor(BORDER).stroke();
//     });

//     y += 20;


//     const tbW = 215;
//     const tbX = PAGE_W - M - tbW;

//     doc.roundedRect(tbX - 10, y - 8, tbW + 20, 90, 10).fill(G50);
//     doc.roundedRect(tbX - 10, y - 8, tbW + 20, 90, 10)
//        .lineWidth(0.8).strokeColor(G200).stroke();

//     doc.font("Helvetica").fontSize(10.5).fillColor(SLATE600)
//        .text("Delivery", tbX, y + 8);
//     doc.font("Helvetica-Bold").fontSize(10.5).fillColor(G600)
//        .text("FREE", tbX, y + 8, { width: tbW, align: "right" });

//     doc.moveTo(tbX, y + 30).lineTo(tbX + tbW, y + 30)
//        .lineWidth(0.5).strokeColor(G200).stroke();

//     doc.font("Helvetica").fontSize(11).fillColor(SLATE600)
//        .text("Grand Total", tbX, y + 42);
//     doc.font("Helvetica-Bold").fontSize(19).fillColor(G800)
//        .text(`Rs. ${total}`, tbX, y + 38, { width: tbW, align: "right" });

//     const fy = PAGE_H - 60;

//     doc.rect(0, fy, PAGE_W, 60).fill(SLATE900);
//     doc.rect(0, fy, PAGE_W, 3).fill(G600);

//     doc
//       .font("Helvetica-Bold").fontSize(10).fillColor(WHITE)
//       .text("Thank you for choosing Verdura Organic Store!", 0, fy + 13, { align: "center", width: PAGE_W });

//     doc
//       .font("Helvetica").fontSize(8).fillColor(SLATE400)
//       .text(
//         "support@verdura.com  ·  verdura.com  ·  System-generated invoice",
//         0, fy + 31, { align: "center", width: PAGE_W }
//       );

//     doc.end();
//     stream.on("finish", resolve);
//     stream.on("error", reject);
//   });
// };
import PDFDocument from "pdfkit";
import fs from "fs";

export const generateInvoice = async (order, orderId, filePath) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 0, size: "A4" });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // ── Colors ──
    const G600    = "#16a34a";
    const G800    = "#166534";
    const G50     = "#f0fdf4";
    const G200    = "#bbf7d0";
    const SLATE900 = "#0f172a";
    const SLATE600 = "#475569";
    const SLATE400 = "#94a3b8";
    const WHITE    = "#ffffff";
    const BORDER   = "#e2e8f0";
    const SLATE50  = "#f8fafc";

    const PAGE_W = 595.28;
    const PAGE_H = 841.89;
    const M      = 44;
    const CW     = PAGE_W - M * 2;

    // ── Data ──
    const name     = order.name    || "N/A";
    const email    = order.email   || "N/A";
    const phone    = order.phone   || "N/A";
    const address  = order.address || "N/A";
    const items    = order.items   || [];
    const discount = order.discount  || 0;
    const promo    = order.promoCode || "";

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const total    = subtotal - discount;

    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });

    // ── Background ──
    doc.rect(0, 0, PAGE_W, PAGE_H).fill(SLATE50);

    // ── Header Bar ──
    doc.rect(0, 0, PAGE_W, 72).fill(SLATE900);
    doc.rect(0, 72, PAGE_W, 5).fill(G600);
    doc.rect(0, 77, PAGE_W, PAGE_H - 77).fill(WHITE);

    // ── Header Text ──
    doc.font("Helvetica-Bold").fontSize(20).fillColor(WHITE).text("VERDURA", M, 20);
    doc.font("Helvetica").fontSize(9).fillColor(G200).text("ORGANIC STORE", M, 44);
    doc.font("Helvetica-Bold").fontSize(26).fillColor(WHITE)
       .text("INVOICE", 0, 22, { align: "right", width: PAGE_W - M });

    // ── Meta Row ──
    let y = 98;
    const metaItems = [
      { label: "ORDER ID", value: `#${orderId}` },
      { label: "DATE",     value: dateStr },
      { label: "PAYMENT",  value: "Online · Razorpay" },
    ];
    metaItems.forEach((m, i) => {
      const x = M + i * 158;
      doc.font("Helvetica-Bold").fontSize(7.5).fillColor(SLATE400).text(m.label, x, y);
      doc.font("Helvetica").fontSize(10).fillColor(SLATE900)
         .text(m.value, x, y + 13, { width: 148, ellipsis: true });
    });

    // ── Status Pill ──
    const pillW = 108, pillX = PAGE_W - M - pillW;
    doc.roundedRect(pillX, y + 2, pillW, 22, 11).fill(G50);
    doc.roundedRect(pillX, y + 2, pillW, 22, 11).lineWidth(0.8).strokeColor(G200).stroke();
    doc.font("Helvetica-Bold").fontSize(8).fillColor(G600)
       .text("ORDER PLACED", pillX, y + 9, { width: pillW, align: "center" });

    y += 50;
    doc.moveTo(M, y).lineTo(PAGE_W - M, y).lineWidth(0.4).strokeColor(BORDER).stroke();
    y += 20;

    // ── From / Bill To Cards ──
    const cardGap = 16;
    const halfW   = (CW - cardGap) / 2;
    const cardH   = 90;

    // FROM
    doc.roundedRect(M, y, halfW, cardH, 6).fill(SLATE50);
    doc.roundedRect(M, y, halfW, cardH, 6).lineWidth(0.5).strokeColor(BORDER).stroke();
    doc.roundedRect(M, y, halfW, 3, 3).fill(G600);
    doc.font("Helvetica-Bold").fontSize(7).fillColor(SLATE400).text("FROM", M + 10, y + 12);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(SLATE900).text("Verdura", M + 10, y + 26);
    doc.font("Helvetica").fontSize(9.5).fillColor(SLATE600)
       .text("Organic Grocery Store", M + 10, y + 42)
       .text("Tamil Nadu, India", M + 10, y + 56)
       .text("support@verdura.com", M + 10, y + 70);

    // BILL TO
    const billX = M + halfW + cardGap;
    doc.roundedRect(billX, y, halfW, cardH, 6).fill(SLATE50);
    doc.roundedRect(billX, y, halfW, cardH, 6).lineWidth(0.5).strokeColor(BORDER).stroke();
    doc.roundedRect(billX, y, halfW, 3, 3).fill(G600);
    doc.font("Helvetica-Bold").fontSize(7).fillColor(SLATE400).text("BILL TO", billX + 10, y + 12);
    doc.font("Helvetica-Bold").fontSize(11).fillColor(SLATE900).text(name, billX + 10, y + 26);
    doc.font("Helvetica").fontSize(9.5).fillColor(SLATE600)
       .text(phone,   billX + 10, y + 42)
       .text(address, billX + 10, y + 56, { width: halfW - 20, ellipsis: true })
       .text(email,   billX + 10, y + 70, { width: halfW - 20, ellipsis: true });

    y += cardH + 24;

    // ── Table Header ──
    const C = { no: M, item: M + 28, unit: M + 285, qty: M + 345, rate: M + 400, total: M + 460 };
    doc.roundedRect(M, y, CW, 30, 5).fill(SLATE900);
    doc.font("Helvetica-Bold").fontSize(8).fillColor(WHITE)
       .text("#", C.no, y + 11, { width: 22, align: "center" })
       .text("ITEM", C.item + 4, y + 11)
       .text("UNIT", C.unit, y + 11, { width: 52, align: "center" })
       .text("QTY", C.qty, y + 11, { width: 44, align: "center" })
       .text("RATE", C.rate, y + 11, { width: 50, align: "right" })
       .text("TOTAL", C.total, y + 11, { width: 50, align: "right" });

    y += 34;

    // ── Table Rows ──
    items.forEach((item, idx) => {
      // Parse unit (for legacy string format)
      const str       = String(item.unit || "").trim().toLowerCase();
      const match     = str.match(/^(\d+\.?\d*)\s*([a-z]+)$/);
      const unitValue = match ? parseFloat(match[1]) : (parseFloat(str) || (item.unitValue || 1));
      const unitType  = match ? match[2] : (item.unitType || "g");
      const rowTotal  = item.price * item.quantity;
      const rowH      = 34;
      const even      = idx % 2 === 0;

      doc.rect(M, y - 2, CW, rowH).fill(even ? SLATE50 : WHITE);
      if (even) doc.rect(M, y - 2, 3, rowH).fill(G600);

      doc.font("Helvetica").fontSize(8).fillColor(SLATE400)
         .text(String(idx + 1), C.no, y + 10, { width: 22, align: "center" });

      doc.font("Helvetica-Bold").fontSize(10).fillColor(SLATE900)
         .text(item.name, C.item + 4, y + 10, { width: 245, ellipsis: true });

      // Unit
      doc.roundedRect(C.unit + 6, y + 7, 40, 16, 8).fill(G50);
      doc.roundedRect(C.unit + 6, y + 7, 40, 16, 8).lineWidth(0.5).strokeColor(G200).stroke();
      doc.font("Helvetica-Bold").fontSize(8).fillColor(G600)
         .text(`${unitValue}${unitType}`, C.unit + 6, y + 11, { width: 40, align: "center" });

      // Qty
      doc.roundedRect(C.qty + 6, y + 7, 32, 16, 8).fill(G50);
      doc.roundedRect(C.qty + 6, y + 7, 32, 16, 8).lineWidth(0.5).strokeColor(G200).stroke();
      doc.font("Helvetica-Bold").fontSize(9).fillColor(G600)
         .text(String(item.quantity), C.qty + 6, y + 11, { width: 32, align: "center" });

      // Rate & Total
      doc.font("Helvetica").fontSize(10).fillColor(SLATE600)
         .text(`₹${item.price}`, C.rate, y + 10, { width: 50, align: "right" });
      doc.font("Helvetica-Bold").fontSize(10).fillColor(SLATE900)
         .text(`₹${rowTotal}`, C.total, y + 10, { width: 50, align: "right" });

      y += rowH;
      doc.moveTo(M + 3, y).lineTo(PAGE_W - M, y).lineWidth(0.25).strokeColor(BORDER).stroke();
    });

    y += 20;

    // ── Summary Box ──
    const tbW = 220;
    const tbX = PAGE_W - M - tbW;
    let summaryRows = 2; // subtotal + total
    if (discount > 0) summaryRows++;

    const boxH = 18 + summaryRows * 22 + 24;
    doc.roundedRect(tbX - 12, y - 8, tbW + 24, boxH, 10).fill(G50);
    doc.roundedRect(tbX - 12, y - 8, tbW + 24, boxH, 10).lineWidth(0.8).strokeColor(G200).stroke();

    // Subtotal
    doc.font("Helvetica").fontSize(10.5).fillColor(SLATE600).text("Subtotal", tbX, y + 4);
    doc.font("Helvetica").fontSize(10.5).fillColor(SLATE900)
       .text(`₹${subtotal}`, tbX, y + 4, { width: tbW, align: "right" });
    y += 22;

    // Delivery
    doc.font("Helvetica").fontSize(10.5).fillColor(SLATE600).text("Delivery", tbX, y + 4);
    doc.font("Helvetica-Bold").fontSize(10.5).fillColor(G600)
       .text("FREE", tbX, y + 4, { width: tbW, align: "right" });
    y += 22;

    // Discount (conditional)
    if (discount > 0) {
      const label = promo ? `Discount (${promo})` : "Discount";
      doc.font("Helvetica").fontSize(10.5).fillColor(SLATE600).text(label, tbX, y + 4);
      doc.font("Helvetica-Bold").fontSize(10.5).fillColor("#dc2626") // red for discount
         .text(`-₹${discount}`, tbX, y + 4, { width: tbW, align: "right" });
      y += 22;
    }

    // Divider
    doc.moveTo(tbX, y + 4).lineTo(tbX + tbW, y + 4).lineWidth(0.5).strokeColor(G200).stroke();
    y += 14;

    // Grand total
    doc.font("Helvetica-Bold").fontSize(13).fillColor(SLATE900).text("Grand Total", tbX, y + 2);
    doc.font("Helvetica-Bold").fontSize(18).fillColor(G800)
       .text(`₹${total}`, tbX, y - 2, { width: tbW, align: "right" });

    // ── Footer ──
    const fy = PAGE_H - 60;
    doc.rect(0, fy, PAGE_W, 60).fill(SLATE900);
    doc.rect(0, fy, PAGE_W, 3).fill(G600);
    doc.font("Helvetica-Bold").fontSize(10).fillColor(WHITE)
       .text("Thank you for choosing Verdura Organic Store!", 0, fy + 13, { align: "center", width: PAGE_W });
    doc.font("Helvetica").fontSize(8).fillColor(SLATE400)
       .text("support@verdura.com  ·  verdura.com  ·  System-generated invoice",
             0, fy + 31, { align: "center", width: PAGE_W });

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};