import { db } from "../config/firebase.js";
import Razorpay from "razorpay";
import shortid from "shortid";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
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

// Save order & transaction
export const saveOrder = async (req, res) => {
  try {
    const { cartItems, address, phone, paymentType, status } = req.body;
    const userId = req.user.uid;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch product details
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

    // Save order
    const orderRef = await db.collection("orders").add({
      userId,
      items: itemsWithDetails,
      address,
      phone,
      paymentType,
      status, // PENDING / PAID
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Save transaction for non-COD payments
    if (paymentType !== "COD") {
      await db.collection("transactions").add({
        userId,
        orderId: orderRef.id,
        transactionId: shortid.generate(),
        transactionType: paymentType,
        transactionStatus: status === "PAID" ? "SUCCESS" : "PENDING",
        createdAt: new Date(),
      });
    }

    // Clear user cart
    await db.collection("carts").doc(userId).set({ items: [] });

    res.json({ message: "Order completed successfully", orderId: orderRef.id });
  } catch (err) {
    console.error("Save order error:", err);
    res.status(500).json({ message: err.message });
  }
};