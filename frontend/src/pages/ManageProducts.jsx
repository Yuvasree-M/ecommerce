import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ManageProducts = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState({ name: "" });
  const [editingCatId, setEditingCatId] = useState(null);
  const [showDeleteCatModal, setShowDeleteCatModal] = useState(false);
  const [deleteCatId, setDeleteCatId] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch(`${API_BASE_URL}/api/products`);
    const data = await res.json();
    setProducts(data);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  /* ── FILTER ── */
  const filtered = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    if (imageFile) formData.append("image", imageFile);

    const url = editingId
      ? `${API_BASE_URL}/api/products/${editingId}`
      : `${API_BASE_URL}/api/products`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();

    setAlertMessage(data.message);
    setShowAlert(true);
    setForm({ name: "", price: "", description: "", category: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setIsModalOpen(false);
    fetchProducts();
  };

  const confirmDelete = (id) => { setDeleteId(id); setShowDeleteModal(true); };

  const handleDelete = async () => {
    const res = await fetch(`${API_BASE_URL}/api/products/${deleteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAlertMessage(data.message);
    setShowAlert(true);
    setShowDeleteModal(false);
    setDeleteId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category || "",
    });
    setImagePreview(product.image);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  /* ── CATEGORY CRUD ── */
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    const url = editingCatId
      ? `${API_BASE_URL}/api/categories/${editingCatId}`
      : `${API_BASE_URL}/api/categories`;
    const method = editingCatId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: catForm.name }),
    });
    const data = await res.json();
    setAlertMessage(data.message);
    setShowAlert(true);
    setCatForm({ name: "" });
    setEditingCatId(null);
    fetchCategories();
  };

  const handleCatEdit = (cat) => { setCatForm({ name: cat.name }); setEditingCatId(cat.id); };
  const confirmDeleteCat = (id) => { setDeleteCatId(id); setShowDeleteCatModal(true); };

  const handleDeleteCat = async () => {
    const res = await fetch(`${API_BASE_URL}/api/categories/${deleteCatId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAlertMessage(data.message);
    setShowAlert(true);
    setShowDeleteCatModal(false);
    setDeleteCatId(null);
    fetchCategories();
  };

  /* ── CATEGORY COLOR MAP ── */
  const catColors = [
    "bg-green-100 text-green-700 border-green-300",
    "bg-blue-100 text-blue-700 border-blue-300",
    "bg-purple-100 text-purple-700 border-purple-300",
    "bg-orange-100 text-orange-700 border-orange-300",
    "bg-pink-100 text-pink-700 border-pink-300",
    "bg-teal-100 text-teal-700 border-teal-300",
  ];
  const getCatColor = (name) => {
    const idx = categories.findIndex(c => c.name === name);
    return catColors[idx % catColors.length] || catColors[0];
  };

  const inputClass =
    "w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-700/60 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition placeholder:text-gray-400";

  return (
    <div className="max-w-7xl container mx-auto px-4 py-8 pt-24 relative">

      {/* ── PAGE HEADER ── */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-green-800 dark:text-gray-100">
          Product Management
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {products.length} products · {categories.length} categories
        </p>
      </div>

      {/* ── TOP-RIGHT BUTTONS ── */}
      <div className="fixed top-24 right-6 flex gap-3 z-50">
        <button
          onClick={() => setIsCatModalOpen(true)}
          className="flex items-center gap-2 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-gray-600 text-green-800 dark:text-gray-100 border border-green-300 dark:border-gray-500 px-4 py-2 rounded-full shadow-lg transition text-sm font-medium"
        >
          Manage Categories
        </button>
        <button
          onClick={() => {
            setForm({ name: "", price: "", description: "", category: "" });
            setImagePreview(null);
            setEditingId(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition text-sm font-medium"
        >
          + Add Product
        </button>
      </div>

      {/* ── CATEGORY FILTER BAR ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", ...categories.map(c => c.name)].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
              selectedCategory === cat
                ? "bg-green-700 text-white border-green-700 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-400 hover:text-green-700"
            }`}
          >
            {cat}
            <span className={`ml-1.5 text-xs font-semibold ${selectedCategory === cat ? "opacity-80" : "opacity-50"}`}>
              {cat === "All" ? products.length : products.filter(p => p.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID ── */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 border-2 border-green-400 rounded-2xl">
          <p className="text-lg font-medium">No products in this category</p>
          <p className="text-sm mt-1">Add a product to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-2 border-green-400 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800 group"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.category && (
                  <span className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full border ${getCatColor(product.category)}`}>
                    {product.category}
                  </span>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 truncate">
                  {product.name}
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="font-bold text-green-700 dark:text-green-400 text-lg mb-4">
                  ₹ {product.price}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 py-1.5 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(product.id)}
                    className="flex-1 py-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRODUCT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border-2 border-gray-100 dark:border-gray-700 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {editingId ? "Update Product" : "Create New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image upload */}
              <div>
                {imagePreview ? (
                  <div className="relative mb-2">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="h-44 w-full object-cover rounded-xl border-2 border-gray-100 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 w-7 h-7 bg-black/50 text-white rounded-full text-xs hover:bg-black/70 transition"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-green-400 transition bg-gray-50 dark:bg-gray-700/40">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Click to upload image</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
                {imagePreview && (
                  <label className="flex items-center gap-2 text-xs text-green-700 dark:text-green-400 cursor-pointer mt-1">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <span>Change image</span>
                  </label>
                )}
              </div>

              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <input
                name="price"
                type="number"
                placeholder="Price (₹)"
                value={form.price}
                onChange={handleChange}
                className={inputClass}
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className={inputClass}
                required
              />

              <div>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`${inputClass} ${!form.category ? "text-gray-400" : ""}`}
                  required
                >
                  <option value="" disabled>Select Category *</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    No categories yet.{" "}
                    <button
                      type="button"
                      onClick={() => { setIsModalOpen(false); setIsCatModalOpen(true); }}
                      className="underline font-medium"
                    >
                      Add one first
                    </button>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={categories.length === 0}
                className="w-full bg-green-700 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold transition"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── CATEGORY MANAGEMENT MODAL ── */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border-2 border-gray-100 dark:border-gray-700 flex flex-col max-h-[80vh] overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Manage Categories
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">{categories.length} categories total</p>
              </div>
              <button
                onClick={() => { setIsCatModalOpen(false); setCatForm({ name: "" }); setEditingCatId(null); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 border-b-2 border-gray-100 dark:border-gray-700">
              <form onSubmit={handleCatSubmit} className="flex gap-2">
                <input
                  placeholder="Category name"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ name: e.target.value })}
                  className={inputClass}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition"
                >
                  {editingCatId ? "Update" : "Add"}
                </button>
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => { setCatForm({ name: "" }); setEditingCatId(null); }}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-xl text-sm transition"
                  >
                    ✕
                  </button>
                )}
              </form>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4 space-y-2">
              {categories.length === 0 && (
                <div className="flex flex-col items-center py-10 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                  <p className="text-sm font-medium">No categories yet</p>
                  <p className="text-xs mt-1">Add one using the field above</p>
                </div>
              )}
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-xl px-4 py-3 border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${catColors[idx % catColors.length].split(" ")[0].replace("-100", "-400")}`} />
                    <span className="text-gray-800 dark:text-gray-100 font-medium text-sm">
                      {cat.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {products.filter(p => p.category === cat.name).length} products
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCatEdit(cat)}
                      className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700 rounded-lg hover:bg-yellow-100 transition text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDeleteCat(cat.id)}
                      className="px-3 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-100 transition text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE PRODUCT MODAL ── */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-2xl w-80 border-2 border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-200 dark:border-red-800">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2 dark:text-white">Delete Product?</h4>
            <p className="mb-5 text-gray-500 dark:text-gray-400 text-sm">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition text-sm font-medium border border-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CATEGORY MODAL ── */}
      {showDeleteCatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-2xl w-80 border-2 border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-red-200 dark:border-red-800">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2 dark:text-white">Delete Category?</h4>
            <p className="mb-5 text-gray-500 dark:text-gray-400 text-sm">
              Products in this category will become uncategorised.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteCatModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition text-sm font-medium border border-gray-200 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCat}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ALERT MODAL ── */}
      {showAlert && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[80]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-2xl w-80 border-2 border-gray-100 dark:border-gray-700">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-green-200 dark:border-green-800">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold mb-2 dark:text-white">Done!</h4>
            <p className="mb-5 text-gray-500 dark:text-gray-400 text-sm">{alertMessage}</p>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition text-sm font-medium"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;