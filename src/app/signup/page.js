"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock } from "lucide-react";

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login?message=Account created successfully");
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Connection error. Please check your internet.");
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#F9F9F9] min-h-screen flex items-center justify-center py-12 px-4 md:px-6 selection:bg-[#C5A25D] selection:text-white">
      <div className="max-w-4xl w-full bg-white rounded-sm shadow-[0_10px_50px_rgba(0,0,0,0.05)] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100">
        
        {/* Hero Image Section */}
        <div className="relative h-48 md:h-auto border-b md:border-b-0 md:border-r border-gray-100 order-1 md:order-none overflow-hidden">
          <Image
            src="/signup/hero2.jpg.jpg" 
            alt="ladynest Craftsmanship"
            fill
            className="object-cover opacity-90 hover:scale-110 transition-all duration-[2s]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 hidden md:block">
            <p className="text-[#C5A25D] text-[10px] tracking-[0.4em] uppercase font-bold bg-white/80 backdrop-blur-sm px-3 py-1 shadow-sm">Join The Legacy</p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-8 bg-white">
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-serif font-light text-black uppercase tracking-tight">
              Create <span className="text-[#C5A25D] italic">Account</span>
            </h1>
            <p className="text-gray-500 text-xs md:text-sm font-light tracking-wide leading-relaxed">
              Register to start your luxury journey with ladynest.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-[10px] p-4 rounded-none text-center tracking-[0.1em] uppercase animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A25D] font-bold ml-1 flex items-center gap-2">
                <User size={10} /> Full Name
              </label>
              <input 
                type="text" 
                placeholder="ENTER FULL NAME" 
                className="w-full bg-transparent border-b border-gray-200 py-3 text-black focus:outline-none focus:border-[#C5A25D] transition-all text-sm rounded-none placeholder:text-gray-300 uppercase"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A25D] font-bold ml-1 flex items-center gap-2">
                <Mail size={10} /> Email Address
              </label>
              <input 
                type="email" 
                placeholder="NAME@EXAMPLE.COM" 
                className="w-full bg-transparent border-b border-gray-200 py-3 text-black focus:outline-none focus:border-[#C5A25D] transition-all text-sm rounded-none placeholder:text-gray-300 uppercase"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-[#C5A25D] font-bold ml-1 flex items-center gap-2">
                <Lock size={10} /> Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-transparent border-b border-gray-200 py-3 text-black focus:outline-none focus:border-[#C5A25D] transition-all text-sm rounded-none placeholder:text-gray-300"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white font-bold py-5 rounded-none hover:bg-[#C5A25D] transition-all duration-500 uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center justify-center gap-3 shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <> <Loader2 size={16} className="animate-spin" /> Registering </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="pt-4 text-center md:text-left border-t border-gray-50">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest font-light">
              Already a member? 
              <a href="/login" className="text-[#C5A25D] font-bold hover:text-black transition-colors ml-2 border-b border-[#C5A25D]/30 pb-1">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
