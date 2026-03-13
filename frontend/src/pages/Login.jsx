import { useState, useEffect, useContext } from "react";
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
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  const navigate = useNavigate();
  const { user, role, setIsLoggedIn } = useContext(AuthContext);

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) return setErrors(validationErrors);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      setIsLoggedIn(true);   // ← mark intentional login in context (controls Navbar)
      setJustLoggedIn(true); // ← trigger redirect in useEffect below
    } catch (error) {
      console.error(error.code);
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential")
        setErrors({ general: "Incorrect email or password" });
      else if (error.code === "auth/user-not-found")
        setErrors({ general: "User not found. Please register first." });
      else
        setErrors({ general: "Login failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Only redirect after intentional login click
  useEffect(() => {
    if (!user || !justLoggedIn) return;
    if (role === "ADMIN") navigate("/admin/dashboard", { replace: true });
    else if (role === "USER") navigate("/products", { replace: true });
  }, [user, role, justLoggedIn]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f9e8] px-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-2">Welcome Back</h2>

        {errors.general && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded text-sm">{errors.general}</div>
        )}

        {/* Email */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaEnvelope className="text-green-600 mr-2" />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none"
          />
        </div>
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

        {/* Password */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
          <FaLock className="text-green-600 mr-2" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 cursor-pointer text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="w-[120px] bg-green-700 text-white py-2 rounded-md hover:bg-green-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-700 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;