import { BarChart3, BookOpen, MessageCircle, CheckCircle2 } from "lucide-react";

const activities = [
  {
    icon: MessageCircle,
    text: "New connection with Ali Khan",
    time: "2 hours ago",
  },
  {
    icon: BookOpen,
    text: "Requested for Python",
    time: "1 day ago",
  },
  {
    icon: CheckCircle2,
    text: "Completed swap with Zara",
    time: "3 days ago",
  },
];

export default function LearningActivity() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">

      <div className="flex items-center justify-between">

        <h2 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-800">
          <BarChart3 size={13} className="text-blue-600" />
          Learning Activity
        </h2>

        <select className="rounded border border-slate-100 bg-slate-50 px-1 py-0.5 text-[7px] text-slate-500">
          <option>This Month</option>
          <option>This Week</option>
        </select>

      </div>

      {/* Chart */}

      <div className="mt-3 h-[120px] w-full rounded bg-slate-50 p-2 sm:h-[95px]">

        <svg
          viewBox="0 0 280 90"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <polyline
            points="5,75 35,65 65,70 95,55 125,62 155,45 185,45 215,30 245,35 275,15"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-500"
          />

          {[5, 35, 65, 95, 125, 155, 185, 215, 245, 275].map(
            (x, index) => {
              const points = [75, 65, 70, 55, 62, 45, 45, 30, 35, 15];

              return (
                <circle
                  key={index}
                  cx={x}
                  cy={points[index]}
                  r="2.5"
                  className="fill-white stroke-blue-500"
                  strokeWidth="2"
                />
              );
            }
          )}
        </svg>

      </div>

      <div className="mt-3 space-y-3">

        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div
              key={activity.text}
              className="flex items-start gap-2"
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon size={11} />
              </div>

              <div>
                <p className="text-[8px] font-medium leading-3 text-slate-600">
                  {activity.text}
                </p>

                <p className="text-[7px] text-slate-400">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}