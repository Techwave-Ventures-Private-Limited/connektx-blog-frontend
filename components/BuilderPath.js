"use client";
import { useState } from 'react';

export default function BuilderPath({ onComplete, loading }) {
  const [builderStep, setBuilderStep] = useState(1);
  const [data, setData] = useState({
    currentRole: '',
    skills: '',
    experience: '',
    projects: '',
    lookingForRole: '',
    commitment: 'Part-time',
    compensation: 'Equity',
    expectations: ''
  });

  const next = () => setBuilderStep(s => s + 1);
  const back = () => setBuilderStep(s => s - 1);

  const inputStyle = "w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl outline-none focus:border-blue-500 text-white placeholder-zinc-500 mb-4 transition-all text-sm";
  const labelStyle = "text-[10px] font-bold text-zinc-500 uppercase ml-1 mb-1 block";

  return (
    <div className="w-full max-w-lg mx-auto">
      
      {/* CARD 1: CURRENT STATUS & SKILLS */}
      {builderStep === 1 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">Your Expertise</h3>
            <span className="text-xs text-zinc-500 font-mono">1 / 3</span>
          </div>
          
          <label className={labelStyle}>Current Role *</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. Frontend Developer, Student, Freelancer" 
            value={data.currentRole} 
            onChange={(e) => setData({...data, currentRole: e.target.value})} 
          />

          <label className={labelStyle}>Skills *</label>
          <input 
            className={inputStyle} 
            placeholder="React, Node.js, Python, UI Design..." 
            value={data.skills} 
            onChange={(e) => setData({...data, skills: e.target.value})} 
          />

          <label className={labelStyle}>Experience</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. 2 years, Self-taught, etc." 
            value={data.experience} 
            onChange={(e) => setData({...data, experience: e.target.value})} 
          />

          <label className={labelStyle}>Projects</label>
          <textarea 
            className={inputStyle} 
            rows={2} 
            placeholder="Briefly mention a few things you've built..." 
            value={data.projects} 
            onChange={(e) => setData({...data, projects: e.target.value})} 
          />

          <button 
            onClick={next} 
            className="w-full bg-blue-600 p-4 rounded-xl font-bold mt-2 hover:bg-blue-700 transition-all"
          >
            Next: Career Goals
          </button>
        </div>
      )}

      {/* CARD 2: PREFERENCES */}
      {builderStep === 2 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">The Next Step</h3>
            <span className="text-xs text-zinc-500 font-mono">2 / 3</span>
          </div>

          <label className={labelStyle}>What role are you looking for? *</label>
          <input 
            className={inputStyle} 
            placeholder="e.g. Co-founder, Lead Dev, Intern" 
            value={data.lookingForRole} 
            onChange={(e) => setData({...data, lookingForRole: e.target.value})} 
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelStyle}>Commitment *</label>
              <select 
                className={inputStyle} 
                value={data.commitment} 
                onChange={(e) => setData({...data, commitment: e.target.value})}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Weekend/Side">Weekend/Side</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Compensation *</label>
              <select 
                className={inputStyle} 
                value={data.compensation} 
                onChange={(e) => setData({...data, compensation: e.target.value})}
              >
                <option value="Equity">Equity</option>
                <option value="Salary">Salary</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={back} className="flex-1 bg-zinc-800 p-4 rounded-xl font-bold">Back</button>
            <button onClick={next} className="flex-[2] bg-blue-600 p-4 rounded-xl font-bold">Next: Final Thoughts</button>
          </div>
        </div>
      )}

      {/* CARD 3: EXPECTATIONS */}
      {builderStep === 3 && (
        <div className="bg-[#111] p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-right-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-500">Platform Expectations</h3>
            <span className="text-xs text-zinc-500 font-mono">3 / 3</span>
          </div>

          <label className={labelStyle}>What do you expect from this platform? (Optional)</label>
          <textarea 
            className={inputStyle} 
            rows={5} 
            placeholder="Networking, finding teammates, learning, etc..." 
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