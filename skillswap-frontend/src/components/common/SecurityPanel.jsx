import {
  CheckCircle2,
  LockKeyhole,
} from "lucide-react";

const securityItems = [
  "BCrypt Password Encryption",
  "JWT Authentication",
  "Secure HTTPS Connection",
  "Role-Based Access (User/Admin)",
];

export default function SecurityPanel() {
  return (
    <div className="w-full max-w-[125px] rounded-xl border border-emerald-100 bg-white/70 p-5 shadow-sm backdrop-blur-sm">
      <div className="mb-5 flex justify-center">
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <LockKeyhole className="text-emerald-600" size={24} />

          <div className="absolute inset-0 rounded-full border border-emerald-200" />
        </div>
      </div>

      <div className="space-y-4">
        {securityItems.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2"
          >
            <CheckCircle2
              size={13}
              className="mt-[1px] shrink-0 text-emerald-500"
              fill="currentColor"
              color="white"
            />

            <span className="text-[9px] font-medium leading-[1.35] text-slate-600">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}