export default function OnboardingDetailsGrid({ details }) {
  const entries = Object.entries(details || {});

  if (entries.length === 0) {
    return <p className="text-sm text-slate-400">No onboarding details yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {entries.map(([key, value]) => (
        <div key={key}>
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
            {key.replace(/([A-Z])/g, " $1")}
          </p>
          <p className="text-lg font-bold text-white leading-tight">{value || "---"}</p>
        </div>
      ))}
    </div>
  );
}
