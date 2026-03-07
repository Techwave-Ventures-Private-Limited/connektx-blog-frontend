"use client";
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Rocket, Target, Users } from 'lucide-react';

export default function FounderPath({ onComplete, loading }) {
  const [founderStep, setFounderStep] = useState(1);
  const [data, setData] = useState({
    startupName: '', building: '', role: '', website: '',
    stage: 'Ideation', funding: 'Bootstrapped',
    targetAudience: '', location: '',
    teamSize: '', lookingFor: '', commitment: 'Full-time', compensation: 'Equity'
  });

  const next = () => setFounderStep(s => s + 1);
  const back = () => setFounderStep(s => s - 1);

  // Minimalist style matching Explore/Auth
  const inputStyle = "w-full bg-black border border-white/10 p-4 rounded-sm outline-none focus:border-white/30 text-white placeholder-slate-700 mb-6 transition-all text-sm tracking-widest";
  const labelStyle = "text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block";

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Progress Bar - Minimalist Thin Line */}
      <div className="flex gap-2 mb-12 px-1">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`h-0.5 flex-1 transition-all duration-700 ${
              step <= founderStep ? 'bg-white' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* STEP 1: THE STARTUP */}
      {founderStep === 1 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Rocket className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">The Startup</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Core Venture Details</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 01</span>
          </div>

          <div className="space-y-1">
            <label className={labelStyle}>Startup Name *</label>
            <input className={inputStyle} placeholder="CONNEKTX" value={data.startupName} onChange={(e) => setData({ ...data, startupName: e.target.value })} />

            <label className={labelStyle}>What are you building? *</label>
            <textarea className={inputStyle} rows={3} placeholder="A SHORT PITCH..." value={data.building} onChange={(e) => setData({ ...data, building: e.target.value })} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Your Role *</label>
                <input className={inputStyle} placeholder="E.G. FOUNDER & COO" value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} />
              </div>
              <div>
                <label className={labelStyle}>Website</label>
                <input className={inputStyle} placeholder="HTTPS://..." value={data.website} onChange={(e) => setData({ ...data, website: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelStyle}>Stage</label>
                <select className={inputStyle} value={data.stage} onChange={(e) => setData({ ...data, stage: e.target.value })}>
                  <option value="Ideation">IDEATION</option>
                  <option value="Validation">VALIDATION</option>
                  <option value="MVP">MVP</option>
                  <option value="Growth">GROWTH</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Funding</label>
                <select className={inputStyle} value={data.funding} onChange={(e) => setData({ ...data, funding: e.target.value })}>
                  <option value="Bootstrapped">BOOTSTRAPPED</option>
                  <option value="Funded">FUNDED</option>
                  <option value="Grant">GRANT</option>
                </select>
              </div>
            </div>
          </div>

          <button onClick={next} className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold mt-4 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]">
            Next: Market Focus <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* STEP 2: AUDIENCE & LOCATION */}
      {founderStep === 2 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Market Focus</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Target Audience & Reach</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 02</span>
          </div>

          <label className={labelStyle}>Target Audience</label>
          <textarea className={inputStyle} rows={4} placeholder="E.G. SAAS FOUNDERS, GEN-Z BUILDERS..." value={data.targetAudience} onChange={(e) => setData({ ...data, targetAudience: e.target.value })} />

          <label className={labelStyle}>Location / Market</label>
          <input className={inputStyle} placeholder="E.G. GLOBAL, REMOTE, PUNE" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} />

          <div className="flex gap-4 mt-8">
            <button onClick={back} className="flex-1 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <ChevronLeft className="w-3 h-3" /> Back
            </button>
            <button onClick={next} className="flex-[2] bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]">
              Next: Team Needs <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TEAM & COMPENSATION */}
      {founderStep === 3 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Team Details</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Structure & Requirements</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 03</span>
          </div>

          <label className={labelStyle}>Current Team Size</label>
          <input className={inputStyle} type="number" placeholder="1" value={data.teamSize} onChange={(e) => setData({ ...data, teamSize: e.target.value })} />

          <label className={labelStyle}>What are you looking for?</label>
          <textarea className={inputStyle} rows={4} placeholder="E.G. FOUNDING CTO, DESIGN PARTNER..." value={data.lookingFor} onChange={(e) => setData({ ...data, lookingFor: e.target.value })} />

          <div className="grid grid-cols-2 gap-6 mt-2">
            <div>
              <label className={labelStyle}>Commitment Type</label>
              <select className={inputStyle} value={data.commitment} onChange={(e) => setData({ ...data, commitment: e.target.value })}>
                <option value="Full-time">FULL-TIME</option>
                <option value="Part-time">PART-TIME</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Compensation</label>
              <select className={inputStyle} value={data.compensation} onChange={(e) => setData({ ...data, compensation: e.target.value })}>
                <option value="Equity">EQUITY</option>
                <option value="Salary">SALARY</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={back} className="flex-1 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <ChevronLeft className="w-3 h-3" /> Back
            </button>
            <button 
              onClick={() => onComplete(data)} 
              disabled={loading}
              className="flex-[2] bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              {loading ? "SAVING..." : "Complete & Explore"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}