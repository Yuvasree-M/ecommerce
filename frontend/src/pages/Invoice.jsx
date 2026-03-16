import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import { FaFileInvoice, FaDownload, FaArrowLeft } from "react-icons/fa";

const Invoice = () => {
  const { id } = useParams();
  const location = useLocation();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (order) return;

    const fetchOrder = async () => {
      try {
        const data = await apiFetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (err) {
        console.error("Invoice fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrder();
  }, [id, token]);

  const downloadInvoice = async () => {
    try {
      setDownloading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoice/${id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${id}.pdf`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Invoice download error:", err);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-xl font-semibold text-green-700">
          Loading invoice...
        </p>
      </div>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto px-4 mt-24 mb-12">

      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-green-700 mb-6"
      >
        <FaArrowLeft /> Back to Products
      </button>

      <div className="bg-white shadow-lg rounded-xl p-8">

        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
            <FaFileInvoice /> Verdura
          </h1>

          <button
            onClick={downloadInvoice}
            disabled={downloading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            <FaDownload />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>Date:</b> {date}</p>
            <p><b>Status:</b> {order.status}</p>
          </div>

          <div>
            <p><b>Name:</b> {order.name}</p>
            <p><b>Email:</b> {order.email}</p>
            <p><b>Phone:</b> {order.phone}</p>
            <p><b>Address:</b> {order.address}</p>
          </div>
        </div>

        <div className="mt-8">
          {order.items.map((item) => (
            <div key={item.productId} className="flex justify-between border-b py-2">
              <span>{item.name} × {item.quantity}</span>
              <span>₹ {item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <div className="bg-green-600 text-white px-6 py-3 rounded">
            Total: ₹ {order.totalAmount}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Invoice;