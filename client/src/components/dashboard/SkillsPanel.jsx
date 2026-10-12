import { Plus, CheckCircle2, Circle } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { useAuth } from "../../auth/AuthContext";
import { fetchSkillCatalog } from "../../store/skillsSlice";

function SkillTag({ children, learning = false }) {
  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1
        rounded-full
        px-2
        py-1
        text-[10px]
        font-medium
        ${
          learning
            ? "border border-indigo-100 bg-indigo-50 text-indigo-700"
            : "border border-emerald-100 bg-emerald-50 text-emerald-700"
        }
      `}
    >
      {learning ? (
        <Circle size={8} />
      ) : (
        <CheckCircle2 size={9} className="fill-emerald-500 text-white" />
      )}

      {children}
    </span>
  );
}

export default function SkillsPanel() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { catalog, status } = useSelector((state) => state.skills);
  const teachSkills = user?.skillsToTeach || [];
  const learnSkills = user?.skillsToLearn || [];
  const selectedSkills = [...teachSkills, ...learnSkills];
  const needsCatalog = selectedSkills.some(
    (skill) => typeof skill === "string" || !skill?.name,
  );
  const skillsById = useMemo(
    () => new Map(catalog.map((skill) => [skill._id || skill.id, skill])),
    [catalog],
  );

  useEffect(() => {
    if (needsCatalog && status === "idle") dispatch(fetchSkillCatalog());
  }, [dispatch, needsCatalog, status]);

  const renderSkills = (skills, learning) => {
    if (!skills.length) {
      return (
        <p className="text-[10px] text-slate-400">No skills selected yet.</p>
      );
    }

    return skills.map((skill) => {
      const id = typeof skill === "string" ? skill : skill.id || skill._id;
      const name =
        typeof skill === "string"
          ? skillsById.get(skill)?.name
          : skill.name || skillsById.get(id)?.name;
      if (!name)
        return (
          <p key={id} className="text-[10px] text-slate-400">
            Loading selected skills...
          </p>
        );
      return (
        <SkillTag key={id || name} learning={learning}>
          {name}
        </SkillTag>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {/* Teach */}

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
            🎓 Skills I Teach
          </h2>

          <Link
            to="/profile"
            className="flex items-center gap-1 text-[10px] font-semibold text-blue-600"
          >
            <Plus size={10} />
            Add Skill
          </Link>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {renderSkills(teachSkills, false)}
        </div>
      </div>

      {/* Learn */}

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
            📖 Skills I Want to Learn
          </h2>

          <Link
            to="/profile"
            className="flex items-center gap-1 text-[10px] font-semibold text-blue-600"
          >
            <Plus size={10} />
            Add Skill
          </Link>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {renderSkills(learnSkills, true)}
        </div>
      </div>
    </div>
  );
}

