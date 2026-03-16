// import { db } from "../config/firebase.js";
// import cloudinary from "../config/cloudinary.js";

// // Create Product (ADMIN)
// export const createProduct = async (req, res) => {
//   try {
//     const { name, price, description } = req.body;
//     let imageUrl = "";

//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       imageUrl = result.secure_url;
//     }

//     const productRef = await db.collection("products").add({
//       name,
//       price,
//       description,
//       image: imageUrl,
//       createdAt: new Date(),
//     });

//     res.status(201).json({
//       message: "Product created successfully",
//       id: productRef.id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error creating product" });
//   }
// };

// // Get all products (public)
// export const getAllProducts = async (req, res) => {
//   try {
//     const snapshot = await db.collection("products").get();
//     const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//     res.json(products);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching products" });
//   }
// };

// // Get product by ID
// export const getProductById = async (req, res) => {
//   try {
//     const doc = await db.collection("products").doc(req.params.id).get();
//     if (!doc.exists) return res.status(404).json({ message: "Product not found" });
//     res.json({ id: doc.id, ...doc.data() });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error fetching product" });
//   }
// };

// // Update product
// export const updateProduct = async (req, res) => {
//   try {
//     const { name, price, description } = req.body;
//     const updatedData = { name, price, description };

//     if (req.file) {
//       const result = await cloudinary.uploader.upload(req.file.path);
//       updatedData.image = result.secure_url;
//     }

//     await db.collection("products").doc(req.params.id).update(updatedData);
//     res.json({ message: "Product updated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

// // Delete product
// export const deleteProduct = async (req, res) => {
//   try {
//     await db.collection("products").doc(req.params.id).delete();
//     res.json({ message: "Product deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };

import { db } from "../config/firebase.js";
import cloudinary from "../config/cloudinary.js";

// Create Product (ADMIN)
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body; // ← add category

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const productRef = await db.collection("products").add({
      name,
      price,
      description,
      image: imageUrl,
      category: category || "",
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Product created successfully",
      id: productRef.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Get all products (public)
export const getAllProducts = async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const doc = await db.collection("products").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "Product not found" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching product" });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body; // ← add category

    const updatedData = { name, price, description, category: category || "" };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedData.image = result.secure_url;
    }

    await db.collection("products").doc(req.params.id).update(updatedData);
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    await db.collection("products").doc(req.params.id).delete();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};