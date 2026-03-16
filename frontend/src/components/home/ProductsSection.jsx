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
  const [addingToCart, setAddingToCart] = useState({});

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

      {/* ── SECTION HEADER ── */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-bold text-green-800">
          Our Products
        </h2>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p, index) => (
          <div
            key={p._id || index}
            className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden group hover:border-green-300 dark:hover:border-green-700 hover:shadow-lg hover:shadow-green-50 transition-all duration-300"
          >
            {/* IMAGE */}
            <div className="relative overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {p.category && (
                <span className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 text-green-700 dark:text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 dark:border-green-700 backdrop-blur-sm">
                  {p.category}
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate mb-1">
                {p.name}
              </h3>
              {p.description && (
                <p className="text-gray-400 dark:text-gray-500 text-xs mb-3 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              )}
              <p className="text-green-700 dark:text-green-400 font-bold text-xl mb-4">
                ₹{p.price}
              </p>

              <button
                onClick={() => handleAddToCart(p)}
                disabled={addingToCart[p._id]}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  addingToCart[p._id]
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed border-2 border-gray-200 dark:border-gray-600"
                    : "bg-green-700 hover:bg-green-600 text-white border-2 border-green-700 hover:border-green-600 shadow-sm shadow-green-200"
                }`}
              >
                {addingToCart[p._id] ? (
                  <>
                    <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
                    Adding…
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── LOGIN MODAL ── */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-100 dark:border-gray-700 p-6 w-80 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200 dark:border-green-800">
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Login Required
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Please login to add products to your cart.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm transition border border-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginRedirect}
                className="flex-1 px-4 py-2.5 bg-green-700 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition shadow-sm shadow-green-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsSection;