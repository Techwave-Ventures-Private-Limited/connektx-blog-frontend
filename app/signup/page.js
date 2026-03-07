"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/appApi';
import Link from 'next/link';
import { User, Mail, Lock, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react';

export default function Signup() {
  const [step, setStep] = useState(1); // 1: Details, 2: OTP Verification
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', otp: '', referralCode: ''
  });

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      await appApi.sendOTP(formData.email);
      setStep(2);
    } catch (err) {
      console.error("OTP Request Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await appApi.signup(formData);
      
      if (response.data?.success || response.data?.token) {
        // META PIXEL TRACKING
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'CompleteRegistration', {
            content_name: 'Connektx Signup',
            status: true,
            value: 0.00,
            currency: 'INR'
          });
        }
        console.log("Signup successful, token saved to cookies.");
        window.location.href = '/onboarding';
      }
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Verification failed. Check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Minimalist Input Style matching your Explore/Login aesthetic
  const inputStyle = `
    w-full bg-black border border-white/10 p-4 pl-12 rounded-sm outline-none 
    focus:border-white/30 text-white placeholder-slate-600
    transition-all text-sm tracking-widest
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      
      <div className="w-full max-w-sm">
        {/* Header Section */}
        <div className="mb-12 border-b border-white/10 pb-8 items-center text-center">
          <h1 className="text-3xl font-bold tracking-tight uppercase">Create Account</h1>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
            {step === 1 ? "Start your journey as a builder." : "Verify your identity."}
          </p>
        </div>

        {step === 1 ? (
          /* STEP 1: COLLECT ALL DETAILS */
          <form onSubmit={handleRequestOTP} className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <User className="w-4 h-4 text-slate-600" />
              </div>
              <input
                type="text" placeholder="Full Name" required
                className={inputStyle}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Mail className="w-4 h-4 text-slate-600" />
              </div>
              <input
                type="email" placeholder="Email" required
                className={inputStyle}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
              />
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Lock className="w-4 h-4 text-slate-600" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className={inputStyle}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <ShieldCheck className="w-4 h-4 text-slate-600" />
              </div>
              <input
                type="password" placeholder="Confirm Password" required
                className={inputStyle}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  Get Code <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: ENTER OTP */
          <form onSubmit={handleFinalSignup} className="space-y-8 text-center">
            <div className="bg-white/5 border border-white/10 p-6 rounded-sm">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Code sent to</p>
              <p className="text-white font-bold text-xs">{formData.email}</p>
            </div>

            <input
              type="text"
              placeholder="000000"
              required
              maxLength={6}
              className="w-full bg-black border border-white/10 p-6 rounded-sm outline-none focus:border-white/30 text-center tracking-[1em] font-mono text-2xl text-white block transition-all"
              onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
            />

            <div className="flex flex-col gap-4">
              <button
                disabled={loading}
                className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    Verify & Join <CheckCircle className="w-3 h-3" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[10px] text-slate-600 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Edit Details
              </button>
            </div>
          </form>
        )}

        {/* Footer/Switch Link */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-600 text-[10px] uppercase tracking-widest mb-4">
            Already have an account?
          </p>
          <Link href="/login" className="text-white hover:text-slate-400 text-xs font-bold uppercase tracking-widest transition-colors">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}