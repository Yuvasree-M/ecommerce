import { db } from "../config/firebase.js";

// Handles registration after token verification & attachUser
export const registerUser = async (req, res) => {
  try {
    const { uid, name, email, role } = req.user;
    const { phone = "", address = "" } = req.body;

    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        name,
        email,
        phone,
        address,
        role: role || "USER",
        createdAt: new Date(),
      });
      console.log("User created:", uid);
    }

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};