"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { appApi } from "@/lib/appApi";
import { userApi } from "@/lib/userApi";

export default function AppHeader({ description, rightSlot }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const username = Cookies.get("username");

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const res = await userApi.getSelf();
        setProfileImage(res?.body?.profileImage || "");
      } catch (error) {
        setProfileImage("");
      }
    };

    loadProfileImage();
  }, []);

  const goToProfile = () => {
    setMenuOpen(false);
    if (username) {
      router.push(`/profile/${username}`);
    } else {
      router.push("/profile");
    }
  };

  const handleLogout = () => {
    setMenuOpen(false);
    appApi.logout();
  };

  return (
    <div className="mb-12 border-b border-white/10 pb-8 w-full flex items-start justify-between gap-6">
      <div className="text-left">
        <Link href="/explore" className="inline-block">
          <h1 className="text-3xl font-bold tracking-tight uppercase text-white">
            Connektx
          </h1>
        </Link>
        {description && (
          <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em]">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="h-9 min-w-[88px] px-4 border border-white/10 text-[10px] uppercase tracking-widest text-white hover:bg-white/10 transition rounded-sm flex items-center justify-center"
          >
            Explore
          </Link>
          <Link
            href="/jobs"
            className="h-9 min-w-[88px] px-4 border border-white/10 text-[10px] uppercase tracking-widest text-white hover:bg-white/10 transition rounded-sm flex items-center justify-center"
          >
            Jobs
          </Link>
        </div>

        {rightSlot}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="h-9 min-w-[88px] flex items-center justify-center gap-2 border border-white/10 px-3 rounded-sm hover:bg-white/10 transition"
            aria-label="Profile menu"
          >
            <img
              src={profileImage || "/images/default-avatar.png"}
              alt="Profile"
              className="w-6 h-6 rounded-full object-cover"
            />
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-black border border-white/10 rounded-sm shadow-lg z-20">
              <button
                type="button"
                onClick={goToProfile}
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-slate-200 hover:bg-white/10"
              >
                Profile
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-xs uppercase tracking-widest text-slate-200 hover:bg-white/10 flex items-center gap-2"
              >
                <LogOut size={12} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
