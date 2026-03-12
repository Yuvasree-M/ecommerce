import { db } from "../config/firebase.js";

// GET ALL TRANSACTIONS (ADMIN)
export const getAllTransactions = async (req, res) => {
  try {
    const snapshot = await db
      .collection("transactions")
      .orderBy("createdAt", "desc")
      .get();

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

// GET USER-SPECIFIC TRANSACTIONS
export const getUserTransactions = async (req, res) => {
  try {
    const userId = req.user.uid;

    const snapshot = await db
      .collection("transactions")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const transactions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch your transactions" });
  }
};