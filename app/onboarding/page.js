"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/appApi';
import FounderPath from '@/components/FounderPath';
import BuilderPath from '@/components/BuilderPath';
import ExplorerPath from '@/components/ExplorerPath';
import { Rocket, Users, Search, ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1); 
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
      const response = await appApi.saveOnboarding(onboardingData, role);
      if (response.data.success || response.status === 200) {
        router.push('/explore?onboarded=true');
      }
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      
      <div className="w-full max-w-5xl relative">

        {/* STEP 1: ROLE SELECTION (One Row Layout) */}
        {step === 1 && (
          <div className="animate-in fade-in duration-700">
            <div className="mb-16 border-b border-white/10 pb-8 flex flex-col items-center text-center">
              <h1 className="text-4xl font-bold tracking-tight uppercase">Connektx</h1>
              <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em]">
                Select your path in the ecosystem
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <RoleCard
                title="Founder"
                desc="Building a startup and looking for a team."
                icon={<Rocket className="w-5 h-5" />}
                onClick={() => handleRoleSelect('Founder')}
              />
              <RoleCard
                title="Builder"
                desc="Contribute skills to ambitious projects."
                icon={<Users className="w-5 h-5" />}
                onClick={() => handleRoleSelect('Builder')}
              />
              <RoleCard
                title="Explorer"
                desc="Discover what others are creating."
                icon={<Search className="w-5 h-5" />}
                onClick={() => handleRoleSelect('Explorer')}
              />
            </div>
          </div>
        )}

        {/* STEP 2: BRANCHED QUESTIONS */}
        {step === 2 && (
          <div className="animate-in fade-in duration-700 w-full max-w-xl mx-auto">
            <div className="mb-12 border-b border-white/10 pb-8 flex flex-col items-center text-center">
              <span className="px-3 py-1 border border-white/10 text-slate-500 rounded-sm text-[10px] font-bold uppercase tracking-widest mb-4">
                {role} Profile
              </span>
              <h2 className="text-2xl font-bold uppercase tracking-tight">Provide Details</h2>
            </div>

            <div className="bg-black border border-white/5 rounded-sm p-4">
              {role === 'Founder' && (
                <FounderPath onComplete={handleFinalSubmit} loading={loading} />
              )}
              {role === 'Builder' && (
                <BuilderPath onComplete={handleFinalSubmit} loading={loading} />
              )}
              {role === 'Explorer' && (
                <ExplorerPath onComplete={handleFinalSubmit} loading={loading} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({ title, desc, onClick, icon }) {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center text-center p-8 bg-black border border-white/10 rounded-sm hover:border-white/40 transition-all group h-full"
    >
      <div className="mb-6 p-4 border border-white/5 rounded-full group-hover:border-white/20 transition-all bg-white/5">
        {icon}
      </div>
      
      <h3 className="text-lg font-bold uppercase tracking-widest mb-3">
        {title}
      </h3>
      
      <p className="text-slate-500 text-[11px] leading-relaxed uppercase tracking-wider mb-8">
        {desc}
      </p>

      <div className="mt-auto flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
        Select Path <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
}