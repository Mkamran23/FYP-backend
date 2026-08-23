export default function StatCard({
  icon: Icon,
  value,
  label,
  iconClass = "bg-blue-50 text-blue-600",
}) {
  return (
    <div className="flex h-[110px] flex-col items-center justify-center rounded-lg border border-slate-200 bg-white p-2 shadow-sm">

      <div
        className={`mb-1 flex h-7 w-7 items-center justify-center rounded-full ${iconClass}`}
      >
        <Icon size={14} />
      </div>

      <p className="text-[14px] font-bold text-slate-800">
        {value}
      </p>

      <p className="text-[7px] text-slate-500">
        {label}
      </p>

    </div>
  );
}