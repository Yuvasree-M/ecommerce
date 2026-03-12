// src/components/ProductsSection.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiFetch } from "../../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState({}); // per-product loading

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await apiFetch("/api/products");
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-6 relative">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-4xl font-bold text-center mb-12 text-green-800">
        Our Products
      </h2>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        {products.map((p, index) => (
          <div
            key={p._id || index}
            className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 shadow-lg rounded-2xl overflow-hidden transform transition hover:scale-105 hover:border-green-500"
          >
            <img
              src={p.image}
              alt={p.name}
              className="h-48 w-full object-cover rounded-t-2xl"
            />
            <div className="p-4 flex flex-col items-center">
              <h3 className="font-semibold text-lg text-center">{p.name}</h3>
              <p className="text-green-700 font-bold mt-2">₹{p.price}</p>

              <button
                onClick={() => handleAddToCart(p)}
                disabled={addingToCart[p._id]}
                className={`mt-4 px-6 py-3 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105 ${
                  addingToCart[p._id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {addingToCart[p._id] ? "Adding..." : "Add to Cart"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm text-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              You need to login
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Do you want to login now to add products to your cart?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleLoginRedirect}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg transition"
              >
                Yes, Login
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;