// import { useEffect, useState } from "react";
// import { apiFetch } from "../services/api";
// import { useNavigate } from "react-router-dom";
// import {
//   FaTruck, FaCheckCircle, FaBox, FaMapMarkerAlt,
//   FaPhone, FaReceipt, FaClock,
// } from "react-icons/fa";

// const STATUS = {
//   ORDER_PLACED: {
//     label: "Order Placed",
//     msg: "Your order is being prepared",
//     badge: "bg-orange-100 text-orange-700 border-orange-200",
//     dot:   "bg-orange-400",
//     bar:   "bg-orange-400",
//     step:  1,
//   },
//   APPROVED: {
//     label: "Approved",
//     msg: "Confirmed! Estimated delivery in 4–5 days",
//     badge: "bg-blue-100 text-blue-700 border-blue-200",
//     dot:   "bg-blue-500",
//     bar:   "bg-blue-500",
//     step:  2,
//   },
//   SHIPPED: {
//     label: "Shipped",
//     msg: "On the way! Delivery in 2–3 days",
//     badge: "bg-purple-100 text-purple-700 border-purple-200",
//     dot:   "bg-purple-500",
//     bar:   "bg-purple-500",
//     step:  3,
//   },
//   DELIVERED: {
//     label: "Delivered",
//     msg: "Order delivered successfully 🎉",
//     badge: "bg-green-100 text-green-700 border-green-200",
//     dot:   "bg-green-500",
//     bar:   "bg-green-500",
//     step:  4,
//   },
//   REJECTED: {
//     label: "Rejected",
//     msg: "Your order was rejected. Contact support.",
//     badge: "bg-red-100 text-red-600 border-red-200",
//     dot:   "bg-red-400",
//     bar:   "bg-red-400",
//     step:  0,
//   },
// };

// const STEPS = [
//   { key: "ORDER_PLACED", icon: "📋", label: "Placed"   },
//   { key: "APPROVED",     icon: "✅", label: "Approved" },
//   { key: "SHIPPED",      icon: "🚚", label: "Shipped"  },
//   { key: "DELIVERED",    icon: "🏠", label: "Delivered"},
// ];

// const sc = (s) => STATUS[s] || { label: s, msg: "Processing", badge: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400", bar: "bg-gray-300", step: 0 };


