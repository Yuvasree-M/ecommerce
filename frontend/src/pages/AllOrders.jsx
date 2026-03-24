import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "../services/api";

const PAGE_SIZE = 10;

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [sortField, setSortField] = useState("id");
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/api/orders/all");

      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders
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
  }, [orders, filterStatus, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-blue-100 text-blue-700";

      case "SHIPPED":
        return "bg-indigo-100 text-indigo-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-500 text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 pt-24">
      <h2 className="text-3xl font-bold  text-green-800">All Users Orders</h2>

      <div className="mb-6 flex items-center gap-4">
        <label className="font-semibold text-sm text-gray-700">
          Filter by Status
        </label>

        <select
          className="px-3 py-2 border rounded-lg"
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="ALL">All</option>
          <option value="ORDER_PLACED">Order Placed</option>
          <option value="APPROVED">Approved</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {paginatedOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl shadow">
            <thead>
              <tr className="bg-green-600 text-white">
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
                    className="px-4 py-3 text-left text-sm font-semibold cursor-pointer"
                  >
                    {col.label}

                    {sortField === col.field && (
                      <span className="ml-1">{sortAsc ? "▲" : "▼"}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginatedOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm font-medium">{order.id}</td>

                  <td className="px-4 py-3 text-sm">
                    {order.userName}
                    <br />
                    <span className="text-xs text-gray-400">
                      {order.userId}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">{order.phone}</td>

                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${statusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-sm">{order.items.length}</td>

                  <td className="px-4 py-3 text-sm">{order.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-16">No orders found.</p>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <span className="px-4 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AllOrders;
