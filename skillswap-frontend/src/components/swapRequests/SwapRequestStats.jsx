import {
  Clock3,
  CheckCircle2,
  Award,
  ArrowLeftRight,
} from "lucide-react";

const stats = [
  {
    label: "Pending Requests",
    value: "12",
    icon: Clock3,
    iconClass: "bg-blue-50 text-blue-500",
  },
  {
    label: "Accepted",
    value: "8",
    icon: CheckCircle2,
    iconClass: "bg-emerald-50 text-emerald-500",
  },
  {
    label: "Completed",
    value: "15",
    icon: Award,
    iconClass: "bg-purple-50 text-purple-500",
  },
  {
    label: "Active Swaps",
    value: "6",
    icon: ArrowLeftRight,
    iconClass: "bg-orange-50 text-orange-500",
  },
];

export default function SwapRequestStats() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className="
              flex
              min-h-[78px]
              items-center
              gap-3
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3
              py-3
              shadow-sm
              sm:min-h-[82px]
            "
          >
            <div
              className={`
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-lg
                ${stat.iconClass}
              `}
            >
              <Icon size={17} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-[8px] text-slate-500 sm:text-[9px]">
                {stat.label}
              </p>

              <p className="mt-0.5 text-lg font-bold text-slate-800 sm:text-xl">
                {stat.value}
              </p>

              <button className="text-[7px] font-semibold text-blue-600 sm:text-[8px]">
                View all
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}