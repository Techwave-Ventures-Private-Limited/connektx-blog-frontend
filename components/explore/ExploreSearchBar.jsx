export default function ExploreSearchBar({ query, setQuery, searching }) {
  return (
    <div className="mb-10 flex items-center justify-end gap-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users (min 4 characters)"
        className="w-full sm:w-80 md:w-96 lg:w-[420px] bg-black border border-white/10 px-4 py-3 text-xs uppercase tracking-widest outline-none focus:border-white/30"
      />
      {searching && (
        <span className="text-[10px] uppercase tracking-widest text-slate-500">
          Searching...
        </span>
      )}
    </div>
  );
}
