"use client";

import { useState, useMemo } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react"; 
import { useCart } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart();
  const [showFlyAnim, setShowFlyAnim] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const originalPrice = product.price || 0;
  const oldPrice = originalPrice + 200;

  // --- DYNAMIC SLUG LOGIC ---
  // Ye function active index ke mutabiq name, color aur id ko join karega
  const getDynamicSlug = () => {
    const nameSlug = product.name.toLowerCase().replace(/ /g, '-');
    
    let colorSlug = "";
    try {
      const colorsArray = typeof product.colors === 'string' 
        ? JSON.parse(product.colors) 
        : (product.colors || []);
      
      // Agar us index par color maujood hai to slug mein shamil karein
      if (colorsArray[activeIndex]) {
        colorSlug = `-${colorsArray[activeIndex].toLowerCase().replace(/ /g, '-')}`;
      }
    } catch (e) {
      colorSlug = "";
    }

    return `${nameSlug}${colorSlug}-${product.id}`;
  };

  const dynamicSlug = getDynamicSlug();

  const getOptimizedUrl = (url, width = 500) => {
    if (!url || typeof url !== 'string' || !url.includes("cloudinary")) return url || "/placeholder.png";
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
  };

  const allImages = useMemo(() => {
    if (!product.images) return [product.image || "/placeholder.png"];
    try {
      const parsed = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : ["/placeholder.png"];
    } catch (e) {
      return [product.image || "/placeholder.png"];
    }
  }, [product.images, product.image]);

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    let selectedColor = "Standard";
    try {
      const colorsArray = typeof product.colors === 'string' ? JSON.parse(product.colors) : (product.colors || []);
      if (colorsArray[activeIndex]) selectedColor = colorsArray[activeIndex];
    } catch (err) {
      selectedColor = "Standard";
    }

    setShowFlyAnim(true);
    addToCart(product, selectedColor, 1); 

    setTimeout(() => setShowFlyAnim(false), 1000); 
  };

  return (
    <div className="group flex flex-col h-full bg-white relative transition-all duration-300">
      
      <AnimatePresence>
        {showFlyAnim && (
          <motion.div
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.3, x: 150, y: -400, rotate: 20 }}
            transition={{ duration: 0.8, ease: "backIn" }}
            className="fixed z-[9999] pointer-events-none"
            style={{ left: '50%', top: '50%', marginLeft: '-20px', marginTop: '-20px' }}
          >
            <div className="bg-[#C5A25D] p-3 rounded-full shadow-2xl border border-white">
              <ShoppingBag size={24} className="text-black" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative aspect-square w-full overflow-hidden bg-[#FBFBFB] border border-black/[0.02]">
        <div className="absolute top-3 left-3 z-40 bg-red-600 text-white text-[8px] font-black px-2 py-1 uppercase tracking-widest shadow-lg">
          Save Rs. 200
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          lazy={{ loadPrevNext: true }}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: `.next-${product.id}`,
            prevEl: `.prev-${product.id}`,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          loop={false}
          onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          className="h-full w-full"
        >
          {allImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              {/* Dynamic URL based on active slide */}
              <Link href={`/products/${dynamicSlug}`} className="cursor-pointer block w-full h-full">
                <Image
                  src={getOptimizedUrl(img)}
                  alt={`${product.name}-${idx}`}
                  fill
                  priority={index < 4 && idx === 0} 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </Link>
            </SwiperSlide>
          ))}

          {allImages.length > 1 && (
            <>
              <div className={`prev-${product.id} absolute left-2 top-1/2 -translate-y-1/2 z-30 cursor-pointer text-black/40 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity`}>
                <ChevronLeft size={18} />
              </div>
              <div className={`next-${product.id} absolute right-2 top-1/2 -translate-y-1/2 z-30 cursor-pointer text-black/40 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity`}>
                <ChevronRight size={18} />
              </div>
            </>
          )}
        </Swiper>

        <button 
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-black text-white p-2.5 rounded-full z-40 shadow-lg hover:bg-[#C5A25D] transition-all duration-300 active:scale-90 md:opacity-0 md:group-hover:opacity-100"
        >
          <ShoppingBag size={15} />
        </button>
      </div>

      {/* Info Area uses the dynamic slug too */}
      <Link href={`/products/${dynamicSlug}`} className="mt-4 flex flex-col items-start px-1">
        <div className="flex items-center gap-1 mb-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={9} className="fill-[#C5A25D] text-[#C5A25D]" />
          ))}
          <span className="text-[7px] text-zinc-400 ml-1 italic tracking-widest uppercase font-bold">In Stock</span>
        </div>

        <h3 className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.1em] text-black group-hover:text-[#C5A25D] transition-colors leading-tight mb-2">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-3 mt-1">
          <p className="text-[16px] md:text-[19px] font-sans text-black font-black flex items-baseline leading-none">
            <span className="text-[10px] font-bold mr-0.5 text-[#C5A25D]">Rs.</span>
            {originalPrice.toLocaleString()}
          </p>
          <p className="text-[12px] md:text-[14px] font-sans text-gray-400 font-bold line-through decoration-red-500/70 decoration-[1.5px] leading-none">
            Rs. {oldPrice.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  );
}