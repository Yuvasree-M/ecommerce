// import { useEffect, useState } from "react";
// import { apiFetch } from "../services/api";

// const Orders = () => {

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {

//     const fetchOrders = async () => {

//       try {

//         const data = await apiFetch("/api/orders");

//         setOrders(data);

//       } catch (error) {

//         console.error("Failed to fetch orders:", error);

//       } finally {

//         setLoading(false);

//       }

//     };

//     fetchOrders();

//   }, []);

//   if (loading) {
//     return (
//       <div className="pt-24 text-center text-gray-500">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto px-4 py-8 pt-24">

//       <h2 className="text-3xl font-bold mb-6 text-gray-800">
//         My Orders
//       </h2>

//       {orders.length === 0 ? (

//         <p className="text-gray-500">No orders yet.</p>

//       ) : (

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

//           {orders.map((order) => (

//             <div
//               key={order.id}
//               className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
//             >

//               <div className="flex justify-between mb-3">

//                 <div>
//                   <p className="text-xs text-gray-500">Order ID</p>
//                   <p className="font-semibold text-sm">{order.id}</p>
//                 </div>

//                 <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">
//                   {order.status}
//                 </span>

//               </div>

//               <div className="text-xs text-gray-600 mb-3">
//                 <p><strong>Address:</strong> {order.address}</p>
//                 <p><strong>Phone:</strong> {order.phone}</p>
//               </div>

//               <div className="border-t pt-3 space-y-2">

//                 {order.items.map((item, idx) => (

//                   <div
//                     key={idx}
//                     className="flex items-center gap-3"
//                   >

//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-12 h-12 rounded object-cover"
//                     />

//                     <div>
//                       <p className="text-sm font-medium">
//                         {item.name}
//                       </p>

//                       <p className="text-xs text-gray-500">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>

//                   </div>

//                 ))}

//               </div>

//             </div>

//           ))}

//         </div>

//       )}

//     </div>
//   );
// };

// export default Orders;
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- DELIVERY MESSAGE ---------------- */

  const getDeliveryMessage = (status) => {

    switch (status) {

      case "APPROVED":
        return "Estimated delivery in 4 - 5 days";

      case "SHIPPED":
        return "Estimated delivery in 3 - 4 days";

      case "DELIVERED":
        return "Order delivered successfully";

      default:
        return "Processing order";

    }

  };

  /* ---------------- FETCH ORDERS ---------------- */

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const data = await apiFetch("/api/orders");
        setOrders(data);

      } catch (error) {

        console.error("Failed to fetch orders:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  if (loading) {
    return (
      <div className="pt-24 text-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (

    <div className="max-w-5xl mx-auto px-4 py-8 pt-24">

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        My Orders
      </h2>

      {orders.length === 0 ? (

        <p className="text-gray-500">No orders yet.</p>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
            >

              {/* ORDER HEADER */}

              <div className="flex justify-between mb-3">

                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-semibold text-sm">{order.id}</p>
                </div>

                <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full capitalize">
                  {order.status}
                </span>

              </div>

              {/* DELIVERY MESSAGE */}

              <p className="text-xs bg-gray-50 border rounded p-2 mb-3 text-gray-600">
                {getDeliveryMessage(order.status)}
              </p>

              {/* ADDRESS */}

              <div className="text-xs text-gray-600 mb-3">
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Phone:</strong> {order.phone}</p>
              </div>

              {/* ITEMS */}

              <div className="border-t pt-3 space-y-2">

                {order?.items?.map((item, idx) => (

                  <div
                    key={idx}
                    className="flex items-center gap-3"
                  >

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />

                    <div>
                      <p className="text-sm font-medium">
                        {item.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default Orders;