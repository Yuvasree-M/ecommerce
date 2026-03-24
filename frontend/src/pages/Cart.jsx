import { useContext, useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { apiFetch } from "../services/api";
import {
  FaTrash, FaShoppingCart, FaArrowRight,
  FaShieldAlt, FaTruck, FaMinus, FaPlus,
  FaExclamationTriangle, FaLeaf, FaTag,
  FaGift, FaChevronRight,
} from "react-icons/fa";

const Cart = () => {
  const { token } = useContext(AuthContext);
  const { cart, setCart, getTotalUnit,discount,  setDiscount,
  promoCode,
  setPromoCode,
  promoApplied,
  setPromoApplied } = useContext(CartContext);
  const navigate = useNavigate();
const [promoMessage, setPromoMessage] = useState(null);
const [showPromoPopup, setShowPromoPopup] = useState(false);
const [usedPromoCodes, setUsedPromoCodes] = useState([]);
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

const handlePromo = () => {
  const code = promoCode.trim().toUpperCase();

  if (!code) {
    setPromoMessage("Enter promo code");
    setShowPromoPopup(true);
    return;
  }

  if (usedPromoCodes.includes(code)) {
    setPromoMessage("Promo code already used");
    setShowPromoPopup(true);
    return;
  }

  if (code === "VERDURA10") {
    setPromoApplied(true);
    setPromoMessage("10% discount applied");
  }
  else if (code === "SAVE50") {
    setPromoApplied(true);
    setPromoMessage("₹50 discount applied");
  }
  else if (code === "FREESHIP") {
    setPromoApplied(true);
    setPromoMessage("Free delivery applied");
  }
  else {
    setPromoApplied(false);
    setDiscount(0);
    setPromoMessage("Invalid promo code");
  }

  setShowPromoPopup(true);
};

const subtotal = useMemo(
  () => cart.reduce((s, i) => s + i.price * i.quantity, 0),
  [cart]
);

const totalPrice = Math.max(0, subtotal - discount);
  const totalItems = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0), [cart]
  );
