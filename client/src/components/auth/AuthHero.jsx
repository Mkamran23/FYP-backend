import {
  Code2,
  Languages,
  Music2,
  Palette,
  ChefHat,
  UsersRound,
  ShieldCheck,
  LockKeyhole,
  BadgeCheck,
  Target,
} from "lucide-react";

import BrandLogo from "../common/BrandLogo";
import FeatureBadge from "../common/FeatureBadge";

const skills = [
  {
    label: "Programming",
    icon: Code2,
    color: "bg-blue-500",
  },
  {
    label: "Graphic Design",
    icon: Palette,
    color: "bg-violet-500",
  },
  {
    label: "Music",
    icon: Music2,
    color: "bg-red-500",
  },
  {
    label: "Cooking",
    icon: ChefHat,
    color: "bg-orange-400",
  },
  {
    label: "Languages",
    icon: Languages,
    color: "bg-emerald-500",
  },
];

export default function AuthHero() {
  return (
    <section className="relative flex min-h-screen flex-1 overflow-hidden bg-gradient-to-br from-[#edf5ff] via-white to-[#e7fbf4] px-8 py-7 lg:px-12 xl:px-16">
      {/* Decorative shapes */}

      <div className="absolute -left-24 bottom-[-100px] h-[300px] w-[300px] rounded-full bg-blue-200/50 blur-sm" />

      <div className="absolute right-[-80px] top-[-80px] h-[300px] w-[300px] rounded-full bg-emerald-200/40" />

      <div className="absolute left-[40%] top-[-100px] h-[300px] w-[150px] rotate-[-25deg] rounded-full bg-emerald-100/70" />

      <div className="relative z-10 flex w-full flex-col">
        <BrandLogo showTagline />

        <div className="mt-10 max-w-[560px]">
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight xl:text-5xl">
            <span className="text-blue-600">Learn.</span>{" "}
            <span className="text-blue-600">Teach.</span>
            <br />
            <span className="text-emerald-500">Grow Together.</span>
          </h1>

          <p className="mt-4 max-w-[360px] text-sm leading-5 text-slate-600">
            Join Pakistan's largest peer-to-peer
            <br />
            skill exchange community.
          </p>
        </div>

        {/* Skill categories */}

        <div className="mt-8 flex flex-wrap gap-5">
          {skills.map((skill) => {
            const Icon = skill.icon;

            return (
              <div
                key={skill.label}
                className="flex w-[58px] flex-col items-center gap-1"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${skill.color} text-white shadow-sm`}
                >
                  <Icon size={20} />
                </div>

                <span className="text-center text-[10px] font-medium text-slate-600">
                  {skill.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Illustration */}

        <div className="relative mt-4 flex h-[250px] max-w-[600px] items-center justify-center">
          {/* Exchange circle */}

          <div className="absolute left-1/2 top-[48%] flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[8px] border-blue-500/90 bg-white shadow-lg">
            <UsersRound size={36} className="text-slate-700" />

            <div className="absolute -left-7 top-1/2 text-3xl text-blue-600">
              ↻
            </div>

            <div className="absolute -right-7 top-1/2 text-3xl text-emerald-500">
              ↺
            </div>
          </div>

          {/* Person 1 */}

          <div className="absolute bottom-2 left-[12%] flex flex-col items-center">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-blue-100">
              <div className="text-6xl">👨🏻‍💻</div>
            </div>

            <div className="mt-[-8px] h-12 w-32 rounded-t-[50%] bg-blue-500" />
          </div>

          {/* Person 2 */}

          <div className="absolute bottom-2 right-[12%] flex flex-col items-center">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-emerald-100">
              <div className="text-6xl">👩🏻‍💻</div>
            </div>

            <div className="mt-[-8px] h-12 w-32 rounded-t-[50%] bg-emerald-500" />
          </div>

          {/* Plants */}

          <div className="absolute bottom-0 left-0 text-4xl">🌱</div>

          <div className="absolute bottom-0 right-0 text-3xl">🌱</div>
        </div>

        {/* Feature bar */}

        <div className="mt-auto rounded-2xl border border-white/70 bg-white/80 px-5 py-4 shadow-lg backdrop-blur">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <FeatureBadge icon={ShieldCheck} title="Secure Authentication" />

            <FeatureBadge icon={LockKeyhole} title="JWT Session Management" />

            <FeatureBadge icon={BadgeCheck} title="Community Verified" />

            <FeatureBadge icon={Target} title="Skill Matching" />
          </div>
        </div>
      </div>
    </section>
  );
}
