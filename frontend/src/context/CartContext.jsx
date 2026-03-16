import { createContext, useState, useEffect, useContext, useMemo } from "react";
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

 const cartCount = useMemo(() => cart.length, [cart]);

  /* ---------------- TOTAL PRICE ---------------- */

  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
      0
    );
  }, [cart]);

  /* ---------------- ADD TO CART ---------------- */

  const addToCart = async (product, quantity = 1) => {
    if (!token) return;

    const previousCart = cart;

    const existingItem = cart.find((i) => i.id === product.id);

    if (existingItem) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        { ...product, quantity }
      ]);
    }

    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      });
    } catch (err) {
      console.error("Add to cart failed:", err);
      setCart(previousCart);
    }
  };

  /* ---------------- REMOVE FROM CART ---------------- */

  const removeFromCart = async (productId) => {
    if (!token) return;

    const previousCart = cart;

    setCart((prev) => prev.filter((item) => item.id !== productId));

    try {
      await apiFetch(`/api/cart/${productId}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.error("Remove from cart failed:", err);
      setCart(previousCart);
    }
  };

  /* ---------------- UPDATE QUANTITY ---------------- */

  const updateQuantity = async (productId, quantity) => {
    if (!token || quantity < 1) return;

    const previousCart = cart;

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );

    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productId,
          quantity,
        }),
      });
    } catch (err) {
      console.error("Update quantity failed:", err);
      setCart(previousCart);
    }
  };

  /* ---------------- CLEAR CART ---------------- */

  const clearCart = async () => {
    if (!token) return;

    const previousCart = cart;

    setCart([]);

    try {
      await apiFetch("/api/cart/clear", {
        method: "POST",
      });
    } catch (err) {
      console.error("Clear cart failed:", err);
      setCart(previousCart);
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
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};