useEffect(() => {
  const code = promoCode.trim().toUpperCase();

  if (!code) return;

  if (code === "VERDURA10") {
    setDiscount(subtotal * 0.10);
    setPromoApplied(true);
  } 
  else if (code === "SAVE50") {
    setDiscount(50);
    setPromoApplied(true);
  } 


}, [subtotal, promoCode]);
  /* ── EMPTY STATE ── */
  if (cart.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex flex-col items-center justify-center gap-6 px-4 pt-20">
      <style>{`
        @keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float-anim { animation: floatUp 3s ease-in-out infinite; }
      `}</style>

      <div className="relative float-anim">
        <div className="w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-100">
          <FaShoppingCart className="text-6xl text-green-200" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
          <span className="text-white text-xs font-bold">0</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</p>
        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
          Looks like you haven't added anything yet. Explore our fresh organic products!
        </p>
      </div>

      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-green-200"
      >
        <FaLeaf className="text-xs" />
        Browse Products
        <FaArrowRight className="text-xs" />
      </button>

      <div className="flex items-center gap-8 mt-2">
        {[
          { icon: FaTruck,     text: "Free Delivery"    },
          { icon: FaShieldAlt, text: "Secure Checkout"  },
          { icon: FaLeaf,      text: "100% Organic"     },
        ].map(({ icon: Icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <Icon className="text-green-500 text-sm" />
            </div>
            <span className="text-xs text-gray-400 font-medium">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* ── CONFIRM MODAL ── */}
      {confirmItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          style={{ animation: "fadeIn 0.15s ease both" }}
          onClick={() => setConfirmItem(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            style={{ animation: "modalIn 0.2s ease both" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-red-50 border-b border-red-100 px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="text-red-500 text-sm" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">Remove Item?</p>
                <p className="text-xs text-gray-400 mt-0.5">This will be removed from your cart</p>
              </div>
            </div>

            <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
              <img
                src={confirmItem.image}
                alt={confirmItem.name}
                className="w-14 h-14 rounded-xl object-cover border border-gray-100 flex-shrink-0"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-snug">{confirmItem.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Qty: {confirmItem.quantity}</p>
              </div>
            </div>

            <div className="px-5 py-4 flex gap-3">
              <button
                onClick={() => setConfirmItem(null)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-all"
              >
                Keep Item
              </button>
              <button
                onClick={() => handleRemove(confirmItem.id)}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-red-200"
              >
                <FaTrash className="text-xs" /> Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
{/* PROMO POPUP */}
{showPromoPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
      
      <div className="text-green-600 text-lg font-bold mb-2">
        Promo Code
      </div>

      <p className="text-sm text-gray-600 mb-4">
        {promoMessage}
      </p>

      <button
        onClick={() => setShowPromoPopup(false)}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold"
      >
        OK
      </button>

    </div>
  </div>
)}
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* ── PAGE HEADER ── */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md shadow-green-200">
                <FaShoppingCart className="text-white text-base" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
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

            {/* ── LEFT: ITEMS ── */}
            <div className="lg:col-span-3 space-y-3">

              {/* Column labels */}
              <div className="hidden sm:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-widest px-5 pb-1">
                <span className="col-span-6">Product</span>
                <span className="col-span-3 text-center">Quantity</span>
                <span className="col-span-2 text-right">Subtotal</span>
                <span className="col-span-1" />
              </div>

              {/* Items */}
              {cart.map((item, idx) => {
                const unitValue = parseInt(item.unit) || 1;
                const unitType = item.unit?.replace(/[0-9]/g, "").trim() || "";

                return (
                  <div
                    key={item.id}
                    className="item-enter bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 overflow-hidden"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-400" />

                    <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">

                      {/* Product info */}
                      <div className="sm:col-span-6 flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-green-100"
                          />
                          <span className="sm:hidden absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 text-sm leading-snug truncate mb-0.5">{item.name}</p>
                          <p className="text-green-600 font-extrabold text-base">₹{item.price}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{item.unit} per unit</p>
                          <p className="text-xs text-green-600 font-semibold mt-0.5">
                            Total: {getTotalUnit(item.unit, item.quantity)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity stepper */}
                      <div className="sm:col-span-3 flex items-center justify-start sm:justify-center">
                        <div className="flex items-center border border-green-200 rounded-xl overflow-hidden bg-green-50">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center text-green-700 hover:bg-green-100 active:bg-green-200 transition-colors"
                          >
                            <FaMinus className="text-xs" />
                          </button>
                          <span className="w-10 text-center text-sm font-extrabold text-gray-900 border-x border-green-200 select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center text-green-700 hover:bg-green-100 active:bg-green-200 transition-colors"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="sm:col-span-2 text-left sm:text-right">
                        <p className="text-base font-extrabold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {item.quantity} × ₹{item.price}
                          </p>
                        )}
                        <p className="text-xs text-green-600 font-medium mt-0.5">
                          {getTotalUnit(item.unit, item.quantity)}
                        </p>
                      </div>

                      {/* Remove — desktop */}
                      <div className="sm:col-span-1 hidden sm:flex sm:justify-end">
                        <button
                          onClick={() => setConfirmItem({ id: item.id, name: item.name, image: item.image, quantity: item.quantity })}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Remove item"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>

                    </div>

                    {/* Remove — mobile */}
                    <div className="sm:hidden flex items-center justify-between px-5 pb-4">
                      <button
                        onClick={() => setConfirmItem({ id: item.id, name: item.name, image: item.image, quantity: item.quantity })}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 font-semibold transition-colors"
                      >
                        <FaTrash className="text-xs" />
                        Remove item
                      </button>
                      <span className="text-xs text-gray-400 font-medium">
                        {unitValue * item.quantity}{unitType} total
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Continue shopping — mobile */}
              <button
                onClick={() => navigate("/products")}
                className="sm:hidden w-full text-center text-sm text-green-600 font-semibold py-3 hover:text-green-800 transition-colors"
              >
                ← Continue Shopping
              </button>

              {/* ── PROMO CODE ── */}
              <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <FaTag className="text-green-500 text-xs" />
                </div>
              <input
  type="text"
  value={promoCode}
  onChange={(e) => {
    setPromoCode(e.target.value);
    setPromoApplied(false);
    setDiscount(0);
  }}
  placeholder="Enter promo or coupon code"
  className="flex-1 text-sm font-medium text-gray-800 placeholder-gray-300 bg-transparent outline-none"
/>
                {promoApplied ? (
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 whitespace-nowrap">
                    Applied ✓
                  </span>
                ) : (
                  <button
                    onClick={handlePromo}
                    className="text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-lg border border-green-200 transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                )}
              </div>
              {/* Available promo codes */}
<div className="bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-700">
  <p className="font-bold mb-1">Available Offers</p>
  <p>VERDURA10 — 10% OFF</p>
  <p>SAVE50 — ₹50 OFF</p>
</div>

            </div>

            {/* ── RIGHT: SIDEBAR ── */}
            <div className="lg:col-span-2 sticky top-24 space-y-3">

              {/* ORDER SUMMARY */}
              <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">

                <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-5 relative overflow-hidden">
                  <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full bg-white/10" />
                  <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-full bg-white/5" />
                  <h3 className="text-white font-extrabold text-base relative">Order Summary</h3>
                  <p className="text-green-200 text-xs mt-0.5 relative">
                    {cart.length} product{cart.length !== 1 ? "s" : ""} in your cart
                  </p>
                </div>

                <div className="p-5">

                {/* Item breakdown */}
<div className="space-y-3 mb-4">
  {cart.map((item) => {
    const unitValue = parseInt(item.unit) || 1;
    const unitType = item.unit?.replace(/[0-9]/g, "").trim() || "";
    const totalWeight = unitValue * item.quantity;
    const itemTotal = item.price * item.quantity;

    return (
      <div
        key={item.id}
        className="flex justify-between items-start gap-3 pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
      >
        <div className="flex flex-col leading-tight min-w-0 flex-1">
          
          {/* Product name */}
          <span className="text-sm font-semibold text-gray-800 truncate">
            {item.name}
          </span>

          {/* quantity calculation */}
          <span className="text-xs text-gray-500 mt-0.5">
            {unitValue}{unitType} × {item.quantity} ={" "}
            <span className="font-semibold text-green-600">
              {totalWeight}{unitType}
            </span>
          </span>

          {/* price calculation */}
          <span className="text-xs text-gray-400">
            ₹{item.price} × {item.quantity} = ₹{itemTotal}
          </span>

        </div>

        {/* right total */}
        <span className="text-sm font-bold text-gray-900 flex-shrink-0">
          ₹{itemTotal}
        </span>
      </div>
    );
  })}
</div>
                  <div className="border-t border-dashed border-gray-200 my-3" />

                  {/* Fee rows */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Products ({cart.length})</span>
                      <span className="font-medium text-gray-700">{totalItems} items</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-700">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <FaTruck className="text-blue-400 text-xs" />
                        Delivery
                      </span>
                      <span className="font-bold text-green-600">FREE</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <FaGift className="text-pink-400 text-xs" />
                          Promo discount
                        </span>
                      <span className="font-bold text-green-600">
 −₹{Math.min(discount, subtotal).toFixed(0)}
</span>
                      </div>
                    )}
                  </div>

                  <div className="my-4 border-t border-dashed border-gray-100" />

                  {/* Grand total */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-extrabold text-gray-900 text-base">Total</span>
                    <div className="text-right">
                 <p className="text-2xl font-extrabold text-green-700">
  ₹{totalPrice.toFixed(0)}
</p>
                      <p className="text-xs text-green-500 font-semibold">Free delivery included</p>
                    </div>
                  </div>

                  {/* Savings pill */}
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2 mb-5">
                    <FaLeaf className="text-green-500 text-xs flex-shrink-0" />
                    <p className="text-xs text-green-700 font-semibold">You're saving on delivery charges!</p>
                  </div>

                  {/* Checkout button */}
                  <button
                    onClick={handleCheckout}
                    className="pulse-btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-extrabold text-sm py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-md shadow-green-200"
                  >
                    Proceed to Checkout
                    <FaChevronRight className="text-xs" />
                  </button>

        

                </div>
              </div>

              {/* TRUST BADGES */}
              <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Why shop with us</p>
                <div className="space-y-2.5">
                  {[
                    { icon: FaTruck,     bg: "bg-blue-50",   color: "text-blue-500",   text: "Free delivery on all orders"  },
                    { icon: FaLeaf,      bg: "bg-green-50",  color: "text-green-500",  text: "100% fresh & organic produce" },
                  
                  ].map(({ icon: Icon, bg, color, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
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