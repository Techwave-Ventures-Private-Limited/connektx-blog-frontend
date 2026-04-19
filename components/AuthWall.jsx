"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function AuthWall({
  isLoggedIn,
  profileCompletion,
  onClose
}) {
  const router = useRouter();

  if (isLoggedIn && profileCompletion >= 70) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black border border-white/20 rounded-lg p-8 max-w-md w-full relative">

        {/* Close button (optional - remove if you want it non-dismissible) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {!isLoggedIn ? (
          // Not logged in wall
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Login Required
            </h2>
            <p className="text-slate-400 mb-6">
              You need to be logged in to view job listings and apply to opportunities.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push("/login")}
                className="flex-1 bg-white text-black py-3 px-6 rounded-sm font-medium hover:bg-white/90 transition"
              >
                Login
              </button>
              <button
                onClick={() => router.push("/signup")}
                className="flex-1 border border-white/20 text-white py-3 px-6 rounded-sm font-medium hover:border-white/40 transition"
              >
                Sign Up
              </button>
            </div>
          </>
        ) : (
          // Profile incomplete wall
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              Complete Your Profile
            </h2>
            <p className="text-slate-400 mb-2">
              To access job listings, please complete at least 70% of your profile.
            </p>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400">Profile Completion</span>
                <span className="text-white font-medium">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
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
          </>
        )}
      </div>
    </div>
  );
}
