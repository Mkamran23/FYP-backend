import { Search, Bell, Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useActivityCounts } from "../../context/ActivityCountsContext";

export default function Topbar({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { counts, clearCount } = useActivityCounts();
  const [searchTerm, setSearchTerm] = useState("");
  const handleSignOut = () => {
    signOut();
    navigate("/login", { replace: true });
  };
  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    navigate(`/skills?q=${encodeURIComponent(query)}`);
  };
  return (
    <header className="flex h-[58px] shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 sm:h-[62px] sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} className="text-slate-600 lg:hidden">
          <Menu size={20} />
        </button>
        <form onSubmit={submitSearch} role="search" className="relative w-[170px] sm:w-[265px] md:w-[330px]">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search skills, people or swap opportunities..."
            aria-label="Search skills and people"
            className="h-[32px] w-full rounded-full border-0 bg-slate-50 pl-9 pr-3 text-[10px] text-slate-700 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 sm:text-[9px]"
          />
        </form>
      </div>
      <div className="flex shrink-0 items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => navigate("/notifications")}
          title="Open notifications"
          className="relative text-slate-500 hover:text-blue-600"
        >
          <Bell size={16} />
          {counts.notifications > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-semibold text-white">
              {counts.notifications > 99 ? "99+" : counts.notifications}
            </span>
          )}
        </button>
        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 text-xs">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            user?.name?.charAt(0)?.toUpperCase() || "?"
          )}
        </div>
        <div className="hidden text-left md:block">
          <p className="text-[9px] font-bold text-slate-700">
            {user?.name || "SkillSwap member"}
          </p>
          <p className="text-[10px] text-emerald-500">Online</p>
        </div>
        <button
          onClick={handleSignOut}
          title="Sign out"
          className="flex items-center gap-2"
        >
          <LogOut size={14} className="text-slate-400" />
        </button>
      </div>
    </header>
  );
}
