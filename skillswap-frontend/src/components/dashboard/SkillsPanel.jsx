import { Plus, CheckCircle2, Circle } from "lucide-react";

const teachSkills = [
  "Python Programming",
  "Web Development",
  "Database Design",
  "Computer Networks",
];

const learnSkills = [
  "Graphic Design",
  "Video Editing",
  "Cooking",
  "English Language",
  "UI/UX Design",
];

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
        text-[8px]
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
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

      {/* Teach */}

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">

        <div className="mb-2 flex items-center justify-between">

          <h2 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
            🎓 Skills I Teach
          </h2>

          <button className="flex items-center gap-1 text-[8px] font-semibold text-blue-600">
            <Plus size={10} />
            Add Skill
          </button>

        </div>

        <div className="flex flex-wrap gap-1.5">

          {teachSkills.map((skill) => (
            <SkillTag key={skill}>
              {skill}
            </SkillTag>
          ))}

        </div>

      </div>

      {/* Learn */}

      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">

        <div className="mb-2 flex items-center justify-between">

          <h2 className="flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
            📖 Skills I Want to Learn
          </h2>

          <button className="flex items-center gap-1 text-[8px] font-semibold text-blue-600">
            <Plus size={10} />
            Add Skill
          </button>

        </div>

        <div className="flex flex-wrap gap-1.5">

          {learnSkills.map((skill) => (
            <SkillTag key={skill} learning>
              {skill}
            </SkillTag>
          ))}

        </div>

      </div>

    </div>
  );
}