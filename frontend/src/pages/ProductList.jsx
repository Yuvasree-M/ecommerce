// // src/pages/ProductList.jsx
// import React, { useState, useEffect, useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { CartContext } from "../context/CartContext";
// import { apiFetch } from "../services/api.js";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [quantities, setQuantities] = useState({});
//   const [loadingProducts, setLoadingProducts] = useState(true);
//   const [addingToCart, setAddingToCart] = useState({});

//   const { token } = useContext(AuthContext);
//   const { fetchCart } = useContext(CartContext);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const data = await apiFetch("/api/products");
//         setProducts(data);

//         // Initialize quantity for all products
//         const initialQty = {};
//         data.forEach((p) => {
//           initialQty[p.id] = 1;
//         });
//         setQuantities(initialQty);
//       } catch (err) {
//         console.error("Failed to fetch products:", err);
//         toast.error("Failed to load products. Please try again.");
//       } finally {
//         setLoadingProducts(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const handleAddToCart = async (productId) => {
//     if (!token) return toast.info("Please login to add products to cart");

//     const qty = quantities[productId] || 1;
//     setAddingToCart((prev) => ({ ...prev, [productId]: true }));

//     try {
//       await apiFetch("/api/cart", {
//         method: "POST",
//         body: JSON.stringify({ productId, quantity: qty }),
//       });

//       fetchCart();
//       setQuantities((prev) => ({ ...prev, [productId]: 1 }));
//       toast.success("Product added to cart!");
//     } catch (err) {
//       console.error("Add to cart error:", err);
//       toast.error("Failed to add product to cart");
//     } finally {
//       setAddingToCart((prev) => ({ ...prev, [productId]: false }));
//     }
//   };

//   const increment = (id) =>
//     setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
//   const decrement = (id) =>
//     setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id]) }));

//   if (loadingProducts) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <p className="text-lg font-semibold text-green-700">Loading products...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-10 pt-24">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="text-3xl font-bold mb-8 text-green-800">Products</h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {products.map((p) => (
//           <div
//             key={p.id}
//             className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition border border-transparent focus-within:border-green-500"
//           >
//             <img
//               src={p.image}
//               alt={p.name}
//               className="h-40 w-full object-cover rounded mb-3"
//             />
//             <h4 className="font-semibold text-lg">{p.name}</h4>
//             <p className="text-gray-600 text-sm mb-2">{p.description}</p>
//             <p className="font-bold mb-3 text-green-700">₹ {p.price}</p>

//             {/* Quantity Selector */}
//             <div className="flex items-center gap-4 mb-3">
//               <span className="font-medium">Qty:</span>
//               <div className="flex items-center border border-green-500 rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => decrement(p.id)}
//                   disabled={!token}
//                   className={`px-3 py-1 transition ${
//                     !token ? "bg-gray-200 cursor-not-allowed" : "bg-green-100 hover:bg-green-200"
//                   }`}
//                 >
//                   −
//                 </button>
//                 <span className="px-4 py-1 font-semibold">{quantities[p.id]}</span>
//                 <button
//                   onClick={() => increment(p.id)}
//                   disabled={!token}
//                   className={`px-3 py-1 transition ${
//                     !token ? "bg-gray-200 cursor-not-allowed" : "bg-green-100 hover:bg-green-200"
//                   }`}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Add to Cart Button */}
//             <button
//               onClick={() => handleAddToCart(p.id)}
//               disabled={!token || addingToCart[p.id]}
//               className={`w-full py-2 rounded-lg font-semibold transition ${
//                 !token || addingToCart[p.id]
//                   ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                   : "bg-green-700 text-white hover:bg-green-600"
//               }`}
//             >
//               {addingToCart[p.id] ? "Adding..." : "Add to Cart"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductList;

import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { apiFetch } from "../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductList = () => {
  const [products,        setProducts]        = useState([]);
  const [quantities,      setQuantities]      = useState({});
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingId,       setLoadingId]       = useState(null); // single id being processed

  const { token }                        = useContext(AuthContext);
  const { cart, fetchCart, removeFromCart } = useContext(CartContext);

  /* ── FETCH PRODUCTS ── */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiFetch("/api/products");
        setProducts(data);
        const initialQty = {};
        data.forEach(p => { initialQty[p.id] = 1; });
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
        <div className="h-8 w-40 bg-green-100 animate-pulse rounded-xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-4 space-y-3 animate-pulse border border-green-50">
              <div className="h-40 bg-green-100 rounded-lg" />
              <div className="h-4 w-3/4 bg-green-100 rounded" />
              <div className="h-3 w-full bg-green-50 rounded" />
              <div className="h-4 w-1/3 bg-green-100 rounded" />
              <div className="h-9 bg-green-100 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24">
      <ToastContainer position="top-right" autoClose={2500} />

      <h2 className="text-3xl font-bold mb-8 text-green-800">Products</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(p => {
          const inCart  = isInCart(p.id);
          const busy    = loadingId === p.id;

          return (
            <div
              key={p.id}
              className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border-2 ${
                inCart ? "border-green-400" : "border-transparent"
              }`}
            >
              {/* IN-CART BADGE */}
              <div className="relative">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-40 w-full object-cover rounded-lg mb-3"
                />
                {inCart && (
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    ✓ In Cart
                  </span>
                )}
              </div>

              <h4 className="font-semibold text-lg text-gray-800">{p.name}</h4>
              <p className="text-gray-500 text-sm mb-2 line-clamp-2">{p.description}</p>
              <p className="font-bold mb-3 text-green-700 text-lg">₹ {p.price}</p>

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
                  className="w-full py-2 rounded-lg font-semibold transition-all border-2 border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <>
                      <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      Removing…
                    </>
                  ) : (
                    <>
                      <span>✕</span> Remove from Cart
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handleAddToCart(p.id)}
                  disabled={!token || busy}
                  className="w-full py-2 rounded-lg font-semibold transition-all bg-green-700 text-white hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {busy ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding…
                    </>
                  ) : (
                    "Add to Cart"
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;