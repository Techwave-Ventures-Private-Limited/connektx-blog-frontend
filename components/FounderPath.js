"use client";
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Rocket, Target, Users } from 'lucide-react';

export default function FounderPath({ onComplete }) {
  const [founderStep, setFounderStep] = useState(1);
  const [data, setData] = useState({
    startupName: '', building: '', role: '', website: '',
    stage: 'Ideation', funding: 'Bootstrapped',
    targetAudience: '', location: '',
    teamSize: '', lookingFor: '', commitment: 'Full-time', compensation: 'Equity'
  });

  const next = () => setFounderStep(s => s + 1);
  const back = () => setFounderStep(s => s - 1);

  const inputStyle = "w-full bg-slate-900/40 border border-blue-500/10 p-4 rounded-2xl outline-none focus:border-blue-400/50 focus:bg-slate-900/60 text-white placeholder-slate-500 mb-5 transition-all text-sm backdrop-blur-md shadow-lg shadow-blue-500/5";
  const labelStyle = "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="flex gap-3 mb-10 px-2">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`h-2 flex-1 rounded-full transition-all duration-700 ${step <= founderStep ? 'bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800'
              }`}
          />
        ))}
      </div>

      {/* CARD 1: THE STARTUP */}
      {founderStep === 1 && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-950/90 backdrop-blur-2xl p-8 rounded-3xl border border-blue-500/10 shadow-3xl animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Rocket className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500 tracking-tight">The Startup</h3>
                </div>
                <p className="text-sm text-slate-400 font-medium">Tell us about your venture's core details.</p>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-[10px] font-black font-mono border border-blue-500/20 tracking-tighter">01 / 03</span>
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>Startup Name *</label>
              <input className={inputStyle} placeholder="My Awesome Startup" value={data.startupName} onChange={(e) => setData({ ...data, startupName: e.target.value })} />

              <label className={labelStyle}>What are you building? *</label>
              <textarea className={inputStyle} rows={3} placeholder="A short pitch about your product..." value={data.building} onChange={(e) => setData({ ...data, building: e.target.value })} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                  <label className={labelStyle}>Your Role *</label>
                  <input className={inputStyle} placeholder="e.g. CEO, Founder" value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} />
                </div>
                <div>
                  <label className={labelStyle}>Website (Optional)</label>
                  <input className={inputStyle} placeholder="https://..." value={data.website} onChange={(e) => setData({ ...data, website: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelStyle}>Stage *</label>
                  <select className={inputStyle} value={data.stage} onChange={(e) => setData({ ...data, stage: e.target.value })}>
                    <option value="Ideation">Ideation</option>
                    <option value="Validation">Validation</option>
                    <option value="MVP">MVP</option>
                    <option value="Growth">Growth</option>
                  </select>
                </div>
                <div>
                  <label className={labelStyle}>Funding *</label>
                  <select className={inputStyle} value={data.funding} onChange={(e) => setData({ ...data, funding: e.target.value })}>
                    <option value="Bootstrapped">Bootstrapped</option>
                    <option value="Funded">Funded</option>
                    <option value="Grant">Grant</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={next} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4.5 rounded-2xl font-bold mt-4 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-600/20">
              Next: Audience & Market
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* CARD 2: AUDIENCE & LOCATION */}
      {founderStep === 2 && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-950/90 backdrop-blur-2xl p-8 rounded-3xl border border-blue-500/10 shadow-3xl animate-in fade-in slide-in-from-right-12 duration-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Target className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500 tracking-tight">Market Focus</h3>
                </div>
                <p className="text-sm text-slate-400 font-medium">Who are you building for and where?</p>
              </div>
              <span className="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-black font-mono border border-indigo-500/20 tracking-tighter">02 / 03</span>
            </div>

            <label className={labelStyle}>Target Audience</label>
            <textarea className={inputStyle} rows={4} placeholder="e.g. SaaS Founders in India, Gen-Z Students..." value={data.targetAudience} onChange={(e) => setData({ ...data, targetAudience: e.target.value })} />

            <label className={labelStyle}>Location / Market</label>
            <input className={inputStyle} placeholder="e.g. Global, Remote, Bangalore" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} />

            <div className="flex gap-4 mt-6">
              <button onClick={back} className="flex-1 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 p-4.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button onClick={next} className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-600/20">
                Next: Team Needs
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARD 3: TEAM & COMPENSATION */}
      {founderStep === 3 && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-950/90 backdrop-blur-2xl p-8 rounded-3xl border border-blue-500/10 shadow-3xl animate-in fade-in slide-in-from-right-12 duration-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 bg-cyan-500/10 rounded-xl">
                    <Users className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500 tracking-tight">Team Details</h3>
                </div>
                <p className="text-sm text-slate-400 font-medium">Define your team structure and needs.</p>
              </div>
              <span className="px-3.5 py-1.5 bg-cyan-500/10 text-cyan-300 rounded-full text-[10px] font-black font-mono border border-cyan-500/20 tracking-tighter">03 / 03</span>
            </div>

            <label className={labelStyle}>Current Team Size</label>
            <input className={inputStyle} type="number" placeholder="1" value={data.teamSize} onChange={(e) => setData({ ...data, teamSize: e.target.value })} />

            <label className={labelStyle}>What are you looking for?</label>
            <textarea className={inputStyle} rows={4} placeholder="e.g. Founding CT0, Design Partner..." value={data.lookingFor} onChange={(e) => setData({ ...data, lookingFor: e.target.value })} />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className={labelStyle}>Commitment Type</label>
                <select className={inputStyle} value={data.commitment} onChange={(e) => setData({ ...data, commitment: e.target.value })}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Compensation</label>
                <select className={inputStyle} value={data.compensation} onChange={(e) => setData({ ...data, compensation: e.target.value })}>
                  <option value="Equity">Equity</option>
                  <option value="Salary">Salary</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={back} className="flex-1 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 p-4.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button onClick={() => onComplete(data)} className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4.5 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20">
                Complete & Explore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
