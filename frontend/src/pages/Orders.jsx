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
// import { useEffect, useState } from "react";
// import { apiFetch } from "../services/api";
// import { FaTruck, FaCheckCircle, FaBox } from "react-icons/fa";

// const Orders = () => {

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ---------------- DELIVERY MESSAGE ---------------- */

//   const getDeliveryMessage = (status) => {

//     switch (status) {

//       case "ORDER_PLACED":
//         return "Your order is being prepared";

//       case "APPROVED":
//         return "Estimated delivery in 4 - 5 days";

//       case "SHIPPED":
//         return "On the way! Delivery in 3 - 4 days";

//       case "DELIVERED":
//         return "Order delivered successfully";

//       default:
//         return "Processing order";

//     }

//   };

//   /* ---------------- STATUS STYLE ---------------- */

//   const getStatusStyle = (status) => {

//     switch (status) {

//       case "ORDER_PLACED":
//         return "bg-yellow-100 text-yellow-700";

//       case "APPROVED":
//         return "bg-blue-100 text-blue-700";

//       case "SHIPPED":
//         return "bg-purple-100 text-purple-700";

//       case "DELIVERED":
//         return "bg-green-100 text-green-700";

//       default:
//         return "bg-gray-100 text-gray-600";

//     }

//   };

//   /* ---------------- FETCH ORDERS ---------------- */

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
//       <div className="pt-24 text-center text-gray-500 text-lg">
//         Loading orders...
//       </div>
//     );

//   }

//   return (

//     <div className="max-w-6xl mx-auto px-4 py-10 pt-24">

//       <h2 className="text-3xl font-bold mb-8 text-gray-800">
//         My Orders
//       </h2>

//       {orders.length === 0 ? (

//         <div className="text-center text-gray-500 py-20">
//           <FaBox className="mx-auto text-4xl mb-3 text-gray-400" />
//           No orders yet.
//         </div>

//       ) : (

//         <div className="space-y-6">

//           {orders.map((order) => (

//             <div
//               key={order.id}
//               className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6"
//             >

//               {/* ORDER HEADER */}

//               <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">

//                 <div>

//                   <p className="text-xs text-gray-500">
//                     Order ID
//                   </p>

//                   <p className="font-semibold text-gray-800">
//                     {order.id}
//                   </p>

//                 </div>

//                 <span
//                   className={`mt-2 md:mt-0 px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(order.status)}`}
//                 >
//                   {order.status}
//                 </span>

//               </div>

//               {/* DELIVERY MESSAGE */}

//               <div className="flex items-center gap-2 bg-gray-50 border rounded-lg p-3 text-sm text-gray-600 mb-4">

//                 {order.status === "DELIVERED" ? (
//                   <FaCheckCircle className="text-green-600" />
//                 ) : (
//                   <FaTruck className="text-green-600" />
//                 )}

//                 {getDeliveryMessage(order.status)}

//               </div>

//               {/* ADDRESS */}

//               <div className="text-sm text-gray-600 mb-4">

//                 <p>
//                   <strong>Delivery Address:</strong> {order.address}
//                 </p>

//                 <p>
//                   <strong>Phone:</strong> {order.phone}
//                 </p>

//               </div>

//               {/* ITEMS */}

//               <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

//                 {order?.items?.map((item, idx) => (

//                   <div
//                     key={idx}
//                     className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50"
//                   >

//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-14 h-14 rounded object-cover"
//                     />

//                     <div>

//                       <p className="font-medium text-sm">
//                         {item.name}
//                       </p>

//                       <p className="text-xs text-gray-500">
//                         Qty: {item.quantity}
//                       </p>

//                       <p className="text-xs text-gray-500">
//                         Price: Rs. {item.price}
//                       </p>

//                     </div>

//                   </div>

//                 ))}

//               </div>

//               {/* TOTAL */}

//               <div className="flex justify-end mt-5 border-t pt-4">

//                 <p className="text-lg font-semibold text-green-700">
//                   Total: Rs. {order.totalAmount}
//                 </p>

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
import { FaTruck, FaCheckCircle, FaBox } from "react-icons/fa";

