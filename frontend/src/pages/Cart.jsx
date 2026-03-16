// import { useContext, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { CartContext } from "../context/CartContext";
// import { apiFetch } from "../services/api";

// const Cart = () => {
//   const { token } = useContext(AuthContext);
//   const { cart, setCart, fetchCart } = useContext(CartContext);
//   const navigate = useNavigate();

//   /* ---------------- REMOVE ITEM ---------------- */

//   const handleRemove = async (id) => {
//     // Optimistic UI update
//     const previousCart = cart;

//     setCart((prev) => prev.filter((item) => item.id !== id));

//     try {
//       await apiFetch(`/api/cart/${id}`, {
//         method: "DELETE",
//       });
//     } catch (error) {
//       console.error("Remove cart item failed", error);

//       // rollback if API fails
//       setCart(previousCart);
//     }
//   };

//   /* ---------------- UPDATE QUANTITY ---------------- */

//   const updateQuantity = async (id, quantity) => {
//     if (quantity < 1) return;

//     const previousCart = cart;

//     // Optimistic UI update
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: quantity } : item
//       )
//     );

//     try {
//       await apiFetch("/api/cart", {
//         method: "POST",
//         body: JSON.stringify({
//           productId: id,
//           quantity,
//         }),
//       });
//     } catch (error) {
//       console.error("Update quantity failed", error);

//       // rollback
//       setCart(previousCart);
//     }
//   };

//   /* ---------------- CHECKOUT ---------------- */

//   const handleCheckout = () => {
//     if (!token) {
//       alert("Login to checkout");
//       return;
//     }

//     navigate("/checkout");
//   };

//   /* ---------------- TOTAL PRICE ---------------- */

//   const totalPrice = useMemo(() => {
//     return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   }, [cart]);

//   return (
//     <div className="min-h-screen bg-[#f0f9e8] dark:bg-gray-900 p-6 transition-colors container mx-auto pt-24">
//       <h2 className="text-3xl font-bold mb-8 text-green-900 dark:text-gray-100">
//         My Cart
//       </h2>

//       {/* EMPTY CART */}

//       {cart.length === 0 && (
//         <p className="text-gray-500 dark:text-gray-400 text-center mt-16">
//           Your cart is empty.
//         </p>
//       )}

//       {cart.length > 0 && (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* CART ITEMS */}

//           <div className="lg:col-span-2 space-y-6">
//             {cart.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col sm:flex-row gap-6 border border-gray-200 dark:border-gray-700"
//               >
//                 <img
//                   src={item.image}
//                   alt={item.name}
//                   className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-sm"
//                 />

//                 <div className="flex-1 flex flex-col justify-between">
//                   <div>
//                     <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
//                       {item.name}
//                     </h4>

//                     <p className="text-green-700 dark:text-green-500 font-medium mt-1">
//                       ₹ {item.price}
//                     </p>

//                     {/* QUANTITY CONTROLS */}

//                     <div className="flex items-center gap-3 mt-4">
//                       <button
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity - 1)
//                         }
//                         className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-600 transition text-green-700 dark:text-green-300 font-semibold"
//                       >
//                         −
//                       </button>

//                       <span className="font-medium text-gray-900 dark:text-gray-100">
//                         {item.quantity}
//                       </span>

//                       <button
//                         onClick={() =>
//                           updateQuantity(item.id, item.quantity + 1)
//                         }
//                         className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-600 transition text-green-700 dark:text-green-300 font-semibold"
//                       >
//                         +
//                       </button>
//                     </div>

//                     <p className="mt-3 text-gray-600 dark:text-gray-300">
//                       Subtotal: ₹ {item.price * item.quantity}
//                     </p>
//                   </div>

//                   <button
//                     onClick={() => handleRemove(item.id)}
//                     className="mt-3 text-sm text-red-500 hover:text-red-600 transition self-start"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* ORDER SUMMARY */}

//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-fit sticky top-24 border border-gray-200 dark:border-gray-700">
//             <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
//               Order Summary
//             </h3>

