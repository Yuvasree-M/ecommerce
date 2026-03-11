import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCart(data.items || []);
    } catch (err) {
      console.error("Cart fetch error:", err);
      setCart([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // ✅ Count unique products
  const cartCount = cart.length;

  return (
    <CartContext.Provider value={{ cart, cartCount, fetchCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};