"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/appApi';
import Link from 'next/link';
import { User, Mail, Lock, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';

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

  // Step 2: Finalize signup with the OTP
  const handleFinalSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Await the signup process
      const response = await appApi.signup(formData);
      
      // 2. Check the correct response structure
      if (response.data?.success || response.data?.token) {
        console.log("Signup successful, token saved to cookies.");
        // Use window.location.href to ensure the middleware picks up the new cookie
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
    w-full bg-slate-900/40 border border-blue-500/10 p-4 pl-12 rounded-2xl outline-none 
    focus:border-blue-400/50 focus:bg-slate-900/60 text-white placeholder-slate-500
    transition-all backdrop-blur-md shadow-lg shadow-blue-500/5
    [-webkit-text-fill-color:white] 
    [transition:background-color_5000s_ease-in-out_0s,border_0.2s_ease,box-shadow_0.2s_ease]
    autofill:shadow-[0_0_0_30px_#0a0c14_inset]
  `;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07090e] text-white p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-lg relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-950/90 backdrop-blur-2xl border border-blue-500/10 p-10 rounded-3xl shadow-3xl animate-in fade-in zoom-in-95 duration-700">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">Connektx</h1>
            <p className="text-slate-400 text-sm font-medium">Start your journey as a builder.</p>
          </div>

          {step === 1 ? (
            /* STEP 1: COLLECT ALL DETAILS */
            <form onSubmit={handleRequestOTP} className="space-y-4">
              <div className="relative group/input">
                <div className="absolute left-4 top-4 p-0.5">
                  <User className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text" placeholder="Full Name" required
                  className={inputStyle}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative group/input">
                <div className="absolute left-4 top-4 p-0.5">
                  <Mail className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email" placeholder="Email Address" required
                  className={inputStyle}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group/input">
                  <div className="absolute left-4 top-4 p-0.5">
                    <Lock className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="password" placeholder="Password" required
                    className={inputStyle}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="relative group/input">
                  <div className="absolute left-4 top-4 p-0.5">
                    <ShieldCheck className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="password" placeholder="Confirm" required
                    className={inputStyle}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4.5 rounded-2xl font-bold mt-4 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 group/btn"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Get Verification Code
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: ENTER OTP */
            <form onSubmit={handleFinalSignup} className="space-y-8 text-center">
              <div className="bg-blue-500/10 border border-blue-500/20 p-6 rounded-2xl backdrop-blur-md">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm text-slate-400">
                  Verification code sent to <br />
                  <span className="text-white font-bold">{formData.email}</span>
                </p>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="000 000"
                  required
                  maxLength={6}
                  className="w-full bg-slate-900/40 border border-blue-500/20 p-6 rounded-2xl outline-none focus:border-blue-400/50 text-center tracking-[0.5em] font-mono text-3xl text-white block transition-all backdrop-blur-md"
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />

                <div className="flex flex-col gap-3">
                  <button
                    disabled={loading}
                    className="w-full bg-white text-black hover:bg-slate-200 p-4.5 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Verify & Create Account
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-white transition-colors flex items-center justify-center gap-1 group/back"
                  >
                    <ArrowLeft className="w-3 h-3 group-hover/back:-translate-x-1 transition-transform" />
                    Back to details
                  </button>
                </div>
              </div>
            </form>
          )}

          <p className="mt-10 text-center text-slate-500 text-sm font-medium">
            Already have an account? <Link href="/login" className="text-white hover:text-blue-400 transition-colors underline underline-offset-4 decoration-white/20">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
