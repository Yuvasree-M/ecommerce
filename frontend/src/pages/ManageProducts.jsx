import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const ManageProducts = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch("API_BASE_URL/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("description", form.description);

    if (imageFile) formData.append("image", imageFile);

    const url = editingId
      ? `API_BASE_URL/api/products/${editingId}`
      : "API_BASE_URL/api/products";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await res.json();

    setAlertMessage(data.message);
    setShowAlert(true);

    setForm({ name: "", price: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setIsModalOpen(false);

    fetchProducts();
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const res = await fetch(`API_BASE_URL/api/products/${deleteId}`, {
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
    });

    setImagePreview(product.image);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl container mx-auto px-4 py-8 pt-24 relative">
      <h2 className="text-3xl font-bold mb-6 text-green-800 dark:text-gray-100">
        Product Management
      </h2>

      {/* Add Product Button */}
      <button
        onClick={() => {
          setForm({ name: "", price: "", description: "" });
          setImagePreview(null);
          setEditingId(null);
          setIsModalOpen(true);
        }}
        className="fixed top-24 right-6 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition z-50"
      >
        Add Product
      </button>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-4 hover:shadow-lg transition border border-gray-200 dark:border-gray-700"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-40 w-full object-cover rounded mb-3"
            />

            <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {product.name}
            </h4>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
              {product.description}
            </p>

            <p className="font-bold mb-3 text-green-700 dark:text-green-500">
              ₹ {product.price}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(product)}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => confirmDelete(product.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white dark:bg-gray-800 w-[500px] max-w-md rounded-2xl shadow-xl p-6 relative border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 text-2xl"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-100">
              {editingId ? "Update Product" : "Create New Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* IMAGE PREVIEW */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-40 w-full object-cover rounded mb-3"
                />
              )}
              <input
                name="name"
                placeholder="Product Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
                required
              />
   

            

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
                required
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
                required
              />

           <input type="file" accept="image/*" onChange={handleImageChange} />
              <button
                type="submit"
                className="block mx-auto bg-green-700 hover:bg-green-600 text-white px-5 py-2 rounded-lg"
              >
                {editingId ? "Update Product" : "Create Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[60]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-xl">
            <h4 className="text-lg font-semibold mb-3 dark:text-white">
              Confirm Delete
            </h4>

            <p className="mb-5 text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this product?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT MODAL */}
      {showAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[70]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl text-center shadow-xl">
            <h4 className="text-lg font-semibold mb-3 dark:text-white">
              Notification
            </h4>

            <p className="mb-5 text-gray-600 dark:text-gray-300">
              {alertMessage}
            </p>

            <button
              onClick={() => setShowAlert(false)}
              className="bg-green-700 text-white px-4 py-2 rounded"
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