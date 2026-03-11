import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const Transaction = () => {
  const { token } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("API_BASE_URL/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch users");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch("API_BASE_URL/api/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch transactions");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchTransactions();
    }
  }, [token]);

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : userId;
  };

  return (
    <div className="min-h-screen bg-[#f0f9e8] dark:bg-gray-900 p-6 pt-24 container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        All Transactions
      </h1>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-300 dark:border-gray-700">
            <thead className="bg-green-700 dark:bg-green-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold border-r border-green-600">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-r border-green-600">
                  User
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-r border-green-600">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold border-r border-green-600">
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
                  className="border-b border-gray-300 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {tx.id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {getUserName(tx.userId)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {tx.orderId}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.transactionType === "COD"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200 border border-purple-200 dark:border-purple-700"
                          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-700"
                      }`}
                    >
                      {tx.transactionType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tx.transactionStatus === "SUCCESS"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200 border border-green-200 dark:border-green-700"
                          : tx.transactionStatus === "FAILED"
                          ? "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200 border border-red-200 dark:border-red-700"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700"
                      }`}
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
        <p className="text-gray-500 dark:text-gray-400 text-center mt-16">
          No transactions available.
        </p>
      )}
    </div>
  );
};

export default Transaction;