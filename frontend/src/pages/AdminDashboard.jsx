import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";

const STATUS_CONFIG = {
  ORDER_PLACED:      { label: "Placed",           bg: "bg-orange-100",  text: "text-orange-700",  dot: "bg-orange-400",  border: "border-orange-200"  },
  APPROVED:          { label: "Approved",          bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-500",    border: "border-blue-200"    },
  SHIPPED:           { label: "Shipped",           bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-500",  border: "border-purple-200"  },
  DELIVERED:         { label: "Delivered",         bg: "bg-green-100",   text: "text-green-700",   dot: "bg-green-500",   border: "border-green-200"   },
  REJECTED:          { label: "Rejected",          bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-400",     border: "border-red-200"     },
  CANCELLED:         { label: "Cancelled",         bg: "bg-gray-100",    text: "text-gray-600",    dot: "bg-gray-400",    border: "border-gray-200"    },
  RETURN_REQUESTED:  { label: "Return Requested",  bg: "bg-yellow-100",  text: "text-yellow-700",  dot: "bg-yellow-400",  border: "border-yellow-200"  },
  REFUND_INITIATED:  { label: "Refund Initiated",  bg: "bg-teal-100",    text: "text-teal-700",    dot: "bg-teal-500",    border: "border-teal-200"    },
  REFUND_SUCCESSFUL: { label: "Refund Successful", bg: "bg-green-100",   text: "text-green-800",   dot: "bg-green-600",   border: "border-green-300"   },
  SUCCESS:           { label: "Success",           bg: "bg-green-100",   text: "text-green-700",   dot: "bg-green-500",   border: "border-green-200"   },
  FAILED:            { label: "Failed",            bg: "bg-red-100",     text: "text-red-600",     dot: "bg-red-400",     border: "border-red-200"     },
  INITIATED:         { label: "Initiated",         bg: "bg-teal-100",    text: "text-teal-700",    dot: "bg-teal-500",    border: "border-teal-200"    },
};
const sc = (s) => STATUS_CONFIG[s] || { label: s, bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400", border: "border-gray-200" };

const NEXT_ACTION = {
  ORDER_PLACED: { next: "APPROVED",  label: "✓ Approve", cls: "bg-orange-500 hover:bg-orange-600 shadow-orange-200" },
  APPROVED:     { next: "SHIPPED",   label: "⬆ Ship",    cls: "bg-blue-500 hover:bg-blue-600 shadow-blue-200"       },
  SHIPPED:      { next: "DELIVERED", label: "✔ Deliver", cls: "bg-purple-600 hover:bg-purple-700 shadow-purple-200"  },
};

const PER_PAGE = 8;

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);

  const [activeTab,     setActiveTab]     = useState("orders");
  const [orders,        setOrders]        = useState([]);
  const [transactions,  setTransactions]  = useState([]);
  const [users,         setUsers]         = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [updatingId,    setUpdatingId]    = useState(null);
  const [modal,         setModal]         = useState(null);
  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("ALL");
  const [orderPage,     setOrderPage]     = useState(1);
  const [txPage,        setTxPage]        = useState(1);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, o, p, t] = await Promise.all([
        apiFetch("/api/users"),
        apiFetch("/api/orders/all"),
        apiFetch("/api/products"),
        apiFetch("/api/transactions"),
      ]);
      setUsers(u || []);
      setOrders(o || []);
      setProductsCount((p || []).length);
      setTransactions(t || []);
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (token) loadAll(); }, [token]);

  const adminCount = useMemo(() => users.filter(u => u.role === "ADMIN").length, [users]);
  const userCount  = useMemo(() => users.filter(u => u.role === "USER").length,  [users]);
  const revenue    = useMemo(() =>
    orders.filter(o => o.status === "DELIVERED")
          .reduce((s, o) => s + (o.totalAmount || 0), 0), [orders]);

  const ordersByStatus = useMemo(() => {
    const obj = {};
    orders.forEach(o => { obj[o.status] = (obj[o.status] || 0) + 1; });
    return obj;
  }, [orders]);

  const getUserName = useCallback((uid) => {
    const u = users.find(u => u.id === uid);
    return u ? u.name : (uid?.slice(0, 10) + "…");
  }, [users]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => o.status !== "DELIVERED")
      .filter(o => statusFilter === "ALL" || o.status === statusFilter)
      .filter(o => !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        getUserName(o.userId).toLowerCase().includes(search.toLowerCase()));
  }, [orders, statusFilter, search, getUserName]);

  const orderTotalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
  const pagedOrders = useMemo(() => {
    const s = (orderPage - 1) * PER_PAGE;
    return filteredOrders.slice(s, s + PER_PAGE);
  }, [filteredOrders, orderPage]);

  const txTotalPages = Math.max(1, Math.ceil(transactions.length / PER_PAGE));
  const pagedTx = useMemo(() => {
    const s = (txPage - 1) * PER_PAGE;
    return transactions.slice(s, s + PER_PAGE);
  }, [transactions, txPage]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await apiFetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (modal?.data?.id === orderId)
        setModal(prev => ({ ...prev, data: { ...prev.data, status } }));
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleApproveRefund = async (orderId, refundNote) => {
    setUpdatingId(orderId);
    try {
      await apiFetch(`/api/orders/${orderId}/refund/approve`, {
  method: "PATCH",
  body: JSON.stringify({ refundNote }),
});

await loadAll();
      if (modal?.data?.id === orderId)
        setModal(prev => ({
          ...prev,
          data: { ...prev.data, status: "REFUND_INITIATED" },
        }));
    } catch (err) {
      console.error("Refund approval failed", err);
      throw err; 
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-green-50 pt-24 px-6">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="h-8 w-52 bg-green-100 animate-pulse rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-24 bg-green-100 animate-pulse rounded-xl" />)}
        </div>
        <div className="h-14 bg-green-100 animate-pulse rounded-xl" />
        <div className="h-96 bg-green-100 animate-pulse rounded-xl" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-50 pt-24 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <h2 className="text-3xl font-bold text-green-800">Admin Dashboard</h2>
          <button
            onClick={loadAll}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 shadow shadow-green-200"
          >↻ Refresh</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Admins",       value: adminCount,          accent: "border-t-4 border-t-green-800",  val: "text-green-800"  },
            { label: "Users",        value: userCount,           accent: "border-t-4 border-t-green-700",  val: "text-green-700"  },
            { label: "Products",     value: productsCount,       accent: "border-t-4 border-t-orange-500", val: "text-orange-600" },
            { label: "Orders",       value: orders.length,       accent: "border-t-4 border-t-blue-500",   val: "text-blue-600"   },
            { label: "Transactions", value: transactions.length, accent: "border-t-4 border-t-purple-500", val: "text-purple-600" },
            { label: "Revenue",      value: `₹${revenue}`,       accent: "border-t-4 border-t-green-500",  val: "text-green-600"  },
          ].map((s, i) => (
            <div key={i} className={`bg-white border border-green-100 ${s.accent} rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200`}>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`text-2xl font-extrabold ${s.val}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-green-200 rounded-xl px-5 py-3 flex flex-wrap items-center gap-3 shadow-sm">
          <span className="text-xs font-extrabold text-white bg-green-700 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Breakdown
          </span>
          {Object.entries(ordersByStatus).map(([status, count]) => {
            const cfg = sc(status);
            return (
              <span key={status} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}: <strong>{count}</strong>
              </span>
            );
          })}
        </div>

        <div className="flex gap-2">
          {[
            { id: "orders",       label: "📦 Orders"       },
            { id: "transactions", label: "💳 Transactions"  },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-bold border-2 transition-all ${
                activeTab === t.id
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-green-700 border-green-200 hover:bg-green-50"
              }`}
            >{t.label}</button>
          ))}
        </div>

        {activeTab === "orders" && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 items-center">
              <input
                placeholder="Search order ID or customer…"
                value={search}
                onChange={e => { setSearch(e.target.value); setOrderPage(1); }}
                className="border-2 border-green-200 rounded-lg px-3 py-2 text-sm text-green-900 outline-none focus:border-green-500 w-64 bg-white"
              />
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setOrderPage(1); }}
                className="border-2 border-green-200 rounded-lg px-3 py-2 text-sm text-green-900 bg-white cursor-pointer focus:border-green-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="ORDER_PLACED">Placed</option>
                <option value="APPROVED">Approved</option>
                <option value="SHIPPED">Shipped</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURN_REQUESTED">Return Requested</option>
                <option value="REFUND_INITIATED">Refund Initiated</option>
                <option value="REFUND_SUCCESSFUL">Refund Successful</option>
              </select>
              <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                {filteredOrders.length} orders
              </span>
            </div>

            <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-green-800 text-green-100">
                  <tr>
                    {["Order ID", "Customer", "Status", "Items", "Amount", "Action"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pagedOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-green-300 text-sm">No orders found</td>
                    </tr>
                  ) : pagedOrders.map(order => {
                    const cfg        = sc(order.status);
                    const act        = NEXT_ACTION[order.status];
                    const needsRefund = ["RETURN_REQUESTED", "CANCELLED"].includes(order.status);

                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setModal({ type: "order", data: order })}
                            className="font-mono text-xs font-bold text-green-600 hover:text-green-800 hover:underline"
                          >#{order.id.slice(0, 12)}…</button>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{getUserName(order.userId)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{order.items?.length || 0} items</td>
                        <td className="px-4 py-3 text-sm font-bold text-green-700">₹{order.totalAmount || 0}</td>
                        <td className="px-4 py-3">
                          {updatingId === order.id ? (
                            <span className="text-xs text-gray-400 italic">Updating…</span>
                          ) : act ? (
                            <button
                              onClick={() => updateStatus(order.id, act.next)}
                              className={`${act.cls} text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow transition-all hover:-translate-y-0.5`}
                            >{act.label}</button>
                          ) : needsRefund ? (
                            <button
                              onClick={() => setModal({ type: "order", data: order })}
                              className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow shadow-teal-200 transition-all hover:-translate-y-0.5"
                            >💳 Refund</button>
                          ) : (
                            <span className="text-gray-300 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Pagination page={orderPage} total={orderTotalPages} onChange={setOrderPage} count={filteredOrders.length} />
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-3">
            <div className="bg-white border border-green-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-green-800 text-green-100">
                  <tr>
                    {["Transaction ID", "Customer", "Order ID", "Type", "Amount", "Status"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-extrabold uppercase tracking-widest whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pagedTx.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-green-300 text-sm">No transactions found</td>
                    </tr>
                  ) : pagedTx.map(tx => {
                    const cfg = sc(tx.transactionStatus);
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setModal({ type: "transaction", data: tx })}
                            className="font-mono text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline"
                          >#{tx.id.slice(0, 12)}…</button>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{getUserName(tx.userId)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              const o = orders.find(o => o.id === tx.orderId);
                              if (o) setModal({ type: "order", data: o });
                            }}
                            className="font-mono text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                          >#{tx.orderId?.slice(0, 12)}…</button>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            tx.transactionType === "REFUND"
                              ? "bg-teal-50 text-teal-600 border border-teal-100"
                              : "bg-blue-50 text-blue-600 border border-blue-100"
                          }`}>{tx.transactionType}</span>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-700">
                          {tx.amount ? `₹${tx.amount}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={txPage} total={txTotalPages} onChange={setTxPage} count={transactions.length} />
          </div>
        )}

      </div>

      {modal && (
        <DetailModal
          modal={modal}
          onClose={() => setModal(null)}
          getUserName={getUserName}
          updateStatus={updateStatus}
          approveRefund={handleApproveRefund}
          updatingId={updatingId}
        />
      )}
    </div>
  );
};

