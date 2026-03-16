import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { apiFetch } from "../services/api";
import {
  FaEnvelope, FaShieldAlt, FaShoppingBag,
  FaArrowLeft, FaPhone, FaMapMarkerAlt,
  FaLock, FaEdit, FaTimes, FaCheck, FaEye, FaEyeSlash
} from "react-icons/fa";

/* ------------------------------------------------
   EDIT MODAL
------------------------------------------------ */
const EditModal = ({ field, currentValue, onClose, onSave }) => {
  const [value, setValue] = useState(currentValue || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isPassword = field === "password";

  const handleSave = async () => {
    setError("");

    if (isPassword) {
      if (!currentPassword) return setError("Enter your current password");
      if (newPassword.length < 6) return setError("New password must be at least 6 characters");
      if (newPassword !== confirmPassword) return setError("Passwords do not match");
    } else {
      if (field === "phone" && !/^\d{10}$/.test(value))
        return setError("Phone must be exactly 10 digits");
      if (field === "address" && !value.trim())
        return setError("Address cannot be empty");
    }

    setLoading(true);
    try {
      await onSave(isPassword ? { currentPassword, newPassword } : value);
      onClose();
    } catch (err) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    phone: "Phone Number",
    address: "Delivery Address",
    password: "Password",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-gray-900">
            Update {labels[field]}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {isPassword ? (
            <>
              {/* Current Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                  Current Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                  <FaLock className="text-green-500 mr-2" size={13} />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full outline-none bg-transparent text-sm"
                  />
                  <span
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="cursor-pointer text-gray-400 ml-2"
                  >
                    {showCurrent ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </span>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                  New Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                  <FaLock className="text-green-500 mr-2" size={13} />
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full outline-none bg-transparent text-sm"
                  />
                  <span
                    onClick={() => setShowNew(!showNew)}
                    className="cursor-pointer text-gray-400 ml-2"
                  >
                    {showNew ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </span>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                  Confirm New Password
                </label>
                <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                  <FaLock className="text-green-500 mr-2" size={13} />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full outline-none bg-transparent text-sm"
                  />
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="cursor-pointer text-gray-400 ml-2"
                  >
                    {showConfirm ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">
                {labels[field]}
              </label>
              <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50">
                {field === "phone"
                  ? <FaPhone className="text-green-500 mr-2" size={13} />
                  : <FaMapMarkerAlt className="text-green-500 mr-2" size={13} />
                }
                {field === "address" ? (
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Enter your address"
                    rows={2}
                    className="w-full outline-none bg-transparent text-sm resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="10-digit phone number"
                    className="w-full outline-none bg-transparent text-sm"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs mt-3 bg-red-50 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-green-700 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? "Saving..." : (
              <>
                <FaCheck size={12} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------
   PROFILE PAGE
------------------------------------------------ */
const Profile = () => {
  const { user, setUser, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editField, setEditField] = useState(null); // "phone" | "address" | "password"
  const [successMsg, setSuccessMsg] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f9e8]">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Please login to view your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const isAdmin = role === "ADMIN";



  const handleSave = async (field, value) => {
    if (field === "password") {
      const { currentPassword, newPassword } = value;

      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);


      await updatePassword(auth.currentUser, newPassword);

    } else {

      await apiFetch("/api/users/profile", {
        method: "PUT",
        body: JSON.stringify({ [field]: value }),
      });

      setUser(prev => ({ ...prev, [field]: value }));
    }

    setSuccessMsg(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };


  const InfoRow = ({ icon, label, value, field }) => (
    <div className="flex items-center justify-between bg-green-50 rounded-2xl p-4 border border-green-100">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className="text-gray-800 font-bold text-sm truncate">
            {value || <span className="text-gray-400 font-normal">Not set</span>}
          </p>
        </div>
      </div>
      {field && (
        <button
          onClick={() => setEditField(field)}
          className="ml-3 flex-shrink-0 flex items-center gap-1.5 text-xs text-green-700 bg-white border border-green-200 px-3 py-1.5 rounded-xl hover:bg-green-100 transition font-semibold"
        >
          <FaEdit size={10} />
          Edit
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f9e8] pt-24 pb-12 px-4">

      <div className="max-w-2xl mx-auto mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-700 hover:text-green-500 font-semibold transition text-sm"
        >
          <FaArrowLeft size={12} />
          Go Back
        </button>
      </div>

      {successMsg && (
        <div className="max-w-2xl mx-auto mb-4">
          <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
            <FaCheck size={12} />
            {successMsg}
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

        
          <div className="relative h-32 bg-gradient-to-br from-green-700 via-green-600 to-emerald-500">
            <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
            <div className="absolute top-4 right-16 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute -bottom-2 left-10 w-10 h-10 rounded-full bg-white/10" />
            <div className="absolute top-4 left-6 opacity-20">
            </div>
            <div className="absolute top-4 right-6">
              <span className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold
                ${isAdmin ? "bg-amber-400 text-amber-900" : "bg-white/20 text-white border border-white/30"}
              `}>
                <FaShieldAlt size={10} />
                {role}
              </span>
            </div>
          </div>

          <div className="px-6 pb-8">

            <div className="flex justify-between items-end -mt-12 mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-white text-3xl font-black tracking-tight">
                    {initials}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
              </div>

              <div className="flex gap-2 mb-1">
                <button
                  onClick={() => navigate("/orders")}
                  className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-green-100 transition"
                >
                  <FaShoppingBag size={12} />
                  My Orders
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
                {user.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <FaEnvelope size={12} />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mb-6" />

 
            <div className="space-y-3">
              <InfoRow
                icon={<FaEnvelope className="text-green-600" size={13} />}
                label="Email Address"
                value={user.email}
                field={null}
              />
              <InfoRow
                icon={<FaPhone className="text-green-600" size={13} />}
                label="Phone Number"
                value={user.phone}
                field="phone"
              />
              <InfoRow
                icon={<FaMapMarkerAlt className="text-green-600" size={13} />}
                label="Delivery Address"
                value={user.address}
                field="address"
              />
              <InfoRow
                icon={<FaLock className="text-green-600" size={13} />}
                label="Password"
                value="••••••••"
                field="password"
              />
            </div>
            {isAdmin && (
              <>
                <div className="border-t border-gray-100 my-6" />
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FaShieldAlt className="text-amber-600" size={14} />
                    <p className="text-amber-700 font-bold text-sm">Admin Access</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/admin/dashboard")}
                      className="flex-1 bg-amber-400 hover:bg-amber-500 text-amber-900 font-bold text-sm py-2 rounded-xl transition"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/admin/all-orders")}
                      className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm py-2 rounded-xl transition border border-amber-300"
                    >
                      All Orders
                    </button>
                    <button
                      onClick={() => navigate("/admin/manage-products")}
                      className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-sm py-2 rounded-xl transition border border-amber-300"
                    >
                      Products
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          Verdura Organic Store &mdash; Member Account
        </p>
      </div>

      {editField && (
        <EditModal
          field={editField}
          currentValue={editField === "phone" ? user.phone : editField === "address" ? user.address : ""}
          onClose={() => setEditField(null)}
          onSave={(value) => handleSave(editField, value)}
        />
      )}
    </div>
  );
};

export default Profile;