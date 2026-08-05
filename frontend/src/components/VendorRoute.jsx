import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VendorRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "vendor") {
    return <Navigate to="/" replace />;
  }

  return children;
}