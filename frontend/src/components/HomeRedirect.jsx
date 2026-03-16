import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Home from "../pages/Home";

const HomeRedirect = () => {
  const { isLoggedIn, role, loading } = useContext(AuthContext);

  if (loading) return null;

  if (isLoggedIn) {
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/products" replace />;
  }

  return <Home />;
};

export default HomeRedirect;