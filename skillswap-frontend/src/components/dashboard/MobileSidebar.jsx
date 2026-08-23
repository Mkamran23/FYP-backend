import {
  LayoutDashboard,
  UserRound,
  Search,
  Sparkles,
  ArrowLeftRight,
  MessageSquare,
  Bell,
  Star,
  Settings,
  X,
} from "lucide-react";

const navigation = [
  ["Dashboard", LayoutDashboard],
  ["My Profile", UserRound],
  ["Search Skills", Search],
  ["Skill Matching", Sparkles],
  ["Swap Requests", ArrowLeftRight],
  ["Messages", MessageSquare],
  ["Notifications", Bell],
  ["Ratings & Reviews", Star],
  ["Settings", Settings],
];

export default function MobileSidebar({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">

      {/* Overlay */}

      <button
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close menu"
      />

      {/* Drawer */}

      <aside
        className="
          relative
          z-10
          flex
          h-full
          w-[240px]
          flex-col
          bg-white
          shadow-xl
        "
      >

        <div className="flex h-[62px] items-center justify-between border-b px-4">

          <div className="font-bold text-blue-600">
            Skill<span className="text-emerald-500">Swap</span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-500"
          >
            <X size={18} />
          </button>

        </div>

        <nav className="space-y-1 px-3 py-4">

          {navigation.map(([label, Icon]) => (
            <a
              key={label}
              href={
                label === "Dashboard"
                  ? "/dashboard"
                  : "#"
              }
              onClick={onClose}
              className="
                flex
                h-10
                items-center
                gap-3
                rounded-md
                px-3
                text-[11px]
                font-medium
                text-slate-600
                hover:bg-blue-50
                hover:text-blue-600
              "
            >
              <Icon size={16} />

              {label}
            </a>
          ))}

        </nav>

      </aside>

    </div>
  );
}