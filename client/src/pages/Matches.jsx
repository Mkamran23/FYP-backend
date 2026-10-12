import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Send,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { matchingService } from "../services/matchingService";
import { swapRequestService } from "../services/swapRequestService";

function SkillTag({ children }) {
  return (
    <span className="rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
      {children}
    </span>
  );
}

export default function Matches() {
  const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestingId, setRequestingId] = useState(null);

  const loadMatches = useCallback(
    async (page) => {
      setLoading(true);
      setError("");
      try {
        const data = await matchingService.getMyMatches("Bearer", token, {
          limit: 6,
          page,
        });
        setMatches(data.matches);
        setPagination(data.pagination);
      } catch (requestError) {
        setError(requestError.message || "Unable to load matches.");
      } finally {
        setLoading(false);
      }
    },
    [token],
  );
  // The initial server request populates this page's independently paginated state.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    loadMatches(1);
  }, [loadMatches]);

  const sendRequest = async (match) => {
    const skill =
      match.matchingSkills.theyCanTeach[0] ||
      match.matchingSkills.theyWantToLearn[0];
    if (!skill) return;
    setRequestingId(match.user.id);
    try {
      await swapRequestService.create(match.user.id, skill.id, token);
      setMatches((items) =>
        items.filter((item) => item.user.id !== match.user.id),
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to send swap request.");
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-800">
            All Recommended Matches
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            People whose skills complement yours.
          </p>
        </div>
        {error && (
          <p
            role="alert"
            className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {loading ? (
          <p className="text-sm text-slate-500">
            Finding compatible members...
          </p>
        ) : matches.length === 0 ? (
          <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
            No more matches found. Add skills to your profile to improve
            recommendations.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((match) => {
              const { user: member, matchScore, matchingSkills } = match;
              const requestSkill =
                matchingSkills.theyCanTeach[0] ||
                matchingSkills.theyWantToLearn[0];
              return (
                <article
                  key={member.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        member.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="truncate font-semibold text-slate-800">
                        {member.name}
                      </h2>
                      <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        {member.location || "Location not set"}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                      {matchScore}%
                    </span>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-slate-500">
                      Can teach you
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {matchingSkills.theyCanTeach.map((skill) => (
                        <SkillTag key={skill.id}>{skill.name}</SkillTag>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-medium text-slate-500">
                      Wants to learn
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {matchingSkills.theyWantToLearn.map((skill) => (
                        <SkillTag key={skill.id}>{skill.name}</SkillTag>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/members/${member.id}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-md border border-blue-200 py-2 text-xs font-semibold text-blue-600"
                    >
                      <UserRound size={13} />
                      View Profile
                    </Link>
                    <button
                      type="button"
                      onClick={() => sendRequest(match)}
                      disabled={requestingId === member.id || !requestSkill}
                      className="flex flex-1 items-center justify-center gap-1 rounded-md bg-emerald-500 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      <Send size={13} />
                      {requestingId === member.id ? "Sending..." : "Request"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}{" "}
        {!loading && pagination.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => loadMatches(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <span className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => loadMatches(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
