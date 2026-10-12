import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
export default function AdminRoute() {
  const { user, isCheckingAuth } = useAuth();
  if (isCheckingAuth) return null;
  return user?.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
}
