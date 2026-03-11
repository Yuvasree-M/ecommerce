import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { attachUser } from "./middleware/attachUser.js";
import { errorHandler, logger } from "./middleware/errorHandler.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import contactRoutes from "./routes/contact.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(logger); // ✅ logger early

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/api/protected", verifyToken, attachUser, (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    role: req.user.role,
  });
});
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes); // contact route
// ✅ ERROR HANDLER MUST BE LAST
app.use("/api/invoice", invoiceRoutes);
app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});