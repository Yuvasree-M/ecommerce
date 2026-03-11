import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

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
    const res = await fetch("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    setUsers(data);
    setAdminCount(data.filter((u) => u.role === "ADMIN").length);
    setUserCount(data.filter((u) => u.role === "USER").length);
  };

  /* ---------------- FETCH ORDERS ---------------- */

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:5000/api/orders/all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setOrders(data);

    const statusCount = {};
    data.forEach((o) => {
      statusCount[o.status] = (statusCount[o.status] || 0) + 1;
    });

    setOrdersByStatus(statusCount);
  };

  /* ---------------- FETCH PRODUCTS ---------------- */

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProductsCount(data.length);
  };

  /* ---------------- FETCH TRANSACTIONS ---------------- */

  const fetchTransactions = async () => {
    const res = await fetch("http://localhost:5000/api/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setTransactions(data);
  };

  /* ---------------- UPDATE ORDER STATUS ---------------- */

  const updateStatus = async (orderId, status) => {
    setUpdatingOrderId(orderId);

    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    await fetchOrders();
    setUpdatingOrderId(null);
  };

  /* ---------------- USER NAME ---------------- */

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : userId;
  };

  /* ---------------- STATUS COLOR ---------------- */

  const statusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-yellow-100 text-yellow-700";
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
              {orders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{order.id}</td>

                  <td className="px-4 py-3">
                    {getUserName(order.userId)}
                  </td>

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