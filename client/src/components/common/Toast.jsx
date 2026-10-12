import { Bell, Check, Info, X } from "lucide-react";
import { useEffect, useRef } from "react";

const variants = {
  success: {
    Icon: Check,
    iconClass: "bg-emerald-100 text-emerald-700",
    borderClass: "border-emerald-100",
  },
  error: {
    Icon: Info,
    iconClass: "bg-red-100 text-red-700",
    borderClass: "border-red-100",
  },
  info: {
    Icon: Bell,
    iconClass: "bg-blue-100 text-blue-700",
    borderClass: "border-blue-100",
  },
};

export default function Toast({
  title,
  message,
  variant,
  icon: CustomIcon,
  onDismiss,
  duration = 5000,
}) {
  const dismissRef = useRef(onDismiss);

  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if ((!title && !message) || !onDismiss || duration <= 0) return undefined;

    const timeoutId = window.setTimeout(() => dismissRef.current?.(), duration);
    return () => window.clearTimeout(timeoutId);
  }, [title, message, duration, Boolean(onDismiss)]);

  if (!title && !message) return null;
  const selected = variants[variant] || variants.info;
  const Icon = CustomIcon || selected.Icon;
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`fixed right-4 top-4 z-50 flex max-w-sm items-start gap-3 rounded-lg border bg-white p-4 shadow-lg ${selected.borderClass}`}
    >
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${selected.iconClass}`}
      >
        <Icon size={16} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        {message && <p className="mt-0.5 text-xs text-slate-500">{message}</p>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="ml-auto text-slate-400 hover:text-slate-600"
          aria-label="Dismiss notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}