import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api";
import {
  FaFileInvoice,
  FaDownload,
  FaArrowLeft,
  FaShoppingBag
} from "react-icons/fa";

const Invoice = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading invoice...
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Invoice not found
      </div>
    );

  const subtotal =
    order.items?.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    ) || 0;

  const discount = order.discount || 0;
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">

      <div className="max-w-4xl mx-auto space-y-4">

        {/* back */}
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-green-700 text-sm font-semibold"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* invoice card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">

          {/* header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <FaFileInvoice className="text-green-600" />
                Invoice
              </h1>
              <p className="text-gray-400 text-sm">#{id}</p>
            </div>

            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              <FaDownload className="inline mr-2" />
              Download
            </button>
          </div>

          {/* from / to */}
          <div className="grid grid-cols-2 gap-6 text-sm mb-6">

            <div>
              <p className="text-gray-400 font-semibold mb-1">
                From
              </p>

              <p className="font-bold">
                Verdura
              </p>

              <p className="text-gray-500">
                Organic Grocery Store
              </p>

              <p className="text-gray-500">
                Tamil Nadu, India
              </p>

              <p className="text-gray-500">
                support@verdura.com
              </p>
            </div>

            <div>
              <p className="text-gray-400 font-semibold mb-1">
                Bill To
              </p>

              <p className="font-bold">
                {order.name}
              </p>

              <p className="text-gray-500">
                {order.phone}
              </p>

              <p className="text-gray-500">
                {order.address}
              </p>

              <p className="text-gray-500">
                {order.email}
              </p>
            </div>

          </div>

          {/* table */}
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">Product</th>
                <th className="text-center">Unit</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Rate</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, i) => {

                const unitValue = parseInt(item.unit) || 1;
                const unitType =
                  item.unit?.replace(/[0-9]/g, "") || "g";

                const total =
                  item.price * item.quantity;

                return (
                  <tr key={i} className="border-b">

                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          className="w-10 h-10 rounded-lg"
                        />

                        <span className="font-medium">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="text-center">
                      {unitValue}{unitType}
                    </td>

                    <td className="text-center">
                      {item.quantity}
                    </td>

                    <td className="text-right">
                      ₹{item.price}
                    </td>

                    <td className="text-right font-semibold">
                      ₹{total}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-sm">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600">
                  Free
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between">
                  <span>
                    Discount ({order.promoCode})
                  </span>

                  <span className="text-green-600">
                    -₹{discount}
                  </span>
                </div>
              )}

              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-green-700">
                  ₹{total}
                </span>
              </div>

            </div>
          </div>

        </div>

        <button
          onClick={() => navigate("/products")}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <FaShoppingBag />
          Continue Shopping
        </button>

      </div>
    </div>
  );
};

export default Invoice;