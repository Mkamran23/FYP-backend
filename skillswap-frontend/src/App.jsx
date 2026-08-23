import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SwapRequests from "./pages/SwapRequests";
import MyProfile from "./pages/MyProfile";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

function App() {
  return (
    <Routes>

      {/* Default */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
      </Route>

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />


      {/* Private Routes */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/swap-requests"
          element={<SwapRequests />}
        />

        <Route
        path="/profile"
          element={<MyProfile />} />
      </Route>

      <Route path="*"
        element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
