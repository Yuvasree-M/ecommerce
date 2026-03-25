import { db } from "../config/firebase.js"; 

export const attachUser = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "User not found" });

    // FIX: req.body may be undefined
    const { phone = "", address = "" } = req.body || {};

    const userRef = db.collection("users").doc(req.user.uid);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      await userRef.set({
        name: req.user.name || req.body?.name || "",
        email: req.user.email,
        phone,
        address,
        role: "USER",
        createdAt: new Date(),
      });
    }

    const userData = docSnap.exists
      ? docSnap.data()
      : { role: "USER", name: req.user.name };

    req.user.role = userData.role || "USER";
    req.user.name = userData.name || req.user.name;

    next();
  } catch (err) {
    console.error("attachUser error:", err);
    res.status(500).json({ message: "Failed to attach user" });
  }
};