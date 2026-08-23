import { Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import BrandLogo from "../components/common/BrandLogo";

export default function ResetPassword() {
  return (
    <AuthLayout>

      <div className="mb-5 flex flex-col items-center sm:mb-6">

        <BrandLogo />

        <h2 className="mt-4 text-lg font-bold text-slate-800 sm:text-xl">
          Reset Your Password
        </h2>

        <p className="mt-1 max-w-[280px] text-center text-[10px] leading-4 text-slate-500 sm:text-[11px]">
          Choose a new password for your SkillSwap account.
        </p>

      </div>

      <ResetPasswordForm />

      <p className="mt-5 text-center text-[10px] text-slate-500 sm:text-[11px]">
        Remembered your password?{" "}

        <Link
          to="/login"
          className="font-bold text-blue-600 hover:text-blue-700"
        >
          Back to Sign In
        </Link>
      </p>

    </AuthLayout>
  );
}
