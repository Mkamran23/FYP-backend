import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuth();
  const location = useLocation();

  if (isCheckingAuth) return null;

  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
