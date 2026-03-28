export default function StatBox({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-xl font-black">{value ?? 0}</p>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
        {label}
      </p>
    </div>
  );
}
