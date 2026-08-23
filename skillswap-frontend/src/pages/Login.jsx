import { Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";
import BrandLogo from "../components/common/BrandLogo";

export default function Login() {
  return (
    <AuthLayout>

      <div className="mb-6 flex flex-col items-center">

        <BrandLogo />

        <h2 className="mt-4 text-lg font-bold text-slate-800 sm:text-xl">
          Welcome Back!
        </h2>

        <p className="mt-1 text-center text-[10px] text-slate-500 sm:text-[11px]">
          Sign in to continue your learning journey.
        </p>

      </div>

      <LoginForm />

      <p className="mt-5 text-center text-[10px] text-slate-500 sm:text-[11px]">
        Don't have an account?{" "}

        <Link
          to="/register"
          className="font-bold text-blue-600 hover:text-blue-700"
        >
          Register Now
        </Link>
      </p>

    </AuthLayout>
  );
}