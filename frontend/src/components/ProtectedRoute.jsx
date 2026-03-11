import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) return null; // wait for auth check
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && role !== "ADMIN") return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;