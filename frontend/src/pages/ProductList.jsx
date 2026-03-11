import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // track quantity per product

  const { token } = useContext(AuthContext);
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);

      // Initialize quantities for all products
      const initialQty = {};
      data.forEach((p) => {
        initialQty[p.id] = 1;
      });
      setQuantities(initialQty);
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    if (!token) return alert("Please login");

    const qty = quantities[productId] || 1;

    await fetch(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: qty }),
    });

    fetchCart();
    setQuantities((prev) => ({ ...prev, [productId]: 1 })); // reset quantity after adding
  };

  const increment = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id]) }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24">
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
                  className="px-3 py-1 bg-green-100 hover:bg-green-200 transition"
                >
                  −
                </button>
                <span className="px-4 py-1 font-semibold">{quantities[p.id]}</span>
                <button
                  onClick={() => increment(p.id)}
                  className="px-3 py-1 bg-green-100 hover:bg-green-200 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={() => handleAddToCart(p.id)}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;