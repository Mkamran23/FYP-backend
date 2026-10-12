import { MapPin, Send, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { swapRequestService } from "../../services/swapRequestService";
import { fetchMatches, removeMatch } from "../../store/matchesSlice";

function SkillTag({ children }) {
  return (
    <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700">
      {children}
    </span>
  );
}

export default function RecommendedMatches() {
  const dispatch = useDispatch();
  const { token, user } = useAuth();
  const {
    items: matches,
    status,
    error,
  } = useSelector((state) => state.matches);
  const [requestingId, setRequestingId] = useState(null);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState("");

  const skillSelection = [
    ...(user?.skillsToTeach || []),
    ...(user?.skillsToLearn || []),
  ]
    .map((skill) =>
      typeof skill === "string" ? skill : skill?.id || skill?._id,
    )
    .filter(Boolean)
    .sort()
    .join(",");

  useEffect(() => {
    if (token && skillSelection) dispatch(fetchMatches({ limit: 3 }));
  }, [dispatch, token, skillSelection]);

  const sendRequest = async (recipientId, skillId, recipientName) => {
    setRequestingId(recipientId);
    setRequestError("");
    try {
      await swapRequestService.create(recipientId, skillId, token);
      dispatch(removeMatch(recipientId));
      setRequestSuccess(`Swap request sent to ${recipientName}.`);
    } catch (error) {
      setRequestError(error.message || "Unable to send swap request.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[11px] font-bold text-slate-800">
          Recommended Matches for You
        </h2>
        <Link
          to="/matches"
          className="text-[10px] font-semibold text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      {status === "loading" && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center text-[9px] text-slate-500">
          Finding compatible SkillSwap members...
        </div>
      )}
      {status === "failed" && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-center text-[9px] text-red-600">
          {error}
        </div>
      )}
      {requestError && (
        <div
          role="alert"
          className="mb-2 rounded-lg bg-red-50 p-2 text-[9px] text-red-600"
        >
          {requestError}
        </div>
      )}
      {requestSuccess && (
        <div
          role="status"
          className="mb-2 rounded-lg bg-emerald-50 p-2 text-[9px] text-emerald-700"
        >
          {requestSuccess}
        </div>
      )}
      {status === "succeeded" && matches.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center text-[9px] text-slate-500">
          No compatible members are available right now. Add more skills or try
          again after a resolved request is cleared.
        </div>
      )}

      {status === "succeeded" && matches.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3 lg:min-h-[200px]">
          {matches.map((match) => {
            const { user, matchScore, matchingSkills } = match;
            const requestSkill =
              matchingSkills.theyCanTeach[0] ||
              matchingSkills.theyWantToLearn[0];
            return (
              <div
                key={user.id}
                className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-sm"
              >
                <div className="flex items-start gap-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-100 to-purple-100 text-sm font-bold text-slate-600">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[10px] font-bold text-slate-800">
                      {user.name}
                    </p>
                    <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-slate-400">
                      <MapPin size={8} />
                      {user.location || "Location not set"}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">
                    {matchScore}% Match
                  </span>
                </div>

                <div className="mt-2">
                  <p className="text-[11px] font-semibold text-slate-500">
                    Can teach you:
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {matchingSkills.theyCanTeach.map((skill) => (
                      <SkillTag key={skill.id}>{skill.name}</SkillTag>
                    ))}
                  </div>
                </div>
                <div className="mt-1.5">
                  <p className="text-[11px] font-semibold text-slate-500 mt-3">
                    Wants to learn from you:
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {matchingSkills.theyWantToLearn.map((skill) => (
                      <SkillTag key={skill.id}>{skill.name}</SkillTag>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex gap-1">
                  <Link
                    to={`/members/${user.id}`}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md border border-blue-200 py-1.5 text-[11px] font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    <UserRound size={10} />
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      sendRequest(user.id, requestSkill.id, user.name)
                    }
                    disabled={requestingId === user.id || !requestSkill}
                    className="flex flex-1 items-center justify-center gap-1 rounded-md bg-emerald-500 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
                  >
                    <Send size={10} />
                    {requestingId === user.id ? "Sending..." : "Send Request"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
