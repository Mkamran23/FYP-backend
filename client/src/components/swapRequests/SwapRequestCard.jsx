import {
  MapPin,
  CalendarDays,
  MoreVertical,
  Check,
  X,
  MessageSquare,
} from "lucide-react";

const statusStyles = {
  Pending: "bg-blue-50 text-blue-600",
  Accepted: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-500",
  Completed: "bg-purple-50 text-purple-600",
};

export default function SwapRequestCard({ request, onChat }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-3.5">
      <div className="flex gap-3">
        {/* Avatar */}

        <div className="relative shrink-0">
          <img
            src={request.avatar}
            alt={request.name}
            className="
              h-11
              w-11
              rounded-full
              object-cover
              ring-2
              ring-slate-100
              sm:h-12
              sm:w-12
            "
          />

          <span
            className={`
              absolute
              bottom-0
              right-0
              h-2.5
              w-2.5
              rounded-full
              border-2
              border-white
              ${request.online ? "bg-emerald-500" : "bg-slate-300"}
            `}
          />
        </div>

        {/* Main content */}

        <div className="min-w-0 flex-1">
          {/* Header */}

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[10px] font-bold text-slate-800 sm:text-[11px]">
                {request.name}
              </h3>

              <div className="mt-0.5 flex items-center gap-1 text-[10px] sm:text-[10px]">
                <MapPin size={9} />

                {request.location}
              </div>

              <div className="mt-1 flex items-center gap-1 text-[10px] text-orange-500">
                ★ {request.rating}
                <span className="text-slate-400">({request.reviews})</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <span
                className={`
                  rounded-full
                  px-2
                  py-1
                  text-[7px]
                  font-semibold
                  ${statusStyles[request.status]}
                `}
              >
                {request.status}
              </span>

              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical size={15} />
              </button>
            </div>
          </div>

          {/* Skills */}

          <div
            className="
              mt-3
              grid
              grid-cols-1
              gap-2
              sm:grid-cols-2
            "
          >
            <div>
              <p className="mb-1 text-[7px] font-medium text-slate-400">
                Teaches
              </p>

              <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[7px] font-medium text-blue-600">
                💻 {request.teaches}
              </span>
            </div>

            <div>
              <p className="mb-1 text-[7px] font-medium text-slate-400">
                Wants
              </p>

              <span className="inline-flex max-w-full items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[7px] font-medium text-emerald-600">
                📗 {request.wants}
              </span>
            </div>
          </div>

          {/* Bottom */}

          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1 text-[7px] text-slate-400">
              <CalendarDays size={10} />
              {request.date}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {request.status === "Pending" && (
                <>
                  <button
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded
                      border
                      border-emerald-300
                      px-2
                      py-1
                      text-[7px]
                      font-semibold
                      text-emerald-600
                      hover:bg-emerald-50
                    "
                  >
                    <Check size={10} />
                    Accept
                  </button>

                  <button
                    className="
                      inline-flex
                      items-center
                      gap-1
                      rounded
                      border
                      border-red-300
                      px-2
                      py-1
                      text-[7px]
                      font-semibold
                      text-red-500
                      hover:bg-red-50
                    "
                  >
                    <X size={10} />
                    Reject
                  </button>
                </>
              )}

              <button
                onClick={() => onChat(request)}
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded
                  border
                  border-blue-300
                  px-2
                  py-1
                  text-[7px]
                  font-semibold
                  text-blue-600
                  hover:bg-blue-50
                "
              >
                <MessageSquare size={10} />

                <span className="hidden sm:inline">View Chat</span>

                <span className="sm:hidden">Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
