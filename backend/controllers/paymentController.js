// import { db } from "../config/firebase.js";
// import Razorpay from "razorpay";
// import shortid from "shortid";
// import { generateInvoice } from "../utils/generateInvoice.js";
// import { sendInvoiceMail } from "../utils/sendInvoiceMail.js";
// import path from "path";
// import os from "os";

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET,
// });

// // Create Razorpay order
// export const createRazorpayOrder = async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount || isNaN(amount) || amount <= 0)
//       return res.status(400).json({ message: "Invalid amount" });

//     const options = {
//       amount: Math.round(amount * 100),
//       currency: "INR",
//       receipt: shortid.generate(),
//     };

//     const order = await razorpay.orders.create(options);

//     res.json({
//       id: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (err) {
//     console.error("Razorpay error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Save order after payment
// export const saveOrder = async (req, res) => {
//   try {
//     const { cartItems, address, phone, paymentId, razorpayOrderId, name, email,  discount,
//   promoCode } = req.body;

//     const userId = req.user.uid;
//     let userName  = name  || req.user.name  || "";
//     let userEmail = email || req.user.email || "";

//     if (!userName || !userEmail) {
//       const userDoc = await db.collection("users").doc(userId).get();
//       if (userDoc.exists) {
//         const userData = userDoc.data();
//         userName  = userName  || userData.name  || "";
//         userEmail = userEmail || userData.email || "";
//       }
//     }

//     if (!cartItems || cartItems.length === 0)
//       return res.status(400).json({ message: "Cart is empty" });

//     const itemsWithDetails = await Promise.all(
//       cartItems.map(async (item) => {
//         const doc = await db.collection("products").doc(item.productId).get();
//         if (!doc.exists) throw new Error(`Product not found: ${item.productId}`);
//         const product = doc.data();
//         return {
//           productId: doc.id,
//           name: product.name,
//           image: product.image,
//           price: product.price,
//           quantity: item.quantity,
//         };
//       })
//     );

//     const totalAmount = itemsWithDetails.reduce(
//       (sum, i) => sum + i.price * i.quantity,
//       0
//     );

//     const orderRef = await db.collection("orders").add({
//       userId,
//       name: userName,       
//       email: userEmail,     
//       items: itemsWithDetails,
//       totalAmount,
//         discount: discount || 0,
//   promoCode: promoCode || "",
//       address,
//       phone,
//       paymentId,
//       razorpayOrderId,
//       paymentType: "ONLINE",
//       status: "ORDER_PLACED",
//       deletedByUser: false,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//    await db.collection("transactions").add({
//   userId,
//   orderId: orderRef.id,
//   transactionId: paymentId,
//   transactionType: "ONLINE",
//   transactionStatus: "SUCCESS",
//   amount: totalAmount,
//   createdAt: new Date(),
// });
//     await db.collection("carts").doc(userId).set({ items: [] });

//     const savedOrder = {
//       name: userName,       
//       email: userEmail,    
//       items: itemsWithDetails,
//       totalAmount,
//       address,
//       phone,
//       status: "ORDER_PLACED",
//     };

//     const invoicePath = path.join(os.tmpdir(), `invoice-${orderRef.id}.pdf`);

//     generateInvoice(savedOrder, orderRef.id, invoicePath)
//       .then(() => sendInvoiceMail(userEmail, invoicePath, savedOrder))
//       .catch(err => console.error("Invoice email failed:", err));

//     res.json({
//       message: "Order completed successfully",
//       orderId: orderRef.id,
//     });

//   } catch (err) {
//     console.error("Save order error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

import { db } from "../config/firebase.js";
import Razorpay from "razorpay";
import shortid from "shortid";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendInvoiceMail } from "../utils/sendInvoiceMail.js";
import path from "path";
import os from "os";

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
    const {
      cartItems, address, phone, paymentId,
      razorpayOrderId, name, email,
      discount,   // ✅ received from frontend
      promoCode,  // ✅ received from frontend
    } = req.body;

    const userId = req.user.uid;
    let userName  = name  || req.user.name  || "";
    let userEmail = email || req.user.email || "";

    if (!userName || !userEmail) {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        userName  = userName  || userData.name  || "";
        userEmail = userEmail || userData.email || "";
      }
    }

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const doc = await db.collection("products").doc(item.productId).get();
        if (!doc.exists) throw new Error(`Product not found: ${item.productId}`);
        const product = doc.data();
        return {
          productId: doc.id,
          name:      product.name,
          image:     product.image,
          price:     product.price,
          quantity:  item.quantity,
        };
      })
    );

    // totalAmount = raw subtotal (before discount); discount stored separately
    const totalAmount = itemsWithDetails.reduce(
      (sum, i) => sum + i.price * i.quantity, 0
    );

    // ─── Save to Firestore orders collection ──────────────────────────────
    const orderRef = await db.collection("orders").add({
      userId,
      name:            userName,
      email:           userEmail,
      items:           itemsWithDetails,
      totalAmount,
      discount:        Number(discount)  || 0,   // ✅ persisted
      promoCode:       promoCode         || "",   // ✅ persisted
      address,
      phone,
      paymentId,
      razorpayOrderId,
      paymentType:     "ONLINE",
      status:          "ORDER_PLACED",
      deletedByUser:   false,
      createdAt:       new Date(),
      updatedAt:       new Date(),
    });

    // ─── Save transaction ──────────────────────────────────────────────────
    await db.collection("transactions").add({
      userId,
      orderId:           orderRef.id,
      transactionId:     paymentId,
      transactionType:   "ONLINE",
      transactionStatus: "SUCCESS",
      amount:            totalAmount,
      createdAt:         new Date(),
    });

    // ─── Clear cart ────────────────────────────────────────────────────────
    await db.collection("carts").doc(userId).set({ items: [] });

    // ─── Build order object for invoice (include discount/promoCode) ───────
    const savedOrder = {
      name:        userName,
      email:       userEmail,
      phone,
      address,
      items:       itemsWithDetails,
      totalAmount,
      discount:    Number(discount)  || 0,   // ✅ passed to invoice generator
      promoCode:   promoCode         || "",  // ✅ passed to invoice generator
      status:      "ORDER_PLACED",
    };

    // ─── Generate & email invoice (non-blocking) ───────────────────────────
    const invoicePath = path.join(os.tmpdir(), `invoice-${orderRef.id}.pdf`);
    generateInvoice(savedOrder, orderRef.id, invoicePath)
      .then(() => sendInvoiceMail(userEmail, invoicePath, savedOrder))
      .catch((err) => console.error("Invoice email failed:", err));

    res.json({
      message: "Order completed successfully",
      orderId: orderRef.id,
    });
  } catch (err) {
    console.error("Save order error:", err);
    res.status(500).json({ message: err.message });
  }
};