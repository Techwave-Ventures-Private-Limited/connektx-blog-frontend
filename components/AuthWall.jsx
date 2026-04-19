"use client";

import { useRouter } from "next/navigation";

export default function AuthWall({
  profileCompletion,
  title = "Complete Your Profile",
  message = "Please complete at least 70% of your profile to access this feature."
}) {
  const router = useRouter();

  // Only show if profile completion is less than 70%
  if (profileCompletion >= 70) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-lg p-8 max-w-md w-full relative">
        <h2 className="text-2xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-slate-400 mb-2">
          {message}
        </p>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Profile Completion</span>
            <span className="text-white font-medium">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                profileCompletion < 40
                  ? "bg-red-500"
                  : profileCompletion < 70
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${profileCompletion}%` }}
            />
          </div>
        </div>
        <button
          onClick={() => router.push("/profile")}
          className="w-full bg-white text-black py-3 px-6 rounded-sm font-medium hover:bg-white/90 transition"
        >
          Complete Profile
        </button>
      </div>
    </div>
  );
}
