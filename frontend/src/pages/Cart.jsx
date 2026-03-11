import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

const Cart = () => {
  const { token } = useContext(AuthContext);
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleRemove = async (id) => {
    await fetch(`http://localhost:5000/api/cart/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    await fetch(`http://localhost:5000/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId: id, quantity }),
    });
    fetchCart();
  };

  const handleCheckout = () => {
    if (!token) return alert("Login to checkout");
    navigate("/checkout");
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#f0f9e8] dark:bg-gray-900 p-6 transition-colors container mx-auto pt-24">
      <h2 className="text-3xl font-bold mb-8 text-green-900 dark:text-gray-100">
        My Cart
      </h2>

      {cart.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-16">
          Your cart is empty.
        </p>
      )}

      {cart.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col sm:flex-row gap-6 border border-gray-200 dark:border-gray-700"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-xl shadow-sm"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {item.name}
                    </h4>

                    <p className="text-green-700 dark:text-green-500 font-medium mt-1">
                      ₹ {item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-600 transition text-green-700 dark:text-green-300 font-semibold"
                      >
                        −
                      </button>

                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-green-100 dark:hover:bg-green-600 transition text-green-700 dark:text-green-300 font-semibold"
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
                    className="mt-3 text-sm text-red-500 hover:text-red-600 transition self-start"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-fit sticky top-24 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Order Summary
            </h3>

            <div className="flex justify-between mb-3 text-gray-700 dark:text-gray-300">
              <span>Total Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="flex justify-between mb-6 text-lg font-bold text-gray-900 dark:text-gray-100">
              <span>Total Price</span>
              <span>₹ {totalPrice}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-[200px] py-3 rounded-xl bg-green-700 mx-auto flex justify-center hover:bg-green-600 text-white font-semibold shadow-md hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;