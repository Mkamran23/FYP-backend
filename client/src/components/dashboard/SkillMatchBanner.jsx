import { ArrowLeftRight, MessageCircle, UserPlus } from "lucide-react";

export default function SkillMatchBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-emerald-400 via-blue-500 to-indigo-600 px-4 py-4 text-white sm:px-5 sm:py-3">
      {/* Decorative circles */}

      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />

      <div className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-white/10" />

      <div className="relative flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-5 md:gap-8">
        <div className="hidden text-4xl sm:block">👨🏻‍💻</div>

        <div className="text-center">
          <h2 className="text-[13px] font-bold">Skill Matching</h2>

          <p className="mt-0.5 text-[12px] text-white/80">
            Connect with people, exchange skills and grow together!
          </p>

          <div className="mt-2 flex items-center justify-center gap-4">
            <span className="flex items-center gap-1 text-[9px]">
              <UserPlus size={9} />
              Free to Join
            </span>

            <span className="flex items-center gap-1 text-[9px]">
              <MessageCircle size={9} />
              Learn from Peers
            </span>

            <span className="flex items-center gap-1">
              <ArrowLeftRight size={9} />
              <span className="text-[9px]">Build Connections</span>
            </span>
          </div>
        </div>

        <div className="hidden text-4xl sm:block">👩🏻‍💻</div>
      </div>
    </div>
  );
}
