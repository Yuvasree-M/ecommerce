import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { apiFetch } from "../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [products,         setProducts]         = useState([]);
  const [categories,       setCategories]       = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [quantities,       setQuantities]       = useState({});
  const [loadingProducts,  setLoadingProducts]  = useState(true);
  const [loadingId,        setLoadingId]        = useState(null);

  const { token }                           = useContext(AuthContext);
  const { cart, fetchCart, removeFromCart } = useContext(CartContext);

  /* ── FETCH PRODUCTS + CATEGORIES ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories] = await Promise.all([
          apiFetch("/api/products"),
          apiFetch("/api/categories"),
        ]);

        setProducts(products);
        setCategories(categories);

        const initialQty = {};
        products.forEach(p => { initialQty[p.id] = 1; });
        setQuantities(initialQty);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load products. Please try again.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchData();
  }, []);

  /* ── CATEGORY FILTER ── */
  const filtered = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  /* ── CATEGORY COLOR MAP ── */
  const catColors = [
    "bg-green-100 text-green-700 border-green-200",
    "bg-blue-100 text-blue-700 border-blue-200",
    "bg-purple-100 text-purple-700 border-purple-200",
    "bg-orange-100 text-orange-700 border-orange-200",
    "bg-pink-100 text-pink-700 border-pink-200",
    "bg-teal-100 text-teal-700 border-teal-200",
  ];
  const getCatColor = (name) => {
    const idx = categories.findIndex(c => c.name === name);
    return catColors[idx % catColors.length] || catColors[0];
  };

  /* ── IS IN CART ── */
  const isInCart = (productId) => cart.some(item => item.id === productId);

  /* ── ADD TO CART ── */
  const handleAddToCart = async (productId) => {
    if (!token) return toast.info("Please login to add products to cart");

    const qty = quantities[productId] || 1;
    setLoadingId(productId);

    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: qty }),
      });
      await fetchCart();
      setQuantities(prev => ({ ...prev, [productId]: 1 }));
      toast.success("Added to cart!");
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Failed to add product to cart");
    } finally {
      setLoadingId(null);
    }
  };

  /* ── REMOVE FROM CART ── */
  const handleRemoveFromCart = async (productId) => {
    setLoadingId(productId);
    try {
      await removeFromCart(productId);
      toast.info("Removed from cart");
    } catch (err) {
      console.error("Remove from cart error:", err);
      toast.error("Failed to remove product");
    } finally {
      setLoadingId(null);
    }
  };

  const increment = (id) =>
    setQuantities(prev => ({ ...prev, [id]: prev[id] + 1 }));
  const decrement = (id) =>
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, prev[id] - 1) }));

  /* ── LOADING ── */
  if (loadingProducts) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <div className="h-9 w-36 bg-green-100 animate-pulse rounded-xl mb-4" />
        <div className="flex gap-2 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-green-50 animate-pulse rounded-full border border-green-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border-2 border-gray-100">
              <div className="h-48 bg-green-50" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-green-100 rounded-full" />
                <div className="h-4 w-3/4 bg-gray-100 rounded-lg" />
                <div className="h-3 w-full bg-gray-50 rounded-lg" />
                <div className="h-3 w-2/3 bg-gray-50 rounded-lg" />
                <div className="h-5 w-1/3 bg-green-100 rounded-lg" />
                <div className="h-9 bg-green-100 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* ── PAGE HEADER ── */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-green-800">Products</h2>
        <p className="text-gray-400 text-sm mt-1">{products.length} items available</p>
      </div>

      {/* ── CATEGORY FILTER TABS ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["All", ...categories.map(c => c.name)].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border-2 ${
              selectedCategory === cat
                ? "bg-green-700 text-white border-green-700 shadow-sm shadow-green-200"
                : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-700"
            }`}
          >
            {cat}
            <span className={`ml-1.5 text-xs ${selectedCategory === cat ? "opacity-75" : "opacity-40"}`}>
              {cat === "All" ? products.length : products.filter(p => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try selecting a different category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => {
            const inCart = isInCart(p.id);
            const busy   = loadingId === p.id;

            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-200 border-2 group ${
                  inCart
                    ? "border-green-400 shadow-md shadow-green-100"
                    : "border-gray-100 hover:border-green-200 hover:shadow-md hover:shadow-gray-100"
                }`}
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* IN-CART BADGE */}
                  {inCart && (
                    <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      In Cart
                    </span>
                  )}

                  {/* CATEGORY BADGE */}
                  {p.category && (
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${getCatColor(p.category)}`}>
                      {p.category}
                    </span>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 text-base mb-1 truncate">{p.name}</h4>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">{p.description}</p>
                  <p className="font-bold text-green-700 text-xl mb-4">₹ {p.price}</p>

                  {/* QUANTITY SELECTOR — only when not in cart */}
                        {/* QUANTITY SELECTOR — only show when not in cart */}
                {!inCart && (
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-medium text-gray-600">Qty:</span>
                  <div className="flex items-center border-2 border-green-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => decrement(p.id)}
                      disabled={!token}
                      className="px-3 py-1 bg-green-50 hover:bg-green-100 disabled:bg-gray-100 disabled:cursor-not-allowed font-bold text-green-700 transition"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-800 min-w-[2rem] text-center">
                      {quantities[p.id]}
                    </span>
                    <button
                      onClick={() => increment(p.id)}
                      disabled={!token}
                      className="px-3 py-1 bg-green-50 hover:bg-green-100 disabled:bg-gray-100 disabled:cursor-not-allowed font-bold text-green-700 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}


                  {/* ADD / REMOVE BUTTON */}
                  {inCart ? (
                    <button
                      onClick={() => handleRemoveFromCart(p.id)}
                      disabled={busy}
                      className="w-full py-2.5 rounded-xl font-semibold transition-all border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {busy ? (
                        <>
                          <span className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          Removing…
                        </>
                      ) : (
                        "Remove from Cart"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(p.id)}
                      disabled={!token || busy}
                      className="w-full py-2.5 rounded-xl font-semibold transition-all bg-green-700 text-white hover:bg-green-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-sm shadow-green-200"
                    >
                      {busy ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Adding…
                        </>
                      ) : (
                        "Add to Cart"
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;