export default function FeatureBadge({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
        <Icon size={17} className="text-blue-600" />
      </div>

      <span className="text-[10px] font-semibold leading-tight text-slate-600">
        {title}
      </span>
    </div>
  );
}
