import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import AuthLayout from "../components/auth/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import BrandLogo from "../components/common/BrandLogo";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <div className="mb-6 flex flex-col items-center">
        <BrandLogo />

        <h2 className="mt-4 text-lg font-bold text-slate-800 sm:text-xl">
          Forgot Password?
        </h2>

        <p className="mt-1 max-w-[290px] text-center text-[10px] leading-4 text-slate-500 sm:text-[11px]">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>
      </div>

      <ForgotPasswordForm />

      <div className="mt-5 flex justify-center">
        <Link
          to="/login"
          className="
            flex
            items-center
            gap-1.5
            text-[10px]
            font-semibold
            text-blue-600
            hover:text-blue-700
            sm:text-[11px]
          "
        >
          <ArrowLeft size={13} />
          Back to Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
