"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  MessageSquare, 
  PackagePlus, 
  ListOrdered,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const isAuthorized = isLoginPage || (typeof window !== "undefined" && localStorage.getItem("adminToken") === "secure_session_active");

  useEffect(() => {
    if (!isAuthorized && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [isAuthorized, isLoginPage, router]);

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-2 border-[#C5A25D] border-t-transparent rounded-full mb-4"
        ></motion.div>
        <p className="text-[#C5A25D] font-serif tracking-widest text-[10px] uppercase animate-pulse">
          Verifying Access...
        </p>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18}/>, href: "/admin" },
    { name: "Add Product", icon: <PackagePlus size={18}/>, href: "/admin/add-product" },
    { name: "All Products", icon: <ListOrdered size={18}/>, href: "/admin/products" },
    { name: "Orders", icon: <ShoppingBag size={18}/>, href: "/admin/orders" },
    { name: "Messages", icon: <MessageSquare size={18}/>, href: "/admin/messages" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FCFCFC] text-black font-sans selection:bg-[#C5A25D] selection:text-white">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 bg-white p-6 hidden md:flex flex-col fixed h-full z-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <h2 className="text-black font-serif text-xl font-bold tracking-[0.2em] uppercase">
            Lady<span className="text-[#C5A25D]">Nest</span>
          </h2>
          <p className="text-[9px] text-gray-400 tracking-widest uppercase mt-1 italic font-medium">Admin Portal</p>
        </motion.div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  href={item.href} 
                  className={`flex items-center gap-4 px-4 py-3 transition-all text-[10px] uppercase tracking-[0.15em] relative group ${
                    isActive 
                    ? "text-[#C5A25D] font-bold" 
                    : "text-gray-400 hover:text-black"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute inset-0 bg-[#C5A25D]/5 border-r-2 border-[#C5A25D] z-0"
                    />
                  )}
                  <span className="relative z-10 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <span className="relative z-10">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <motion.button 
          whileHover={{ x: 5 }}
          onClick={() => {
            localStorage.removeItem("adminToken");
            router.push("/admin/login");
          }}
          className="mt-auto pt-6 border-t border-gray-100 text-gray-400 hover:text-red-500 text-[10px] uppercase tracking-widest transition-colors flex items-center gap-3 font-bold"
        >
          <LogOut size={16} /> Logout Session
        </motion.button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto md:ml-64">
        {/* Header */}
        <header className="h-16 border-b border-gray-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="text-[10px] text-gray-400 tracking-widest uppercase font-medium">
            System Status: <span className="text-[#C5A25D] animate-pulse">●</span> <span className="text-black">Online</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#C5A25D] rounded-full"></div>
             </div>
             <span className="text-[10px] uppercase tracking-widest text-black font-bold">Admin Account</span>
          </div>
        </header>

        {/* Content Wrapper with Animation */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="p-8 md:p-12"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
