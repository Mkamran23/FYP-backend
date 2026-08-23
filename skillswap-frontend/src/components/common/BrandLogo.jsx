import { UsersRound } from "lucide-react";

export default function BrandLogo({ showTagline = false }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-blue-600">
          <UsersRound
            size={20}
            strokeWidth={2.5}
            className="text-blue-600"
          />

          <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
            +
          </span>
        </div>

        <div className="text-[22px] font-bold tracking-tight">
          <span className="text-blue-600">Skill</span>
          <span className="text-emerald-500">Swap</span>
          <p className="text-[10px]">Learn - Teach - Grow</p>
        </div>
      </div>

      {showTagline && (
        <p className="ml-11 text-[8px] font-medium text-slate-500">
          A Peer-to-Peer Skill Exchange Platform
        </p>
      )}
    </div>
  );
}