import { formatDateRange } from "./historyUtils";

export default function EducationList({ items }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-slate-600 italic">No education recorded.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((edu) => (
        <div key={edu._id || edu.id} className="bg-white/5 border border-white/5 p-4 rounded-2xl">
          <p className="font-bold text-slate-100">{edu.degree || edu.title}</p>
          <p className="text-xs text-blue-400">{edu.school || edu.name}</p>
          <p className="text-[11px] text-slate-500 mt-1 uppercase font-bold">
            {formatDateRange(edu.startDate, edu.endDate, edu.current)}
          </p>
        </div>
      ))}
    </div>
  );
}
