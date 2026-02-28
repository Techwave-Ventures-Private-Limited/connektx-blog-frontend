"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/api'; 
import Link from 'next/link';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', otp: '', referralCode: ''
  });

  // Step 1: Validate details and request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }
    
    setLoading(true);
    // console.log("--- Requesting OTP for Email ---", formData.email);
    try {
      // Hits your /auth/sendEmail route
      await appApi.sendOTP(formData.email);
      setStep(2);
    } catch (err) {
      console.error("OTP Request Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Finalize signup with the OTP
  const handleFinalSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log("--- Submitting Final Signup ---");
    try {
      // Hits your /auth/signup route (now including the OTP)
      const { data } = await appApi.signup(formData);
      if (data.token) {
        // console.log("Signup Success!");
        window.location.href = '/onboarding'; 
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Verification failed. Check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = `
    w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl outline-none 
    focus:border-blue-500 text-white placeholder-zinc-500
    [-webkit-text-fill-color:white] 
    [transition:background-color_5000s_ease-in-out_0s]
    autofill:shadow-[0_0_0_30px_#18181b_inset]
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-md bg-[#111] border border-zinc-800 p-8 rounded-2xl shadow-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-blue-500">ConnektX</h1>
          <p className="text-zinc-400 mt-2">Create your builder profile.</p>
        </div>

        {step === 1 ? (
          /* STEP 1: COLLECT ALL DETAILS */
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <input 
              type="text" placeholder="Full Name" required
              className={inputStyle}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="email" placeholder="Email Address" required
              className={inputStyle}
              onChange={(e) => setFormData({...formData, email: e.target.value.trim()})}
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="password" placeholder="Password" required
                className={inputStyle}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <input 
                type="password" placeholder="Confirm" required
                className={inputStyle}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 p-3.5 rounded-xl font-bold mt-2 transition-all disabled:opacity-50"
            >
              {loading ? "Processing..." : "Continue to Verification"}
            </button>
          </form>
        ) : (
          /* STEP 2: ENTER OTP */
          <form onSubmit={handleFinalSignup} className="space-y-6 text-center">
            <div>
              <p className="text-sm text-zinc-400 mb-4">
                We've sent a 6-digit code to <br/>
                <span className="text-white font-medium">{formData.email}</span>
              </p>
              <input 
                type="text" 
                placeholder="000000" 
                required
                maxLength={6}
                className={`${inputStyle} text-center tracking-[1em] font-mono text-2xl border-blue-500/50`}
                onChange={(e) => setFormData({...formData, otp: e.target.value})}
              />
            </div>
            
            <div className="space-y-3">
              <button 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 p-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
              
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="text-xs text-zinc-500 hover:text-white transition-colors"
              >
                ← Edit details
              </button>
            </div>
          </form>
        )}
        
        <p className="mt-6 text-center text-zinc-500 text-sm">
          Already a builder? <Link href="/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}