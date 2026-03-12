import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortField, setSortField] = useState("id");
  const [sortAsc, setSortAsc] = useState(true);

  /* ---------------- FETCH ORDERS ---------------- */

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("/api/orders/all");
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching orders");
    }
  };

  /* ---------------- LOAD DATA ---------------- */

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------- FILTER + SORT ---------------- */

  const filteredOrders = orders
    .filter((o) => filterStatus === "ALL" || o.status === filterStatus)
    .sort((a, b) => {
      let fieldA = a[sortField];
      let fieldB = b[sortField];

      if (sortField === "items") {
        fieldA = a.items.length;
        fieldB = b.items.length;
      }

      if (typeof fieldA === "string") fieldA = fieldA.toLowerCase();
      if (typeof fieldB === "string") fieldB = fieldB.toLowerCase();

      if (fieldA > fieldB) return sortAsc ? 1 : -1;
      if (fieldA < fieldB) return sortAsc ? -1 : 1;

      return 0;
    });

  /* ---------------- SORT HANDLER ---------------- */

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        All User Orders
      </h2>

      {/* FILTER */}

      <div className="mb-4 flex items-center gap-4">
        <label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
          Filter by Status:
        </label>

        <select
          className="px-3 py-1 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
        <option value="ALL">All</option>
<option value="ORDER_PLACED">Order Placed</option>
<option value="APPROVED">Approved</option>
<option value="SHIPPED">Shipped</option>
<option value="DELIVERED">Delivered</option>
<option value="REJECTED">Rejected</option>
        </select>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <thead>
              <tr className="bg-green-600 dark:bg-green-700">
                {[
                  { label: "Order ID", field: "id" },
                  { label: "User", field: "userName" },
                  { label: "Phone", field: "phone" },
                  { label: "Status", field: "status" },
                  { label: "Items", field: "items" },
                  { label: "Address", field: "address" },
                ].map((col) => (
                  <th
                    key={col.field}
                    onClick={() => handleSort(col.field)}
                    className="px-4 py-3 border-b border-green-700 text-left text-sm font-semibold text-white cursor-pointer select-none"
                  >
                    {col.label}{" "}
                    {sortField === col.field ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-green-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-800 dark:text-gray-100">
                    {order.id}
                  </td>

                  <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {order.userName} <br />
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {order.userId}
                    </span>
                  </td>

                  <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {order.phone}
                  </td>

                  <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm">
                    <span
                     className={`px-2 py-1 rounded-full text-xs font-semibold ${
  order.status === "ORDER_PLACED"
    ? "bg-yellow-100 text-yellow-700"
    : order.status === "APPROVED"
    ? "bg-blue-100 text-blue-700"
    : order.status === "SHIPPED"
    ? "bg-indigo-100 text-indigo-700"
    : order.status === "DELIVERED"
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700"
}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {order.items.length}
                  </td>

                  <td className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300">
                    {order.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-16">
          No orders yet.
        </p>
      )}
    </div>
  );
};

export default AllOrders;