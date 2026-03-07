"use client";
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Search, Heart, Compass } from 'lucide-react';

export default function ExplorerPath({ onComplete, loading }) {
  const [explorerStep, setExplorerStep] = useState(1);
  const [data, setData] = useState({
    currentRole: '',
    skills: '',
    experience: '',
    projects: '',
    helpOthers: '',
    whyHere: '',
    expectations: ''
  });

  const next = () => setExplorerStep(s => s + 1);
  const back = () => setExplorerStep(s => s - 1);

  // Minimalist architectural style matching Founder/Builder
  const inputStyle = "w-full bg-black border border-white/10 p-4 rounded-sm outline-none focus:border-white/30 text-white placeholder-slate-700 mb-6 transition-all text-sm tracking-widest";
  const labelStyle = "text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block";

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress Bar - Minimalist Thin Line */}
      <div className="flex gap-2 mb-12 px-1">
        {[1, 2].map(step => (
          <div
            key={step}
            className={`h-0.5 flex-1 transition-all duration-700 ${
              step <= explorerStep ? 'bg-white' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: IDENTITY */}
      {explorerStep === 1 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Compass className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Your Identity</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Professional Persona</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 01</span>
          </div>
          
          <div className="space-y-1">
            <label className={labelStyle}>Current Role *</label>
            <input 
              className={inputStyle} 
              placeholder="E.G. DESIGNER, INVESTOR, ENTHUSIAST" 
              value={data.currentRole} 
              onChange={(e) => setData({...data, currentRole: e.target.value})} 
            />

            <label className={labelStyle}>Skills / Expertise *</label>
            <input 
              className={inputStyle} 
              placeholder="E.G. PRODUCT MGMT, MARKETING" 
              value={data.skills} 
              onChange={(e) => setData({...data, skills: e.target.value})} 
            />

            <label className={labelStyle}>Experience Level</label>
            <input 
              className={inputStyle} 
              placeholder="E.G. 5 YEARS, CAREER SPANNING" 
              value={data.experience} 
              onChange={(e) => setData({...data, experience: e.target.value})} 
            />

            <label className={labelStyle}>Notable Projects / Background</label>
            <textarea 
              className={inputStyle} 
              rows={2} 
              placeholder="PAST WORK OR ACHIEVEMENTS..." 
              value={data.projects} 
              onChange={(e) => setData({...data, projects: e.target.value})} 
            />
          </div>

          <button 
            onClick={next} 
            className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold mt-4 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
          >
            Next: Community Goals <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* STEP 2: CONTRIBUTION & INTENT */}
      {explorerStep === 2 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Community Goals</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Intent & Contribution</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 02</span>
          </div>

          <label className={labelStyle}>How can you help others?</label>
          <textarea 
            className={inputStyle} 
            rows={2} 
            placeholder="MENTORSHIP, FEEDBACK, NETWORKING..." 
            value={data.helpOthers} 
            onChange={(e) => setData({...data, helpOthers: e.target.value})} 
          />

          <label className={labelStyle}>Why are you here?</label>
          <textarea 
            className={inputStyle} 
            rows={2} 
            placeholder="FINDING INSPIRATION, MEETING FOUNDERS..." 
            value={data.whyHere} 
            onChange={(e) => setData({...data, whyHere: e.target.value})} 
          />

          <label className={labelStyle}>What do you expect from this platform?</label>
          <textarea 
            className={inputStyle} 
            rows={3} 
            placeholder="HIGH-SIGNAL FEED, LEARNING, CONNECTING..." 
            value={data.expectations} 
            onChange={(e) => setData({...data, expectations: e.target.value})} 
          />

          <div className="flex gap-4 mt-8">
            <button onClick={back} className="flex-1 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <ChevronLeft className="w-3 h-3" /> Back
            </button>
            <button 
              disabled={loading}
              onClick={() => onComplete(data)} 
              className="flex-[2] bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
            >
              {loading ? "SAVING..." : "Complete & Explore"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}