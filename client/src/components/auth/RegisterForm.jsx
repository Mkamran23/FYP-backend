import { useState } from "react";
import { User, Mail, LockKeyhole, UserPlus } from "lucide-react";

import CustomInput from "../common/CustomInput";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import SocialButton from "./SocialButton";
import GoogleIcon from "./GoogleIcon";
import GitHubIcon from "./GitHubIcon";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      await signUp(formData);
      navigate("/dashboard", { replace: true });
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-[11px] text-red-600"
        >
          {error}
        </p>
      )}

      <CustomInput
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        icon={User}
        value={formData.name}
        onChange={handleChange}
        name="name"
      />

      <CustomInput
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        icon={Mail}
        value={formData.email}
        onChange={handleChange}
        name="email"
      />

      <CustomInput
        label="Password"
        type="password"
        placeholder="Create a password"
        icon={LockKeyhole}
        value={formData.password}
        onChange={handleChange}
        name="password"
      />

      <CustomInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        icon={LockKeyhole}
        value={formData.confirmPassword}
        onChange={handleChange}
        name="confirmPassword"
      />

      <label className="flex items-start gap-2 text-[10px] text-slate-500">
        <input
          type="checkbox"
          required
          className="mt-[1px] h-3.5 w-3.5 rounded border-slate-300 text-blue-600"
        />

        <span>
          I agree to the{" "}
          <button type="button" className="font-semibold text-blue-600">
            Terms of Service
          </button>{" "}
          and{" "}
          <button type="button" className="font-semibold text-blue-600">
            Privacy Policy
          </button>
        </span>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="
          flex
          h-[42px]
          w-full
          items-center
          justify-center
          gap-2
          rounded-md
          bg-blue-600
          text-[12px]
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-blue-700
          active:scale-[0.99]
        "
      >
        <UserPlus size={15} />

        {isSubmitting ? "Creating Account..." : "Create Account"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-[10px] text-slate-400">OR</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

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
    </form>
  );
}
