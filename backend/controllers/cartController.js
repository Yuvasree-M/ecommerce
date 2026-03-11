import { db } from "../config/firebase.js";

// Add to cart
// 🛒 Add or Update Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.uid;

    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    let cartItems = cartDoc.exists ? cartDoc.data().items : [];

    const existing = cartItems.find(i => i.productId === productId);
    if (existing) {
      // ✅ Set the new quantity directly
      existing.quantity = quantity;
    } else {
      cartItems.push({ productId, quantity });
    }

    await cartRef.set({ items: cartItems });
    res.json({ message: "Cart updated successfully" });
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const cartDoc = await db.collection("carts").doc(userId).get();

    if (!cartDoc.exists) return res.json({ items: [] });

    const cartItems = cartDoc.data().items;

    const products = await Promise.all(
      cartItems.map(async (item) => {
        const doc = await db.collection("products").doc(item.productId).get();
        return { id: doc.id, ...doc.data(), quantity: item.quantity };
      })
    );

    res.json({ items: products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.uid;

    const cartRef = db.collection("carts").doc(userId);
    const cartDoc = await cartRef.get();

    if (!cartDoc.exists) return res.json({ message: "Cart empty" });

    const updatedItems = cartDoc.data().items.filter((i) => i.productId !== productId);
    await cartRef.set({ items: updatedItems });

    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    await db.collection("carts").doc(userId).set({ items: [] });
    res.json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};