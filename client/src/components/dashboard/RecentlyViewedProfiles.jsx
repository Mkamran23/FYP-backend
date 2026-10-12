import { Clock, MapPin, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
export default function RecentlyViewedProfiles({ profiles }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-blue-600" />
        <h2 className="text-[11px] font-bold text-slate-800">
          Recently Viewed Profiles
        </h2>
      </div>
      {profiles.length ? (
        <div className="mt-3 space-y-2">
          {profiles.map((profile) => (
            <Link
              key={profile.id}
              to={`/members/${profile.id}`}
              className="flex items-center gap-2 rounded-md p-1.5 hover:bg-blue-50"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.name?.charAt(0)?.toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold text-slate-700">
                  {profile.name}
                </p>
                <p className="flex items-center gap-1 truncate text-[9px] text-slate-400">
                  <MapPin size={10} />
                  {profile.location || "Location not set"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-slate-50 p-3 text-[10px] text-slate-500">
          <UserRound size={14} />
          Profiles you open will appear here.
        </div>
      )}
    </section>
  );
}
