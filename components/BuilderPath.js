"use client";
import { useState } from 'react';
import { ChevronRight, ChevronLeft, Briefcase, Sparkles, Zap } from 'lucide-react';

export default function BuilderPath({ onComplete, loading }) {
  const [builderStep, setBuilderStep] = useState(1);

  // FORM STATE
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

  // ================= VALIDATION HELPERS =================

  // Utility to check empty values
  const isEmpty = (value) => !value || value.toString().trim() === "";

  // Step 1 validation (ALL fields required now)
  const validateStep1 = () => {
    return (
      !isEmpty(data.currentRole) &&
      !isEmpty(data.skills) &&
      !isEmpty(data.experience) &&
      !isEmpty(data.projects)
    );
  };

  // Step 2 validation
  const validateStep2 = () => {
    return (
      !isEmpty(data.lookingForRole) &&
      data.commitment &&
      data.compensation
    );
  };

  // Step 3 validation
  const validateStep3 = () => {
    return (
      !isEmpty(data.expectations)
    );
  };

  // ================= STYLES =================

  const inputStyle = "w-full bg-black border border-white/10 p-4 rounded-sm outline-none focus:border-white/30 text-white placeholder-slate-700 mb-6 transition-all text-sm tracking-widest";
  const labelStyle = "text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2 block";

  // Dynamic error border
  const errorBorder = (value) => isEmpty(value) ? 'border-red-500' : '';

  return (
    <div className="w-full max-w-xl mx-auto">

      {/* Progress Bar */}
      <div className="flex gap-2 mb-12 px-1">
        {[1, 2, 3].map(step => (
          <div
            key={step}
            className={`h-0.5 flex-1 transition-all duration-700 ${
              step <= builderStep ? 'bg-white' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* ================= STEP 1 ================= */}
      {builderStep === 1 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Your Expertise</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Professional Background</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 01</span>
          </div>

          <div className="space-y-1">

            <label className={labelStyle}>Current Role *</label>
            <input
              required
              className={`${inputStyle} ${errorBorder(data.currentRole)}`}
              value={data.currentRole}
              onChange={(e) => setData({ ...data, currentRole: e.target.value })}
            />

            <label className={labelStyle}>Skills *</label>
            <input
              required
              className={`${inputStyle} ${errorBorder(data.skills)}`}
              value={data.skills}
              onChange={(e) => setData({ ...data, skills: e.target.value })}
            />

            <label className={labelStyle}>Experience *</label>
            <input
              required
              className={`${inputStyle} ${errorBorder(data.experience)}`}
              value={data.experience}
              onChange={(e) => setData({ ...data, experience: e.target.value })}
            />

            <label className={labelStyle}>Projects *</label>
            <textarea
              required
              rows={3}
              className={`${inputStyle} ${errorBorder(data.projects)}`}
              value={data.projects}
              onChange={(e) => setData({ ...data, projects: e.target.value })}
            />
          </div>

          {/* Disable Next until valid */}
          <button
            onClick={next}
            disabled={!validateStep1()}
            className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold mt-4 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
          >
            Next: Career Goals <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ================= STEP 2 ================= */}
      {builderStep === 2 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Zap className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">The Next Step</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Venture Preferences</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 02</span>
          </div>

          <label className={labelStyle}>What are you looking for? *</label>
          <input
            required
            className={`${inputStyle} ${errorBorder(data.lookingForRole)}`}
            value={data.lookingForRole}
            onChange={(e) => setData({ ...data, lookingForRole: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-6 mt-2">
            <div>
              <label className={labelStyle}>Commitment *</label>
              <select
                required
                className={inputStyle}
                value={data.commitment}
                onChange={(e) => setData({ ...data, commitment: e.target.value })}
              >
                <option value="Full-time">FULL-TIME</option>
                <option value="Part-time">PART-TIME</option>
                <option value="Contract">CONTRACT</option>
                <option value="Weekend/Side">WEEKEND/SIDE</option>
              </select>
            </div>
            <div>
              <label className={labelStyle}>Compensation *</label>
              <select
                required
                className={inputStyle}
                value={data.compensation}
                onChange={(e) => setData({ ...data, compensation: e.target.value })}
              >
                <option value="Equity">EQUITY</option>
                <option value="Salary">SALARY</option>
                <option value="Flexible">FLEXIBLE</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button onClick={back} className="flex-1 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <ChevronLeft className="w-3 h-3" /> Back
            </button>

            {/* Disable Next until valid */}
            <button
              onClick={next}
              disabled={!validateStep2()}
              className="flex-[2] bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] disabled:opacity-50"
            >
              Next: Final Thoughts <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* ================= STEP 3 ================= */}
      {builderStep === 3 && (
        <div className="animate-in fade-in duration-500">
          <div className="flex justify-between items-end mb-10 border-b border-white/5 pb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="w-4 h-4 text-white" />
                <h3 className="text-xl font-bold uppercase tracking-tight">Ecosystem Needs</h3>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Growth & Support</p>
            </div>
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Step 03</span>
          </div>

          <label className={labelStyle}>What do you expect from this platform? *</label>
          <textarea
            required
            rows={5}
            className={`${inputStyle} ${errorBorder(data.expectations)}`}
            value={data.expectations}
            onChange={(e) => setData({ ...data, expectations: e.target.value })}
          />

          <div className="flex gap-4 mt-8">
            <button onClick={back} className="flex-1 border border-white/10 hover:border-white/30 text-slate-400 hover:text-white py-4 rounded-sm font-bold transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em]">
              <ChevronLeft className="w-3 h-3" /> Back
            </button>

            {/* Final submit only if valid */}
            <button
              disabled={!validateStep3() || loading}
              onClick={() => validateStep3() && onComplete(data)}
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