import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const Invoice = () => {

  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [order, setOrder] = useState(null);

  useEffect(() => {

    const fetchOrder = async () => {

      const res = await fetch(
        "API_BASE_URL/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      const current = data.find((o) => o.id === id);

      setOrder(current);

      alert("Invoice sent to your registered email");

    };

    fetchOrder();

  }, [id]);

  if (!order) return <p className="text-center mt-20">Loading invoice...</p>;

  const downloadInvoice = () => {

    window.open(
      `API_BASE_URL/api/invoice/${id}`,
      "_blank"
    );

  };

  return (

    <div className="max-w-3xl mx-auto p-6 pt-24 bg-white shadow">

      <h1 className="text-2xl font-bold mb-4 text-green-700">
        Verdura Organic Store
      </h1>

      <p className="mb-2">Order ID : {id}</p>

      <p className="mb-2">Phone : {order.phone}</p>

      <p className="mb-4">Address : {order.address}</p>

      <h2 className="font-bold mb-2">Products</h2>

      {order.items.map((item) => (

        <div key={item.productId} className="flex justify-between border-b py-2">

          <span>
            {item.name} × {item.quantity}
          </span>

          <span>
            ₹ {item.price * item.quantity}
          </span>

        </div>

      ))}

      <h3 className="text-lg font-bold mt-4">
        Total : ₹ {order.totalAmount}
      </h3>

      <button
        onClick={downloadInvoice}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Download Invoice
      </button>

    </div>

  );

};

export default Invoice;