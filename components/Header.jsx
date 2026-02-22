"use client";

import Link from "next/link";

export default function Header() {
  return (
    <nav className="w-full backdrop-blur-xl bg-white/85 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT: Logo + Name */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Connektx Logo"
              className="h-16 w-auto"
            />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Connektx
            </span>
          </Link>

          {/* RIGHT: Articles + Join Now */}
          <div className="flex items-center space-x-8">
            <Link
              href="/articles"
              className="text-sm font-medium text-slate-600 hover:text-sky-600 transition"
            >
              Articles
            </Link>

            <a
              href="https://play.google.com/store/apps/details?id=app.rork.connektx"
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg"
            >
              Join Connektx
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}