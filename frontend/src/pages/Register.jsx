import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaPhone, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaMapMarkerAlt } from "react-icons/fa";
import { apiFetch } from "../services/api";

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!name.trim() || name.trim().length < 2) newErrors.name = "Enter a valid name (min 2 chars)";
    if (!/^\d{10}$/.test(phone)) newErrors.phone = "Phone must be exactly 10 digits";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (confirmPassword !== password) newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const token = await userCredential.user.getIdToken();

      await apiFetch("/api/users/register", {
        method: "POST",
        body: JSON.stringify({ uid, name, email, phone, address }),
        headers: { Authorization: `Bearer ${token}` },
      });

      await signOut(auth);
      setSuccess("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error(error.code);
      if (error.code === "auth/email-already-in-use") setShowLoginModal(true);
      else setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f9e8] px-4">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center">Create Account</h2>

        {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm">{success}</div>}
        {errors.general && <div className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm">{errors.general}</div>}

        {/* Name */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaUser className="text-green-600 mr-2" />
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full outline-none" />
        </div>
        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}

        {/* Phone */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaPhone className="text-green-600 mr-2" />
          <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full outline-none" />
        </div>
        {errors.phone && <p className="text-red-600 text-sm">{errors.phone}</p>}

        {/* Address */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaMapMarkerAlt className="text-green-600 mr-2" />
          <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full outline-none" />
        </div>
        {errors.address && <p className="text-red-600 text-sm">{errors.address}</p>}

        {/* Email */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaEnvelope className="text-green-600 mr-2" />
          <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full outline-none" />
        </div>
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

        {/* Password */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaLock className="text-green-600 mr-2" />
          <input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full outline-none" />
          <span onClick={() => setShowPassword(!showPassword)} className="ml-2 cursor-pointer text-gray-500">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

        {/* Confirm Password */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaLock className="text-green-600 mr-2" />
          <input type={showConfirm ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full outline-none" />
          <span onClick={() => setShowConfirm(!showConfirm)} className="ml-2 cursor-pointer text-gray-500">{showConfirm ? <FaEyeSlash /> : <FaEye />}</span>
        </div>
        {errors.confirmPassword && <p className="text-red-600 text-sm">{errors.confirmPassword}</p>}

        {/* Register */}
        <div className="flex justify-center">
          <button type="submit" disabled={loading} className="w-[120px] bg-green-700 text-white py-2 rounded-md hover:bg-green-600">{loading ? "Registering..." : "Register"}</button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-2">Already have an account? <Link to="/login" className="text-green-700 font-semibold hover:underline">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;