import { db } from "../config/firebase.js";

// GET ALL TRANSACTIONS (ADMIN)
export const getTransactions = async (req, res) => {

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