"use client";
import { motion } from "framer-motion";

export default function AnnouncementWrapper() {
  return (
    <div className="bg-black text-[#C5A25D] py-2.5 overflow-hidden flex whitespace-nowrap">
      <motion.div 
        initial={{ x: "0%" }}
        animate={{ x: "-50%" }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="flex gap-20 items-center min-w-full"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">✨ Lady Nest Luxury: Eid Edit is Now Live ✨</span>
        <span className="text-[10px] uppercase tracking-[0.4em] font-bold">✨ Handcrafted PU Leather Excellence ✨</span>
      </motion.div>
    </div>
  );
}