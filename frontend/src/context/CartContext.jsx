// src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../services/api.js"; // use your helper for auth

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch cart items from API
  const fetchCart = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiFetch("/api/cart");
      setCart(data.items || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // Count unique products in cart
  const cartCount = cart.length;

  // Compute total price
  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  // Add item to cart (update or append)
  const addToCart = async (product, quantity = 1) => {
    if (!token) return;
    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      await fetchCart();
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!token) return;
    try {
      await apiFetch(`/api/cart/${productId}`, { method: "DELETE" });
      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        totalPrice,
        loading,
        fetchCart,
        setCart,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};