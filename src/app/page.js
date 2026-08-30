import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as motion from 'framer-motion/client';
import { prisma } from "../lib/prisma"; 
import ProductCard from "../components/ui/ProductCard";
import { Star, CheckCircle } from "lucide-react";

export default async function HomePage() {
  
  // 1. Database se Products fetch karna (Priority ke hisaab se)
  // 'asc' ka matlab hai ke Priority 1 pehle aayegi, 2 baad mein.
  const featuredProducts = await prisma.product.findMany({
    take: 8, // Aap isey apni marzi se barha sakte hain
    orderBy: [
      { priority: 'asc' },
      { createdAt: 'desc' }
    ]
  });

  const dbCategories = await prisma.product.findMany({
    select: {
      category: true,
      images: true, 
    },
    distinct: ['category'],
  });

  const subtlePalettes = [
    'Crafted Elegance', 'Everyday Versatility', 'Timeless Classic', 
    'Sophisticated Form', 'Complete Ensemble', 'Two-Tone Refinement', 
    'Evening Glamour', 'The Ultimate Set'
  ];

  return (
    <main className="min-h-screen bg-white relative">
      
      {/* --- 0. SUMMER COLLECTION POP-UP (Mobile & Desktop Optimized) --- */}
      <input type="checkbox" id="close-popup" className="peer hidden" />
      
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8, type: "spring" }}
        className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:bottom-12 z-[100] 
                   peer-checked:hidden flex items-center gap-4 md:gap-6 
                   bg-black text-white p-4 md:p-6 
                   shadow-[0_10px_40px_rgba(197,162,93,0.4)] 
                   border-2 border-[#C5A25D] rounded-sm group 
                   max-w-full md:min-w-[340px]"
      >
        <div className="relative w-16 h-16 md:w-24 md:h-24 border border-[#C5A25D]/30 overflow-hidden bg-white/5 flex-shrink-0">
            <Image src="/logo.png" alt="LadyNest Logo" fill className="object-contain p-2" />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[9px] md:text-[11px] text-[#C5A25D] font-bold uppercase tracking-[0.3em] mb-1 animate-pulse">
            Exclusive Launch
          </span>
          <h3 className="text-lg md:text-2xl font-serif tracking-[0.1em] uppercase text-white leading-tight">
            Summer <span className="text-[#C5A25D] italic">Collection</span> <br className="hidden md:block" /> 2026
          </h3>
          <div className="h-px w-8 md:w-12 bg-[#C5A25D] my-1 md:my-2"></div>
          <Link 
            href="/products" 
            className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-[#C5A25D] text-black px-4 py-2 md:px-5 md:py-2.5 mt-1 text-center hover:bg-white transition-all duration-500 shadow-lg"
          >
            Explore Now
          </Link>
        </div>

        <label 
          htmlFor="close-popup"
          className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-white text-black border border-[#C5A25D] rounded-full w-7 h-7 md:w-8 md:h-8 text-xs md:text-sm flex items-center justify-center hover:bg-[#C5A25D] hover:text-white transition-all shadow-xl cursor-pointer"
        >
          ×
        </label>
      </motion.div>

      {/* 1. SEO H1 TAG (Hidden but good for Google) */}
      <h1 className="sr-only">Women’s Handbags & Luxury Fashion Online in Pakistan – LadyNest</h1>

      {/* 2. ANNOUNCEMENT BAR */}
      <div className="bg-black text-[#C5A25D] py-2.5 overflow-hidden border-b border-[#C5A25D]/20 flex">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap text-[10px] uppercase tracking-[0.4em] font-bold flex gap-20 min-w-full"
        >
          <span>✨ Bloom in Style: Explore Our Exclusive Summer Collection 2026 — Limited Edition Bags & Suits ✨</span>
          <span>✨ Bloom in Style: Explore Our Exclusive Summer Collection 2026 — Limited Edition Bags & Suits ✨</span>
        </motion.div>
      </div>

      {/* 3. HERO SECTION */}
      <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-gray-100">
        <Link href="/products" className="block w-full h-full relative group">
          <Image 
            src="/main-banner.jpg" 
            alt="Lady Nest Summer Collection Luxury Bags"
            fill
            priority
            className="object-cover object-center group-hover:scale-105 transition-transform duration-[4000ms]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="relative z-10">
            </div>
          </div>
        </Link>
      </section>

      {/* 4. CATEGORY GRID */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto bg-white">
        <div className="text-center mb-16">
          <span className="text-[#C5A25D] text-[10px] uppercase tracking-[0.6em] font-bold">Curated Selection</span>
          <h2 className="font-serif text-4xl md:text-5xl uppercase tracking-[0.1em] mt-4 text-black text-center">
            Shop by <span className="italic font-light">Category</span>
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {dbCategories.map((cat, index) => {
            let imageList = [];
            try {
              imageList = typeof cat.images === 'string' ? JSON.parse(cat.images) : cat.images;
            } catch (e) { imageList = []; }
            const firstImg = imageList && imageList.length > 0 ? imageList[0] : "/placeholder.jpg";

            return (
              <Link 
                key={cat.category} 
                href={`/products/category/${cat.category.toLowerCase().replace(/ /g, '-')}`} 
                className="group relative overflow-hidden aspect-[4/5] rounded-sm bg-gray-100 transition-all duration-500"
              >
                <Image 
                  src={firstImg} 
                  alt={`${cat.category} Luxury Bags LadyNest`}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 text-center p-4">
                   <span className="text-[#C5A25D] text-[9px] uppercase tracking-[0.5em] font-bold mb-2 translate-y-4 group-hover:translate-y-0 transition-all duration-500 opacity-0 group-hover:opacity-100">
                     {subtlePalettes[index] || "Exclusive Collection"}
                   </span>
                   <h3 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.1em] text-white drop-shadow-lg">
                     {cat.category}
                   </h3>
                   <span className="mt-4 text-white text-[9px] uppercase tracking-[0.4em] font-semibold border border-white/30 px-5 py-2 hover:bg-white hover:text-black transition-all duration-300">
                      Explore
                   </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. LIVE FEATURED PRODUCTS (Priority Sorted) */}
      <section className="py-24 bg-[#FCFBFA] border-t border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
             <div className="text-center md:text-left">
               <h2 className="font-serif text-4xl uppercase tracking-[0.1em] text-black leading-tight">
                 Summer <span className="text-[#C5A25D] italic">Favorites</span>
               </h2>
               <p className="text-[11px] text-black font-semibold uppercase tracking-[0.3em] mt-3">
                 Handcrafted Elegance for Your Special Occasions
               </p>
             </div>
             <Link 
               href="/products" 
               className="text-[10px] uppercase tracking-[0.4em] border-b border-black pb-2 hover:text-[#C5A25D] hover:border-[#C5A25D] transition-all duration-300 font-bold text-black"
             >
               View All Products
             </Link>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
             ) : (
                <div className="col-span-full text-center py-20 text-black text-xs uppercase tracking-widest font-bold">
                  New masterpieces arriving soon...
                </div>
             )}
           </div>
        </div>
      </section>

      {/* --- 6. REVIEWS SECTION --- */}
      <section className="py-24 bg-white overflow-hidden border-t border-gray-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex items-center gap-2 mb-3 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle size={10} className="text-green-600" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-green-700">Verified Client Feedback</span>
            </div>
            <h2 className="font-serif text-4xl uppercase tracking-[0.1em] text-black leading-tight">
              Customer <span className="text-[#C5A25D] italic">Stories</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 1, name: "Ayesha R.", city: "Lahore", comment: "The quality is simply unmatched. Best Summer purchase so far! Highly recommended for premium gifts.", date: "2 Days Ago" },
              { id: 2, name: "Sara K.", city: "Karachi", comment: "Exactly as shown in pictures. The packaging was so luxury and delivered on time.", date: "5 Days Ago" },
              { id: 3, name: "Fatima L.", city: "Islamabad", comment: "Love the gold hardware details. Truly an artisan piece that stands out.", date: "1 Week Ago" }
            ].map((rev) => (
              <div key={rev.id} className="p-8 border border-gray-200 bg-[#FCFBFA] relative group hover:border-[#C5A25D]/30 transition-all duration-500">
                <div className="flex text-yellow-500 mb-4 gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                </div>
                <p className="text-black text-sm italic font-medium leading-relaxed mb-6">{`"${rev.comment}"`}</p>
                <div className="flex justify-between items-center border-t border-gray-100 pt-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-1">
                      {rev.name}
                    </span>
                    <span className="text-[8px] text-black font-bold uppercase tracking-widest">{rev.city}</span>
                  </div>
                  <span className="text-[8px] text-black font-black uppercase tracking-widest">{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-20 bg-white text-center border-t border-gray-100">
        <h2 className="font-serif text-3xl tracking-widest uppercase mb-6 text-black tracking-[0.3em]">Lady Nest</h2>
        <p className="text-black text-[9px] font-bold uppercase tracking-[0.5em] px-4 max-w-md mx-auto leading-loose">
          Redefining luxury through handcrafted artisanal bags and exclusive apparel. 
        </p>
        <div className="mt-12 flex justify-center gap-10 text-[10px] uppercase tracking-widest text-black font-black">
           <Link href="/products" className="hover:text-[#C5A25D]">Collections</Link>
           <Link href="/about" className="hover:text-[#C5A25D]">About</Link>
           <Link href="/contact" className="hover:text-[#C5A25D]">Contact</Link>
        </div>
        <p className="mt-20 text-[8px] text-black font-bold uppercase tracking-widest">
          © 2026 Lady Nest Luxury. All Rights Reserved.
        </p>
      </footer>
    </main>
  );
}