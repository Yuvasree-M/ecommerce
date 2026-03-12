import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { apiFetch } from "../services/api.js";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH CART ---------------- */

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

  /* ---------------- CART COUNT ---------------- */

  const cartCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  /* ---------------- TOTAL PRICE ---------------- */

  const totalPrice = cart.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  /* ---------------- ADD TO CART ---------------- */

  const addToCart = async (product, quantity = 1) => {
    if (!token) return;

    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,   // fixed from _id
          quantity,
        }),
      });

      await fetchCart();
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  /* ---------------- REMOVE FROM CART ---------------- */

  const removeFromCart = async (productId) => {
    if (!token) return;

    try {
      await apiFetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });

      await fetchCart();
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  /* ---------------- CLEAR CART ---------------- */

  const clearCart = async () => {
    if (!token) return;

    try {
      await apiFetch("/api/cart/clear", {
        method: "POST",
      });

      setCart([]);
    } catch (err) {
      console.error("Clear cart failed:", err);
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
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};