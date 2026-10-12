import { BadgeCheck, Pencil, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { Link } from "react-router-dom";
import { reviewService } from "../../services/reviewService";

export default function ProfileSummary() {
  const { user, token } = useAuth();
  const [reviewSummary, setReviewSummary] = useState(null);

  useEffect(() => {
    if (!user?.id || !token) {
      setReviewSummary(null);
      return;
    }
    let active = true;
    reviewService
      .getForUser(user.id, token)
      .then(({ summary }) => {
        if (active) setReviewSummary(summary);
      })
      .catch(() => {
        if (active) setReviewSummary({ average: 0, count: 0 });
      });
    return () => {
      active = false;
    };
  }, [user?.id, token]);

  const average = reviewSummary?.average || 0;
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Avatar */}

        <div className="relative">
          <div className="flex h-[74px] w-[74px] items-center justify-center overflow-hidden rounded-full border-4 border-slate-100 bg-gradient-to-br from-orange-100 to-pink-100 text-2xl font-bold text-slate-600">
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
        </div>

        {/* User information */}

        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h1 className="text-[14px] font-bold text-slate-800">
              {user?.name || "SkillSwap member"}
            </h1>

            <BadgeCheck size={13} className="fill-blue-600 text-white" />
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-[10px] text-slate-500">
              {user?.location || "Add your location"}
            </span>

            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[7px] font-semibold text-emerald-600">
              Active Member
            </span>
          </div>

          <div className="mt-1 flex items-center gap-1">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={11}
                  fill={average >= star ? "currentColor" : "none"}
                  strokeWidth={0}
                />
              ))}
            </div>

            <span className="text-[9px] font-bold text-slate-700">
              {reviewSummary?.count ? average.toFixed(1) : "—"}
            </span>

            <span className="text-[10px] text-slate-400">
              ({reviewSummary?.count ?? "…"} {reviewSummary?.count === 1 ? "review" : "reviews"})
            </span>
          </div>

          <p className="mt-1 max-w-[390px] text-[10px] leading-3 text-slate-500">
            {user?.bio ||
              "Tell the SkillSwap community a little about yourself."}
          </p>
        </div>

        {/* Edit */}

        <Link
          to="/profile"
          className="flex items-center gap-1 rounded-md border border-blue-200 px-2 py-1 text-[10px] font-semibold text-blue-600 hover:bg-blue-50"
        >
          <Pencil size={10} />
          Edit Profile
        </Link>
      </div>
    </div>
  );
}
