import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";

const AdminDashboard = () => {
  const { token } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  const [productsCount, setProductsCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [ordersByStatus, setOrdersByStatus] = useState({});
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  /* ---------------- FETCH USERS ---------------- */

  const fetchUsers = async () => {
    try {
      const data = await apiFetch("/api/users");

      setUsers(data);
      setAdminCount(data.filter((u) => u.role === "ADMIN").length);
      setUserCount(data.filter((u) => u.role === "USER").length);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  /* ---------------- FETCH ORDERS ---------------- */

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/api/orders/all");

      setOrders(data);

      const statusCount = {};

      data.forEach((o) => {
        statusCount[o.status] = (statusCount[o.status] || 0) + 1;
      });

      setOrdersByStatus(statusCount);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = async () => {
    try {
      const data = await apiFetch("/api/products");
      setProductsCount(data.length);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  /* ---------------- FETCH TRANSACTIONS ---------------- */

  const fetchTransactions = async () => {
    try {
      const data = await apiFetch("/api/transactions");
      setTransactions(data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    }
  };

  /* ---------------- UPDATE ORDER STATUS ---------------- */

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingOrderId(orderId);

    await apiFetch(`/api/orders/${orderId}/status`, {
  method: "PATCH",
  body: JSON.stringify({ status }),
});
      

      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  /* ---------------- USER NAME ---------------- */

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : userId;
  };

  /* ---------------- STATUS COLOR ---------------- */

  const statusColor = (status) => {
    switch (status) {

      case "APPROVED":
        return "bg-blue-100 text-blue-700";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  /* ---------------- ACTION BUTTONS ---------------- */

  const renderActionButton = (order) => {
    if (updatingOrderId === order.id) return "Updating...";

    switch (order.status) {
      case "ORDER_PLACED":
        return (
          <button
            onClick={() => updateStatus(order.id, "APPROVED")}
            className="px-4 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Approve
          </button>
        );

      case "APPROVED":
        return (
          <button
            onClick={() => updateStatus(order.id, "SHIPPED")}
            className="px-4 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Ship
          </button>
        );

      case "SHIPPED":
        return (
          <button
            onClick={() => updateStatus(order.id, "DELIVERED")}
            className="px-4 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Deliver
          </button>
        );

      case "DELIVERED":
        return <span className="text-green-600 font-semibold">Completed</span>;

      case "CANCELLED":
        return <span className="text-red-600 font-semibold">Cancelled</span>;

      default:
        return null;
    }
  };

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchOrders();
      fetchProducts();
      fetchTransactions();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#f0f9e8] dark:bg-gray-900 p-6 container mx-auto pt-24 space-y-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Admin Dashboard
      </h1>

      {/* STATS */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard title="Admins" value={adminCount} />
        <StatCard title="Users" value={userCount} />
        <StatCard title="Products" value={productsCount} />
        <StatCard title="Orders" value={orders.length} />
        <StatCard title="Transactions" value={transactions.length} />
      </div>

      {/* ORDER STATUS SUMMARY */}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border">
        <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Orders by Status
        </h3>

        <div className="flex flex-wrap gap-3">
          {Object.entries(ordersByStatus).map(([status, count]) => (
            <span
              key={status}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm"
            >
              {status}: {count}
            </span>
          ))}
        </div>
      </div>

      {/* TABS */}

      <div className="flex gap-4">
        <TabButton
          active={activeTab === "orders"}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </TabButton>

        <TabButton
          active={activeTab === "transactions"}
          onClick={() => setActiveTab("transactions")}
        >
          Transactions
        </TabButton>
      </div>

      {/* ORDERS TABLE */}

      {activeTab === "orders" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

           
          <tbody>
  {orders
    .filter(order => order.status !== "DELIVERED")
    .map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{order.id}</td>

                  <td className="px-4 py-3">{getUserName(order.userId)}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">{order.items.length}</td>

                  <td className="px-4 py-3">
                    {renderActionButton(order)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TRANSACTIONS */}

      {activeTab === "transactions" && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow">
            <thead className="bg-green-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Transaction ID</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Payment</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{tx.id}</td>
                  <td className="px-4 py-3">{getUserName(tx.userId)}</td>
                  <td className="px-4 py-3">{tx.orderId}</td>
                  <td className="px-4 py-3">{tx.transactionType}</td>
                  <td className="px-4 py-3">{tx.transactionStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ---------------- REUSABLE COMPONENTS ---------------- */

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center border hover:shadow-lg transition">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-lg font-medium ${
      active
        ? "bg-green-600 text-white"
        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
    }`}
  >
    {children}
  </button>
);

export default AdminDashboard;

// import { useState, useEffect, useContext, useMemo } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { apiFetch } from "../services/api";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// /* ---------------- MAIN COMPONENT ---------------- */

// const AdminDashboard = () => {
//   const { token } = useContext(AuthContext);

//   const [activeTab, setActiveTab] = useState("orders");

//   const [orders, setOrders] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [productsCount, setProductsCount] = useState(0);

//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("ALL");

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 6;

//   const [selectedOrder, setSelectedOrder] = useState(null);

//   const [notification, setNotification] = useState(null);

//   /* ---------------- LOAD DASHBOARD ---------------- */

//   const loadDashboard = async () => {
//     try {
//       setLoading(true);

//       const [usersData, ordersData, productsData, txData] = await Promise.all([
//         apiFetch("/api/users"),
//         apiFetch("/api/orders/all"),
//         apiFetch("/api/products"),
//         apiFetch("/api/transactions"),
//       ]);

//       setUsers(usersData || []);
//       setOrders(ordersData || []);
//       setTransactions(txData || []);
//       setProductsCount(productsData?.length || 0);

//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (token) loadDashboard();
//   }, [token]);

//   /* ---------------- LIVE ORDER POLLING ---------------- */

//   useEffect(() => {
//     const interval = setInterval(async () => {
//       const latest = await apiFetch("/api/orders/all");

//       if (latest.length > orders.length) {
//         setNotification("New order received!");
//       }

//       setOrders(latest);
//     }, 15000);

//     return () => clearInterval(interval);
//   }, [orders]);

//   /* ---------------- COUNTS ---------------- */

//   const adminCount = useMemo(
//     () => users.filter((u) => u.role === "ADMIN").length,
//     [users]
//   );

//   const userCount = useMemo(
//     () => users.filter((u) => u.role === "USER").length,
//     [users]
//   );

//   const ordersByStatus = useMemo(() => {
//     const obj = {};
//     orders.forEach((o) => {
//       obj[o.status] = (obj[o.status] || 0) + 1;
//     });
//     return obj;
//   }, [orders]);

//   /* ---------------- CHART DATA ---------------- */

//   const chartData = useMemo(() => {
//     return Object.entries(ordersByStatus).map(([status, value]) => ({
//       name: status,
//       orders: value,
//     }));
//   }, [ordersByStatus]);

//   /* ---------------- USER NAME ---------------- */

//   const getUserName = (userId) => {
//     const user = users.find((u) => u.id === userId);
//     return user?.name || userId;
//   };

//   /* ---------------- SEARCH + FILTER ---------------- */

//   const filteredOrders = useMemo(() => {
//     return orders.filter((o) => {
//       const matchesSearch =
//         o.id.toLowerCase().includes(search.toLowerCase());

//       const matchesStatus =
//         statusFilter === "ALL" || o.status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [orders, search, statusFilter]);

//   /* ---------------- PAGINATION ---------------- */

//   const paginatedOrders = useMemo(() => {
//     const start = (page - 1) * rowsPerPage;
//     return filteredOrders.slice(start, start + rowsPerPage);
//   }, [filteredOrders, page]);

//   const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

//   /* ---------------- UPDATE STATUS ---------------- */

//   const updateStatus = async (orderId, status) => {
//     await apiFetch(`/api/orders/${orderId}/status`, {
//       method: "PATCH",
//       body: JSON.stringify({ status }),
//     });

//     setOrders((prev) =>
//       prev.map((o) => (o.id === orderId ? { ...o, status } : o))
//     );
//   };

//   /* ---------------- EXPORT CSV ---------------- */

//   const exportCSV = () => {
//     const rows = transactions.map((t) =>
//       `${t.id},${t.userId},${t.orderId},${t.transactionType},${t.transactionStatus}`
//     );

//     const csv =
//       "TransactionID,User,Order,PaymentType,Status\n" + rows.join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });

//     const url = URL.createObjectURL(blob);

//     const a = document.createElement("a");

//     a.href = url;
//     a.download = "transactions.csv";

//     a.click();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading Dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 container mx-auto pt-24 space-y-10">

//       <h1 className="text-3xl font-bold">Admin Dashboard</h1>

//       {/* Notification */}

//       {notification && (
//         <div className="bg-green-500 text-white px-4 py-2 rounded">
//           {notification}
//         </div>
//       )}

//       {/* Stats */}

//       <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

//         <StatCard title="Admins" value={adminCount} />
//         <StatCard title="Users" value={userCount} />
//         <StatCard title="Products" value={productsCount} />
//         <StatCard title="Orders" value={orders.length} />
//         <StatCard title="Transactions" value={transactions.length} />

//       </div>

//       {/* Chart */}

//       <div className="bg-white p-6 rounded shadow">

//         <h3 className="mb-4 font-semibold">Orders by Status</h3>

//         <ResponsiveContainer width="100%" height={300}>

//           <BarChart data={chartData}>

//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="orders" />

//           </BarChart>

//         </ResponsiveContainer>

//       </div>

//       {/* Tabs */}

//       <div className="flex gap-4">

//         <TabButton
//           active={activeTab === "orders"}
//           onClick={() => setActiveTab("orders")}
//         >
//           Orders
//         </TabButton>

//         <TabButton
//           active={activeTab === "transactions"}
//           onClick={() => setActiveTab("transactions")}
//         >
//           Transactions
//         </TabButton>

//       </div>

//       {/* ORDERS */}

//       {activeTab === "orders" && (
//         <div className="space-y-4">

//           <div className="flex gap-4">

//             <input
//               placeholder="Search Order ID"
//               className="border p-2 rounded"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />

//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value)}
//               className="border p-2 rounded"
//             >
//               <option value="ALL">All</option>
//               <option value="ORDER_PLACED">Placed</option>
//               <option value="APPROVED">Approved</option>
//               <option value="SHIPPED">Shipped</option>
//               <option value="DELIVERED">Delivered</option>
//             </select>

//           </div>

//           <table className="w-full bg-white shadow rounded">

//             <thead className="bg-green-700 text-white">
//               <tr>
//                 <th className="p-3">Order</th>
//                 <th>User</th>
//                 <th>Status</th>
//                 <th>Items</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>

//               {paginatedOrders.map((order) => (

//                 <tr key={order.id} className="border-b hover:bg-gray-50">

//                   <td
//                     className="p-3 cursor-pointer"
//                     onClick={() => setSelectedOrder(order)}
//                   >
//                     {order.id}
//                   </td>

//                   <td>{getUserName(order.userId)}</td>

//                   <td>{order.status}</td>

//                   <td>{order.items.length}</td>

//                   <td>

//                     <button
//                       onClick={() =>
//                         updateStatus(order.id, "APPROVED")
//                       }
//                       className="bg-green-600 text-white px-3 py-1 rounded"
//                     >
//                       Approve
//                     </button>

//                   </td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//           {/* Pagination */}

//           <div className="flex gap-2">

//             {Array.from({ length: totalPages }).map((_, i) => (

//               <button
//                 key={i}
//                 onClick={() => setPage(i + 1)}
//                 className="px-3 py-1 border rounded"
//               >
//                 {i + 1}
//               </button>

//             ))}

//           </div>

//         </div>
//       )}

//       {/* TRANSACTIONS */}

//       {activeTab === "transactions" && (

//         <div>

//           <button
//             onClick={exportCSV}
//             className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
//           >
//             Export CSV
//           </button>

//           <table className="w-full bg-white shadow rounded">

//             <thead className="bg-gray-900 text-white">
//               <tr>
//                 <th className="p-3">Transaction</th>
//                 <th>User</th>
//                 <th>Order</th>
//                 <th>Payment</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>

//               {transactions.map((t) => (

//                 <tr key={t.id} className="border-b">

//                   <td className="p-3">{t.id}</td>
//                   <td>{getUserName(t.userId)}</td>
//                   <td>{t.orderId}</td>
//                   <td>{t.transactionType}</td>
//                   <td>{t.transactionStatus}</td>

//                 </tr>

//               ))}

//             </tbody>

//           </table>

//         </div>
//       )}

//       {/* ORDER MODAL */}

//       {selectedOrder && (

//         <OrderModal
//           order={selectedOrder}
//           onClose={() => setSelectedOrder(null)}
//         />

//       )}

//     </div>
//   );
// };

// /* ---------------- COMPONENTS ---------------- */

// const StatCard = ({ title, value }) => (

//   <div className="bg-white p-6 rounded shadow text-center">

//     <p className="text-gray-500">{title}</p>
//     <h2 className="text-2xl font-bold">{value}</h2>

//   </div>

// );

// const TabButton = ({ active, onClick, children }) => (

//   <button
//     onClick={onClick}
//     className={`px-6 py-2 rounded ${
//       active ? "bg-green-600 text-white" : "bg-gray-200"
//     }`}
//   >
//     {children}
//   </button>

// );

// const OrderModal = ({ order, onClose }) => (

//   <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

//     <div className="bg-white p-6 rounded shadow w-96">

//       <h3 className="font-bold mb-4">Order Details</h3>

//       <p><b>ID:</b> {order.id}</p>
//       <p><b>Status:</b> {order.status}</p>

//       <h4 className="mt-4 font-semibold">Items</h4>

//       {order.items.map((i, idx) => (

//         <div key={idx}>
//           {i.name} × {i.quantity}
//         </div>

//       ))}

//       <button
//         onClick={onClose}
//         className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
//       >
//         Close
//       </button>

//     </div>

//   </div>

// );

// export default AdminDashboard;