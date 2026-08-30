import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import { SITE_CONTACT } from "../../lib/siteConfig";

// Custom TikTok SVG Icon (Consistent with Navbar)
const TikTokIcon = ({ size = 16 }) => (
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

export default function Footer() {
  const socialLinks = [
    { id: 1, icon: <Facebook size={16} />, href: "https://www.facebook.com/ladynest.official" },
    { id: 2, icon: <Instagram size={16} />, href: "https://www.instagram.com/ladynest__/" },
    { id: 3, icon: <TikTokIcon size={16} />, href: "https://www.tiktok.com/@ladyneststore?lang=en" },
  ];

  return (
    <footer className="bg-black text-gray-400 py-16 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 1. Brand Identity */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-white text-2xl font-serif font-bold mb-6 tracking-[0.2em] uppercase italic">
            lady<span className="text-[#C5A25D]">nest</span>
          </h2>
          <p className="text-[13px] leading-relaxed mb-6 font-light tracking-wide">
            Your daily dose of {"Where did you get that?"} From statement bags to handcrafted luxury accessories. Style is a nest for your soul.
          </p>
          
          {/* Updated Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a 
                key={social.id}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#C5A25D] hover:border-[#C5A25D] hover:text-white transition-all duration-500"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 2. Quick Navigation */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Navigation</h3>
          <Link href="/" className="text-[13px] hover:text-[#C5A25D] transition-colors font-light">Home</Link>
          <Link href="/products" className="text-[13px] hover:text-[#C5A25D] transition-colors font-light">The Collection</Link>
          <Link href="/about" className="text-[13px] hover:text-[#C5A25D] transition-colors font-light">Our Story</Link>
          <Link href="/contact" className="text-[13px] hover:text-[#C5A25D] transition-colors font-light">Customer Care</Link>
        </div>

        {/* 3. Support & Policies */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Legal</h3>
          <Link href="/privacy" className="text-[13px] hover:text-[#C5A25D] transition-colors font-light">Privacy Policy</Link>
          <Link href="/terms" className="text-[13px] hover:text-[#C5A25D] transition-colors font-light">Terms of Service</Link>
          <Link href="/shipping" className="text-[13px] hover:text-[#C5A25D] transition-colors font-light">Shipping & Returns</Link>
        </div>

        {/* 4. Contact Details */}
        <div className="space-y-4">
          <h3 className="text-white text-[11px] uppercase tracking-[0.3em] font-bold mb-2">Contact</h3>
          <div className="flex items-start gap-3 text-[13px]">
            <MapPin size={16} className="text-[#C5A25D] shrink-0" />
            <span className="font-light">Lahore, Pakistan</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <Mail size={16} className="text-[#C5A25D] shrink-0" />
            <span className="font-light underline decoration-[#C5A25D]/30 underline-offset-4">{SITE_CONTACT.email}</span>
          </div>
          <div className="flex items-center gap-3 text-[13px]">
            <Phone size={16} className="text-[#C5A25D] shrink-0" />
            <span className="font-light">{SITE_CONTACT.phone}</span>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-16 border-t border-white/5 pt-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">
            &copy; {new Date().getFullYear()} LADYNEST OFFICIAL. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <span className="text-[8px] border border-white/20 px-2 py-0.5 uppercase tracking-widest">Cash on Delivery</span>
             <span className="text-[8px] border border-white/20 px-2 py-0.5 uppercase tracking-widest">Bank Transfer</span>
          </div>
        </div>
      </div>
    </footer>
  );
}