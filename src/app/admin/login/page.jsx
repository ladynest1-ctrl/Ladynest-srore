"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    // Yahan aap apna secret password rakhein
    if (password === "ladynest@2026") { 
      localStorage.setItem("adminToken", "secure_session_active");
      router.push("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="max-w-sm w-full space-y-8 text-center">
        <h1 className="text-[#C5A25D] font-serif text-3xl tracking-[0.3em] uppercase">ladynest Vault</h1>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest">Authorized Personnel Only</p>
        
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <input
            type="password"
            placeholder="ENTER ACCESS KEY"
            className="w-full bg-transparent border-b border-white/10 py-4 text-center text-white focus:outline-none focus:border-[#C5A25D] tracking-[0.5em]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-[10px] uppercase tracking-widest">Access Denied</p>}
          <button className="w-full bg-[#C5A25D] text-black py-4 font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all">
            Unlock Console
          </button>
        </form>
      </div>
    </div>
  );
}
