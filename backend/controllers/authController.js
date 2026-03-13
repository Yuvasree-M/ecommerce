import { db } from "../config/firebase.js";

// Handles registration after token verification & attachUser
export const registerUser = async (req, res) => {
  try {
    const { uid, email, role } = req.user;
   const { phone = "", address = "", name = "" } = req.body; // ← read name from body
    const userRef = db.collection("users").doc(uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      await userRef.set({
        name,
        email,
        phone,
        address,
        role: role || "USER",
        createdAt: new Date(),
      });
    } else {
      // Doc was pre-created by attachUser — update the missing fields
      await userRef.update({name, phone, address });
    }

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};