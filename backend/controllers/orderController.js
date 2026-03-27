import { db } from "../config/firebase.js";
import Razorpay from "razorpay";
import { generateInvoice } from "../utils/generateInvoice.js";
import { sendInvoiceMail } from "../utils/sendInvoiceMail.js";
import path from "path";
import os from "os";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// place order
export const placeOrder = async (req, res) => {
  try {
    const {
      cartItems, address, phone, paymentId,
      razorpayOrderId, name, email, discount, promoCode,
    } = req.body;

    const userId = req.user.uid;
    let userName  = name  || req.user.name  || "";
    let userEmail = email || req.user.email || "";

    if (!userName || !userEmail) {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const d = userDoc.data();
        userName  = userName  || d.name  || "";
        userEmail = userEmail || d.email || "";
      }
    }

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {
        const productDoc = await db.collection("products").doc(item.productId).get();
        if (!productDoc.exists) throw new Error("Product not found");
        const product = productDoc.data();
        return {
          productId: productDoc.id,
          name:      product.name,
          image:     product.image,
          price:     product.price,
          quantity:  item.quantity,
        };
      })
    );

    const totalAmount = itemsWithDetails.reduce(
      (sum, i) => sum + i.price * i.quantity, 0
    );

    const orderRef = await db.collection("orders").add({
      userId,
      name:            userName,
      email:           userEmail,
      items:           itemsWithDetails,
      totalAmount,
      address,
      phone,
      paymentId:       paymentId       || null,
      razorpayOrderId: razorpayOrderId || null,
      discount:        discount        || 0,
      promoCode:       promoCode       || "",
      status:          "ORDER_PLACED",
      deletedByUser:   false,
      createdAt:       new Date(),
      updatedAt:       new Date(),
    });

    await db.collection("transactions").add({
      userId,
      orderId:           orderRef.id,
      transactionId:     paymentId || null,
      transactionType:   "ONLINE",
      transactionStatus: "SUCCESS",
      createdAt:         new Date(),
    });

    await db.collection("carts").doc(userId).set({ items: [] });

    const savedOrder = {
      name: userName, email: userEmail,
      items: itemsWithDetails, totalAmount,
      address, phone, status: "ORDER_PLACED",
      discount: discount || 0, promoCode: promoCode || "",
    };

    const invoicePath = path.join(os.tmpdir(), `invoice-${orderRef.id}.pdf`);
    generateInvoice(savedOrder, orderRef.id, invoicePath)
      .then(() => sendInvoiceMail(userEmail, invoicePath, savedOrder))
      .catch(err => console.error("Invoice email failed:", err));

    res.status(201).json({ message: "Order placed successfully", orderId: orderRef.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// export const getOrders = async (req, res) => {
//   try {
//     const snapshot = await db.collection("orders")
//       .where("userId", "==", req.user.uid)
//       .get();

//     const orders = snapshot.docs
//       .map(doc => ({ id: doc.id, ...doc.data() }))
//       .filter(o => !o.deletedByUser)
//       .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

//     res.json(orders);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// Get Orders
export const getOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders")
      .where("userId", "==", req.user.uid)
      .get();

    const orders = snapshot.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt:          data.createdAt?.toDate?.()          || data.createdAt          || null,
          updatedAt:          data.updatedAt?.toDate?.()          || data.updatedAt          || null,
          deliveredAt:        data.deliveredAt?.toDate?.()        || data.deliveredAt        || null,
          cancelledAt:        data.cancelledAt?.toDate?.()        || data.cancelledAt        || null,
          returnRequestedAt:  data.returnRequestedAt?.toDate?.()  || data.returnRequestedAt  || null,
          refundInitiatedAt:  data.refundInitiatedAt?.toDate?.()  || data.refundInitiatedAt  || null,
        };
      })
      .filter(o => !o.deletedByUser)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const orderDoc = await db.collection("orders").doc(req.params.id).get();
    if (!orderDoc.exists)
      return res.status(404).json({ message: "Order not found" });

    const data = orderDoc.data();
    if (req.user.role !== "ADMIN" && data.userId !== req.user.uid)
      return res.status(403).json({ message: "Access denied" });

    res.json({
      id: orderDoc.id, userId: data.userId,
      name: data.name, email: data.email,
      phone: data.phone, address: data.address,
      totalAmount: data.totalAmount,
      items: data.items || [],
      status: data.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get All orders (admin only)
export const getAllOrders = async (req, res) => {
  try {
    const snapshot = await db.collection("orders").get();
    const orders = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userSnap = await db.collection("users").doc(data.userId).get();
        return {
          id: doc.id, ...data,
          userName: userSnap.exists ? userSnap.data().name : "Unknown",
        };
      })
    );
    orders.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update order status (admin only)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      "ORDER_PLACED",
      "APPROVED",
      "SHIPPED",
      "DELIVERED",
      "REJECTED",
    ];

    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const update = {
      status,
      updatedAt: new Date(),
    };

    if (status === "DELIVERED") {
      update.deliveredAt = new Date();
    }

    await db.collection("orders").doc(req.params.id).update(update);

    res.json({ message: "Order status updated" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Soft delete order
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

export const cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason?.trim())
      return res.status(400).json({ message: "Cancellation reason is required" });

    const orderDoc = await db.collection("orders").doc(req.params.id).get();

    if (!orderDoc.exists)
      return res.status(404).json({ message: "Order not found" });

    const data = orderDoc.data();

    if (data.userId !== req.user.uid)
      return res.status(403).json({ message: "Access denied" });

    if (!["ORDER_PLACED", "APPROVED"].includes(data.status))
      return res.status(400).json({
        message: "Order cannot be cancelled after it has been shipped",
      });
    await db.collection("orders").doc(req.params.id).update({
     status: "CANCELLED", 
      cancelReason: reason.trim(),
      cancelledAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({
      message: "Order cancelled. Refund will be processed after admin approval.",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Request return (customer)
export const requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason?.trim())
      return res.status(400).json({ message: "Return reason is required" });

    const orderDoc = await db.collection("orders").doc(req.params.id).get();

    if (!orderDoc.exists)
      return res.status(404).json({ message: "Order not found" });

    const data = orderDoc.data();

    if (data.userId !== req.user.uid)
      return res.status(403).json({ message: "Access denied" });

    if (data.status !== "DELIVERED")
      return res.status(400).json({
        message: "Only delivered orders can be returned",
      });

    const deliveredAt = data.deliveredAt?.toDate();

    if (!deliveredAt)
      return res.status(400).json({
        message: "Delivery date not found",
      });

    const now = new Date();
    const diffDays = (now - deliveredAt) / (1000 * 60 * 60 * 24);

    if (diffDays > 7)
      return res.status(400).json({
        message: "Return window closed (7 days exceeded)",
      });

    await db.collection("orders").doc(req.params.id).update({
      status: "RETURN_REQUESTED",
      returnReason: reason.trim(),
      returnRequestedAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({ message: "Return request submitted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Approve refund (admin)
export const approveRefund = async (req, res) => {
  try {
    const { refundNote } = req.body;
    const orderId = req.params.id;

    const orderDoc = await db.collection("orders").doc(orderId).get();
    if (!orderDoc.exists)
      return res.status(404).json({ message: "Order not found" });

    const data = orderDoc.data();

    if (!["RETURN_REQUESTED", "CANCELLED"].includes(data.status))
      return res.status(400).json({ message: "Order is not eligible for a refund" });

   
    if (!data.paymentId)
      return res.status(400).json({
        message: "No Razorpay payment ID on this order — cannot process refund automatically.",
      });

  const rzpRefund = await razorpay.payments.refund(data.paymentId, {
  speed: "optimum",
  notes: {
    orderId,
    reason: data.returnReason || data.cancelReason || "Admin approved refund",
  },
});
    await db.collection("orders").doc(orderId).update({
      status:            "REFUND_INITIATED",
      refundNote:        refundNote?.trim() || "",
      razorpayRefundId:  rzpRefund.id,
      refundInitiatedAt: new Date(),
      updatedAt:         new Date(),
    });

    await db.collection("transactions").add({
      userId:            data.userId,
      orderId,
      transactionId:     rzpRefund.id,
      transactionType:   "REFUND",
      transactionStatus: "INITIATED",
      amount:            data.totalAmount,
      createdAt:         new Date(),
    });

    res.json({
      message:         "Refund initiated via Razorpay. Customer will receive money in 5–7 business days.",
      razorpayRefundId: rzpRefund.id,
    });
  } catch (err) {
    console.error("Razorpay refund error:", err);
    const message = err?.error?.description || err.message || "Refund failed";
    res.status(500).json({ message });
  }
};

// Razorpay webhook to confirm refund success
export const razorpayWebhook = async (req, res) => {
  try {
    const { createHmac } = await import("crypto");
    const secret    = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    const expectedSig = createHmac("sha256", secret)
      .update(req.body) 
      .digest("hex");

    if (expectedSig !== signature) {
      console.warn("Razorpay webhook: invalid signature");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "refund.processed") {
      const rzpRefundId = event.payload.refund.entity.id;

      const orderSnap = await db.collection("orders")
        .where("razorpayRefundId", "==", rzpRefundId)
        .limit(1)
        .get();

      if (!orderSnap.empty) {
        await orderSnap.docs[0].ref.update({
          status:            "REFUND_SUCCESSFUL",
          refundCompletedAt: new Date(),
          updatedAt:         new Date(),
        });

        const txSnap = await db.collection("transactions")
          .where("transactionId", "==", rzpRefundId)
          .limit(1)
          .get();

        if (!txSnap.empty) {
          await txSnap.docs[0].ref.update({
            transactionStatus: "SUCCESS",
            updatedAt:         new Date(),
          });
        }

        console.log(`✅ Refund successful — order: ${orderSnap.docs[0].id}`);
      }
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ message: err.message });
  }
};