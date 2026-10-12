import { Navigate, Route, Routes } from "react-router-dom";
import { ActivityCountsProvider } from "./context/ActivityCountsContext"; // Adjust path as needed

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import SwapRequests from "./pages/SwapRequests";
import MyProfile from "./pages/MyProfile";
import OAuthCallback from "./pages/OAuthCallback";
import MemberProfile from "./pages/MemberProfile";
import Matches from "./pages/Matches";
import SearchPartners from "./pages/SearchPartners";
import Ratings from "./pages/Ratings";
import AdminPanel from "./pages/AdminPanel";
import Notifications from "./pages/Notifications";
import AdminRoute from "./components/auth/AdminRoute";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

function App() {
  return (
    <ActivityCountsProvider>
      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/swap-requests" element={<SwapRequests />} />

          <Route path="/profile" element={<MyProfile />} />
          <Route path="/members/:id" element={<MemberProfile />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/skills" element={<SearchPartners />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ActivityCountsProvider>
  );
}

export default App;
