import { useState } from "react";
import { LockKeyhole, UserPlus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import CustomInput from "../common/CustomInput";
import { useAuth } from "../../auth/AuthContext";

export default function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { resetPassword } = useAuth();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Token normally comes from:
  // /reset-password?token=xxxxx
  const token = searchParams.get("token");

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

    // Make sure reset token exists
    if (!token) {
      setError(
        "Invalid or expired password reset link."
      );
      return;
    }

    // Validate password
    if (!formData.password) {
      setError("Please enter a new password.");
      return;
    }

    if (formData.password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    // Validate confirmation
    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token,
        password: formData.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Password reset successfully. Please login with your new password.",
        },
      });
    } catch (submissionError) {
      setError(
        submissionError?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Error */}

      {error && (
        <p
          role="alert"
          className="
            rounded-md
            bg-red-50
            p-3
            text-[11px]
            text-red-600
          "
        >
          {error}
        </p>
      )}

      {/* Password */}

      <CustomInput
        label="Password"
        type="password"
        placeholder="Create a password"
        icon={LockKeyhole}
        value={formData.password}
        onChange={handleChange}
        name="password"
        required
      />

      {/* Confirm password */}

      <CustomInput
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        icon={LockKeyhole}
        value={formData.confirmPassword}
        onChange={handleChange}
        name="confirmPassword"
        required
      />

      {/* Terms */}

      <label className="flex items-start gap-2 text-[10px] text-slate-500">
        <input
          type="checkbox"
          required
          className="
            mt-[1px]
            h-3.5
            w-3.5
            rounded
            border-slate-300
            text-blue-600
          "
        />

        <span>
          I agree to the{" "}
          <button
            type="button"
            className="font-semibold text-blue-600"
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            type="button"
            className="font-semibold text-blue-600"
          >
            Privacy Policy
          </button>
        </span>
      </label>

      {/* Submit */}

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
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        <UserPlus size={15} />

        {isSubmitting
          ? "Resetting Password..."
          : "Reset Password"}
      </button>
    </form>
  );
}
