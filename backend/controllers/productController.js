import productCollection from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";

// Create Product (ADMIN only)
export const createProduct = async (req, res) => {
  try {
    const { name, price, description } = req.body;

    let imageUrl = "";

    // If image exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const newProduct = await productCollection.add({
      name,
      price,
      description,
      image: imageUrl,
      createdAt: new Date(),
    });

    res.status(201).json({
      message: "Product created successfully",
      id: newProduct.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
};

// Get All Products (PUBLIC)
export const getAllProducts = async (req, res) => {
  try {
    const snapshot = await productCollection.get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    let updatedData = { name, price, description };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedData.image = result.secure_url;
    }

    await productCollection.doc(id).update(updatedData);

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await productCollection.doc(id).delete();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await productCollection.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      id: doc.id,
      ...doc.data(),
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};