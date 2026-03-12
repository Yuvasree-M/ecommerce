
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import { FaFileInvoice, FaDownload } from "react-icons/fa";

const Invoice = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  /* ---------------- FETCH ORDER ---------------- */

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await apiFetch(`/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  /* ---------------- DOWNLOAD PDF ---------------- */

  const downloadInvoice = async () => {
    try {
      setDownloading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoice/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Invoice download failed");
      }

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
      alert("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  /* ---------------- LOADING UI ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-xl font-semibold text-green-700">
          Loading invoice...
        </p>
      </div>
    );
  }

  /* ---------------- ERROR UI ---------------- */

  if (!order) {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold">
        Invoice not found
      </div>
    );
  }

  /* ---------------- DATE FORMAT ---------------- */

  const date = order.createdAt
    ? new Date(
        order.createdAt.seconds
          ? order.createdAt.seconds * 1000
          : order.createdAt._seconds * 1000
      ).toLocaleDateString()
    : "N/A";

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-24">

      {/* HEADER */}

      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-green-700 flex items-center gap-2">
            <FaFileInvoice /> Verdura
          </h1>
          <p className="text-gray-500">Organic Grocery Store</p>
        </div>

        <button
          onClick={downloadInvoice}
          disabled={downloading}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <FaDownload />
          {downloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>

      {/* ORDER INFO */}

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Order Details</h3>

          <p>
            <span className="font-semibold">Order ID:</span> {order.id}
          </p>

          <p>
            <span className="font-semibold">Date:</span> {date}
          </p>

          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
              {order.status}
            </span>
          </p>
        </div>

        <div>
          <h3 className="font-semibold text-gray-700 mb-2">Delivery Info</h3>

          <p>
            <span className="font-semibold">Phone:</span> {order.phone}
          </p>

          <p>
            <span className="font-semibold">Address:</span> {order.address}
          </p>
        </div>
      </div>

      {/* ITEMS TABLE */}

      <div className="mt-8">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="text-left p-3">Product</th>
              <th className="text-center p-3">Qty</th>
              <th className="text-center p-3">Price</th>
              <th className="text-right p-3">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  {item.name}
                </td>

                <td className="text-center p-3">{item.quantity}</td>

                <td className="text-center p-3">₹ {item.price}</td>

                <td className="text-right p-3">
                  ₹ {item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TOTAL */}

      <div className="flex justify-end mt-6">
        <div className="text-right">
          <p className="text-lg font-semibold">
            Total: ₹ {order.totalAmount}
          </p>
        </div>
      </div>

      {/* FOOTER */}

      <div className="border-t mt-8 pt-4 text-center text-gray-500 text-sm">
        Thank you for shopping with Verdura 🌿
      </div>
    </div>
  );
};

export default Invoice;

