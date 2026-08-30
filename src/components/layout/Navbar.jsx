"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, LogOut, User, Menu, X, Instagram, Facebook, Truck, XCircle } from "lucide-react"; 
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../../context/CartContext"; 

// Custom TikTok SVG Icon
const TikTokIcon = ({ size = 20 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cart } = useCart();
  const mounted = typeof window !== "undefined";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("announcementDismissed") !== "true";
  });

  const handleDismissAnnouncement = () => {
    setShowAnnouncement(false);
    localStorage.setItem("announcementDismissed", "true");
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const socialLinks = [
    { id: 1, icon: <Instagram size={18} />, href: "https://www.instagram.com/ladynest__/", label: "Instagram" },
    { id: 2, icon: <Facebook size={18} />, href: "https://www.facebook.com/ladynest.official", label: "Facebook" },
    { id: 3, icon: <TikTokIcon size={18} />, href: "https://www.tiktok.com/@ladyneststore?lang=en", label: "TikTok" },
  ];

  return (
    <>
      {/* Announcement Bar - Delivery Charges */}
      {showAnnouncement && (
        <div className="relative w-full bg-gradient-to-r from-amber-600 via-[#C5A25D] to-amber-600 text-black py-2.5 overflow-hidden">
          {/* Animated shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-center md:justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 md:gap-3">
                <Truck className="animate-bounce" size={18} />
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-wider">
                  🚚 Delivery Charges <span className="text-red-800 text-sm md:text-base font-black mx-1">Rs 300</span> Only!
                </p>
                <Truck className="animate-bounce" size={18} />
              </div>
              
              <div className="hidden md:flex items-center gap-4 text-[10px] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Free Shipping on orders above Rs 5000
                </span>
              </div>

              {/* Close Button */}
              <button 
                onClick={handleDismissAnnouncement}
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-black/70 hover:text-black transition-colors"
                aria-label="Close announcement"
              >
                <XCircle size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="w-full bg-black sticky top-0 z-50 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Mobile Menu Button (Left) */}
          <div className="md:hidden flex-1">
            <button 
              className="text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Logo Section */}
          <div className="flex-none md:flex-1 flex justify-center md:justify-start">
            <Link href="/" className="relative"> 
              <Image 
                src="/logo.png"
                alt="LedyNest" 
                width={160} 
                height={50}  
                className="object-contain w-[140px] h-auto md:w-[200px] transition-all duration-300" 
                priority 
              />
            </Link>
          </div>

          {/* Desktop Navigation & Social Icons */}
          <nav className="hidden md:flex items-center gap-8 font-semibold">
            <div className="flex items-center gap-6 pr-6 border-r border-white/10">
              <Link href="/" className="text-gray-200 hover:text-[#C5A25D] transition-colors text-[12px] tracking-[0.2em] uppercase font-bold">Home</Link>
              <Link href="/products" className="text-gray-200 hover:text-[#C5A25D] transition-colors text-[12px] tracking-[0.2em] uppercase font-bold">Products</Link>
              <Link href="/about" className="text-gray-200 hover:text-[#C5A25D] transition-colors text-[12px] tracking-[0.2em] uppercase font-bold">About</Link>
              <Link href="/contact" className="text-gray-200 hover:text-[#C5A25D] transition-colors text-[12px] tracking-[0.2em] uppercase font-bold">Contact</Link>
            </div>

            {/* Social Media Icons (Desktop) */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#C5A25D] transition-all hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </nav>

          {/* Icons & Auth Section */}
          <div className="flex-1 flex justify-end items-center gap-4 md:gap-8">
            
            {status === "authenticated" ? (
              <div className="flex items-center gap-3 md:gap-5">
                <div className="text-right hidden lg:block">
                  <p className="text-[9px] text-[#C5A25D] font-bold tracking-[0.2em] leading-none mb-1 uppercase">Member</p>
                  <p className="text-[13px] text-white font-semibold tracking-wide">{session.user.name.split(' ')[0]}</p>
                </div>
                
                <div className="w-9 h-9 rounded-full border-2 border-[#C5A25D]/50 flex items-center justify-center bg-[#C5A25D]/10 text-[#C5A25D] font-bold text-sm uppercase shadow-inner">
                  {session.user.name.charAt(0)}
                </div>

                <button 
                  onClick={() => signOut()}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-white flex items-center gap-2 hover:text-[#C5A25D] transition-all group">
                <User size={22} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-[0.15em]">Sign In</span>
              </Link>
            )}

            {/* Cart Button */}
            <Link href="/cart" className="relative flex items-center gap-2 bg-[#C5A25D] text-black px-4 md:px-6 py-2.5 rounded-sm hover:bg-white hover:scale-105 transition-all font-bold shadow-md">
              <ShoppingBag size={20} />
              <span className="hidden xs:inline text-[11px] uppercase tracking-wider font-extrabold">Cart</span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full min-w-[20px] text-center border-2 border-black font-black animate-bounce">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-t border-white/5 px-8 py-10 flex flex-col gap-6 animate-in slide-in-from-top-5 duration-300">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-medium tracking-[0.2em] uppercase border-b border-white/5 pb-2">Home</Link>
            <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-medium tracking-[0.2em] uppercase border-b border-white/5 pb-2">Products</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-medium tracking-[0.2em] uppercase border-b border-white/5 pb-2">About</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-white text-lg font-medium tracking-[0.2em] uppercase border-b border-white/5 pb-2">Contact</Link>
            
            {/* Social Icons in Mobile Menu */}
            <div className="flex items-center gap-8 mt-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5A25D] hover:text-white transition-all scale-125"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Add this CSS to your global.css or component */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}