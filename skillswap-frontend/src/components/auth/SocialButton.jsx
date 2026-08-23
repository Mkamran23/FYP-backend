export default function SocialButton({
  children,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        h-[40px]
        w-full
        items-center
        justify-center
        gap-3
        rounded-md
        border
        border-slate-200
        bg-white
        text-[12px]
        font-semibold
        text-slate-700
        transition
        hover:border-slate-300
        hover:bg-slate-50
      "
    >
      {icon}
      {children}
    </button>
  );
}