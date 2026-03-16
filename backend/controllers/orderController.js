import { db } from "../config/firebase.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendInvoiceMail } from "../utils/sendInvoiceMail.js";
import path from "path";
import os from "os";

// Place order
export const placeOrder = async (req, res) => {
  try {
    const { cartItems, address, phone, paymentId, razorpayOrderId } = req.body;
   const userId = req.user.uid;
const userName = req.user.name;
const userEmail = req.user.email;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const itemsWithDetails = await Promise.all(
      cartItems.map(async item => {
        const productDoc = await db.collection("products").doc(item.productId).get();
        if (!productDoc.exists) throw new Error("Product not found");
        const product = productDoc.data();
        return {
          productId: productDoc.id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity,
        };
      })
    );

    const totalAmount = itemsWithDetails.reduce((sum, i) => sum + i.price * i.quantity, 0);

const orderRef = await db.collection("orders").add({
  userId,
  name: userName,
  email: userEmail,
  items: itemsWithDetails,
  totalAmount,
  address,
  phone,
  paymentId,
  razorpayOrderId,
  status: "ORDER_PLACED",
  deletedByUser: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});
    await db.collection("transactions").add({
      userId,
      orderId: orderRef.id,
      transactionId: paymentId,
      transactionType: "ONLINE",
      transactionStatus: "SUCCESS",
      createdAt: new Date(),
    });

    await db.collection("carts").doc(userId).set({ items: [] });

    // Send invoice email — non-blocking, don't fail the order if email fails
 const savedOrder = {
  name: userName,
  email: userEmail,
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

    res.status(201).json({ message: "Order placed successfully", orderId: orderRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get user orders
export const getOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders")
      .where("userId", "==", req.user.uid)
      .get();
    const orders = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(order => !order.deletedByUser)
      .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const orderDoc = await db.collection("orders").doc(id).get();

    if (!orderDoc.exists)
      return res.status(404).json({ message: "Order not found" });
const data = orderDoc.data();

const order = {
  id: orderDoc.id,
  name: data.name,
  email: data.email,
  phone: data.phone,
  address: data.address,
  totalAmount: data.totalAmount,
  items: data.items || [],
  status: data.status
};

    if (req.user.role !== "ADMIN" && order.userId !== req.user.uid)
      return res.status(403).json({ message: "Access denied" });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all orders
export const getAllOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();
    const orders = await Promise.all(snapshot.docs.map(async doc => {
      const data = doc.data();
      const userSnap = await db.collection("users").doc(data.userId).get();
      return {
        id: doc.id,
        ...data,
        userName: userSnap.exists ? userSnap.data().name : "Unknown",
      };
    }));
    orders.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["ORDER_PLACED", "APPROVED", "SHIPPED", "DELIVERED", "REJECTED"];
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    await db.collection("orders").doc(req.params.id).update({
      status,
      updatedAt: new Date(),
    });
    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Soft delete orders (user hides)
export const softDeleteOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders")
      .where("userId", "==", req.user.uid)
      .get();
    const batch = db.batch();
    snapshot.docs.forEach(doc => batch.update(doc.ref, { deletedByUser: true }));
    await batch.commit();
    res.json({ message: "Orders hidden successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};