import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import { FaFileInvoice, FaDownload, FaArrowLeft } from "react-icons/fa";

const Invoice = () => {

  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {

    if (order) return;

    const fetchOrder = async () => {

      try {

        const data = await apiFetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setOrder(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

    if (token) fetchOrder();

  }, [id, token, order]);

  const downloadInvoice = async () => {

    try {

      setDownloading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoice/${id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` }
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

      console.error(err);
      alert("Download failed");

    } finally {

      setDownloading(false);

    }

  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        Loading invoice...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center mt-20 text-red-600">
        Invoice not found
      </div>
    );
  }

  return (

    <div className="max-w-4xl mx-auto mt-24">

      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 mb-6 text-green-600"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-8">

        <div className="flex justify-between items-center border-b pb-4">

          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FaFileInvoice /> Verdura Invoice
          </h1>

          <button
            onClick={downloadInvoice}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            <FaDownload /> {downloading ? "Downloading..." : "Download"}
          </button>

        </div>

        <div className="mt-6">

          <p><strong>Order ID:</strong> {id}</p>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Address:</strong> {order.address}</p>

        </div>

        <div className="mt-6">

          {order.items.map((item, i) => (

            <div key={i} className="flex justify-between border-b py-2">

              <span>{item.name} x {item.quantity}</span>

              <span>₹ {item.price * item.quantity}</span>

            </div>

          ))}

        </div>

        <div className="text-right mt-6 font-bold text-lg">

          Total: ₹ {order.totalAmount}

        </div>

      </div>

    </div>

  );

};

export default Invoice;