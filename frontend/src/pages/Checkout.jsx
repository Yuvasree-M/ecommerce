import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {

  const { token } = useContext(AuthContext);
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
const API_BASE_URL = import.meta.env.VITE_API_URL;
  // Auto fill address + phone
  useEffect(() => {

    const fetchProfile = async () => {

      const res = await fetch(
        "API_BASE_URL/api/users/profile",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();

      setAddress(data.address || "");
      setPhone(data.phone || "");

    };

    if (token) fetchProfile();

  }, [token]);

  // Load Razorpay
  const loadRazorpayScript = () =>
    new Promise((resolve) => {

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);

      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });

  const handlePayment = async () => {

    if (!address.trim()) return alert("Enter delivery address");

    if (!/^[0-9]{10}$/.test(phone))
      return alert("Enter valid phone number");

    if (cart.length === 0) return alert("Cart is empty");

    setLoading(true);

    const orderData = {
      cartItems: cart.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
      })),
      address,
      phone
    };

    const loaded = await loadRazorpayScript();

    if (!loaded) {
      alert("Razorpay failed to load");
      setLoading(false);
      return;
    }

    try {

      const res = await fetch(
        "API_BASE_URL/api/payment/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: totalAmount }),
        }
      );

      const data = await res.json();

      const options = {

        key: data.key,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,

        name: "Verdura",
        description: "Order Payment",

        handler: async (response) => {

          const orderRes = await fetch(
            "API_BASE_URL/api/orders/place-order",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                ...orderData,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id
              })
            }
          );

          const order = await orderRes.json();

          await fetchCart();

          navigate(`/invoice/${order.orderId}`);

        },

        prefill: {
          contact: phone
        },

        theme: {
          color: "#16a34a"
        }
      };

      new window.Razorpay(options).open();

    } catch (err) {

      console.error(err);

      alert("Payment failed");

    }

    setLoading(false);
  };

  return (

    <div className="max-w-4xl mx-auto px-4 py-8 pt-24">

      <h2 className="text-3xl font-bold mb-6">
        Checkout - <span className="text-green-600">Verdura</span>
      </h2>

      {cart.map((item) => (

        <div key={item.id} className="flex gap-4 mb-4">

          <img
            src={item.image}
            className="w-20 h-20 object-cover"
          />

          <div>
            <p>{item.name}</p>
            <p>₹ {item.price} × {item.quantity}</p>
          </div>

        </div>

      ))}

      <h3 className="font-bold mb-4">
        Total : ₹ {totalAmount}
      </h3>

      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Delivery Address"
        className="w-full border p-2 mb-3"
      />

      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone Number"
        className="w-full border p-2 mb-3"
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-green-600 text-white px-6 py-3 rounded w-full"
      >

        {loading ? "Processing Payment..." : "Confirm Order"}

      </button>

    </div>

  );

};

export default Checkout;