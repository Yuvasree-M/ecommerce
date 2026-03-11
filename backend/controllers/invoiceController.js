import { db } from "../config/firebase.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendInvoiceMail } from "../utils/sendMail.js";
import path from "path";

export const downloadInvoice = async (req, res) => {

  try {

    const { id } = req.params;

    const orderDoc = await db.collection("orders").doc(id).get();

    if (!orderDoc.exists) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orderDoc.data();

    const userDoc = await db.collection("users").doc(order.userId).get();

    const user = userDoc.data();

    const filePath = `./invoices/invoice_${id}.pdf`;

    await generateInvoice(order, id, filePath);

    await sendInvoiceMail(user.email, filePath);

    res.download(path.resolve(filePath));

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: "Invoice generation failed" });

  }

};