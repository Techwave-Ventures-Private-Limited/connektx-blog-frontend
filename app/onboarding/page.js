"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/api';
import FounderPath from '@/components/FounderPath';
import BuilderPath from '@/components/BuilderPath';
import { Rocket, Users, Search, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Questions, 3: App CTA
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleFinalSubmit = async (onboardingData) => {
    setLoading(true);
    try {
      const response = await appApi.signup({ ...onboardingData, type: role });
      if (response.data.success || response.status === 201) {
        setStep(3);
      }
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      alert("Failed to save profile. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-2xl relative">

        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div className="text-center animate-in fade-in zoom-in duration-700">
            <div className="mb-12">
              <h1 className="text-5xl font-black tracking-tighter mb-3 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">Connektx</h1>
              <p className="text-slate-400 font-medium text-lg">Tell us what brings you here today.</p>
            </div>

            <div className="grid gap-5 md:grid-cols-1 max-w-lg mx-auto">
              <RoleCard
                title="I am a Founder"
                desc="I am building a startup and need a team."
                icon={<Rocket className="w-6 h-6 text-blue-400" />}
                onClick={() => handleRoleSelect('Founder')}
                gradient="from-blue-600/20 to-indigo-600/20"
                borderColor="border-blue-500/20"
              />
              <RoleCard
                title="I am a Builder"
                desc="I want to join a project and contribute skills."
                icon={<Users className="w-6 h-6 text-cyan-400" />}
                onClick={() => handleRoleSelect('Builder')}
                gradient="from-cyan-600/20 to-blue-600/20"
                borderColor="border-cyan-500/20"
              />
              <RoleCard
                title="Just Exploring"
                desc="I want to see what others are building."
                icon={<Search className="w-6 h-6 text-slate-400" />}
                onClick={() => handleRoleSelect('Explorer')}
                gradient="from-slate-800/40 to-slate-900/40"
                borderColor="border-slate-700/30"
              />
            </div>
          </div>
        )}

        {/* STEP 2: BRANCHED QUESTIONS */}
        {step === 2 && (
          <div className="animate-in fade-in zoom-in-95 duration-700 w-full">
            <div className="text-center mb-10">
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/20 mb-4 inline-block">
                Onboarding: {role}
              </span>
              <h2 className="text-3xl font-black tracking-tight">Tell us more, {role}</h2>
            </div>

            <div className="bg-slate-950/20 backdrop-blur-sm rounded-3xl p-2">
              {role === 'Founder' && (
                <FounderPath onComplete={handleFinalSubmit} loading={loading} />
              )}

              {role === 'Builder' && (
                <BuilderPath onComplete={handleFinalSubmit} loading={loading} />
              )}
            </div>
          </div>
        )}

        {/* STEP 3: APP DOWNLOAD PROMPT */}
        {step === 3 && (
          <div className="text-center animate-in slide-in-from-bottom-12 duration-700 max-w-md mx-auto">
            <div className="mb-8 relative inline-block">
              <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-slate-950 border border-blue-500/30 p-6 rounded-full inline-block">
                <CheckCircle2 className="w-16 h-16 text-blue-400" />
              </div>
            </div>

            <h2 className="text-4xl font-black tracking-tight mb-4">Profile Created!</h2>
            <p className="text-slate-400 mb-10 text-lg font-medium">Your journey starts here. Download the app for the full experience.</p>

            <button
              onClick={() => router.push('/explore')}
              className="group/btn relative w-full p-5 rounded-2xl font-black text-white overflow-hidden transition-all shadow-2xl shadow-blue-600/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-50 hover:to-indigo-500 transition-all"></div>
              <span className="relative flex items-center justify-center gap-2">
                Go to Explore Page
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({ title, desc, onClick, icon, gradient, borderColor }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-6 bg-slate-950/60 backdrop-blur-xl border ${borderColor} rounded-3xl hover:border-blue-400/50 transition-all group overflow-hidden shadow-xl hover:shadow-blue-500/10`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative flex items-start gap-5">
        <div className="p-3 bg-slate-900 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-black group-hover:text-white transition-colors tracking-tight">{title}</h3>
          <p className="text-slate-500 group-hover:text-slate-300 mt-1.5 text-sm font-medium transition-colors leading-relaxed">{desc}</p>
        </div>
        <div className="ml-auto self-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
          <ArrowRight className="w-5 h-5 text-blue-400" />
        </div>
      </div>
    </button>
  );
}
