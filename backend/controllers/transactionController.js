import { db } from "../config/firebase.js";

const getDate = (value) => {
  if (!value) return new Date(0);
  if (typeof value.toDate === "function") return value.toDate();
  return new Date(value);
};

// Get all transactions 
export const getAllTransactions = async (req, res) => {
  try {
    console.log("Admin fetching all transactions");

    const snapshot = await db.collection("transactions").get();

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    transactions.sort((a, b) => getDate(b.createdAt) - getDate(a.createdAt));

    res.json(transactions);
  } catch (err) {
    console.error("getAllTransactions error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get transactions for logged-in user

export const getUserTransactions = async (req, res) => {
  try {
    console.log("Fetching transactions for user:", req.user);

    const snapshot = await db
      .collection("transactions")
      .where("userId", "==", req.user.uid)
      .get();

    console.log("Transactions found:", snapshot.size);

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    transactions.sort((a, b) => getDate(b.createdAt) - getDate(a.createdAt));

    res.json(transactions);
  } catch (err) {
    console.error("getUserTransactions error:", err);
    res.status(500).json({ message: err.message });
  }
};