import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const ProductsSection = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("API_BASE_URL/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = (product) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(""), 2500);
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/login");
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
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
                className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg transition transform hover:scale-105"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}

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