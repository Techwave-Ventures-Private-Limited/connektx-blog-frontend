"use client";
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Briefcase, Sparkles, Zap } from 'lucide-react';

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

  const inputStyle = "w-full bg-slate-900/40 border border-blue-500/10 p-4 rounded-2xl outline-none focus:border-blue-400/50 focus:bg-slate-900/60 text-white placeholder-slate-500 mb-5 transition-all text-sm backdrop-blur-md shadow-lg shadow-blue-500/5";
  const labelStyle = "text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <div className="w-full max-w-xl mx-auto px-4">
      {/* Progress Bar */}
      <div className="flex gap-3 mb-10 px-2">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`h-2 flex-1 rounded-full transition-all duration-700 ${step <= builderStep ? 'bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-800'
              }`}
          />
        ))}
      </div>

      {/* CARD 1: CURRENT STATUS & SKILLS */}
      {builderStep === 1 && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-950/90 backdrop-blur-2xl p-8 rounded-3xl border border-blue-500/10 shadow-3xl animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500 tracking-tight">Your Expertise</h3>
                </div>
                <p className="text-sm text-slate-400 font-medium">Showcase your skills and experience.</p>
              </div>
              <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-300 rounded-full text-[10px] font-black font-mono border border-blue-500/20 tracking-tighter">01 / 03</span>
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>Current Role *</label>
              <input
                className={inputStyle}
                placeholder="e.g. Frontend Developer, Student, Freelancer"
                value={data.currentRole}
                onChange={(e) => setData({ ...data, currentRole: e.target.value })}
              />

              <label className={labelStyle}>Skills *</label>
              <input
                className={inputStyle}
                placeholder="React, Node.js, Python, UI Design..."
                value={data.skills}
                onChange={(e) => setData({ ...data, skills: e.target.value })}
              />

              <label className={labelStyle}>Experience</label>
              <input
                className={inputStyle}
                placeholder="e.g. 2 years, Self-taught, etc."
                value={data.experience}
                onChange={(e) => setData({ ...data, experience: e.target.value })}
              />

              <label className={labelStyle}>Projects</label>
              <textarea
                className={inputStyle}
                rows={3}
                placeholder="Briefly mention a few things you've built..."
                value={data.projects}
                onChange={(e) => setData({ ...data, projects: e.target.value })}
              />
            </div>

            <button onClick={next} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4.5 rounded-2xl font-bold mt-4 transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-600/20">
              Next: Career Goals
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* CARD 2: PREFERENCES */}
      {builderStep === 2 && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-950/90 backdrop-blur-2xl p-8 rounded-3xl border border-blue-500/10 shadow-3xl animate-in fade-in slide-in-from-right-12 duration-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 bg-indigo-500/10 rounded-xl">
                    <Zap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500 tracking-tight">The Next Step</h3>
                </div>
                <p className="text-sm text-slate-400 font-medium">What are you looking for in your next venture?</p>
              </div>
              <span className="px-3.5 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-[10px] font-black font-mono border border-indigo-500/20 tracking-tighter">02 / 03</span>
            </div>

            <label className={labelStyle}>What role are you looking for? *</label>
            <input
              className={inputStyle}
              placeholder="e.g. Co-founder, Lead Dev, Intern"
              value={data.lookingForRole}
              onChange={(e) => setData({ ...data, lookingForRole: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className={labelStyle}>Commitment *</label>
                <select className={inputStyle} value={data.commitment} onChange={(e) => setData({ ...data, commitment: e.target.value })}>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Weekend/Side">Weekend/Side</option>
                </select>
              </div>
              <div>
                <label className={labelStyle}>Compensation *</label>
                <select className={inputStyle} value={data.compensation} onChange={(e) => setData({ ...data, compensation: e.target.value })}>
                  <option value="Equity">Equity</option>
                  <option value="Salary">Salary</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={back} className="flex-1 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 p-4.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button onClick={next} className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group/btn shadow-xl shadow-blue-600/20">
                Next: Final Thoughts
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CARD 3: EXPECTATIONS */}
      {builderStep === 3 && (
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
          <div className="relative bg-slate-950/90 backdrop-blur-2xl p-8 rounded-3xl border border-blue-500/10 shadow-3xl animate-in fade-in slide-in-from-right-12 duration-700">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <div className="p-2 bg-cyan-500/10 rounded-xl">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500 tracking-tight">Platform Expectations</h3>
                </div>
                <p className="text-sm text-slate-400 font-medium">How can we help you succeed?</p>
              </div>
              <span className="px-3.5 py-1.5 bg-cyan-500/10 text-cyan-300 rounded-full text-[10px] font-black font-mono border border-cyan-500/20 tracking-tighter">03 / 03</span>
            </div>

            <label className={labelStyle}>What do you expect from this platform? (Optional)</label>
            <textarea
              className={inputStyle}
              rows={5}
              placeholder="Networking, finding teammates, learning, etc..."
              value={data.expectations}
              onChange={(e) => setData({ ...data, expectations: e.target.value })}
            />

            <div className="flex gap-4 mt-6">
              <button onClick={back} className="flex-1 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 p-4.5 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-slate-400 hover:text-white">
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
              <button
                disabled={loading}
                onClick={() => onComplete(data)}
                className="flex-[2] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4.5 rounded-2xl font-bold disabled:opacity-50 transition-all shadow-xl shadow-blue-600/20"
              >
                {loading ? "Saving Profile..." : "Complete & Explore"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