// const Orders = () => {
//   const [orders,  setOrders]  = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const data = await apiFetch("/api/orders");
//         setOrders(data || []);
//       } catch (err) {
//         console.error("Failed to fetch orders:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   if (loading) return (
//     <div className="max-w-4xl mx-auto px-4 pt-28 pb-16 space-y-5">
//       <div className="h-8 w-40 bg-green-100 animate-pulse rounded-xl" />
//       {[1, 2, 3].map(i => (
//         <div key={i} className="bg-white rounded-2xl p-6 shadow-sm space-y-4 animate-pulse border border-green-100">
//           <div className="flex justify-between">
//             <div className="h-4 w-36 bg-green-100 rounded-lg" />
//             <div className="h-6 w-20 bg-green-100 rounded-full" />
//           </div>
//           <div className="h-10 bg-green-50 rounded-xl" />
//           <div className="grid grid-cols-3 gap-3">
//             {[1,2,3].map(j => <div key={j} className="h-16 bg-green-50 rounded-xl" />)}
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   if (orders.length === 0) return (
//     <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center gap-4 pt-20">
//       <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-100">
//         <FaBox className="text-4xl text-green-300" />
//       </div>
//       <p className="text-xl font-bold text-green-800">No orders yet</p>
//       <p className="text-sm text-green-500">Your order history will appear here</p>
//       <button
//         onClick={() => navigate("/products")}
//         className="mt-2 bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow shadow-green-200"
//       >
//         Start Shopping
//       </button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-green-50 pt-24 pb-16 px-4">
//       <div className="max-w-4xl mx-auto">

//         <div className="mb-8 flex items-center justify-between">
//           <div>
// <h2 className="text-3xl font-bold  text-green-800">My Orders</h2>
//             <p className="text-sm text-green-500 mt-1">{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
//           </div>
//         </div>

//         <div className="space-y-5">
//           {orders.map((order, idx) => {
//             const cfg   = sc(order?.status);
//             const step  = cfg.step;

//             return (
//               <div
//                 key={order?.id}
//                 className="bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
//                 style={{ animationDelay: `${idx * 80}ms` }}
//               >
            
//                 <div className={`h-1 w-full ${cfg.bar}`} />

//                 <div className="p-5 md:p-6">

  
//                   <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
//                     <div className="flex items-start gap-3">
//                       <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
//                         <FaReceipt className="text-green-600 text-sm" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Order ID</p>
//                         <p className="font-mono text-xs font-bold text-gray-700 mt-0.5 break-all">
//                           {order?.id}
//                         </p>
//                       </div>
//                     </div>
//                     <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.badge}`}>
//                       <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
//                       {cfg.label}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
//                     {order?.status === "DELIVERED"
//                       ? <FaCheckCircle className="text-green-500 flex-shrink-0" />
//                       : <FaTruck className="text-green-500 flex-shrink-0 animate-pulse" />
//                     }
//                     <p className="text-sm font-medium text-green-800">{cfg.msg}</p>
//                   </div>

//                   {order?.status !== "REJECTED" && (
//                     <div className="mb-5">
//                       <div className="flex items-center justify-between relative">
          
//                         <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 z-0" />
//                         <div
//                           className={`absolute top-4 left-4 h-0.5 z-0 transition-all duration-700 ${cfg.bar}`}
//                           style={{ width: step > 0 ? `${((step - 1) / 3) * 100}%` : "0%" }}
//                         />

//                         {STEPS.map((s, i) => {
//                           const done    = i + 1 <= step;
//                           const current = i + 1 === step;
//                           return (
//                             <div key={s.key} className="flex flex-col items-center gap-1 z-10 flex-1">
//                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
//                                 done
//                                   ? `${cfg.bar} border-transparent text-white`
//                                   : "bg-white border-gray-200 text-gray-300"
//                               } ${current ? "ring-4 ring-offset-1 ring-green-100" : ""}`}>
//                                 {s.icon}
//                               </div>
//                               <span className={`text-xs font-semibold hidden sm:block ${done ? "text-gray-700" : "text-gray-300"}`}>
//                                 {s.label}
//                               </span>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
//                     <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
//                       <FaMapMarkerAlt className="text-orange-400 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Delivery Address</p>
//                         <p className="text-sm font-medium text-gray-700">{order?.address || "—"}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start gap-2.5 bg-gray-50 border border-gray-100 rounded-xl p-3">
//                       <FaPhone className="text-blue-400 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
//                         <p className="text-sm font-medium text-gray-700">{order?.phone || "—"}</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="border-t border-gray-50 pt-4">
//                     <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
//                       Items ({order?.items?.length || 0})
//                     </p>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                       {order?.items?.map((item, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-xl p-3 transition-all duration-200"
//                         >
//                           <img
//                             src={item?.image}
//                             alt={item?.name}
//                             loading="lazy"
//                             className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
//                           />
//                           <div className="min-w-0">
//                             <p className="text-sm font-bold text-gray-800 truncate">{item?.name}</p>
//                             <p className="text-xs text-gray-400 mt-0.5">
//                               ₹{item?.price} <span className="text-gray-300">×</span> {item?.quantity}
//                             </p>
//                             <p className="text-xs font-bold text-green-600 mt-0.5">
//                               ₹{item?.price * item?.quantity}
//                             </p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
//                     <button
//                       onClick={() => navigate(`/invoice/${order?.id}`, { state: { order } })}
//                       className="flex items-center gap-2 text-xs font-bold text-green-600 hover:text-green-800 border border-green-200 hover:border-green-400 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-all"
//                     >
//                       <FaReceipt className="text-xs" />
//                       View Invoice
//                     </button>

//                     <div className="text-right">
//                       <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Total Amount</p>
//                       <p className="text-xl font-extrabold text-green-700">₹{order?.totalAmount}</p>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             );
//           })}
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Orders;

import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  FaTruck, FaCheckCircle, FaBox, FaMapMarkerAlt,
  FaPhone, FaReceipt, FaTimes, FaUndo,
} from "react-icons/fa";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  ORDER_PLACED:      { label: "Order Placed",      msg: "Your order is being prepared",                          badge: "bg-orange-100 text-orange-700 border-orange-200",  dot: "bg-orange-400", bar: "bg-orange-400", step: 1 },
  APPROVED:          { label: "Approved",           msg: "Confirmed! Estimated delivery in 4–5 days",             badge: "bg-blue-100 text-blue-700 border-blue-200",         dot: "bg-blue-500",   bar: "bg-blue-500",   step: 2 },
  SHIPPED:           { label: "Shipped",            msg: "On the way! Delivery in 2–3 days",                      badge: "bg-purple-100 text-purple-700 border-purple-200",   dot: "bg-purple-500", bar: "bg-purple-500", step: 3 },
  DELIVERED:         { label: "Delivered",          msg: "Order delivered successfully 🎉",                       badge: "bg-green-100 text-green-700 border-green-200",      dot: "bg-green-500",  bar: "bg-green-500",  step: 4 },
  REJECTED:          { label: "Rejected",           msg: "Your order was rejected. Contact support.",             badge: "bg-red-100 text-red-600 border-red-200",            dot: "bg-red-400",    bar: "bg-red-400",    step: 0 },
  CANCELLED:         { label: "Cancelled",          msg: "Order has been cancelled.",                             badge: "bg-gray-100 text-gray-600 border-gray-200",         dot: "bg-gray-400",   bar: "bg-gray-300",   step: 0 },
  RETURN_REQUESTED:  { label: "Return Requested",   msg: "Your return request is under review.",                  badge: "bg-yellow-100 text-yellow-700 border-yellow-200",   dot: "bg-yellow-400", bar: "bg-yellow-400", step: 0 },
  REFUND_INITIATED:  { label: "Refund Initiated",   msg: "Refund is being processed via Razorpay (5–7 days).",   badge: "bg-teal-100 text-teal-700 border-teal-200",         dot: "bg-teal-500",   bar: "bg-teal-500",   step: 0 },
  REFUND_SUCCESSFUL: { label: "Refund Successful",  msg: "Refund has been credited to your original account ✅", badge: "bg-green-100 text-green-800 border-green-300",      dot: "bg-green-600",  bar: "bg-green-600",  step: 0 },
};

