"use client";
import { CheckCircle2, X } from 'lucide-react';

export default function AppDownloadDialog({ isOpen, onClose }) {

  const redirectToPlaystore = () => {
    window.open("https://play.google.com/store/apps/details?id=app.rork.connektx", "_blank");
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div className="relative bg-black border border-white/10 w-full max-w-sm rounded-sm p-8 shadow-2xl animate-in zoom-in-95 duration-300 text-center">
        
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
            <div className="relative bg-black border border-white/10 p-4 rounded-full">
              <CheckCircle2 className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Profile Created!</h2>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          The website is a basic view of your profile<br />Download our app to unlock full potential.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={redirectToPlaystore} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-sm transition-all text-sm uppercase tracking-widest"
          >
            Download Now
          </button>
          
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}