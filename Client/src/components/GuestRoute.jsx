import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-orange-600 text-2xl animate-pulse font-display">🙏 Loading...</div>
    </div>
  );

  // If already logged in, redirect to appropriate dashboard
  if (user) {
    if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "ORGANIZER") return <Navigate to="/organizer/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
