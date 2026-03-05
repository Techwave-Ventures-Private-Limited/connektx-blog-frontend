"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/api';
import Link from 'next/link';
import { LogIn, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await appApi.login(formData.email, formData.password);
      if (response.data.success) {
        router.push('/explore');
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid email or password");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#07090e] text-white p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative bg-slate-950/90 backdrop-blur-2xl border border-blue-500/10 p-10 rounded-3xl shadow-3xl animate-in fade-in zoom-in-95 duration-700">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500">
              Connektx
            </h2>
            <p className="text-slate-400 text-sm font-medium">Welcome back, builder.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group/input">
              <div className="absolute left-4 top-4 p-0.5">
                <Mail className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                required
                className={inputStyle}
                onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
              />
            </div>
            <div className="relative group/input">
              <div className="absolute left-4 top-4 p-0.5">
                <Lock className="w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
              </div>
              <input
                type="password"
                placeholder="Password"
                required
                className={inputStyle}
                onChange={(e) => setFormData({ ...formData, password: e.target.value.trim() })}
              />
            </div>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white p-4 rounded-2xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 group/btn"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-blue-500/10"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-[#0b0d12] px-4 text-slate-500">New to the community?</span>
            </div>
          </div>

          <Link href="/signup">
            <button className="w-full bg-slate-900/40 border border-slate-800 hover:bg-slate-900 hover:border-slate-700 p-4 rounded-2xl font-semibold transition-all text-slate-300 hover:text-white flex items-center justify-center gap-2 group/signup">
              Create an account
              <ArrowRight className="w-4 h-4 group-hover/signup:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>

      <p className="mt-8 text-slate-600 text-xs font-medium">
        &copy; {new Date().getFullYear()} Connektx. All rights reserved.
      </p>
    </div>
  );
}
