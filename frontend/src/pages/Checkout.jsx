import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

import {
  FaMapMarkerAlt,
  FaPhone,
  FaShoppingCart,
  FaUser,
  FaEnvelope,
  FaTruck,
  FaLeaf,
  FaLock,
  FaChevronRight,
} from "react-icons/fa";

const Checkout = () => {
  const { token } = useContext(AuthContext);
  const { cart, clearCart, discount, promoCode } = useContext(CartContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  const totalAmount = Math.max(0, subtotal - discount);

  {
    discount > 0 && (
      <div className="flex justify-between text-sm">
        <span>Promo Discount</span>
        <span className="text-green-600 font-bold">−₹{discount}</span>
      </div>
    );
  }
  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/api/users/profile");
        setName(data.name || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handlePayment = async () => {
    if (!address.trim()) return alert("Enter delivery address");
    if (!/^[0-9]{10}$/.test(phone)) return alert("Enter valid phone number");
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    const orderData = {
      cartItems: cart.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
      })),
      name,
      email,
      address,
      phone,
    };

    try {
      const payment = await apiFetch("/api/payment/razorpay/order", {
        method: "POST",
        body: JSON.stringify({ amount: totalAmount }),
      });

      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.id,
        name: "Verdura",
        description: "Order Payment",

        handler: async (response) => {
          try {
            const savedOrder = await apiFetch("/api/payment/order/save", {
              method: "POST",
              body: JSON.stringify({
                ...orderData,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
              }),
            });

            await clearCart();

            const invoiceOrder = {
              name,
              email,
              phone,
              address,
              totalAmount,
                discount,        // ✅ ADD THIS
  promoCode, 
              status: "ORDER_PLACED",
              items: cart.map((i) => ({
                productId: i.id,
                name: i.name,
                image: i.image,
                price: i.price,
                quantity: i.quantity,
              })),
            };

            navigate(`/invoice/${savedOrder.orderId}`, {
              state: { order: invoiceOrder },
            });
          } catch (err) {
            console.error("Order save failed", err);
            alert("Order placement failed");
          }
        },

        prefill: {
          name,
          email,
          contact: phone,
        },

        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
      });
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-md shadow-green-200">
            <FaShoppingCart className="text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Checkout</h1>
            <p className="text-xs text-green-600 font-semibold">
              {cart.length} products · {totalItems} items
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-start">
          {/* LEFT */}
          <div className="lg:col-span-3 space-y-4">
            {/* DELIVERY */}
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-4 text-white font-bold">
                Delivery Details
              </div>

              <div className="p-5 space-y-4">
                {/* name */}
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                  <input
                    value={name}
                    readOnly
                    className="w-full border border-green-100 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50"
                  />
                </div>

                {/* email */}
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                  <input
                    value={email}
                    readOnly
                    className="w-full border border-green-100 rounded-xl pl-10 pr-4 py-3 text-sm bg-gray-50"
                  />
                </div>

                {/* address */}
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-4 text-gray-400 text-sm" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Delivery address"
                    className="w-full border border-green-100 rounded-xl pl-10 pr-4 py-3 text-sm"
                  />
                </div>

                {/* phone */}
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3.5 text-gray-400 text-sm" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    maxLength={10}
                    className="w-full border border-green-100 rounded-xl pl-10 pr-4 py-3 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-4 text-white font-bold">
                Order Items
              </div>

              <div className="p-5 space-y-3">
                {cart.map((item) => {
                  const unitValue = parseInt(item.unit) || 1;
                  const unitType = item.unit?.replace(/[0-9]/g, "").trim();
                  const totalWeight = unitValue * item.quantity;
                  const totalPrice = item.price * item.quantity;

                  return (
                    <div
                      key={item.id}
                      className="flex justify-between gap-3 pb-3 border-b border-dashed last:border-0"
                    >
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          className="w-14 h-14 rounded-xl object-cover border border-green-100"
                        />

                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>

                          <p className="text-xs text-gray-500">
                            {unitValue}
                            {unitType} × {item.quantity}= {totalWeight}
                            {unitType}
                          </p>

                          <p className="text-xs text-gray-400">
                            ₹{item.price} × {item.quantity}= ₹{totalPrice}
                          </p>
                        </div>
                      </div>

                      <div className="font-bold text-sm">₹{totalPrice}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-2 sticky top-24 space-y-4">
            {/* SUMMARY */}
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-5 text-white font-bold">
                Order Summary
              </div>

              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Products</span>
                    <span>{cart.length}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Total Items</span>
                    <span>{totalItems}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Promo Discount</span>
                      <span className="text-green-600 font-bold">
                        −₹{discount}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <FaTruck className="text-blue-400 text-xs" />
                      Delivery
                    </span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                </div>

                <div className="border-t my-4" />

                <div className="flex justify-between items-center mb-4">
                  <span className="font-extrabold">Total</span>

                  <span className="text-2xl font-extrabold text-green-700">
                    ₹{totalAmount}
                  </span>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white font-bold py-4 rounded-xl shadow-md"
                >
                  {loading ? "Processing..." : `Pay ₹${totalAmount}`}
                  <FaChevronRight />
                </button>
              </div>
            </div>

            {/* TRUST BADGES */}
            <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-4">
              <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                Why shop with us
              </p>

              <div className="space-y-2.5">
                {[
                  {
                    icon: FaTruck,
                    bg: "bg-blue-50",
                    color: "text-blue-500",
                    text: "Free delivery on all orders",
                  },
                  {
                    icon: FaLeaf,
                    bg: "bg-green-50",
                    color: "text-green-500",
                    text: "100% fresh & organic produce",
                  },
                ].map(({ icon: Icon, bg, color, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}
                    >
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
  );
};

export default Checkout;
