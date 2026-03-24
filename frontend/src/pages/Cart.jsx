import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { apiFetch } from "../services/api";
import {
  FaTrash, FaShoppingCart, FaArrowRight,
   FaShieldAlt, FaTruck, FaMinus, FaPlus,
  FaExclamationTriangle,
} from "react-icons/fa";

const Cart = () => {
  const { token } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [confirmItem, setConfirmItem] = useState(null); 

  const handleRemove = async (id) => {
    const prev = cart;
    setCart(c => c.filter(i => i.id !== id));
    setConfirmItem(null);
    try {
      await apiFetch(`/api/cart/${id}`, { method: "DELETE" });
    } catch {
      setCart(prev);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    const prev = cart;
    setCart(c => c.map(i => i.id === id ? { ...i, quantity } : i));
    try {
      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: id, quantity }),
      });
    } catch {
      setCart(prev);
    }
  };

  const handleCheckout = () => {
    if (!token) return alert("Login to checkout");
    navigate("/checkout");
  };


  const totalPrice = useMemo(
    () => cart.reduce((s, i) => s + i.price * i.quantity, 0), [cart]
  );
  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0), [cart]
  );


  if (cart.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col items-center justify-center gap-5 px-4 pt-20">
      <div className="relative">
        <div className="w-28 h-28 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-green-100">
          <FaShoppingCart className="text-5xl text-green-200" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow">
          <span className="text-white text-xs font-bold">0</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xl font-bold text-gray-800 mb-1">Your cart is empty</p>
        <p className="text-sm text-gray-400 max-w-xs">
          Looks like you haven't added anything yet. Explore our fresh organic products!
        </p>
      </div>
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-green-100"
      > Browse Products
      </button>
    </div>
  );

  return (
    <>
      {confirmItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          onClick={() => setConfirmItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ animation: "modalIn 0.18s ease both" }}
            onClick={e => e.stopPropagation()}
          >
            <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.94)}to{opacity:1;transform:scale(1)}}`}</style>

            <div className="bg-red-50 border-b border-red-100 px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="text-red-500 text-sm" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">Remove Item?</p>
                <p className="text-xs text-gray-400 mt-0.5">This will be removed from your cart</p>
              </div>
            </div>

            <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-50">
              <img
                src={confirmItem.image}
                alt={confirmItem.name}
                className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
              />
              <p className="text-sm font-semibold text-gray-800 leading-snug">{confirmItem.name}</p>
            </div>

            <div className="px-5 py-4 flex gap-3">
              <button
                onClick={() => setConfirmItem(null)}
                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-all"
              >
                Keep Item
              </button>
              <button
                onClick={() => handleRemove(confirmItem.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
              >
                <FaTrash className="text-xs" /> Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center shadow-md shadow-green-200">
                <FaShoppingCart className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Shopping Cart</h1>
                <p className="text-xs text-green-500 font-semibold mt-0.5">
                  {cart.length} product{cart.length !== 1 ? "s" : ""} · {totalItems} item{totalItems !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="hidden sm:flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 font-semibold transition-colors"
            >
              ← Continue Shopping
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-6 items-start">

            <div className="lg:col-span-3 space-y-3">

              <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-widest px-4 pb-1">
                <span className="col-span-6">Product</span>
                <span className="col-span-3 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
                <span className="col-span-1" />
              </div>

              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-400" />

                  <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">

       
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-green-100"
                        />
                        <span className="sm:hidden absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm leading-snug truncate">{item.name}</p>
                        <p className="text-green-600 font-bold text-sm mt-0.5">₹{item.price}</p>
                        <p className="text-xs text-gray-400 mt-0.5">per unit</p>
                      </div>
                    </div>

       
                    <div className="sm:col-span-3 flex items-center justify-start sm:justify-center">
                      <div className="flex items-center border border-green-200 rounded-xl overflow-hidden bg-green-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-9 h-9 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                        >
                          <FaMinus className="text-xs" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold text-gray-800 border-x border-green-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-9 h-9 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                        >
                          <FaPlus className="text-xs" />
                        </button>
                      </div>
                    </div>


                    <div className="sm:col-span-2 text-left sm:text-right">
                      <p className="text-base font-extrabold text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-400">
                          {item.quantity} × ₹{item.price}
                        </p>
                      )}
                    </div>

 
                    <div className="sm:col-span-1 flex sm:justify-end">
                      <button
                        onClick={() => setConfirmItem({ id: item.id, name: item.name, image: item.image })}
                        className="flex items-center gap-1.5 sm:gap-0 text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                        title="Remove"
                      >
                        <FaTrash className="text-xs" />
                        <span className="sm:hidden ml-1">Remove</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate("/products")}
                className="sm:hidden w-full text-center text-sm text-green-600 font-semibold py-3"
              >
                ← Continue Shopping
              </button>

            </div>

            <div className="lg:col-span-2 sticky top-24 space-y-3">

              <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-4">
                  <h3 className="text-white font-bold text-base">Order Summary</h3>
                  <p className="text-green-200 text-xs mt-0.5">
                    {cart.length} product{cart.length !== 1 ? "s" : ""} in cart
                  </p>
                </div>

                <div className="p-5">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Products ({cart.length})</span>
                      <span className="font-medium text-gray-700">{totalItems} items</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-700">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FaTruck className="text-blue-400 text-xs" /> Delivery
                      </span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                  </div>

                  <div className="my-4 border-t border-dashed border-gray-100" />

                  <div className="flex justify-between items-center mb-5">
                    <span className="font-bold text-gray-900 text-base">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-green-700">₹{totalPrice}</p>
                      <p className="text-xs text-green-500 font-semibold">Free delivery included</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-green-100"
                  >
                    Proceed to Checkout
                    <FaArrowRight className="text-xs" />
                  </button>
                </div>
              </div>


              <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
                <div className="space-y-2.5">
                  {[
                    { icon: FaTruck,     bg: "bg-blue-50",   color: "text-blue-500",   text: "Free delivery on all orders"   },
                  
                    { icon: FaShieldAlt, bg: "bg-purple-50", color: "text-purple-500", text: "Secure & encrypted checkout"   },
                  ].map(({ icon: Icon, bg, color, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`text-xs ${color}`} />
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;