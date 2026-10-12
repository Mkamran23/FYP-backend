import { useState } from "react";
import { Mail, Send } from "lucide-react";

import CustomInput from "../common/CustomInput";
import { useAuth } from "../../auth/AuthContext";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setStatus("");
    setIsSubmitting(true);
    try {
      const result = await forgotPassword({ email });
      setStatus(result.message);
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p
          role="alert"
          className="rounded-md bg-red-50 p-3 text-[11px] text-red-600"
        >
          {error}
        </p>
      )}
      {status && (
        <p
          role="status"
          className="rounded-md bg-green-50 p-3 text-[11px] text-green-700"
        >
          {status}
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
        required
      />

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
        <Send size={15} />

        {isSubmitting ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
}
