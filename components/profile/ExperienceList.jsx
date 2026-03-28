import { formatDateRange } from "./historyUtils";

export default function ExperienceList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-600 italic">No experience recorded.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((exp) => (
        <div key={exp._id || exp.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <p className="font-bold text-slate-100">{exp.role || exp.position}</p>
          <p className="text-xs text-blue-400">{exp.name || exp.company}</p>
          <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold">
            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
          </p>
          {exp.desc && <p className="text-sm text-slate-300 mt-2">{exp.desc}</p>}
        </div>
      ))}
    </div>
  );
}
