import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) return null;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
