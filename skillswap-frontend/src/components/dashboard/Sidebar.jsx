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
} from "lucide-react";

import BrandLogo from "../common/BrandLogo";

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "My Profile",
    icon: UserRound,
    path: "/profile",
  },
  {
    label: "Search Skills",
    icon: Search,
    path: "/skills",
  },
  {
    label: "Skill Matching",
    icon: Sparkles,
    path: "/matching",
  },
  {
    label: "Swap Requests",
    icon: ArrowLeftRight,
    path: "/swap-requests",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    path: "/messages",
    badge: 5,
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/notifications",
    badge: 3,
  },
  {
    label: "Ratings & Reviews",
    icon: Star,
    path: "/ratings",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  const activeItem = window.location.pathname;
  return (
    <aside
  className="
    hidden
    h-screen
    w-[199px]
    shrink-0
    flex-col
    border-r
    border-slate-200
    bg-white
    lg:flex">
      {/* Logo */}

      <div className="flex h-[62px] items-center border-b border-slate-100 px-4">
        <BrandLogo />
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 px-2 py-3">

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.path}
              className={`
                group
                relative
                flex
                h-[34px]
                items-center
                gap-2
                rounded-md
                px-3
                text-[10px]
                font-medium
                transition
                ${
                  item.path === activeItem
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                }

              `}
            >
              <Icon size={14} strokeWidth={1.8} />

              <span>{item.label}</span>

              {item.badge && (
                <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] text-white">
                  {item.badge}
                </span>
              )}
            </a>
          );
        })}

      </nav>

      {/* Invite card */}

      <div className="px-3 pb-3">

        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 p-3 text-center">

          <p className="text-[10px] font-bold text-blue-700">
            Share Skills.
          </p>

          <p className="text-[10px] font-bold text-blue-700">
            Build a Better Future.
          </p>

          <div className="my-3 flex justify-center text-3xl">
            👨🏻‍💻 💡 👩🏻‍💻
          </div>

          <button className="w-full rounded-md bg-blue-600 py-2 text-[9px] font-semibold text-white hover:bg-blue-700">
            Invite Friends
          </button>

        </div>

      </div>

    </aside>
  );
}
