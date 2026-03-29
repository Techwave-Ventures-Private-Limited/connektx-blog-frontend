export default function ExploreHeader({ query, setQuery, searching }) {
  return (
    <div className="mb-12 border-b border-white/10 pb-8 w-full flex items-start justify-between gap-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight uppercase text-white">
          Explore
        </h1>
        <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em]">
          Connect with the Connektx network.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="transition-all duration-200 w-36 sm:w-64 focus-within:w-72 md:focus-within:w-80">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users (min 4 characters)"
            className="w-full bg-black border border-white/10 px-4 py-3 text-xs uppercase tracking-widest outline-none focus:border-white/30"
          />
        </div>
        {searching && (
          <span className="text-[10px] uppercase tracking-widest text-slate-500">
            Searching...
          </span>
        )}
      </div>
    </div>
  );
}
