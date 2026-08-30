"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Phone, Mail, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_CONTACT } from "../../lib/siteConfig";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <section className="bg-white text-black min-h-screen selection:bg-[#C5A25D] selection:text-white overflow-x-hidden">
      
      {/* 1. Luxury Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-10 md:gap-16">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <span className="text-[#C5A25D] text-[10px] uppercase tracking-[0.5em] mb-4 block font-bold">Connect With Us</span>
          <h1 className="text-4xl md:text-7xl font-serif font-medium mb-6 md:mb-8 text-black uppercase tracking-tighter">
            Get in <span className="text-[#C5A25D] italic underline decoration-[#C5A25D]/20 underline-offset-8">Touch</span>
          </h1>
          {/* Changed from text-gray-500 to text-black */}
          <p className="text-black text-sm md:text-lg leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
            Experience premium concierge service. Whether it is a bespoke inquiry or order assistance, our team is at your disposal.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="w-full lg:w-1/2 relative h-[250px] md:h-[450px] border border-[#C5A25D]/10 overflow-hidden shadow-2xl group"
        >
          <Image
            src="/contact/hero.jpg.png"
            alt="ladynest Concierge"
            fill
            className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-[4s] ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
        </motion.div>
      </div>

      {/* 2. Contact Form & Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16 border-t border-gray-100">
        
        {/* Contact Details Side */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="space-y-8 md:space-y-12"
        >
          {[
            { icon: <MapPin size={18}/>, title: "Address", text: SITE_CONTACT.location },
            { icon: <Mail size={18}/>, title: "Inquiries", text: SITE_CONTACT.email },
            { icon: <Phone size={18}/>, title: "Client Support", text: SITE_CONTACT.phone }
          ].map((item, index) => (
            <motion.div variants={fadeInUp} key={index} className="flex items-start gap-5 md:gap-6 group">
              <div className="w-10 h-10 md:w-12 md:h-12 border border-[#C5A25D]/30 flex-shrink-0 flex items-center justify-center group-hover:bg-[#C5A25D] group-hover:border-[#C5A25D] group-hover:rotate-[360deg] transition-all duration-700">
                <div className="text-[#C5A25D] group-hover:text-white transition-colors duration-500">
                  {item.icon}
                </div>
              </div>
              <div>
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-black mb-1">{item.title}</h3>
                {/* Changed from text-gray-500 to text-black */}
                <p className="text-black text-xs md:text-sm font-bold leading-relaxed uppercase tracking-tighter">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* The Actual Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-2"
        >
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-2 group">
                {/* Label changed from text-[#C5A25D] to text-black */}
                <label className="text-[9px] uppercase tracking-[0.3em] text-black font-black">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-[#C5A25D] transition-all text-sm rounded-none placeholder:text-black/30 text-black font-medium"
                  placeholder="ENTER FULL NAME"
                  required
                />
              </div>
              <div className="space-y-2">
                {/* Label changed from text-[#C5A25D] to text-black */}
                <label className="text-[9px] uppercase tracking-[0.3em] text-black font-black">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-[#C5A25D] transition-all text-sm rounded-none placeholder:text-black/30 text-black font-medium"
                  placeholder="EMAIL@EXAMPLE.COM"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              {/* Label changed from text-[#C5A25D] to text-black */}
              <label className="text-[9px] uppercase tracking-[0.3em] text-black font-black">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="w-full bg-transparent border-b border-black/20 py-3 focus:outline-none focus:border-[#C5A25D] transition-all text-sm rounded-none placeholder:text-black/30 text-black font-medium"
                placeholder="NATURE OF INQUIRY"
              />
            </div>

            <div className="space-y-2">
              {/* Label changed from text-[#C5A25D] to text-black */}
              <label className="text-[9px] uppercase tracking-[0.3em] text-black font-black">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full bg-transparent border-b border-black/20 py-3 h-28 md:h-32 focus:outline-none focus:border-[#C5A25D] transition-all text-sm resize-none rounded-none placeholder:text-black/30 text-black font-medium"
                placeholder="HOW CAN WE ASSIST YOU?"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={status === "sending"}
              className="w-full md:w-auto bg-black text-white px-12 py-5 font-bold uppercase tracking-[0.4em] text-[10px] hover:bg-[#C5A25D] transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl overflow-hidden relative group"
            >
              <span className="relative z-10">
                {status === "sending" ? (
                  <> <Loader2 className="animate-spin" size={16} /> SENDING... </>
                ) : (
                  <> SEND MESSAGE <Send size={14} className="inline ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> </>
                )}
              </span>
            </motion.button>

            {status === "success" && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-black text-[10px] uppercase tracking-widest mt-4 italic font-black animate-pulse"
              >
                Thank you. Your inquiry has been secured.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600 text-[10px] uppercase tracking-widest mt-4 italic font-bold"
              >
                Connection failed. Please try again.
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}