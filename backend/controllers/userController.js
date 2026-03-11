import { db } from "../config/firebase.js";

export const registerUser = async (req, res) => {
  try {
    const { uid, name, email, phone, address } = req.body;

    if (!uid || !email) {
      return res.status(400).json({ message: "User info missing" });
    }

    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      await userRef.set({
        name,
        email,
        phone,
        address,
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
    res.status(500).json({ message: "Registration failed" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const usersRef = db.collection("users");
    const snapshot = await usersRef.get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const users = [];

    snapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.json(users);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserProfile = async (req, res) => {
  try {

    const uid = req.user.uid; // from verifyToken middleware

    const userRef = db.collection("users").doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: doc.id,
      ...doc.data(),
    });

  } catch (error) {

    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });

  }
};