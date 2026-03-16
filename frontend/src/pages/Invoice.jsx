import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import {
  FaFileInvoice,
  FaDownload,
  FaArrowLeft,
  FaShoppingBag,
  FaTimes,
} from "react-icons/fa";

const Invoice = () => {

  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [downloading, setDownloading] = useState(false);

  /* ---------------- FETCH ORDER ---------------- */

  useEffect(() => {

    if (order) return;

    const fetchOrder = async () => {

      try {

        const data = await apiFetch(`/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrder(data);

      } catch (err) {

        console.error("Order fetch failed", err);

      } finally {

        setLoading(false);

      }

    };

    if (token) fetchOrder();

  }, [id, token, order]);

  /* ---------------- DOWNLOAD PDF ---------------- */

  const downloadInvoice = async () => {

    try {

      setDownloading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/invoice/${id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Download failed");

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
      alert("Invoice download failed");

    } finally {

      setDownloading(false);

    }

  };

  /* ---------------- LOADING ---------------- */

  if (loading) {

    return (

      <div className="flex justify-center items-center h-[70vh] text-xl font-semibold text-green-600">
        Loading Invoice...
      </div>

    );

  }

  if (!order) {

    return (

      <div className="text-center mt-20 text-red-600 font-semibold">
        Invoice not found
      </div>

    );

  }

  /* ---------------- UI ---------------- */

  return (

    <div className="max-w-4xl mx-auto px-4 mt-24 mb-16">

      {/* BACK BUTTON */}

      <button
        onClick={() => navigate("/products")}
        className="flex items-center gap-2 text-green-700 hover:text-green-500 font-semibold mb-6"
      >
        <FaArrowLeft />
        Back to Products
      </button>

      {/* INVOICE CARD */}

      <div className="bg-white shadow-xl rounded-xl p-8">

        {/* HEADER */}

        <div className="flex justify-between items-center border-b pb-4">

          <div>

            <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
              <FaFileInvoice /> Verdura Invoice
            </h1>

            <p className="text-gray-500 text-sm">
              Organic Grocery Store
            </p>

          </div>

          <button
            onClick={downloadInvoice}
            disabled={downloading}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FaDownload />
            {downloading ? "Downloading..." : "Download PDF"}
          </button>

        </div>

        {/* ORDER DETAILS */}

        <div className="grid md:grid-cols-2 gap-6 mt-6 text-gray-700">

          <div>

            <h3 className="font-semibold mb-2 text-gray-900">
              Order Details
            </h3>

            <p><strong>Order ID:</strong> {id}</p>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Email:</strong> {order.email}</p>

          </div>

          <div>

            <h3 className="font-semibold mb-2 text-gray-900">
              Delivery Info
            </h3>

            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Address:</strong> {order.address}</p>

          </div>

        </div>

        {/* ITEMS */}

        <div className="mt-8">

          <h3 className="font-semibold mb-4 text-gray-900">
            Order Items
          </h3>

          <div className="space-y-3">

            {order?.items?.length > 0 ? (

              order.items.map((item, i) => (

                <div
                  key={i}
                  className="flex justify-between items-center border rounded-lg p-3"
                >

                  <div className="flex items-center gap-3">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />

                    <div>

                      <p className="font-semibold">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ₹ {item.price} × {item.quantity}
                      </p>

                    </div>

                  </div>

                  <p className="font-semibold">
                    ₹ {item.price * item.quantity}
                  </p>

                </div>

              ))

            ) : (

              <p className="text-gray-500 text-center">
                No items found
              </p>

            )}

          </div>

        </div>

        {/* TOTAL */}

        <div className="flex justify-end mt-8">

          <div className="bg-green-600 text-white px-6 py-3 rounded-lg">

            <p className="text-lg font-bold">
              Total: ₹ {order.totalAmount}
            </p>

          </div>

        </div>

        {/* ACTION BUTTONS */}

        <div className="flex justify-between mt-10">

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <FaTimes />
            Close
          </button>

          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
          >
            <FaShoppingBag />
            Continue Shopping
          </button>

        </div>

      </div>

    </div>

  );

};

export default Invoice;