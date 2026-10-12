import { Crosshair, Search, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { fetchSkillCatalog } from "../../store/skillsSlice";
const skillId = (skill) =>
  typeof skill === "string" ? skill : skill?.id || skill?._id;
export default function MatchFinder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { catalog, status } = useSelector((state) => state.skills);
  const learnIds = (user?.skillsToLearn || []).map(skillId).filter(Boolean);
  const [selectedSkill, setSelectedSkill] = useState(learnIds[0] || "");
  useEffect(() => {
    if (status === "idle") dispatch(fetchSkillCatalog());
  }, [dispatch, status]);
  useEffect(() => {
    if (!selectedSkill && learnIds[0]) setSelectedSkill(learnIds[0]);
  }, [selectedSkill, learnIds.join(",")]);
  const findMatches = () =>
    navigate(
      `/skills?${new URLSearchParams({ ...(selectedSkill ? { skillId: selectedSkill } : {}), ...(user?.location ? { location: user.location } : {}) })}`,
    );
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <h2 className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
        <Crosshair size={14} className="text-blue-600" />
        Find Your Perfect Match
      </h2>
      <p className="mt-2 text-[10px] font-semibold text-slate-600">
        I want to learn:
      </p>
      <select
        value={selectedSkill}
        onChange={(event) => setSelectedSkill(event.target.value)}
        className="mt-1 h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-[10px] text-slate-600 outline-none focus:border-blue-500"
      >
        <option value="">Any skill</option>
        {catalog.map((skill) => (
          <option key={skill.id || skill._id} value={skill.id || skill._id}>
            {skill.name}
          </option>
        ))}
      </select>
      <p className="mt-3 text-[10px] font-semibold text-slate-600">
        Show me users who teach:
      </p>
      <p className="mt-1 rounded-md bg-blue-50 px-2 py-2 text-[10px] text-blue-700">
        {catalog.find((skill) => (skill.id || skill._id) === selectedSkill)
          ?.name || "Any skill"}
      </p>
      <p className="mt-3 text-[10px] font-semibold text-slate-600">
        In my area:
      </p>
      <p className="relative mt-1 rounded-md border border-slate-200 py-2 pl-6 pr-2 text-[10px] text-slate-600">
        <MapPin
          size={11}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
        />
        {user?.location || "Any location"}
      </p>
      <button
        type="button"
        onClick={findMatches}
        className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-blue-600 text-[9px] font-semibold text-white hover:bg-blue-700"
      >
        <Search size={12} />
        Find Matches
      </button>
    </div>
  );
}
