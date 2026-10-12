import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function OAuthCallback() {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing Google sign-in...");

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const token = params.get("token");
    const expiresAt = params.get("expiresAt");
    if (!token || !expiresAt) {
      navigate("/login?error=Google%20sign-in%20could%20not%20be%20completed", {
        replace: true,
      });
      return;
    }
    signInWithGoogle({ token, expiresAt })
      .then(() => navigate("/dashboard", { replace: true }))
      .catch((error) => {
        setMessage(
          error.message || "Google sign-in failed. Redirecting to login...",
        );
        window.setTimeout(() => navigate("/login", { replace: true }), 1500);
      });
  }, [navigate, signInWithGoogle]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <p className="rounded-lg bg-white px-5 py-4 text-sm text-slate-600 shadow-sm">
        {message}
      </p>
    </main>
  );
}
