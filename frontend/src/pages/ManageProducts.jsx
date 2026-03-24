import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ManageProducts = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "", category: "", quantity: "" });
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

  const filtered = selectedCategory === "All"
    ? products
    : products.filter(p => p.category === selectedCategory);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    formData.append("quantity", form.quantity);
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
    setForm({ name: "", price: "", description: "", category: "", quantity: "" });
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
      quantity: product.quantity || "",
    });
    setImagePreview(product.image);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

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

  const catColors = [
    { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
    { badge: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-400" },
    { badge: "bg-violet-100 text-violet-700 border-violet-200", dot: "bg-violet-400" },
    { badge: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-400" },
    { badge: "bg-rose-100 text-rose-700 border-rose-200", dot: "bg-rose-400" },
    { badge: "bg-cyan-100 text-cyan-700 border-cyan-200", dot: "bg-cyan-400" },
  ];

  const getCatStyle = (name) => {
    const idx = categories.findIndex(c => c.name === name);
    return catColors[idx % catColors.length] || catColors[0];
  };

  const inputClass =
    "w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-gray-700/60 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition placeholder:text-gray-400";

  const labelClass = "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5";

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10 pt-24">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
              <h2 className="text-3xl font-bold text-green-800">
              Product Management
            </h2>
          <p className="text-gray-400 text-sm mt-1">
              {products.length} products · {categories.length} categories
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-xl shadow-sm transition text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </button>
            <button
              onClick={() => {
                setForm({ name: "", price: "", description: "", category: "", quantity: "" });
                setImagePreview(null);
                setEditingId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl shadow-sm transition text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {["All", ...categories.map(c => c.name)].map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-all border ${
                  isActive
                    ? "bg-green-600 text-white border-green-600 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-green-400 hover:text-green-700 dark:hover:text-green-400"
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-md ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {cat === "All" ? products.length : products.filter(p => p.category === cat).length}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-600 dark:text-gray-300">No products here</p>
            <p className="text-sm mt-1">Add a product to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((product) => {
              const catStyle = product.category ? getCatStyle(product.category) : null;
              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700 group flex flex-col"
                >
                  <div className="relative overflow-hidden h-44 bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.category && (
                      <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${catStyle.badge}`}>
                        {product.category}
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1 truncate">
                      {product.name}
                    </h4>
                    <p className="text-gray-400 dark:text-gray-500 text-xs mb-4 line-clamp-2 flex-1">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="font-bold text-green-600 dark:text-green-400 text-lg leading-none">
                        ₹{product.price}
                      </p>
                      {product.quantity ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-2.5 py-1 rounded-lg">
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          {product.quantity}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-gray-600 italic">—</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition text-xs font-semibold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(product.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/50 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition text-xs font-semibold"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[90vh]">

              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                    {editingId ? "Update Product" : "New Product"}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {editingId ? "Edit the details below" : "Fill in the product details"}
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">

              
                <div>
                  <label className={labelClass}>Product Image</label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="preview"
                        className="h-40 w-full object-cover rounded-xl border border-gray-200 dark:border-gray-600"
                      />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/25 rounded-xl transition flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                        <label className="cursor-pointer bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg shadow hover:bg-gray-50 transition">
                          Change
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                        <button
                          type="button"
                          onClick={() => { setImageFile(null); setImagePreview(null); }}
                          className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition bg-gray-50 dark:bg-gray-700/30 group">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-2 group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-gray-500 group-hover:text-green-600 transition">Click to upload image</span>
                      <span className="text-xs text-gray-400 mt-0.5">PNG, JPG, WEBP</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Product Name</label>
                  <input
                    name="name"
                    placeholder="e.g. Organic Turmeric Powder"
                    value={form.name}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                </div>

     
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Price (₹)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Quantity</label>
                    <input
                      name="quantity"
                      placeholder="e.g. 100 grams"
                      value={form.quantity}
                      onChange={handleChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the product..."
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={`${inputClass} ${!form.category ? "text-gray-400" : ""}`}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      No categories yet.{" "}
                      <button type="button" onClick={() => { setIsModalOpen(false); setIsCatModalOpen(true); }} className="underline font-semibold">
                        Add one first
                      </button>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={categories.length === 0}
                  className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm transition"
                >
                  {editingId ? "Update Product" : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        )}

        {isCatModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col max-h-[80vh]">

              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Manage Categories</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{categories.length} categories total</p>
                </div>
                <button
                  onClick={() => { setIsCatModalOpen(false); setCatForm({ name: "" }); setEditingCatId(null); }}
                  className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition"
                >
                  ✕
                </button>
              </div>

              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
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
                    className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl whitespace-nowrap text-sm font-semibold transition"
                  >
                    {editingCatId ? "Update" : "Add"}
                  </button>
                  {editingCatId && (
                    <button
                      type="button"
                      onClick={() => { setCatForm({ name: "" }); setEditingCatId(null); }}
                      className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-500 px-3 py-2 rounded-xl text-sm transition"
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
                {categories.map((cat, idx) => {
                  const style = catColors[idx % catColors.length];
                  const count = products.filter(p => p.category === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/40 hover:border-gray-200 dark:hover:border-gray-500 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${style.dot}`} />
                        <span className="text-gray-800 dark:text-gray-100 font-medium text-sm truncate">
                          {cat.name}
                        </span>
                        <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-lg border ${style.badge}`}>
                          {count} {count === 1 ? "item" : "items"}
                        </span>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0 ml-2">
                        <button
                          onClick={() => handleCatEdit(cat)}
                          className="p-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50 rounded-lg hover:bg-amber-100 transition"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => confirmDeleteCat(cat.id)}
                          className="p-1.5 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border border-red-200 dark:border-red-700/50 rounded-lg hover:bg-red-100 transition"
                          title="Delete"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] px-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h4 className="text-base font-bold mb-1 dark:text-white">Delete Product?</h4>
              <p className="mb-6 text-gray-400 text-sm">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {showDeleteCatModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] px-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h4 className="text-base font-bold mb-1 dark:text-white">Delete Category?</h4>
              <p className="mb-6 text-gray-400 text-sm">Products in this category will become uncategorised.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteCatModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 transition text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCat}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition text-sm font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        {showAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[80] px-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-2xl w-full max-w-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-base font-bold mb-1 dark:text-white">Done!</h4>
              <p className="mb-6 text-gray-400 text-sm">{alertMessage}</p>
              <button
                onClick={() => setShowAlert(false)}
                className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2.5 rounded-xl transition text-sm font-semibold"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;