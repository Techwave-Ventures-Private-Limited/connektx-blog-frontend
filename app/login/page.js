"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appApi } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // console.log("--- Login Attempt ---");
    // console.log("Target URL:", process.env.NEXT_PUBLIC_APP_BACKEND_URL);

    try {
      const response = await appApi.login(formData.email, formData.password);
      if (response.data.success) {
        // console.log("Login Success:", response.data.message);
        router.push('/explore');
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  // Base style for inputs to handle the "Invisible Text" / Autofill bug
  const inputStyle = `
    w-full bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl outline-none 
    focus:border-blue-500 text-white placeholder-zinc-500
    [-webkit-text-fill-color:white] 
    [transition:background-color_5000s_ease-in-out_0s]
    autofill:shadow-[0_0_0_30px_#18181b_inset]
  `;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-sm bg-[#111] border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-blue-500 text-center">ConnektX</h2>
        <p className="text-zinc-500 text-center text-sm mb-8">Welcome back, builder.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Email" 
              required
              className={inputStyle}
              onChange={(e) => setFormData({...formData, email: e.target.value.trim()})}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              required
              className={inputStyle}
              onChange={(e) => setFormData({...formData, password: e.target.value.trim()})}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-white text-black hover:bg-zinc-200 p-3.5 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#111] px-2 text-zinc-500">New here?</span>
          </div>
        </div>

        <Link href="/signup">
          <button className="w-full border border-zinc-800 hover:bg-zinc-900 p-3.5 rounded-xl font-medium transition-all text-white">
            Create an account
          </button>
        </Link>
      </div>
    </div>
  );
}