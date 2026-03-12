import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, adminOnly = false }) => {

  const { user, role, loading } = useContext(AuthContext);

  if (loading) return <Loader />;

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && role !== "ADMIN") return <Navigate to="/" replace />;

  return children;

};

export default ProtectedRoute;