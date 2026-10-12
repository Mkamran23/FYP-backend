import { MapPin, Search, SlidersHorizontal, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../auth/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import { fetchSkillCatalog } from "../store/skillsSlice";
import { partnerSearchService } from "../services/partnerSearchService";

const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
export default function SearchPartners() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { token } = useAuth();
  const { catalog, status } = useSelector((state) => state.skills);
  const [filters, setFilters] = useState({
    skillId: "",
    expertise: "Beginner",
    radiusKm: "25",
    location: "",
    q: initialQuery,
  });
  const [coordinates, setCoordinates] = useState(null);
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (status === "idle") dispatch(fetchSkillCatalog());
  }, [dispatch, status]);
  const useLocation = () => {
    if (!navigator.geolocation)
      return setMessage(
        "Your browser does not support location search. Enter a city instead.",
      );
    setMessage("Getting your location...");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        setMessage("Location ready. Search to find partners nearby.");
      },
      () =>
        setMessage("Location access was unavailable. Enter a city instead."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const result = await partnerSearchService.search(
        { ...filters, ...(coordinates || {}) },
        token,
      );
      const normalizedQuery = filters.q.trim().toLocaleLowerCase();
      const matchingMembers = normalizedQuery
        ? result.members.filter((member) =>
            [member.name, member.bio, member.location,
              ...member.skills.map((skill) => skill.name)]
              .some((value) => value?.toLocaleLowerCase().includes(normalizedQuery)),
          )
        : result.members;
      setMembers(matchingMembers);
      setMessage(
        matchingMembers.length ? "" : "No partners match these filters yet.",
      );
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (initialQuery && token) submit({ preventDefault() {} });
  // Run the top bar search once when its query opens this page.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, token]);
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-700">Advanced search</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-800">
            Find skill-swap partners
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Filter members by a skill they teach, their expertise, and
            proximity.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="grid gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4"
        >
          <label className="text-sm font-medium text-slate-700 md:col-span-4">
            Search people or skills
            <input
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
              placeholder="Name, skill, city, or keyword"
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            Skill
            <select
              value={filters.skillId}
              onChange={(e) =>
                setFilters({ ...filters, skillId: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
            >
              <option value="">Any skill</option>
              {catalog.map((skill) => (
                <option
                  key={skill.id || skill._id}
                  value={skill.id || skill._id}
                >
                  {skill.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Minimum expertise
            <select
              value={filters.expertise}
              onChange={(e) =>
                setFilters({ ...filters, expertise: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
            >
              {levels.map((level) => (
                <option key={level}>{level}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            Within
            <select
              value={filters.radiusKm}
              onChange={(e) =>
                setFilters({ ...filters, radiusKm: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
            >
              {[5, 10, 25, 50, 100, 250, 500].map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700">
            City (optional)
            <input
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              placeholder="e.g. Karachi"
              className="mt-1 w-full rounded-lg border border-slate-200 p-2.5 text-sm"
            />
          </label>
          <div className="flex items-end gap-2 md:col-span-4">
            <button
              type="button"
              onClick={useLocation}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2.5 text-sm font-semibold text-blue-700"
            >
              <MapPin size={16} />
              {coordinates ? "Nearby location enabled" : "Use my location"}
            </button>
            <button
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              <Search size={16} />
              {loading ? "Searching..." : "Search partners"}
            </button>
          </div>
        </form>
        {message && (
          <p
            role="status"
            className="mt-5 rounded-lg bg-blue-50 p-3 text-sm text-blue-800"
          >
            {message}
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-bold text-blue-700">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    member.name[0]
                  )}
                </div>
                <div>
                  <h2 className="font-semibold text-slate-800">
                    {member.name}
                  </h2>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} />
                    {member.location || "Location not set"}
                    {member.distanceKm !== null &&
                      ` · ${member.distanceKm} km away`}
                  </p>
                </div>
              </div>
              {member.bio && (
                <p className="mt-3 line-clamp-2 text-sm text-slate-600">
                  {member.bio}
                </p>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                  >
                    {skill.name} · {skill.level}
                  </span>
                ))}
              </div>
              <Link
                to={`/members/${member.id}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
              >
                <UserRound size={15} />
                View profile
              </Link>
            </article>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
