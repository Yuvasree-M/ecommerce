// import { useContext, useState, useEffect } from "react";
// import { AuthContext } from "../context/AuthContext";
// import { CartContext } from "../context/CartContext";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "../services/api";
// import { FaMapMarkerAlt, FaPhone, FaShoppingCart } from "react-icons/fa";

// const Checkout = () => {
//   const { token } = useContext(AuthContext);
//   const { cart, clearCart } = useContext(CartContext);
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [address, setAddress] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   /* ---------------- TOTAL ---------------- */

//   const totalAmount = cart.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   /* ---------------- FETCH USER PROFILE ---------------- */

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const data = await apiFetch("/api/users/profile");

//         setName(data.name || "");
//         setEmail(data.email || "");
//         setAddress(data.address || "");
//         setPhone(data.phone || "");
//       } catch (err) {
//         console.error("Profile fetch failed", err);
//       }
//     };

//     if (token) fetchProfile();
//   }, [token]);

//   /* ---------------- PAYMENT ---------------- */

//   const handlePayment = async () => {
//     if (!address.trim()) return alert("Enter delivery address");

//     if (!/^[0-9]{10}$/.test(phone))
//       return alert("Enter valid phone number");

//     if (cart.length === 0) return alert("Cart is empty");

//     setLoading(true);

//     const orderData = {
//       cartItems: cart.map((i) => ({
//         productId: i.id,
//         quantity: i.quantity,
//       })),
//       name,
//       email,
//       address,
//       phone,
//     };

//     try {

//       /* CREATE RAZORPAY ORDER */

//       const payment = await apiFetch("/api/payment/razorpay/order", {
//         method: "POST",
//         body: JSON.stringify({
//           amount: totalAmount,
//         }),
//       });

//       const options = {
//         key: payment.key,
//         amount: payment.amount,
//         currency: payment.currency,
//         order_id: payment.id,

//         name: "Verdura",
//         description: "Order Payment",

//         handler: async (response) => {
//           try {

//             /* SAVE ORDER */

//             const savedOrder = await apiFetch("/api/payment/order/save", {
//               method: "POST",
//               body: JSON.stringify({
//                 ...orderData,
//                 paymentId: response.razorpay_payment_id,
//                 razorpayOrderId: response.razorpay_order_id,
//               }),
//             });

//             /* CLEAR CART */

//             await clearCart();

//             /* NAVIGATE TO INVOICE */

//             navigate(`/invoice/${savedOrder.orderId}`, {
//               state: { order: savedOrder },
//             });

//           } catch (err) {
//             console.error("Order save failed", err);
//             alert("Order placement failed");
//           }
//         },

//         prefill: {
//           name,
//           email,
//           contact: phone,
//         },

//         theme: {
//           color: "#16a34a",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();

//       rzp.on("payment.failed", function () {
//         alert("Payment failed. Please try again.");
//       });

//     } catch (err) {
//       console.error(err);
//       alert("Payment failed");
//     }

//     setLoading(false);
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

//       <h2 className="text-3xl font-bold mb-8">
//         Checkout - <span className="text-green-600">Verdura</span>
//       </h2>

//       <div className="grid md:grid-cols-2 gap-10">

//         {/* LEFT SIDE */}

//         <div>

//           {/* CUSTOMER INFO */}

//           <div className="bg-white shadow-md rounded-xl p-6 mb-6">

//             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaMapMarkerAlt className="text-green-600"/>
//               Delivery Details
//             </h3>

//             <div className="space-y-3">

//               <input
//                 value={name}
//                 readOnly
//                 className="w-full border rounded-lg p-3 bg-gray-100"
//               />

//               <input
//                 value={email}
//                 readOnly
//                 className="w-full border rounded-lg p-3 bg-gray-100"
//               />

//               <textarea
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 placeholder="Enter Delivery Address"
//                 className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
//               />

//               <div className="relative">
//                 <FaPhone className="absolute top-4 left-3 text-gray-400"/>

//                 <input
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="Phone Number"
//                   className="w-full border rounded-lg pl-10 p-3 focus:ring-2 focus:ring-green-500 outline-none"
//                 />
//               </div>

//             </div>

//           </div>

//           {/* CART ITEMS */}

//           <div className="bg-white shadow-md rounded-xl p-6">

//             <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <FaShoppingCart className="text-green-600"/>
//               Order Items
//             </h3>

//             <div className="space-y-4">

//               {cart.map((item) => (

//                 <div
//                   key={item.id}
//                   className="flex items-center justify-between border-b pb-4"
//                 >

//                   <div className="flex items-center gap-4">

//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-16 h-16 rounded-lg object-cover"
//                     />

//                     <div>
//                       <p className="font-semibold">{item.name}</p>
//                       <p className="text-gray-500 text-sm">
//                         ₹ {item.price} × {item.quantity}
//                       </p>
//                     </div>

//                   </div>

