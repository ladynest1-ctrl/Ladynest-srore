"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid Email or Password. Please try again.");
        setLoading(false);
      } else {
        router.push("/"); 
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#F9F9F9] min-h-screen flex items-center justify-center py-12 px-4 md:px-6 selection:bg-[#C5A25D] selection:text-white">
      <div className="max-w-4xl w-full bg-white rounded-sm shadow-[0_10px_50px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100">

        {/* Hero Image Section */}
        <div className="relative h-48 md:h-auto border-b md:border-b-0 md:border-r border-gray-100 order-1 md:order-none">
          <Image
            src="/signup/hero2.jpg.jpg" 
            alt="ladynest Boutique Entrance"
            fill
            className="object-cover opacity-90 hover:scale-105 transition-all duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 hidden md:block">
            <p className="text-[#C5A25D] text-[10px] tracking-[0.4em] uppercase font-bold bg-white/80 backdrop-blur-sm px-3 py-1 shadow-sm">Artisanal Excellence</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8 bg-white">
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif font-light text-black uppercase tracking-tight">
              Welcome <span className="text-[#C5A25D] italic">Back</span>
            </h1>
            <p className="text-gray-500 text-xs md:text-sm font-light tracking-wide leading-relaxed">
              Sign in to access your premium PU Leather collection.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] p-4 rounded-none text-center tracking-[0.1em] uppercase animate-pulse">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2 relative">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A25D] font-bold ml-1 flex items-center gap-2">
                <Mail size={10} /> Email Address
              </label>
              <input
                type="email"
                placeholder="NAME@EXAMPLE.COM"
                className="bg-transparent border-b border-gray-200 text-black rounded-none px-1 py-3 focus:outline-none focus:border-[#C5A25D] w-full placeholder:text-gray-300 transition-all text-sm uppercase"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2 relative">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A25D] font-bold ml-1 flex items-center gap-2">
                <Lock size={10} /> Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="bg-transparent border-b border-gray-200 text-black rounded-none px-1 py-3 focus:outline-none focus:border-[#C5A25D] w-full placeholder:text-gray-300 transition-all text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-5 rounded-none hover:bg-[#C5A25D] transition-all duration-500 uppercase tracking-[0.3em] text-[10px] mt-4 shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {loading ? (
                <> <Loader2 size={16} className="animate-spin" /> Verifying </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="pt-4 text-center md:text-left border-t border-gray-50">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-light">
              Don’t have an account? 
              <a href="/signup" className="text-[#C5A25D] font-bold hover:text-black transition-colors ml-2 border-b border-[#C5A25D]/30 pb-1">
                Register Now
              </a>
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