const Orders = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- DELIVERY MESSAGE ---------------- */

  const getDeliveryMessage = (status) => {

    switch (status) {

      case "ORDER_PLACED":
        return "Your order is being prepared";

      case "APPROVED":
        return "Estimated delivery in 4 - 5 days";

      case "SHIPPED":
        return "On the way! Delivery in 3 - 4 days";

      case "DELIVERED":
        return "Order delivered successfully";

      default:
        return "Processing order";

    }

  };

  /* ---------------- STATUS STYLE ---------------- */

  const getStatusStyle = (status) => {

    switch (status) {

      case "ORDER_PLACED":
        return "bg-yellow-100 text-yellow-700";

      case "APPROVED":
        return "bg-blue-100 text-blue-700";

      case "SHIPPED":
        return "bg-purple-100 text-purple-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";

    }

  };

  /* ---------------- FETCH ORDERS ---------------- */

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const data = await apiFetch("/api/orders");

        setOrders(data || []);

      } catch (error) {

        console.error("Failed to fetch orders:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);

  /* ---------------- LOADING SKELETON ---------------- */

  if (loading) {

    return (

      <div className="max-w-6xl mx-auto px-4 pt-24 space-y-6">

        {[1, 2, 3].map((i) => (

          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow animate-pulse"
          >

            <div className="h-4 bg-gray-200 w-40 mb-4 rounded"></div>

            <div className="h-3 bg-gray-200 w-60 mb-4 rounded"></div>

            <div className="grid grid-cols-3 gap-4">

              <div className="h-14 bg-gray-200 rounded"></div>

              <div className="h-14 bg-gray-200 rounded"></div>

              <div className="h-14 bg-gray-200 rounded"></div>

            </div>

          </div>

        ))}

      </div>

    );

  }

  return (

    <div className="max-w-6xl mx-auto px-4 py-10 pt-24">

      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        My Orders
      </h2>

      {orders.length === 0 ? (

        <div className="text-center text-gray-500 py-20">

          <FaBox className="mx-auto text-4xl mb-3 text-gray-400" />

          <p>No orders yet.</p>

        </div>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (

            <div
              key={order?.id}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-6"
            >

              {/* ORDER HEADER */}

              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">

                <div>

                  <p className="text-xs text-gray-500">
                    Order ID
                  </p>

                  <p className="font-semibold text-gray-800">
                    {order?.id}
                  </p>

                </div>

                <span
                  className={`mt-2 md:mt-0 px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(order?.status)}`}
                >
                  {order?.status}
                </span>

              </div>

              {/* DELIVERY MESSAGE */}

              <div className="flex items-center gap-2 bg-gray-50 border rounded-lg p-3 text-sm text-gray-600 mb-4">

                {order?.status === "DELIVERED" ? (
                  <FaCheckCircle className="text-green-600" />
                ) : (
                  <FaTruck className="text-green-600" />
                )}

                {getDeliveryMessage(order?.status)}

              </div>

              {/* ADDRESS */}

              <div className="text-sm text-gray-600 mb-4">

                <p>
                  <strong>Delivery Address:</strong> {order?.address}
                </p>

                <p>
                  <strong>Phone:</strong> {order?.phone}
                </p>

              </div>

              {/* ITEMS */}

              <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                {order?.items?.map((item, idx) => (

                  <div
                    key={idx}
                    className="flex items-center gap-3 border rounded-lg p-3 bg-gray-50"
                  >

                    <img
                      src={item?.image}
                      alt={item?.name}
                      loading="lazy"
                      className="w-14 h-14 rounded object-cover"
                    />

                    <div>

                      <p className="font-medium text-sm">
                        {item?.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        Qty: {item?.quantity}
                      </p>

                      <p className="text-xs text-gray-500">
                        Price: ₹ {item?.price}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

              {/* TOTAL */}

              <div className="flex justify-end mt-5 border-t pt-4">

                <p className="text-lg font-semibold text-green-700">
                  Total: ₹ {order?.totalAmount}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );

};

export default Orders;