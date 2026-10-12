import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, LogIn } from "lucide-react";

import CustomInput from "../common/CustomInput";
import SocialButton from "./SocialButton";
import GoogleIcon from "./GoogleIcon";
import GitHubIcon from "./GitHubIcon";
import { useAuth } from "../../auth/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await signIn({ email, password, remember });
      navigate("/dashboard", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-[11px] text-red-600"
        >
          {error}
        </p>
      )}

      <CustomInput
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        icon={Mail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        name="email"
      />

      <CustomInput
        label="Password"
        type="password"
        placeholder="Enter your password"
        icon={LockKeyhole}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        name="password"
      />

      <div className="flex items-center justify-between text-[10px]">
        <label className="flex cursor-pointer items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Remember Me
        </label>

        <Link
          to="/forgot-password"
          className="font-semibold text-blue-600 hover:text-blue-700"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="
    flex
    h-10
    w-full
    items-center
    justify-center
    gap-2
    rounded-md
    bg-blue-600
    text-[11px]
    font-semibold
    text-white
    transition
    hover:bg-blue-700
    sm:h-[42px]
    sm:text-[12px]
  "
      >
        <LogIn size={15} />
        {isSubmitting ? "Signing In..." : "Sign In"}
      </button>

      {/* OR */}

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-[10px] text-slate-400">OR</span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="space-y-2">
        <SocialButton
          onClick={() => {
            window.location.assign(`${apiUrl}/auth/google`);
          }}
          icon={<GoogleIcon />}
        >
          Continue with Google
        </SocialButton>

        <SocialButton
          onClick={() => {
            window.location.assign(`${apiUrl}/auth/github`);
          }}
          icon={<GitHubIcon />}
        >
          Continue with GitHub
        </SocialButton>
      </div>
    </form>
  );
}
