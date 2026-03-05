"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/api';
import FounderPath from '@/components/FounderPath';
import BuilderPath from '@/components/BuilderPath';
// import ExplorerPath from '@/components/ExplorerPath';

export default function Onboarding() {
  const [step, setStep] = useState(1); // 1: Role Selection, 2: Questions, 3: App CTA
  const [role, setRole] = useState(''); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  // This is the function the error was missing
  const handleFinalSubmit = async (onboardingData) => {
    setLoading(true);
    console.log("Submitting Onboarding Data:", onboardingData);
    try {
      // Hits your backend to update the user profile with the new fields
      // Ensure your backend signup or profile-update route handles these keys
      const response = await appApi.signup({ ...onboardingData, type: role }); 
      
      if (response.data.success || response.status === 201) {
        setStep(3); // Move to App Download screen
      }
    } catch (err) {
      console.error("Submission Error:", err.response?.data || err.message);
      alert("Failed to save profile. Please check the console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        
        {/* STEP 1: ROLE SELECTION */}
        {step === 1 && (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <h1 className="text-3xl font-bold mb-2 text-blue-500">Connektx</h1>
            <p className="text-zinc-400 mb-8">Tell us what brings you here today.</p>
            <div className="grid gap-4">
              <RoleCard title="I am a Founder" desc="I am building a startup and need a team." onClick={() => handleRoleSelect('Founder')} />
              <RoleCard title="I am a Builder" desc="I want to join a project and contribute skills." onClick={() => handleRoleSelect('Builder')} />
              <RoleCard title="Just Exploring" desc="I want to see what others are building." onClick={() => handleRoleSelect('Explorer')} />
            </div>
          </div>
        )}

        {/* STEP 2: BRANCHED QUESTIONS (No extra buttons here) */}
        {step === 2 && (
          <div className="animate-in fade-in zoom-in duration-300 w-full">
            <h2 className="text-2xl font-bold mb-6 text-center">Tell us more, {role}</h2>
            
            {role === 'Founder' && (
              <FounderPath onComplete={handleFinalSubmit} loading={loading} />
            )}

            {role === 'Builder' && (
              <BuilderPath onComplete={handleFinalSubmit} loading={loading} />
            )}
            
            {/* Add ExplorerPath here later */}
          </div>
        )}

        {/* STEP 3: APP DOWNLOAD PROMPT */}
        {step === 3 && (
          <div className="text-center animate-in slide-in-from-bottom-10 duration-500">
            <h2 className="text-2xl font-bold mb-4">Profile Created!</h2>
            <p className="text-zinc-400 mb-8 text-sm">Download the app for the best experience.</p>
            <button onClick={() => router.push('/explore')} className="bg-blue-600 w-full p-4 rounded-xl font-bold">
              Go to Explore Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RoleCard({ title, desc, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left p-6 bg-[#111] border border-zinc-800 rounded-2xl hover:border-blue-500 hover:bg-zinc-900 transition-all group">
      <h3 className="text-xl font-bold group-hover:text-blue-500 transition-colors">{title}</h3>
      <p className="text-zinc-500 mt-1 text-sm">{desc}</p>
    </button>
  );
}