//                   <p className="font-semibold">
//                     ₹ {item.price * item.quantity}
//                   </p>

//                 </div>

//               ))}

//             </div>

//           </div>

//         </div>

//         {/* RIGHT SIDE */}

//         <div>

//           <div className="bg-white shadow-lg rounded-xl p-6 sticky top-28">

//             <h3 className="text-xl font-semibold mb-6">
//               Order Summary
//             </h3>

//             <div className="space-y-3 text-gray-700">

//               <div className="flex justify-between">
//                 <span>Items</span>
//                 <span>{cart.length}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹ {totalAmount}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Delivery</span>
//                 <span className="text-green-600">FREE</span>
//               </div>

//               <hr/>

//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total</span>
//                 <span>₹ {totalAmount}</span>
//               </div>

//             </div>

//             <button
//               onClick={handlePayment}
//               disabled={loading}
//               className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
//             >
//               {loading ? "Processing Payment..." : `Pay ₹${totalAmount}`}
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// };

// export default Checkout;

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { FaMapMarkerAlt, FaPhone, FaShoppingCart } from "react-icons/fa";

const Checkout = () => {
  const { token } = useContext(AuthContext);
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- TOTAL ---------------- */

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ---------------- FETCH USER PROFILE ---------------- */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiFetch("/api/users/profile");
        setName(data.name || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setPhone(data.phone || "");
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  /* ---------------- PAYMENT ---------------- */

  const handlePayment = async () => {
    if (!address.trim()) return alert("Enter delivery address");
    if (!/^[0-9]{10}$/.test(phone)) return alert("Enter valid phone number");
    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    const orderData = {
      cartItems: cart.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
      })),
      name,       // ✅ sent so backend can destructure
      email,      // ✅ sent so backend can destructure
      address,
      phone,
    };

    try {

      /* CREATE RAZORPAY ORDER */

      const payment = await apiFetch("/api/payment/razorpay/order", {
        method: "POST",
        body: JSON.stringify({ amount: totalAmount }),
      });

      const options = {
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.id,
        name: "Verdura",
        description: "Order Payment",

        handler: async (response) => {
          try {

            /* SAVE ORDER */

            const savedOrder = await apiFetch("/api/payment/order/save", {
              method: "POST",
              body: JSON.stringify({
                ...orderData,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
              }),
            });

            /* CLEAR CART */

            await clearCart();

            /* ✅ FIX: build the full order object locally so Invoice screen
               has all fields immediately without an extra fetch */
            const invoiceOrder = {
              name,
              email,
              phone,
              address,
              totalAmount,
              status: "ORDER_PLACED",
              items: cart.map((i) => ({
                productId: i.id,
                name: i.name,
                image: i.image,
                price: i.price,
                quantity: i.quantity,
              })),
            };

            /* NAVIGATE TO INVOICE */

            navigate(`/invoice/${savedOrder.orderId}`, {
              state: { order: invoiceOrder },
            });

          } catch (err) {
            console.error("Order save failed", err);
            alert("Order placement failed");
          }
        },

        prefill: { name, email, contact: phone },
        theme: { color: "#16a34a" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function () {
        alert("Payment failed. Please try again.");
      });

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }

    setLoading(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">

      <h2 className="text-3xl font-bold mb-8">
        Checkout - <span className="text-green-600">Verdura</span>
      </h2>

      <div className="grid md:grid-cols-2 gap-10">

        {/* LEFT SIDE */}

        <div>

          {/* CUSTOMER INFO */}

          <div className="bg-white shadow-md rounded-xl p-6 mb-6">

            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" />
              Delivery Details
            </h3>

            <div className="space-y-3">

              <input
                value={name}
                readOnly
                className="w-full border rounded-lg p-3 bg-gray-100"
              />

              <input
                value={email}
                readOnly
                className="w-full border rounded-lg p-3 bg-gray-100"
              />

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter Delivery Address"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-green-500 outline-none"
              />

              <div className="relative">
                <FaPhone className="absolute top-4 left-3 text-gray-400" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full border rounded-lg pl-10 p-3 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

            </div>

          </div>

          {/* CART ITEMS */}

          <div className="bg-white shadow-md rounded-xl p-6">

            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FaShoppingCart className="text-green-600" />
              Order Items
            </h3>

            <div className="space-y-4">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-4"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />

                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-500 text-sm">
                        ₹ {item.price} × {item.quantity}
                      </p>
                    </div>

                  </div>

                  <p className="font-semibold">
                    ₹ {item.price * item.quantity}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div>

          <div className="bg-white shadow-lg rounded-xl p-6 sticky top-28">

            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

            <div className="space-y-3 text-gray-700">

              <div className="flex justify-between">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹ {totalAmount}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>

              <hr />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹ {totalAmount}</span>
              </div>

            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              {loading ? "Processing Payment..." : `Pay ₹${totalAmount}`}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Checkout;