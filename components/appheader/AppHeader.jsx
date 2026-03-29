"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { User, ChevronDown, LogOut } from "lucide-react";
import { appApi } from "@/lib/appApi";

export default function AppHeader({ description, rightSlot }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const username = Cookies.get("username");

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
        <h1 className="text-3xl font-bold tracking-tight uppercase text-white">
          Connektx
        </h1>
        {description && (
          <p className="text-slate-500 text-[10px] mt-2 uppercase tracking-[0.3em]">
            {description}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {rightSlot}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 border border-white/10 px-3 py-2 rounded-sm hover:bg-white/10 transition"
            aria-label="Profile menu"
          >
            <User size={16} className="text-white" />
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
