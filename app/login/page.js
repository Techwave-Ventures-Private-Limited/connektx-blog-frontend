"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/appApi';
import Link from 'next/link';
import { LogIn, Mail, Lock, ArrowRight, Eye, EyeOff} from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  // Minimalist Input Style matching your Explore card aesthetic
  const inputStyle = `
    w-full bg-black border border-white/10 p-4 pl-12 rounded-sm outline-none 
    focus:border-white/30 text-white placeholder-slate-600
    transition-all text-sm tracking-widest
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      
      <div className="w-full max-w-sm">
        {/* Header Section */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-3xl font-bold tracking-tight uppercase">Login</h1>
          <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">
            Welcome back to the network.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Mail className="w-4 h-4 text-slate-600" />
            </div>
            <input
              type="email"
              placeholder="Email"
              required
              className={inputStyle}
              onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="w-4 h-4 text-slate-600" />
            </div>
            
            <input
              type={showPassword ? "text" : "password"} // Conditional type
              placeholder="Password"
              required
              className={inputStyle}
              onChange={(e) => setFormData({ ...formData, password: e.target.value.trim() })}
            />

            {/* Toggle Button */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            disabled={loading}
            className="w-full bg-white text-black hover:bg-slate-200 py-4 rounded-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <LogIn className="w-3 h-3" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-[0.3em]">
            <span className="bg-black px-4 text-slate-700">New Builder?</span>
          </div>
        </div>

        {/* Secondary Action Link */}
        <Link href="/signup">
          <button className="w-full border border-white/10 hover:border-white/30 py-4 rounded-sm font-bold transition-all text-slate-400 hover:text-white flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em]">
            Create New Account
            <ArrowRight className="w-3 h-3" />
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-white/5 w-full max-w-sm text-center">
        <p className="text-slate-800 text-[10px] font-bold uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Techwave Ventures Private Limited. All rights reserved.
        </p>
      </footer>
    </div>
  );
}