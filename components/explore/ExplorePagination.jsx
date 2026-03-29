export default function ExplorePagination({
  loading,
  hasMore,
  isSearchActive,
  onLoadMore,
}) {
  return (
    <div className="mt-16 flex justify-center">
      {loading ? (
        <p className="text-slate-500 text-xs uppercase tracking-widest">
          Loading...
        </p>
      ) : (
        !isSearchActive &&
        hasMore && (
          <button
            onClick={onLoadMore}
            className="px-8 py-3 border border-white/20 text-white text-xs font-bold hover:bg-white hover:text-black transition-all uppercase tracking-widest"
          >
            Load More
          </button>
        )
      )}
    </div>
  );
}
