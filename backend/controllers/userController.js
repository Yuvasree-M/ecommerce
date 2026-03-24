import { db } from "../config/firebase.js";


// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const docSnap = await db.collection("users").doc(uid).get();
    if (!docSnap.exists) return res.status(404).json({ message: "User not found" });
    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update phone or address
export const updateUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { phone, address } = req.body;

    const updates = {};
    if (phone !== undefined) {
      if (!/^\d{10}$/.test(phone))
        return res.status(400).json({ message: "Phone must be exactly 10 digits" });
      updates.phone = phone;
    }
    if (address !== undefined) {
      if (!address.trim())
        return res.status(400).json({ message: "Address cannot be empty" });
      updates.address = address.trim();
    }

    if (Object.keys(updates).length === 0)
      return res.status(400).json({ message: "No valid fields to update" });

    await db.collection("users").doc(uid).update(updates);

    res.json({ message: "Profile updated successfully", ...updates });
  } catch (err) {
    console.error("updateUserProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};