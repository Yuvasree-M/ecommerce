import { db } from "../config/firebase.js";

export const registerUser = async (req, res) => {
  try {
    const { uid, name, email } = req.user;
    const { phone } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "User info missing" });
    }

    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        name: name || "",
        email,
        phone: phone || "",
        role: "USER",
        createdAt: new Date(),
      });
      console.log("User created in Firestore:", uid);
    } else {
      console.log("User already exists:", uid);
    }

    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Firestore error:", error);
    res.status(500).json({ message: "Auth failed" });
  }
};