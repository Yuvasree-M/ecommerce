import { db } from "../config/firebase.js";
import Razorpay from "razorpay";
import shortid from "shortid";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendInvoiceMail } from "../utils/sendInvoiceMail.js";
import path from "path";
import os from "os";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: shortid.generate(),
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ message: err.message });
  }
};

// Save order after payment
export const saveOrder = async (req, res) => {
  try {
    const { cartItems, address, phone, paymentId, razorpayOrderId } = req.body;
    const userId = req.user.uid;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    /* FETCH PRODUCT DETAILS */
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const doc = await db.collection("products").doc(item.productId).get();
        if (!doc.exists) throw new Error(`Product not found: ${item.productId}`);
        const product = doc.data();
        return {
          productId: doc.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const totalAmount = itemsWithDetails.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    /* SAVE ORDER */
    const orderRef = await db.collection("orders").add({
      userId,
      items: itemsWithDetails,
      totalAmount,
      address,
      phone,
      paymentId,
      razorpayOrderId,
      paymentType: "ONLINE",
      status: "ORDER_PLACED",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    /* SAVE TRANSACTION */
    await db.collection("transactions").add({
      userId,
      orderId: orderRef.id,
      transactionId: paymentId,
      transactionType: "ONLINE",
      transactionStatus: "SUCCESS",
      createdAt: new Date(),
    });

    /* CLEAR CART */
    await db.collection("carts").doc(userId).set({ items: [] });

    /* SEND INVOICE EMAIL — non-blocking */
    const savedOrder = {
      items: itemsWithDetails,
      totalAmount,
      address,
      phone,
      status: "ORDER_PLACED",
    };
    const invoicePath = path.join(os.tmpdir(), `invoice-${orderRef.id}.pdf`);

    generateInvoice(savedOrder, orderRef.id, invoicePath)
      .then(() => sendInvoiceMail(req.user.email, invoicePath, savedOrder))
      .catch(err => console.error("Invoice email failed:", err));

    res.json({
      message: "Order completed successfully",
      orderId: orderRef.id,
    });
  } catch (err) {
    console.error("Save order error:", err);
    res.status(500).json({ message: err.message });
  }
};
