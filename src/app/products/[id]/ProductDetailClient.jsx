"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, Sparkles, Maximize2, Ruler, Lock, Truck, Star } from "lucide-react";
import ProductGallery from "../../../components/ui/ProductGallery";
import ProductActions from "../../../components/ui/ProductActions";

export default function ProductDetailClient({ product, productImages, productColors }) {
  const [selectedColor, setSelectedColor] = useState(productColors[0] || "");

  useEffect(() => {
    if (selectedColor && product) {
      const nameSlug = product.name.toLowerCase().replace(/ /g, "-");
      const colorSlug = selectedColor.toLowerCase().replace(/ /g, "-");
      const newPath = `/products/${nameSlug}-${colorSlug}-${product.id}`;
      window.history.replaceState(null, "", newPath);
    }
  }, [selectedColor, product]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 px-4 md:px-6 mt-6 md:mt-12 mb-16 md:mb-24">
      
      {/* LEFT SIDE: GALLERY */}
      <div className="lg:col-span-7 w-full self-start lg:sticky lg:top-24">
        <div className="bg-white p-2 md:p-4 shadow-xl shadow-black/5 border border-gray-100 rounded-sm">
          <ProductGallery 
            images={productImages} 
            colors={productColors}
            name={product.name} 
            selectedColor={selectedColor} 
            setSelectedColor={setSelectedColor} 
          />
        </div>
      </div>

      {/* RIGHT SIDE: INFO */}
      <div className="lg:col-span-5 flex flex-col w-full">
        {/* Title and Price */}
        <div className="space-y-4">
          <span className="text-[#C5A25D] text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-black italic block">
            {product.category || "Luxury"} Collection
          </span>
          <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-tight leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 md:gap-6">
            <p className="text-2xl md:text-3xl font-serif font-bold">Rs. {product.price.toLocaleString()}</p>
            <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-2 py-0.5 md:px-2.5 md:py-1 rounded">
              <Star size={10} fill="currentColor" />
              <span className="text-[9px] md:text-[10px] font-black">5.0</span>
            </div>
          </div>
        </div>

        {/* 1. COLORS & BUTTONS (Moved Up) */}
        <div className="mt-8 md:mt-12 space-y-6">
          <ProductActions 
            product={product} 
            colors={productColors} 
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor} 
          />
        </div>

        {/* 2. DESCRIPTION (Moved Below Buttons) */}
        <div className="mt-8 md:mt-10 pl-4 md:pl-6 border-l-2 border-black">
          <p className="text-[13px] md:text-[14px] text-black/70 italic leading-relaxed">
            {product.description?.split(/(\d+["x])/)[0] || "A signature piece designed for elegance and daily luxury."}
          </p>
        </div>

        {/* 3. TABULAR SPECS */}
        <div className="mt-8 md:mt-10 bg-white border border-black overflow-hidden shadow-sm">
          <div className="bg-black px-4 py-2 flex justify-between items-center text-white">
            <span className="text-[8px] uppercase tracking-widest font-bold">Product Blueprint</span>
            <ShieldCheck size={12} className="text-[#C5A25D]" />
          </div>
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-gray-100">
              <tr className="text-[9px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors">
                <td className="p-3 md:p-4 bg-gray-50/50 w-28 md:w-32 flex items-center gap-2">
                  <Sparkles size={12} className="text-[#C5A25D] shrink-0"/> Material
                </td>
                <td className="p-3 md:p-4 text-gray-600">Premium PU / Gold Hardware</td>
              </tr>
              <tr className="text-[9px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors">
                <td className="p-3 md:p-4 bg-gray-50/50 flex items-center gap-2">
                  <Maximize2 size={12} className="text-[#C5A25D] shrink-0"/> Dimensions
                </td>
                <td className="p-3 md:p-4 text-gray-600">
                  {product.width || '12'}&quot; (W) x {product.height || '10'}&quot; (H)
                </td>
              </tr>
              <tr className="text-[9px] uppercase tracking-widest font-bold hover:bg-gray-50 transition-colors">
                <td className="p-3 md:p-4 bg-gray-50/50 flex items-center gap-2">
                  <Ruler size={12} className="text-[#C5A25D] shrink-0"/> Palette
                </td>
                <td className="p-3 md:p-4 text-gray-600">
                  {productColors.length > 0 ? productColors.join(" • ") : "Signature Edition"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 4. TRUST BADGES */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-4">
          <div className="p-3 md:p-4 border border-black flex items-center gap-2 md:gap-3 hover:bg-black hover:text-white transition-all group cursor-default">
            <Lock size={16} className="text-[#C5A25D] shrink-0" />
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Secure Checkout</span>
          </div>
          <div className="p-3 md:p-4 border border-black flex items-center gap-2 md:gap-3 hover:bg-black hover:text-white transition-all group cursor-default">
            <Truck size={16} className="text-[#C5A25D] shrink-0" />
            <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}