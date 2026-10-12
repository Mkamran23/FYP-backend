import {
  LayoutDashboard,
  UserRound,
  Search,
  Sparkles,
  ArrowLeftRight,
  Bell,
  Star,
  Settings,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useActivityCounts } from "../../context/ActivityCountsContext";

const navigation = [
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    path: "/dashboard" 
  },
  { 
    label: "My Profile", 
    icon: UserRound, 
    path: "/profile" 
  },
  { 
    label: "Search Skills", 
    icon: Search, 
    path: "/skills" 
  },
  {
    label: "Swap Requests",
    icon: ArrowLeftRight,
    path: "/swap-requests",
    countKey: "swapRequests",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
    countKey: "notifications",
  },
  { 
    label: "Ratings & Reviews", 
    icon: Star, 
    path: "/ratings" 
  },
];

export default function MobileSidebar({ open, onClose }) {
  const { pathname: activeItem } = useLocation();
  const { counts, clearCount } = useActivityCounts();
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
        <div className="flex h-[62px] items-center justify-between border-b px-4 py-2">
          <div className="font-bold text-blue-600">
            Skill<span className="text-emerald-500">Swap</span>
          </div>

          <button onClick={onClose} className="text-slate-500">
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1 px-3 py-3">
          {navigation.map(({ label, icon, path, countKey, className }) => {
            const Icon = icon;
            return (
              <Link
                key={label}
                to={path}
                onClick={() => {
                  if (countKey) clearCount(countKey);
                  onClose();
                }}
                className={`
                flex
                h-10
                items-center
                gap-3
                rounded-md
                px-3
                text-11px
                font-medium
                text-slate-600
                hover:bg-blue-50
                hover:text-blue-600 

                ${
                  path === activeItem
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }

               ${className || ""}  `}
              >
                <Icon size={16} />

                <span>{label}</span>
                {countKey && counts[countKey] > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[9px] font-semibold text-white">
                    {counts[countKey] > 99 ? "99+" : counts[countKey]}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
