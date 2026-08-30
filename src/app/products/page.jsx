"use client";

import { useState, useEffect, useMemo } from "react";
import ProductCard from "../../components/ui/ProductCard";
import Link from "next/link";
import { motion } from "framer-motion";

// Categories ko static rakhein taake re-render na hon
const CATEGORIES = [
  { name: "All Collections", slug: "all", href: "/products" },
  { name: "Tote Bags", slug: "tote-bags", href: "/products/category/tote-bags" },
  { name: "Cross Body", slug: "cross-body", href: "/products/category/cross-body" },
  { name: "Hand Bag", slug: "hand-bag", href: "/products/category/hand-bag" },
  { name: "Shoulder Bag", slug: "shoulder-bag", href: "/products/category/shoulder-bag" },
  { name: "Three Piece", slug: "three-piece", href: "/products/category/three-piece" },
  { name: "Two Piece", slug: "two-piece", href: "/products/category/two-piece" },
  { name: "Clutches", slug: "clutches", href: "/products/category/clutches" },
  { name: "Four Piece", slug: "four-piece", href: "/products/category/four-piece" },
];

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Cache management ke liye fetch options add kiye
        const response = await fetch("/api/products", { next: { revalidate: 3600 } });
        const data = await response.json();
        
        const sortedData = data.sort((a, b) => {
          if (a.priority !== b.priority) return a.priority - b.priority;
          return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        });

        setAllProducts(sortedData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Performance optimize: List ko tabhi re-render karein jab data badle
  const productList = useMemo(() => (
    allProducts.map((product, index) => (
      <div key={product.id} className="transition-transform hover:translate-y-[-5px] duration-500">
        {/* Index pass kar rhe hain taake ProductCard priority images load kar sakay */}
        <ProductCard product={product} index={index} />
      </div>
    ))
  ), [allProducts]);

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-black overflow-x-hidden">
      
      {/* --- OPTIMIZED ANNOUNCEMENT BAR --- */}
      <div className="bg-black text-[#C5A25D] py-2 overflow-hidden flex whitespace-nowrap border-b border-[#C5A25D]/20">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-20 items-center"
        >
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold">
              ✨ Lady Nest Luxury: Handcrafted Excellence ✨
            </span>
          ))}
        </motion.div>
      </div>

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6"> 
          <header className="mb-12 md:mb-20 text-center">
            <span className="text-[#C5A25D] text-[9px] uppercase tracking-[0.6em] mb-3 block font-bold">
              Premium PU Leather
            </span>
            <h1 className="text-4xl md:text-6xl font-serif font-light text-black uppercase tracking-tight">
              Our <span className="text-[#C5A25D] italic">Collection</span>
            </h1>
          </header>

          {/* Sticky Nav with glassmorphism */}
          <nav className="sticky top-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-md border-y border-black/5 mb-12">
            <div className="flex items-center justify-start md:justify-center gap-6 md:gap-8 overflow-x-auto py-4 px-4 scrollbar-hide">
              {CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={cat.href} className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-black/50 hover:text-black transition-colors whitespace-nowrap">
                  {cat.name}
                </Link>
              ))}
            </div>
          </nav>

          {loading ? (
            /* --- SKELETON LOADER (Better for UX) --- */
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-20">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="space-y-4 animate-pulse">
                  <div className="aspect-square bg-zinc-200 rounded-sm" />
                  <div className="h-3 bg-zinc-200 w-3/4" />
                  <div className="h-3 bg-zinc-200 w-1/2" />
                </div>
              ))}
            </div>
          ) : allProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-10 md:gap-y-20">
              {productList}
            </div>
          ) : (
            <div className="text-center py-32 font-bold uppercase text-[10px] tracking-[0.3em] opacity-40">
              Collection is currently empty.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}