const STEPS = [
  { key: "ORDER_PLACED", icon: "📋", label: "Placed"    },
  { key: "APPROVED",     icon: "✅", label: "Approved"  },
  { key: "SHIPPED",      icon: "🚚", label: "Shipped"   },
  { key: "DELIVERED",    icon: "🏠", label: "Delivered" },
];

const sc = (s) => STATUS[s] || { label: s, msg: "Processing", badge: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400", bar: "bg-gray-300", step: 0 };

const CANCEL_REASONS = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Delivery taking too long",
  "Other",
];

const RETURN_REASONS = [
  "Item damaged or defective",
  "Wrong item received",
  "Item not as described",
  "Size / fit issue",
  "Changed my mind",
  "Other",
];

// ─── Action modal (cancel or return) ─────────────────────────────────────────
const ActionModal = ({ mode, orderId, onClose, onSuccess }) => {
  const isReturn = mode === "return";

  const [reason,       setReason]       = useState("");
  const [customReason, setCustomReason] = useState("");
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState("");

  const reasons     = isReturn ? RETURN_REASONS : CANCEL_REASONS;
  const finalReason = reason === "Other" ? customReason.trim() : reason;

  const handleSubmit = async () => {
    if (!finalReason) return setError("Please select or enter a reason.");
    setSubmitting(true);
    setError("");
    try {
      const endpoint = isReturn
        ? `/api/orders/${orderId}/return`
        : `/api/orders/${orderId}/cancel`;

      await apiFetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ reason: finalReason }),
      });

      onSuccess(isReturn ? "RETURN_REQUESTED" : "CANCELLED");
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const accent = isReturn
    ? { border: "border-yellow-100", bg: "bg-yellow-50", btn: "bg-yellow-500 hover:bg-yellow-600", dot: "border-yellow-500 bg-yellow-500" }
    : { border: "border-red-100",    bg: "bg-red-50",    btn: "bg-red-500 hover:bg-red-600",       dot: "border-red-500 bg-red-500"       };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
        style={{ animation: "modalIn 0.2s ease both" }}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>

        {/* Header */}
        <div className={`px-5 py-4 flex items-center justify-between ${accent.bg} border-b ${accent.border}`}>
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base ${accent.bg}`}>
              {isReturn ? "↩️" : "🚫"}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-gray-800">
                {isReturn ? "Request a Return" : "Cancel Order"}
              </h3>
              <p className="text-xs text-gray-400">
                {isReturn
                  ? "Refund goes back to your original payment method"
                  : "Tell us why you're cancelling"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/80 hover:bg-white text-gray-400 hover:text-gray-600 border border-gray-200 transition-colors text-xs"
          >✕</button>
        </div>

        <div className="p-5 space-y-4">

          {/* Razorpay refund info banner (return only) */}
          {isReturn && (
            <div className="flex items-start gap-2.5 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
              <span className="text-base flex-shrink-0">💳</span>
              <p className="text-xs text-teal-700 font-medium leading-relaxed">
                Once approved by our team, the refund of <strong>₹{""}</strong> will be automatically credited
                back to your original payment method via Razorpay within <strong>5–7 business days</strong>.
                No bank details needed.
              </p>
            </div>
          )}

          {/* Reason selection */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              {isReturn ? "Why are you returning this order?" : "Why are you cancelling?"}
            </p>
            <div className="space-y-2">
              {reasons.map(r => (
                <label
                  key={r}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    reason === r
                      ? isReturn ? "border-yellow-400 bg-yellow-50" : "border-red-400 bg-red-50"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio" name="reason" value={r}
                    checked={reason === r}
                    onChange={() => { setReason(r); setError(""); }}
                    className="hidden"
                  />
                  <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    reason === r ? accent.dot : "border-gray-300"
                  }`}>
                    {reason === r && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{r}</span>
                </label>
              ))}
            </div>

            {reason === "Other" && (
              <textarea
                value={customReason}
                onChange={e => setCustomReason(e.target.value)}
                placeholder="Please describe your reason…"
                rows={3}
                className="mt-3 w-full border-2 border-gray-200 focus:border-green-400 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none resize-none transition-colors"
              />
            )}
          </div>

          {error && (
            <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-100 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex-1 text-white text-sm font-bold py-2.5 rounded-xl transition-all disabled:opacity-60 ${accent.btn}`}
            >
              {submitting
                ? "Processing…"
                : isReturn ? "Submit Return Request" : "Cancel Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Orders page ─────────────────────────────────────────────────────────
const Orders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal,   setModal]   = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/api/orders");
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleActionSuccess = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const TERMINAL = ["REJECTED", "CANCELLED", "RETURN_REQUESTED", "REFUND_INITIATED", "REFUND_SUCCESSFUL"];

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
            {[1, 2, 3].map(j => <div key={j} className="h-16 bg-green-50 rounded-xl" />)}
          </div>
        </div>
      ))}
    </div>
  );

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

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-green-800">My Orders</h2>
          <p className="text-sm text-green-500 mt-1">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>

        <div className="space-y-5">
          {orders.map((order, idx) => {
            const cfg  = sc(order?.status);
            const step = cfg.step;

            const canCancel = ["ORDER_PLACED", "APPROVED"].includes(order?.status);
           const deliveredAt = order?.deliveredAt
  ? new Date(order.deliveredAt)
  : null;

const within7Days =
  deliveredAt &&
  (new Date() - deliveredAt) / (1000 * 60 * 60 * 24) <= 7;

const canReturn =
  order?.status === "DELIVERED" && within7Days;
            return (
              <div
                key={order?.id}
                className="bg-white border border-green-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className={`h-1 w-full ${cfg.bar}`} />

                <div className="p-5 md:p-6">

                  {/* Order ID + badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaReceipt className="text-green-600 text-sm" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest">Order ID</p>
                        <p className="font-mono text-xs font-bold text-gray-700 mt-0.5 break-all">{order?.id}</p>
                      </div>
                    </div>
                    <span className={`self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${cfg.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Status message */}
                  <div className="flex items-center gap-2.5 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-4">
                    {["DELIVERED", "REFUND_SUCCESSFUL"].includes(order?.status)
                      ? <FaCheckCircle className="text-green-500 flex-shrink-0" />
                      : <FaTruck className="text-green-500 flex-shrink-0 animate-pulse" />
                    }
                    <p className="text-sm font-medium text-green-800">{cfg.msg}</p>
                  </div>

                  {/* Cancel / Return reason */}
                  {(order?.cancelReason || order?.returnReason) && (
                    <div className="mb-4 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                        {order?.cancelReason ? "Cancellation Reason" : "Return Reason"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order?.cancelReason || order?.returnReason}
                      </p>
                    </div>
                  )}

                  {/* Refund initiated banner
                  {order?.status === "REFUND_INITIATED" && (
                    <div className="mb-4 flex items-center gap-2.5 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
                      <span className="text-base">⏳</span>
                      <div>
                        <p className="text-sm font-bold text-teal-700">Refund in progress</p>
                        <p className="text-xs text-teal-600">
                          Razorpay is processing your refund. It will be credited to your original payment method within 5–7 business days.
                        </p>
                      </div>
                    </div>
                  )}

                  {order?.status === "REFUND_SUCCESSFUL" && (
                    <div className="mb-4 flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <span className="text-base">✅</span>
                      <div>
                        <p className="text-sm font-bold text-green-700">Refund Successful!</p>
                        <p className="text-xs text-green-600">
                          ₹{order?.totalAmount} has been credited back to your original payment method.
                        </p>
                      </div>
                    </div>
                  )} */}

                  {/* Progress stepper */}
                  {!TERMINAL.includes(order?.status) && (
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
                                done ? `${cfg.bar} border-transparent text-white` : "bg-white border-gray-200 text-gray-300"
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

                  {/* Address + Phone */}
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

                  {/* Items */}
                  <div className="border-t border-gray-50 pt-4">
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">
                      Items ({order?.items?.length || 0})
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {order?.items?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 border border-gray-100 hover:border-green-200 rounded-xl p-3 transition-all duration-200"
                        >
                          <img
                            src={item?.image} alt={item?.name} loading="lazy"
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-800 truncate">{item?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              ₹{item?.price} <span className="text-gray-300">×</span> {item?.quantity}
                            </p>
                            <p className="text-xs font-bold text-green-600 mt-0.5">₹{item?.price * item?.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 flex-wrap">

                      <button
                        onClick={() => navigate(`/invoice/${order?.id}`, { state: { order } })}
                        className="flex items-center gap-2 text-xs font-bold text-green-600 hover:text-green-800 border border-green-200 hover:border-green-400 bg-green-50 hover:bg-green-100 px-4 py-2 rounded-xl transition-all"
                      >
                        <FaReceipt className="text-xs" /> Invoice
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => setModal({ mode: "cancel", orderId: order.id })}
                          className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-400 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-xl transition-all"
                        >
                          <FaTimes className="text-xs" /> Cancel Order
                        </button>
                      )}

                      {canReturn && (
                        <button
                          onClick={() => setModal({ mode: "return", orderId: order.id })}
                          className="flex items-center gap-2 text-xs font-bold text-yellow-600 hover:text-yellow-800 border border-yellow-200 hover:border-yellow-400 bg-yellow-50 hover:bg-yellow-100 px-4 py-2 rounded-xl transition-all"
                        >
                          <FaUndo className="text-xs" /> Return / Refund
                        </button>
                      )}
                    </div>

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

      {modal && (
        <ActionModal
          mode={modal.mode}
          orderId={modal.orderId}
          onClose={() => setModal(null)}
          onSuccess={(newStatus) => handleActionSuccess(modal.orderId, newStatus)}
        />
      )}
    </div>
  );
};

export default Orders;