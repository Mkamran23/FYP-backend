import { Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import RegisterForm from "../components/auth/RegisterForm";
import BrandLogo from "../components/common/BrandLogo";

export default function Register() {
  return (
    <AuthLayout>

      <div className="mb-5 flex flex-col items-center sm:mb-6">

        <BrandLogo />

        <h2 className="mt-4 text-lg font-bold text-slate-800 sm:text-xl">
          Create Your Account
        </h2>

        <p className="mt-1 max-w-[280px] text-center text-[10px] leading-4 text-slate-500 sm:text-[11px]">
          Join SkillSwap and start exchanging skills.
        </p>

      </div>

      <RegisterForm />

      <p className="mt-5 text-center text-[10px] text-slate-500 sm:text-[11px]">
        Already have an account?{" "}

        <Link
          to="/login"
          className="font-bold text-blue-600 hover:text-blue-700"
        >
          Sign In
        </Link>
      </p>

    </AuthLayout>
  );
}