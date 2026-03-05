"use client";
import { useState } from 'react';

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

  const inputStyle = "w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl outline-none focus:border-blue-500 text-white placeholder-zinc-500 mb-4 transition-all text-sm";
  const labelStyle = "text-[10px] font-bold text-zinc-500 uppercase ml-1 mb-1 block";

  return (
    <div className="w-full max-w-lg mx-auto">
      
      {/* CARD 1: THE STARTUP */}
      {founderStep === 1 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">The Startup</h3>
            <span className="text-xs text-zinc-500 font-mono">1 / 3</span>
          </div>
          
          <label className={labelStyle}>Startup Name *</label>
          <input className={inputStyle} value={data.startupName} onChange={(e) => setData({...data, startupName: e.target.value})} />

          <label className={labelStyle}>What are you building? *</label>
          <textarea className={inputStyle} rows={2} value={data.building} onChange={(e) => setData({...data, building: e.target.value})} />

          <label className={labelStyle}>Your Role *</label>
          <input className={inputStyle} value={data.role} onChange={(e) => setData({...data, role: e.target.value})} />

          <label className={labelStyle}>Website (Optional)</label>
          <input className={inputStyle} placeholder="https://..." value={data.website} onChange={(e) => setData({...data, website: e.target.value})} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Stage *</label>
              <select className={inputStyle} value={data.stage} onChange={(e) => setData({...data, stage: e.target.value})}>
                <option value="Ideation">Ideation</option>
                <option value="Validation">Validation</option>
                <option value="MVP">MVP</option>
                <option value="Growth">Growth</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Funding *</label>
              <select className={inputStyle} value={data.funding} onChange={(e) => setData({...data, funding: e.target.value})}>
                <option value="Bootstrapped">Bootstrapped</option>
                <option value="Funded">Funded</option>
                <option value="Grant">Grant</option>
              </select>
            </div>
          </div>

          <button onClick={next} className="w-full bg-blue-600 p-4 rounded-xl font-bold mt-2 hover:bg-blue-700 transition-all">Next: Audience & Market</button>
        </div>
      )}

      {/* CARD 2: AUDIENCE & LOCATION */}
      {founderStep === 2 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">Market Focus</h3>
            <span className="text-xs text-zinc-500 font-mono">2 / 3</span>
          </div>

          <label className={labelStyle}>Target Audience</label>
          <textarea className={inputStyle} rows={3} placeholder="Who are your users?" value={data.targetAudience} onChange={(e) => setData({...data, targetAudience: e.target.value})} />

          <label className={labelStyle}>Location / Market</label>
          <input className={inputStyle} placeholder="e.g. India, Remote, Global" value={data.location} onChange={(e) => setData({...data, location: e.target.value})} />

          <div className="flex gap-4">
            <button onClick={back} className="flex-1 bg-zinc-800 p-4 rounded-xl font-bold">Back</button>
            <button onClick={next} className="flex-[2] bg-blue-600 p-4 rounded-xl font-bold">Next: Team Needs</button>
          </div>
        </div>
      )}

      {/* CARD 3: TEAM & COMPENSATION */}
      {founderStep === 3 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">Team Details</h3>
            <span className="text-xs text-zinc-500 font-mono">3 / 3</span>
          </div>

          <label className={labelStyle}>Current Team Size</label>
          <input className={inputStyle} type="number" placeholder="1" value={data.teamSize} onChange={(e) => setData({...data, teamSize: e.target.value})} />

          <label className={labelStyle}>What are you looking for?</label>
          <textarea className={inputStyle} rows={3} placeholder="Team members, investors, etc." value={data.lookingFor} onChange={(e) => setData({...data, lookingFor: e.target.value})} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Commitment Type</label>
              <select className={inputStyle} value={data.commitment} onChange={(e) => setData({...data, commitment: e.target.value})}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Compensation</label>
              <select className={inputStyle} value={data.compensation} onChange={(e) => setData({...data, compensation: e.target.value})}>
                <option value="Equity">Equity</option>
                <option value="Salary">Salary</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={back} className="flex-1 bg-zinc-800 p-4 rounded-xl font-bold">Back</button>
            <button onClick={() => onComplete(data)} className="flex-[2] bg-blue-600 p-4 rounded-xl font-bold">Complete & Explore</button>
          </div>
        </div>
      )}
    </div>
  );
}