import { useState, useContext, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const navigate = useNavigate();
  const { user, role } = useContext(AuthContext);

  // ✅ Field Validation
  const validate = () => {

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } 
    else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  // ✅ Login Function
  const handleLogin = async (e) => {

    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );

    } catch (error) {

      console.log("Firebase login error code:", error.code);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        setShowRegisterModal(true);
      } 
      else if (error.code === "auth/wrong-password") {
        setErrors({ general: "Incorrect password" });
      } 
      else if (error.code === "auth/invalid-email") {
        setErrors({ general: "Invalid email format" });
      } 
      else {
        setErrors({ general: "Failed to login. Please try again." });
      }

    } finally {
      setLoading(false);
    }
  };

  // ✅ Redirect After Login
  useEffect(() => {

    if (user && role) {

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } 
      else {
        navigate("/products");
      }

    }

  }, [user, role, navigate]);

  // ✅ Remove error while typing
  const handleChange = (field, value) => {

    setErrors((prev) => ({ ...prev, [field]: "" }));

    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
  };

  return (

<div className="flex items-center justify-center min-h-screen bg-[#f0f9e8] px-4">

<form
onSubmit={handleLogin}
noValidate
className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4 border-2 border-transparent focus-within:border-green-400 transition"
>

<h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-2">
Welcome Back
</h2>

{errors.general && (
<div className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm">
{errors.general}
</div>
)}

{/* Email */}

<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
<FaEnvelope className="text-green-600 mr-2" />

<input
type="text"
placeholder="Email"
value={email}
onChange={(e) => handleChange("email", e.target.value)}
className="w-full outline-none"
/>

</div>

{errors.email && (
<p className="text-red-600 text-sm">{errors.email}</p>
)}

{/* Password */}

<div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
<FaLock className="text-green-600 mr-2" />

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e) => handleChange("password", e.target.value)}
className="w-full outline-none"
/>

<span
className="ml-2 cursor-pointer text-gray-500"
onClick={() => setShowPassword(!showPassword)}
>

{showPassword ? <FaEyeSlash /> : <FaEye />}

</span>

</div>

{errors.password && (
<p className="text-red-600 text-sm">{errors.password}</p>
)}

{/* Login Button */}

<div className="flex justify-center">

<button
type="submit"
disabled={loading}
className="w-[120px] bg-green-700 text-white font-semibold py-2 rounded-md hover:bg-green-600 transition text-sm"
>

{loading ? "Logging in..." : "Login"}

</button>

</div>

<p className="text-center text-gray-500 text-sm mt-2">
Don't have an account?{" "}
<Link
to="/register"
className="text-green-700 font-semibold hover:underline"
>
Register
</Link>
</p>

</form>

{/* Register Modal */}

{showRegisterModal && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-lg text-center space-y-4">

<h3 className="text-lg font-bold text-gray-800">
Email not registered
</h3>

<p className="text-gray-600 text-sm">
You don’t have an account. Do you want to register now?
</p>

<div className="flex justify-center gap-4 mt-4">

<button
onClick={() => navigate("/register")}
className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
>
Register
</button>

<button
onClick={() => setShowRegisterModal(false)}
className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
>
Cancel
</button>

</div>
</div>
</div>

)}

</div>

  );
};

export default Login;