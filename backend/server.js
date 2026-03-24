import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { attachUser } from "./middleware/attachUser.js";
import { errorHandler, logger } from "./middleware/errorHandler.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://ecommerce-pi-nine-47.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

app.use(logger);

app.get("/", (req, res) => {
  res.json({
    message: "Ecommerce Backend API Running",
  });
});

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
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/invoice", invoiceRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});