import { db } from "../config/firebase.js";

// PLACE ORDER AFTER PAYMENT SUCCESS
export const placeOrder = async (req, res) => {
  try {

    const { cartItems, address, phone, paymentId, razorpayOrderId } = req.body;

    const userId = req.user.uid;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Fetch product details
    const itemsWithDetails = await Promise.all(
      cartItems.map(async (item) => {

        const productDoc = await db
          .collection("products")
          .doc(item.productId)
          .get();

        if (!productDoc.exists) {
          throw new Error("Product not found");
        }

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

    const totalAmount = itemsWithDetails.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Save Order
    const orderRef = await db.collection("orders").add({

      userId,
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

    // Save transaction
    await db.collection("transactions").add({

      userId,

      orderId: orderRef.id,

      transactionId: paymentId,

      transactionType: "ONLINE",

      transactionStatus: "SUCCESS",

      createdAt: new Date(),

    });

    // Clear cart
    await db.collection("carts").doc(userId).set({
      items: [],
    });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: orderRef.id,
    });

  } catch (err) {

    console.error("Order error:", err);

    res.status(500).json({ message: err.message });

  }
};


// GET USER ORDERS
export const getOrders = async (req, res) => {

  try {

    const userId = req.user.uid;

    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .get();

    const orders = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    res.json(orders);

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: err.message });

  }

};


// ADMIN GET ALL ORDERS
export const getAllOrders = async (req, res) => {

  try {

    const snapshot = await db.collection("orders").get();

    const orders = await Promise.all(

      snapshot.docs.map(async (doc) => {

        const orderData = doc.data();

        const userSnap = await db
          .collection("users")
          .doc(orderData.userId)
          .get();

        const userData = userSnap.exists
          ? userSnap.data()
          : { name: "Unknown User" };

        return {
          id: doc.id,
          ...orderData,
          userName: userData.name,
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


// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    const allowed = [
      "ORDER_PLACED",
      "APPROVED",
      "SHIPPED",
      "DELIVERED",
      "REJECTED",
    ];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.collection("orders").doc(id).update({

      status,

      updatedAt: new Date(),

    });

    res.json({ message: "Order status updated" });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: err.message });

  }

};


// SOFT DELETE USER ORDERS
export const softDeleteOrders = async (req, res) => {

  try {

    const userId = req.user.uid;

    const snapshot = await db
      .collection("orders")
      .where("userId", "==", userId)
      .get();

    const batch = db.batch();

    snapshot.docs.forEach((doc) => {

      batch.update(doc.ref, { deletedByUser: true });

    });

    await batch.commit();

    res.json({ message: "Orders hidden successfully" });

  } catch (err) {

    console.error(err);

    res.status(500).json({ message: err.message });

  }

};