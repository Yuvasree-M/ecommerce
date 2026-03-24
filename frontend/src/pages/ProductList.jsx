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

  const filtered = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const catColors = [
    { badge: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { badge: "bg-blue-100 text-blue-700 border-blue-200" },
    { badge: "bg-violet-100 text-violet-700 border-violet-200" },
    { badge: "bg-amber-100 text-amber-700 border-amber-200" },
    { badge: "bg-rose-100 text-rose-700 border-rose-200" },
    { badge: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  ];
  const getCatColor = (name) => {
    const idx = categories.findIndex(c => c.name === name);
    return (catColors[idx % catColors.length] || catColors[0]).badge;
  };

  const isInCart = (productId) => cart.some(item => item.id === productId);

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

  if (loadingProducts) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">
        <div className="h-8 w-32 bg-gray-100 animate-pulse rounded-xl mb-1" />
        <div className="h-4 w-24 bg-gray-100 animate-pulse rounded-lg mb-6" />
        <div className="flex gap-2 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-100" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-16 bg-gray-100 rounded-full" />
                <div className="h-4 w-3/4 bg-gray-100 rounded-lg" />
                <div className="h-3 w-full bg-gray-100 rounded-lg" />
                <div className="h-3 w-2/3 bg-gray-100 rounded-lg" />
                <div className="flex justify-between">
                  <div className="h-6 w-1/3 bg-gray-100 rounded-lg" />
                  <div className="h-6 w-1/4 bg-gray-100 rounded-lg" />
                </div>
                <div className="h-9 bg-gray-100 rounded-xl" />
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

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-green-800">Products</h2>
        <p className="text-gray-400 text-sm mt-1">{products.length} items available</p>
      </div>


        <div className="flex flex-wrap gap-2 mb-8">
          {["All", ...categories.map(c => c.name)].map(cat => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-400 hover:text-green-700 dark:hover:text-green-400"
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {cat === "All" ? products.length : products.filter(p => p.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 bg-white dark:bg-gray-800">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-600 dark:text-gray-300">No products found</p>
            <p className="text-sm mt-1">Try selecting a different category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(p => {
              const inCart = isInCart(p.id);
              const busy   = loadingId === p.id;

              return (
                <div
                  key={p.id}
                  className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-200 border group flex flex-col ${
                    inCart
                      ? "border-green-400 shadow-md shadow-green-100/50 dark:shadow-none"
                      : "border-gray-100 dark:border-gray-700 hover:border-green-300 hover:shadow-lg"
                  }`}
                >
                  <div className="relative overflow-hidden h-48 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {p.category && (
                      <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${getCatColor(p.category)}`}>
                        {p.category}
                      </span>
                    )}

                    {inCart && (
                      <span className="absolute top-2.5 right-2.5 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                        ✓ In Cart
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 truncate">
                      {p.name}
                    </h4>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
                      {p.description}
                    </p>

                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-bold text-green-600 dark:text-green-400 text-lg leading-none">
                        ₹{p.price}
                      </p>
                      {p.quantity ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-lg">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          {p.quantity}
                        </span>
                      ) : null}
                    </div>

                    {!inCart && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Qty</span>
                        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700/50">
                          <button
                            onClick={() => decrement(p.id)}
                            disabled={!token}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold text-lg"
                          >
                            −
                          </button>
                          <span className="px-3 text-sm font-bold text-gray-800 dark:text-gray-100 min-w-[2rem] text-center">
                            {quantities[p.id]}
                          </span>
                          <button
                            onClick={() => increment(p.id)}
                            disabled={!token}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    )}

                    {inCart ? (
                      <button
                        onClick={() => handleRemoveFromCart(p.id)}
                        disabled={busy}
                        className="w-full py-2.5 rounded-xl font-semibold transition-all border border-red-200 dark:border-red-700/50 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs mt-auto"
                      >
                        {busy ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            Removing…
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove from Cart
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(p.id)}
                        disabled={!token || busy}
                        className="w-full py-2.5 rounded-xl font-semibold transition-all bg-green-600 text-white hover:bg-green-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs mt-auto shadow-sm"
                      >
                        {busy ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Adding…
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {!token ? "Login to Add" : "Add to Cart"}
                          </>
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