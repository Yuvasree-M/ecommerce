// src/pages/Transaction.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../services/api.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transaction = () => {

  const { token, role } = useContext(AuthContext);

  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Fetch Users (Admin only) ---------------- */

  const fetchUsers = async () => {
    if (role !== "ADMIN") return;

    try {
      const data = await apiFetch("/api/users");
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    }
  };

  /* ---------------- Fetch Transactions ---------------- */

  const fetchTransactions = async () => {
    try {

      const endpoint =
        role === "ADMIN"
          ? "/api/transactions"
          : "/api/transactions/me";

      const data = await apiFetch(endpoint);

      setTransactions(data);

    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch transactions");
    }
  };

  /* ---------------- Load Data ---------------- */

  useEffect(() => {

    if (!token) return;

    setLoading(true);

    Promise.all([fetchUsers(), fetchTransactions()])
      .finally(() => setLoading(false));

  }, [token, role]);

  /* ---------------- Get Username ---------------- */

  const getUserName = (userId) => {

    const user = users.find((u) => u.id === userId);

    return user ? user.name : "Unknown";

  };

  /* ---------------- Badge Styles ---------------- */

  const getBadgeClasses = (type, isStatus = false) => {

    if (isStatus) {

      switch (type) {
        case "SUCCESS":
          return "bg-green-100 text-green-700 border border-green-200";
        case "FAILED":
          return "bg-red-100 text-red-700 border border-red-200";
        default:
          return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      }

    }

    return type === "COD"
      ? "bg-purple-100 text-purple-700 border border-purple-200"
      : "bg-indigo-100 text-indigo-700 border border-indigo-200";

  };

  /* ---------------- Loading ---------------- */

  if (loading) {

    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-xl font-semibold text-green-700">
          Loading transactions...
        </p>
      </div>
    );

  }

  /* ---------------- UI ---------------- */

  return (

    <div className="min-h-screen bg-[#f0f9e8] dark:bg-gray-900 p-6 pt-24 container mx-auto">

      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Transactions
      </h1>

      {transactions.length > 0 ? (

        <div className="overflow-x-auto">

          <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl shadow-md border">

            <thead className="bg-green-700 text-white">

              <tr>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Transaction ID
                </th>

                {role === "ADMIN" && (
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    User
                  </th>
                )}

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Order ID
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Payment Type
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {transactions.map((tx) => (

                <tr
                  key={tx.id}
                  className="border-b hover:bg-green-50 dark:hover:bg-green-900 transition"
                >

                  <td className="px-4 py-3 text-sm">{tx.id}</td>

                  {role === "ADMIN" && (
                    <td className="px-4 py-3 text-sm">
                      {getUserName(tx.userId)}
                    </td>
                  )}

                  <td className="px-4 py-3 text-sm">{tx.orderId}</td>

                  <td className="px-4 py-3 text-sm">

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(tx.transactionType)}`}
                    >
                      {tx.transactionType}
                    </span>

                  </td>

                  <td className="px-4 py-3 text-sm">

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getBadgeClasses(tx.transactionStatus, true)}`}
                    >
                      {tx.transactionStatus}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      ) : (

        <p className="text-center text-gray-500 mt-20">
          No transactions found
        </p>

      )}

    </div>

  );

};

export default Transaction;