"use client";

import { FaWhatsapp } from "react-icons/fa";
export default function WhatsAppFab() {
  const whatsappUrl = process.env.NEXT_PUBLIC_WHATSAPP_URL;

  if (!whatsappUrl) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-2 border border-white/10 rounded-lg backdrop-blur text-right leading-4">
        <span className="block">Join WhatsApp Group</span>
        <span className="block">For Latest Job Updates</span>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg hover:bg-emerald-400 transition"
        aria-label="Open WhatsApp"
      >
        <FaWhatsapp size={30} />
      </a>
    </div>
  );
}
