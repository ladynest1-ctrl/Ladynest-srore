"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  // Animation Variants
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

      {/* Hero Section */}
      <div className="relative border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col lg:flex-row items-center gap-10 md:gap-12">
          
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="w-full lg:w-1/2 relative z-10 text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-[#C5A25D]">
              About ladynest
            </h1>
            <p className="text-black text-base md:text-lg mb-6 leading-relaxed font-medium">
              At ladynest, we craft more than just bags—we craft experiences.
              Every stitch reflects elegance and timeless style.
            </p>
            <p className="text-black text-base md:text-lg leading-relaxed font-medium">
              We blend luxury with practicality to elevate your everyday life.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="w-full lg:w-1/2 relative h-64 md:h-96 rounded-lg overflow-hidden shadow-2xl border border-[#C5A25D]/20"
          >
            <Image
              src="/products/bag1.jpg" 
              alt="Luxury PU Leather Bags"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-110 transition duration-[4s] ease-out"
            />
          </motion.div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-serif font-bold text-[#C5A25D] text-center mb-10 md:mb-16"
        >
          Our Story
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6 text-black text-base md:text-lg leading-relaxed order-2 md:order-1 text-center md:text-left font-medium"
          >
            <p>
              We began as a small workshop rooted in craftsmanship and passion.
              Today we combine tradition with modern design.
            </p>
            <p>
              Every product is carefully crafted from the finest materials, 
              ensuring that each piece carries the mark of excellence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden shadow-xl border border-[#C5A25D]/10 order-1 md:order-2"
          >
            <Image
              src="/products/bag2.jpg" 
              alt="PU Leather Crafting"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-110 transition duration-[4s] ease-out"
            />
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-[#F9F9F9] py-16 md:py-24 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-serif font-bold text-[#C5A25D] mb-12 md:mb-16"
          >
            Our Values
          </motion.h2>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-20"
          >
            {[
              { src: "/icons/Craftsmanship.png.png", title: "Craftsmanship", desc: "Traditional techniques blended with modern design." },
              { src: "/icons/quality.png.jpg", title: "Quality", desc: "Premium materials crafted to last a lifetime." },
              { src: "/icons/elegance.png.jpg", title: "Elegance", desc: "Timeless and refined everyday luxury." }
            ].map((value, idx) => (
              <motion.div variants={fadeInUp} key={idx} className="group space-y-6 flex flex-col items-center text-center">
                <div className="relative w-28 h-28 md:w-36 md:h-36 overflow-hidden rounded-full border border-[#C5A25D]/30 transition-all duration-500 group-hover:border-[#C5A25D] group-hover:rotate-6 shadow-xl bg-white">
                  <Image
                    src={value.src} 
                    alt={value.title}
                    fill
                    className="object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-medium text-black tracking-wide">{value.title}</h3>
                  <p className="text-black text-sm md:text-base max-w-[280px] leading-relaxed font-semibold">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Legacy Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 mb-10">
        <motion.h2 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-serif font-bold text-[#C5A25D] text-center mb-10 md:mb-16"
        >
          Legacy & Artistry
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-2xl border border-[#C5A25D]/10"
          >
            <Image
              src="/products/bag3.jpg" 
              alt="PU Leather Craftsmanship"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-110 transition duration-[4s] ease-out"
            />
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6 text-black text-base md:text-lg leading-relaxed text-center md:text-left font-medium"
          >
            <p>Every bag tells a story of dedication, patience, and true artistry.</p>
            <p>
              Our legacy is built on excellence, where we pay attention to every 
              individual stitch and edge, ensuring a product that is as unique as you are.
            </p>
          </motion.div>
        </div>
      </div>

    </section>
  );
}