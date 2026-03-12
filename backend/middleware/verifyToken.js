import admin from "../config/firebase.js";

export const verifyToken = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token" });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name || "",
    };

    next();

  } catch (err) {

    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });

  }
};