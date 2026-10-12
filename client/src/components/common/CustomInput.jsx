import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function CustomInput({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  name,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className="space-y-2">
      <label className="block text-[12px] font-semibold text-slate-700">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        <input
          name={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            h-[42px]
            w-full
            rounded-md
            border
            border-slate-200
            bg-white
            ${Icon ? "pl-10" : "pl-3"}
            ${isPassword ? "pr-10" : "pr-3"}
            text-[12px]
            text-slate-700
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-100
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
