import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const Orders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log("Fetching orders with token:", token);
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);
        const data = await res.json();
        console.log("Orders fetched:", data);
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  // const handleClearOrders = async () => {
  //   if (!window.confirm("Are you sure you want to clear all orders?")) return;

  //   await fetch("API_BASE_URL/api/orders/clear", {
  //     method: "DELETE",
  //     headers: { Authorization: `Bearer ${token}` },
  //   });

  //   setOrders([]); // Clear local state
  //   alert("All orders cleared successfully");
  // };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pt-24">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={`order-${order.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all duration-300 hover:shadow-md focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500"
              tabIndex={0} // makes focus work
            >
              <div className="flex justify-between flex-wrap gap-2 mb-3">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-semibold text-sm">{order.id}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "PAID"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* <div>
                  <p className="text-xs text-gray-500">Payment</p>
                  <p className="font-medium text-sm">{order.paymentType}</p>
                </div> */}
              </div>

              <div className="mb-3 text-xs text-gray-600 space-y-1">
                <p>
                  <strong>Address:</strong> {order.address}
                </p>
                <p>
                  <strong>Phone:</strong> {order.phone}
                </p>
              </div>

              <div className="border-t pt-3 space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={`order-${order.id}-item-${item.productId}-${idx}`}
                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-6 flex justify-end">
          {/* <button
            onClick={handleClearOrders}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Clear All Orders
          </button> */}
        </div>
      )}
    </div>
  );
};

export default Orders;