//             <div className="flex justify-between mb-3 text-gray-700 dark:text-gray-300">
//               <span>Total Items</span>
//               <span>{cart.length}</span>
//             </div>

//             <div className="flex justify-between mb-6 text-lg font-bold text-gray-900 dark:text-gray-100">
//               <span>Total Price</span>
//               <span>₹ {totalPrice}</span>
//             </div>

//             <button
//               onClick={handleCheckout}
//               className="w-[200px] py-3 rounded-xl bg-green-700 mx-auto flex justify-center hover:bg-green-600 text-white font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Cart;

import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { apiFetch } from "../services/api";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

const Cart = () => {

  const { token } = useContext(AuthContext);
  const { cart, setCart } = useContext(CartContext);
  const navigate = useNavigate();

  /* ---------------- REMOVE ITEM ---------------- */

  const handleRemove = async (id) => {

    const previousCart = cart;

    setCart((prev) => prev.filter((item) => item.id !== id));

    try {

      await apiFetch(`/api/cart/${id}`, {
        method: "DELETE"
      });

    } catch (error) {

      console.error("Remove cart item failed", error);
      setCart(previousCart);

    }

  };

  /* ---------------- UPDATE QUANTITY ---------------- */

  const updateQuantity = async (id, quantity) => {

    if (quantity < 1) return;

    const previousCart = cart;

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );

    try {

      await apiFetch("/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productId: id,
          quantity
        })
      });

    } catch (error) {

      console.error("Update quantity failed", error);
      setCart(previousCart);

    }

  };

  /* ---------------- CHECKOUT ---------------- */

  const handleCheckout = () => {

    if (!token) {
      alert("Login to checkout");
      return;
    }

    navigate("/checkout");

  };

  /* ---------------- TOTAL PRICE ---------------- */

  const totalPrice = useMemo(() => {

    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

  }, [cart]);

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* HEADER */}

        <div className="flex items-center gap-3 mb-8">

          <FaShoppingCart className="text-green-700 text-2xl" />

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Cart
          </h2>

          <span className="text-gray-500 text-sm">
            ({cart.length} items)
          </span>

        </div>

        {/* EMPTY CART */}

        {cart.length === 0 && (

          <div className="text-center py-24">

            <FaShoppingCart className="mx-auto text-5xl text-gray-300 mb-4" />

            <p className="text-gray-500 text-lg">
              Your cart is empty
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600"
            >
              Continue Shopping
            </button>

          </div>

        )}

        {cart.length > 0 && (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}

            <div className="lg:col-span-2 space-y-6">

              {cart.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition border"
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />

                  <div className="flex-1 flex flex-col justify-between">

                    <div>

                      <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {item.name}
                      </h4>

                      <p className="text-green-700 font-semibold mt-1">
                        ₹ {item.price}
                      </p>

                      {/* QUANTITY */}

                      <div className="flex items-center gap-3 mt-4">

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded border hover:bg-green-100"
                        >
                          -
                        </button>

                        <span className="font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded border hover:bg-green-100"
                        >
                          +
                        </button>

                      </div>

                      <p className="mt-3 text-gray-600 dark:text-gray-300">
                        Subtotal: ₹ {item.price * item.quantity}
                      </p>

                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="flex items-center gap-2 text-red-500 text-sm hover:text-red-600 mt-3"
                    >
                      <FaTrash />
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* ORDER SUMMARY */}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-fit sticky top-24 border">

              <h3 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white">
                Order Summary
              </h3>

              <div className="flex justify-between text-gray-600 mb-2">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="flex justify-between text-gray-600 mb-4">
                <span>Subtotal</span>
                <span>₹ {totalPrice}</span>
              </div>

              <hr className="mb-4"/>

              <div className="flex justify-between font-bold text-lg mb-6">
                <span>Total</span>
                <span className="text-green-700">₹ {totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 rounded-lg bg-green-700 hover:bg-green-600 text-white font-semibold transition shadow-md"
              >
                Proceed to Checkout
              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};

export default Cart;