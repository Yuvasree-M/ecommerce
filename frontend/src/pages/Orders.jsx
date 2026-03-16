import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaTruck, FaCheckCircle, FaBox, FaMapMarkerAlt,
  FaPhone, FaReceipt, FaClock,
} from "react-icons/fa";

const STATUS = {
  ORDER_PLACED: {
    label: "Order Placed",
    msg: "Your order is being prepared",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
    dot:   "bg-orange-400",
    bar:   "bg-orange-400",
    step:  1,
  },
  APPROVED: {
    label: "Approved",
    msg: "Confirmed! Estimated delivery in 4–5 days",
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot:   "bg-blue-500",
    bar:   "bg-blue-500",
    step:  2,
  },
  SHIPPED: {
    label: "Shipped",
    msg: "On the way! Delivery in 2–3 days",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    dot:   "bg-purple-500",
    bar:   "bg-purple-500",
    step:  3,
  },
  DELIVERED: {
    label: "Delivered",
    msg: "Order delivered successfully 🎉",
    badge: "bg-green-100 text-green-700 border-green-200",
    dot:   "bg-green-500",
    bar:   "bg-green-500",
    step:  4,
  },
  REJECTED: {
    label: "Rejected",
    msg: "Your order was rejected. Contact support.",
    badge: "bg-red-100 text-red-600 border-red-200",
    dot:   "bg-red-400",
    bar:   "bg-red-400",
    step:  0,
  },
};

const STEPS = [
  { key: "ORDER_PLACED", icon: "📋", label: "Placed"   },
  { key: "APPROVED",     icon: "✅", label: "Approved" },
  { key: "SHIPPED",      icon: "🚚", label: "Shipped"  },
  { key: "DELIVERED",    icon: "🏠", label: "Delivered"},
];

const sc = (s) => STATUS[s] || { label: s, msg: "Processing", badge: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400", bar: "bg-gray-300", step: 0 };


const Orders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiFetch("/api/orders");
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 space-y-5">
      <div className="h-8 w-40 bg-green-100 animate-pulse rounded-xl" />
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 animate-pulse border border-green-100">
          <div className="flex justify-between">
            <div className="h-4 w-36 bg-green-100 rounded-lg" />
            <div className="h-6 w-20 bg-green-100 rounded-full" />
          </div>
          <div className="h-10 bg-green-50 rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            {[1,2,3].map(j => <div key={j} className="h-16 bg-green-50 rounded-xl" />)}
          </div>
        </div>
      ))}
    </div>
  );

  /* ── EMPTY ── */
  if (orders.length === 0) return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center gap-4 pt-20">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-100">
        <FaBox className="text-4xl text-green-300" />
      </div>
      <p className="text-xl font-bold text-green-800">No orders yet</p>
      <p className="text-sm text-green-500">Your order history will appear here</p>
      <button
        onClick={() => navigate("/products")}
        className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow shadow-green-200"
      >
        Start Shopping
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50 pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8 flex items-center justify-between">
          <div>
<h2 className="text-3xl font-bold  text-green-800">My Orders</h2>
            <p className="text-sm text-green-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
          </div>
        </div>

        <div className="space-y-5">
          {orders.map((order, idx) => {
            const cfg   = sc(order?.status);
            const step  = cfg.step;

            return (
              <div
                key={order?.id}
                className="bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
            
                <div className={`h-1 w-full ${cfg.bar}`} />

                <div className="p-5 md:p-6">

  
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaReceipt className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Order ID</p>
                        <p className="font-mono text-xs font-bold text-gray-700 mt-0.5 break-all">
                          {order?.id}
                        </p>
                      </div>
                    </div>
                    <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
                    {order?.status === "DELIVERED"
                      ? <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      : <FaTruck className="text-green-500 flex-shrink-0 animate-pulse" />
                    }
                    <p className="text-sm font-medium text-green-800">{cfg.msg}</p>
                  </div>

                  {order?.status !== "REJECTED" && (
                    <div className="mb-5">
                      <div className="flex items-center justify-between relative">
          
                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 z-0" />
                        <div
                          className={`absolute top-4 left-4 h-0.5 z-0 transition-all duration-700 ${cfg.bar}`}
                          style={{ width: step > 0 ? `${((step - 1) / 3) * 100}%` : "0%" }}
                        />

                        {STEPS.map((s, i) => {
                          const done    = i + 1 <= step;
                          const current = i + 1 === step;
                          return (
                            <div key={s.key} className="flex flex-col items-center gap-1 z-10 flex-1">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                                done
                                  ? `${cfg.bar} border-transparent text-white`
                                  : "bg-white border-gray-200 text-gray-300"
                              } ${current ? "ring-4 ring-offset-1 ring-green-100" : ""}`}>
                                {s.icon}
                              </div>
                              <span className={`text-xs font-semibold hidden sm:block ${done ? "text-gray-700" : "text-gray-300"}`}>
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                    <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <FaMapMarkerAlt className="text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Delivery Address</p>
                        <p className="text-sm font-medium text-gray-700">{order?.address || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
                      <FaPhone className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
                        <p className="text-sm font-medium text-gray-700">{order?.phone || "—"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-50 pt-4">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                      Items ({order?.items?.length || 0})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order?.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-xl p-3 transition-all duration-200"
                        >
                          <img
                            src={item?.image}
                            alt={item?.name}
                            loading="lazy"
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{item?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              ₹{item?.price} <span className="text-gray-300">×</span> {item?.quantity}
                            </p>
                            <p className="text-xs font-bold text-green-600 mt-0.5">
                              ₹{item?.price * item?.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
                    <button
                      onClick={() => navigate(`/invoice/${order?.id}`, { state: { order } })}
                      className="flex items-center gap-2 text-xs font-bold text-green-600 hover:text-green-800 border border-green-200 hover:border-green-400 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-all"
                    >
                      <FaReceipt className="text-xs" />
                      View Invoice
                    </button>

                    <div className="text-right">
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Total Amount</p>
                      <p className="text-xl font-extrabold text-green-700">₹{order?.totalAmount}</p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Orders;