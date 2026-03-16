import { db } from "../config/firebase.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const snapshot = await db.collection("categories").get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const existing = await db.collection("categories").where("name", "==", name).get();
    if (!existing.empty) return res.status(409).json({ message: "Category already exists" });

    const ref = await db.collection("categories").add({
      name,
      createdAt: new Date(),
    });
    res.status(201).json({ message: "Category created", id: ref.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const doc = await db.collection("categories").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "Category not found" });

    await db.collection("categories").doc(req.params.id).update({ name });
    res.json({ message: "Category updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const doc = await db.collection("categories").doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: "Category not found" });

    await db.collection("categories").doc(req.params.id).delete();
    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};