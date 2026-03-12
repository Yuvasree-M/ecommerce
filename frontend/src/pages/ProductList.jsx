// src/pages/ProductList.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { apiFetch } from "../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});

  const { token } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/api/products");
        setProducts(data);

        // Initialize quantity for all products
        const initialQty = {};
        data.forEach((p) => {
          initialQty[p.id] = 1;
        });
        setQuantities(initialQty);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        toast.error("Failed to load products. Please try again.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token) return toast.info("Please login to add products to cart");

    const qty = quantities[productId] || 1;
    setAddingToCart((prev) => ({ ...prev, [productId]: true }));

    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: qty }),
      });

      fetchCart();
      setQuantities((prev) => ({ ...prev, [productId]: 1 }));
      toast.success("Product added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id]) }));

  if (loadingProducts) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg font-semibold text-green-700">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-3xl font-bold mb-8 text-green-800">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition border border-transparent focus-within:border-green-500"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-40 w-full object-cover rounded mb-3"
            />
            <h4 className="font-semibold text-lg">{p.name}</h4>
            <p className="text-gray-600 text-sm mb-2">{p.description}</p>
            <p className="font-bold mb-3 text-green-700">₹ {p.price}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-3">
              <span className="font-medium">Qty:</span>
              <div className="flex items-center border border-green-500 rounded-lg overflow-hidden">
                <button
                  onClick={() => decrement(p.id)}
                  disabled={!token}
                  className={`px-3 py-1 transition ${
                    !token ? "bg-gray-200 cursor-not-allowed" : "bg-green-100 hover:bg-green-200"
                  }`}
                >
                  −
                </button>
                <span className="px-4 py-1 font-semibold">{quantities[p.id]}</span>
                <button
                  onClick={() => increment(p.id)}
                  disabled={!token}
                  className={`px-3 py-1 transition ${
                    !token ? "bg-gray-200 cursor-not-allowed" : "bg-green-100 hover:bg-green-200"
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(p.id)}
              disabled={!token || addingToCart[p.id]}
              className={`w-full py-2 rounded-lg font-semibold transition ${
                !token || addingToCart[p.id]
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-600"
              }`}
            >
              {addingToCart[p.id] ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;