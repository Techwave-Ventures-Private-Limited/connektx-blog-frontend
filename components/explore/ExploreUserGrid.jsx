import ExploreUserCard from "@/components/explore/ExploreUserCard";

export default function ExploreUserGrid({ users, isSearchActive, searching }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <ExploreUserCard key={user._id} user={user} />
        ))}
      </div>

      {isSearchActive && !searching && users.length === 0 && (
        <p className="mt-10 text-center text-xs uppercase tracking-widest text-slate-500">
          No users found
        </p>
      )}
    </>
  );
}