const Pagination = ({ page, total, onChange, count }) => {
  if (total <= 1) return null;
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== "…") pages.push("…");
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
      <span className="text-xs font-semibold text-gray-400">Page {page} of {total} · {count} total</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(page - 1)} disabled={page === 1} className="border-2 border-green-200 bg-white text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-50 transition-colors">‹ Prev</button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e-${i}`} className="text-gray-300 px-1 text-sm select-none">…</span>
          ) : (
            <button key={p} onClick={() => onChange(p)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border-2 transition-colors min-w-[34px] ${p === page ? "bg-green-700 text-white border-green-700" : "bg-white text-green-700 border-green-200 hover:bg-green-50"}`}>{p}</button>
          )
        )}
        <button onClick={() => onChange(page + 1)} disabled={page === total} className="border-2 border-green-200 bg-white text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-green-50 transition-colors">Next ›</button>
      </div>
    </div>
  );
};

const DetailModal = ({ modal, onClose, getUserName, updateStatus, approveRefund, updatingId }) => {
  const { type, data } = modal;
  const isOrder = type === "order";
  const cfg = sc(data.status || data.transactionStatus);

  const [refundNote,     setRefundNote]     = useState("");
  const [showConfirm,    setShowConfirm]    = useState(false);
  const [refundLoading,  setRefundLoading]  = useState(false);
  const [refundError,    setRefundError]    = useState("");

  const needsRefund   = ["RETURN_REQUESTED", "CANCELLED"].includes(data.status);
  const refundDone    = ["REFUND_INITIATED", "REFUND_SUCCESSFUL"].includes(data.status);

  const handleApprove = async () => {
    setRefundLoading(true);
    setRefundError("");
    try {
      await approveRefund(data.id, refundNote);
      setShowConfirm(false);
    } catch (err) {
      setRefundError(err?.message || "Refund failed. Please try again.");
    } finally {
      setRefundLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[88vh] overflow-y-auto shadow-2xl border border-gray-100"
        style={{ animation: "modalIn 0.2s ease both" }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`@keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}`}</style>

       
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isOrder ? "bg-orange-50" : "bg-purple-50"}`}>
              {isOrder ? "📦" : "💳"}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-gray-800">
                {isOrder ? "Order Details" : "Transaction Details"}
              </h2>
              <p className="font-mono text-xs text-gray-400">#{data.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold text-sm transition-colors">✕</button>
        </div>

        <div className={`flex items-center gap-2 px-5 py-2.5 border-b border-gray-100 ${cfg.bg}`}>
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-bold ${cfg.text}`}>{cfg.label}</span>
        </div>

        <div className="p-5 space-y-4">

          {isOrder && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Customer", value: data.name  || getUserName(data.userId), color: "border-t-orange-400" },
                  { label: "Email",    value: data.email || "—",                      color: "border-t-blue-400"   },
                  { label: "Phone",    value: data.phone || "—",                      color: "border-t-purple-400" },
                  { label: "Amount",   value: `₹${data.totalAmount || 0}`,            color: "border-t-green-400"  },
                ].map((f, i) => (
                  <div key={i} className={`bg-gray-50 border border-gray-100 border-t-4 ${f.color} rounded-xl p-3`}>
                    <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">{f.label}</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{f.value}</p>
                  </div>
                ))}
              </div>

              {data.address && (
                <div className="bg-gray-50 border border-gray-100 border-t-4 border-t-teal-400 rounded-xl p-3">
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">Delivery Address</p>
                  <p className="text-sm font-semibold text-gray-800">{data.address}</p>
                </div>
              )}

              {(data.cancelReason || data.returnReason) && (
                <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                  <p className="text-xs font-extrabold text-red-400 uppercase tracking-widest mb-1">
                    {data.cancelReason ? "Cancellation Reason" : "Return Reason"}
                  </p>
                  <p className="text-sm font-semibold text-red-700">
                    {data.cancelReason || data.returnReason}
                  </p>
                </div>
              )}

              {data.razorpayRefundId && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                  <p className="text-xs font-extrabold text-teal-500 uppercase tracking-widest mb-1">Razorpay Refund ID</p>
                  <p className="text-sm font-mono font-semibold text-teal-800">{data.razorpayRefundId}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Order Items</p>
                <div className="space-y-2">
                  {(data.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl p-3 hover:bg-orange-50 transition-colors">
                      <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover border border-gray-200 flex-shrink-0" onError={e => e.target.style.display = "none"} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400">₹{item.price} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-extrabold text-green-600 whitespace-nowrap">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {NEXT_ACTION[data.status] && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => updateStatus(data.id, NEXT_ACTION[data.status].next)}
                    disabled={updatingId === data.id}
                    className={`${NEXT_ACTION[data.status].cls} text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow transition-all hover:-translate-y-0.5 disabled:opacity-50`}
                  >
                    {updatingId === data.id ? "Updating…" : NEXT_ACTION[data.status].label}
                  </button>
                </div>
              )}

              {needsRefund && !refundDone && (
                <div className="border-t border-gray-100 pt-4">
                  {!showConfirm ? (
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold py-3 rounded-xl transition-all hover:-translate-y-0.5 shadow shadow-teal-200 flex items-center justify-center gap-2"
                    >
                      💳 Approve &amp; Initiate Razorpay Refund
                    </button>
                  ) : (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-extrabold text-teal-600 uppercase tracking-widest">Confirm Refund</p>

                      <div className="bg-white border border-teal-100 rounded-xl px-4 py-3 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-400 font-semibold">Amount to Refund</p>
                          <p className="text-2xl font-extrabold text-teal-700">₹{data.totalAmount}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 font-semibold">Refund To</p>
                          <p className="text-sm font-bold text-gray-700">Original Payment Source</p>
                          <p className="text-xs text-gray-400">via Razorpay</p>
                        </div>
                      </div>

                   
                      <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                        <span className="text-sm flex-shrink-0">ℹ️</span>
                        <p className="text-xs text-blue-700 font-medium leading-relaxed">
                          Razorpay will automatically credit the amount back to the customer's original
                          payment method (card / UPI / netbanking) within <strong>5–7 business days</strong>.
                        </p>
                      </div>

                    
                      <div>
                        <label className="text-xs font-bold text-teal-600 uppercase tracking-widest block mb-1.5">
                          Internal Note (optional)
                        </label>
                        <textarea
                          value={refundNote}
                          onChange={e => setRefundNote(e.target.value)}
                          placeholder="e.g. Item returned in good condition, full refund approved."
                          rows={2}
                          className="w-full border-2 border-teal-200 focus:border-teal-500 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none resize-none bg-white transition-colors"
                        />
                      </div>

                      {refundError && (
                        <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
                          ❌ {refundError}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => { setShowConfirm(false); setRefundError(""); }}
                          className="flex-1 border-2 border-gray-200 text-gray-600 text-sm font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        >Cancel</button>
                        <button
                          onClick={handleApprove}
                          disabled={refundLoading}
                          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold py-2.5 rounded-xl transition-all disabled:opacity-60"
                        >
                          {refundLoading ? "Processing…" : "✓ Confirm Refund"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {data.status === "REFUND_INITIATED" && (
                <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
                  <span className="text-xl">⏳</span>
                  <div>
                    <p className="text-sm font-bold text-teal-700">Refund Initiated via Razorpay</p>
                    <p className="text-xs text-teal-600">
                      Customer will receive the amount within 5–7 business days once Razorpay processes it.
                    </p>
                    {data.razorpayRefundId && (
                      <p className="text-xs text-teal-500 font-mono mt-1">ID: {data.razorpayRefundId}</p>
                    )}
                  </div>
                </div>
              )}

              {data.status === "REFUND_SUCCESSFUL" && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="text-sm font-bold text-green-700">Refund Successful</p>
                    <p className="text-xs text-green-600">
                      ₹{data.totalAmount} has been credited to the customer's original payment method.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {!isOrder && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Transaction ID", value: data.id,                  color: "border-t-purple-400" },
                { label: "Customer",       value: getUserName(data.userId),  color: "border-t-blue-400"   },
                { label: "Order ID",       value: data.orderId,              color: "border-t-orange-400" },
                { label: "Payment Type",   value: data.transactionType,      color: "border-t-teal-400"   },
                { label: "Amount",         value: data.amount ? `₹${data.amount}` : "—", color: "border-t-green-400" },
                { label: "Status",         value: data.transactionStatus,    color: "border-t-gray-300"   },
              ].map((f, i) => (
                <div key={i} className={`bg-gray-50 border border-gray-100 border-t-4 ${f.color} rounded-xl p-3`}>
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">{f.label}</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">{f.value}</p>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;