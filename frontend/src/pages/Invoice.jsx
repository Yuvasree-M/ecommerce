import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import {
  FaFileInvoice,
  FaDownload,
  FaArrowLeft,
  FaShoppingBag,
  FaLeaf,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";

const Invoice = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [order,       setOrder]       = useState(location.state?.order || null);
  const [loading,     setLoading]     = useState(!location.state?.order);
  const [downloading, setDownloading] = useState(false);

  /* ── FETCH ORDER ── */
  useEffect(() => {
    if (order) return;
    const fetchOrder = async () => {
      try {
        const data = await apiFetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (err) {
        console.error("Order fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchOrder();
  }, [id, token, order]);

  /* ── DOWNLOAD PDF ── */
  const downloadInvoice = async () => {
    try {
      setDownloading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoice/${id}/download`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Invoice download failed");
    } finally {
      setDownloading(false);
    }
  };

  /* ── LOADING ── */
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
      <div className="w-10 h-10 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
      <p className="text-green-600 font-semibold text-base">Preparing your invoice…</p>
    </div>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center mt-32 gap-3">
      <FaLeaf className="text-green-500 text-5xl" />
      <p className="text-red-500 font-semibold text-lg">Invoice not found</p>
      <button
        onClick={() => navigate("/products")}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-lg transition"
      >
        Back to Products
      </button>
    </div>
  );

  const subtotal = order?.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-slate-50 px-4 pt-24 pb-16">

      {/* ── BACK ── */}
      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-green-700 hover:text-green-900 font-semibold text-sm mb-5 max-w-3xl mx-auto bg-transparent border-none cursor-pointer transition-colors"
      >
        <FaArrowLeft className="text-xs" />
        Back to Products
      </button>

      {/* ── CARD ── */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* ── GREEN BAND ── */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-white text-xl font-bold leading-tight">Verdura</p>
            <p className="text-green-200 text-xs mt-0.5">Organic Grocery Store</p>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Cancel */}
            <button
              onClick={() => navigate("/orders")}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/30 bg-white/10 hover:bg-white/20 transition-all"
            >
              <FaTimes className="text-xs" />
              Cancel
            </button>
            {/* Download */}
            <button
              onClick={downloadInvoice}
              disabled={downloading}
              className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/35 bg-white/15 hover:bg-white/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
            >
              <FaDownload className="text-xs" />
              {downloading ? "Downloading…" : "Download PDF"}
            </button>
          </div>
        </div>

        {/* ── TITLE ROW ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-0">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800">
              <FaFileInvoice className="text-green-600" />
              Invoice
            </h1>
            <p className="font-mono text-xs text-gray-400 mt-1">#{id}</p>
          </div>
          <span className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mt-1">
            <FaCheckCircle className="text-xs" />
            {order.status?.replace(/_/g, " ") || "ORDER PLACED"}
          </span>
        </div>

        {/* ── DIVIDER ── */}
        <div className="mx-6 my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* ── INFO GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 px-6 pb-6">
          <div className="pb-4 sm:pb-0 sm:pr-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Customer</p>
            <p className="text-sm font-semibold text-gray-800">{order.name  || "—"}</p>
            <p className="text-sm text-gray-500 break-all">{order.email || "—"}</p>
          </div>
          <div className="py-4 sm:py-0 sm:px-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery</p>
            <p className="text-sm font-semibold text-gray-800">{order.phone   || "—"}</p>
            <p className="text-sm text-gray-500">{order.address || "—"}</p>
          </div>
          <div className="pt-4 sm:pt-0 sm:pl-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</p>
            <p className="text-sm font-semibold text-gray-800">
              {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            <p className="text-sm text-gray-500">Payment: Online</p>
          </div>
        </div>

        {/* ── ITEMS TABLE ── */}
        <div className="mx-6 border border-gray-200 rounded-xl overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order?.items?.length > 0 ? order.items.map((item, i) => (
                <tr key={i} className="hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-11 h-11 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                      <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500">₹{item.price}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-800">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400 text-sm">No items found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── TOTALS ── */}
        <div className="flex justify-end px-6 mb-6">
          <div className="w-56 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold text-gray-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery</span>
              <span className="font-semibold text-green-600">Free</span>
            </div>
            <div className="h-px bg-gray-200" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-gray-800">Grand Total</span>
              <span className="text-lg font-extrabold text-green-600">₹{order.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex justify-end px-6 pb-6">
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 shadow shadow-green-200"
          >
            <FaShoppingBag className="text-xs" />
            Continue Shopping
          </button>
        </div>

        {/* ── BOTTOM NOTE ── */}
        <p className="text-center text-xs text-gray-400 pb-5 px-6">
          A copy of this invoice has been sent to <strong className="text-gray-600">{order.email}</strong>
        </p>

      </div>
    </div>
  );
};

export default Invoice;