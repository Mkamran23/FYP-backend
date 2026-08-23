import {
  Search,
  Mail,
  Bell,
  Menu,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function Topbar({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };

  return (
    <header
      className="
        flex
        h-[58px]
        shrink-0
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white
        px-3
        sm:h-[62px]
        sm:px-4
      "
    >

      {/* LEFT */}

      <div className="flex min-w-0 items-center gap-3">

        {/* Mobile menu */}

        <button
          onClick={onMenuClick}
          className="text-slate-600 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search */}

        <div className="relative w-[170px] sm:w-[265px] md:w-[330px]">

          <Search
            size={13}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search skills, people or swap opportunities..."
            className="
              h-[32px]
              w-full
              rounded-full
              border-0
              bg-slate-50
              pl-9
              pr-3
              text-[8px]
              text-slate-700
              outline-none
              placeholder:text-slate-400
              focus:ring-2
              focus:ring-blue-100
              sm:text-[9px]
            "
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex shrink-0 items-center gap-3 sm:gap-4">

        <button className="relative text-slate-500 hover:text-blue-600">
          <Mail size={16} />

          <span className="absolute -right-1 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-red-500 px-1 text-[6px] text-white">
            5
          </span>
        </button>

        <button className="relative text-slate-500 hover:text-blue-600">
          <Bell size={16} />

          <span className="absolute -right-1 -top-1 flex h-3 min-w-3 items-center justify-center rounded-full bg-red-500 px-1 text-[6px] text-white">
            3
          </span>
        </button>

        {/* User */}


          <div className="flex h-7 w-7 items-center justify-center rounded-full overflow-hidden border-4 border-slate-100 from-orange-200 to-pink-200 text-xs">
            {user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="h-full w-full object-cover" /> : user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <div className="hidden text-left md:block">

            <p className="text-[9px] font-bold text-slate-700">
              {user?.name || "SkillSwap member"}
            </p>

            <p className="text-[8px] text-emerald-500">
              ● Online
            </p>

          </div>

        <button onClick={handleSignOut} title="Sign out" className="flex items-center gap-2">

          <LogOut size={14} className="text-slate-400" />

        </button>

      </div>

    </header>
  );
}
