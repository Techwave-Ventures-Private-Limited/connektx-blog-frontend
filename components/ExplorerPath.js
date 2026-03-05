"use client";
import { useState } from 'react';

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

  const inputStyle = "w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl outline-none focus:border-blue-500 text-white placeholder-zinc-500 mb-4 transition-all text-sm";
  const labelStyle = "text-[10px] font-bold text-zinc-500 uppercase ml-1 mb-1 block";

  return (
    <div className="w-full max-w-lg mx-auto">
      
      {/* CARD 1: IDENTITY (Matches Builder) */}
      {explorerStep === 1 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">Your Identity</h3>
            <span className="text-xs text-zinc-500 font-mono">1 / 2</span>
          </div>
          
          <label className={labelStyle}>Current Role *</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. Designer, Investor, Tech Enthusiast" 
            value={data.currentRole} 
            onChange={(e) => setData({...data, currentRole: e.target.value})} 
          />

          <label className={labelStyle}>Skills / Expertise *</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. Product Mgmt, Marketing, Java..." 
            value={data.skills} 
            onChange={(e) => setData({...data, skills: e.target.value})} 
          />

          <label className={labelStyle}>Experience Level</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. 5 years, Career spanning, etc." 
            value={data.experience} 
            onChange={(e) => setData({...data, experience: e.target.value})} 
          />

          <label className={labelStyle}>Notable Projects / Background</label>
          <textarea 
            className={inputStyle} 
            rows={2} 
            placeholder="What have you worked on previously?" 
            value={data.projects} 
            onChange={(e) => setData({...data, projects: e.target.value})} 
          />

          <button 
            onClick={next} 
            className="w-full bg-blue-600 p-4 rounded-xl font-bold mt-2 hover:bg-blue-700 transition-all"
          >
            Next: Community Goals
          </button>
        </div>
      )}

      {/* CARD 2: CONTRIBUTION & INTENT */}
      {explorerStep === 2 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">Community & Goals</h3>
            <span className="text-xs text-zinc-500 font-mono">2 / 2</span>
          </div>

          <label className={labelStyle}>How can you help others?</label>
          <textarea 
            className={inputStyle} 
            rows={2} 
            placeholder="Mentorship, feedback, networking intros..." 
            value={data.helpOthers} 
            onChange={(e) => setData({...data, helpOthers: e.target.value})} 
          />

          <label className={labelStyle}>Why are you here?</label>
          <textarea 
            className={inputStyle} 
            rows={2} 
            placeholder="Finding inspiration, meeting founders, etc." 
            value={data.whyHere} 
            onChange={(e) => setData({...data, whyHere: e.target.value})} 
          />

          <label className={labelStyle}>What do you expect from this platform?</label>
          <textarea 
            className={inputStyle} 
            rows={3} 
            placeholder="Networking, high-signal feed, learning..." 
            value={data.expectations} 
            onChange={(e) => setData({...data, expectations: e.target.value})} 
          />

          <div className="flex gap-4">
            <button onClick={back} className="flex-1 bg-zinc-800 p-4 rounded-xl font-bold">Back</button>
            <button 
              disabled={loading}
              onClick={() => onComplete(data)} 
              className="flex-[2] bg-blue-600 p-4 rounded-xl font-bold disabled:opacity-50 transition-all"
            >
              {loading ? "Saving Profile..." : "Complete & Explore"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}