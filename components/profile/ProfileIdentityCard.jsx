import StatBox from "./StatBox";

export default function ProfileIdentityCard({
  user,
  badge,
  metaItems = [],
  actionSlot = null,
  footer = null,
  className = "",
}) {
  if (!user) return null;

  return (
    <div
      className={`bg-slate-950/50 backdrop-blur-2xl border border-white/5 p-6 rounded-[2.5rem] shadow-2xl relative ${className}`}
    >
      <div className="relative inline-block mb-6">
        <img
          src={user.profileImage || "/images/default-avatar.png"}
          className="w-32 h-32 lg:w-40 lg:h-40 rounded-[2rem] object-cover border-4 border-[#07090e] shadow-xl"
          alt={user.name}
        />
        {badge && (
          <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl border-4 border-[#07090e]">
            {badge}
          </div>
        )}
      </div>

      <h1 className="text-3xl font-black tracking-tighter mb-1">{user.name}</h1>
      <p className="text-blue-400 font-bold text-sm mb-4">@{user.username}</p>

      {user.headline && (
        <p className="text-slate-200 font-medium text-lg leading-snug mb-4">
          {user.headline}
        </p>
      )}

      <div className="space-y-3 text-sm text-slate-400 mb-6">
        {metaItems.map((item, index) => (
          <div key={`${item.label || "meta"}-${index}`} className="flex items-center gap-2">
            {item.icon ? item.icon : null}
            {item.href ? (
              <a href={item.href} className="text-blue-400 hover:underline">
                {item.label}
              </a>
            ) : (
              <span>{item.label}</span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 py-6 border-y border-white/5">
        <StatBox label="Followers" value={user.followerCount} />
        <StatBox label="Following" value={user.followingCount} />
        <StatBox label="Streak" value={user.streak} />
      </div>

      {actionSlot}
      {footer}
    </div>
  );
}
