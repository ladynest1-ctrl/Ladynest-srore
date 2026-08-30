"use client";
import { useState, useCallback, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap, Check, Minus, Plus, Palette, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductActions({ 
  product, 
  label, 
  colors = [], 
  selectedColor, 
  setSelectedColor 
}) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showFlyAnim, setShowFlyAnim] = useState(false); 
  
  const { addToCart } = useCart();
  const router = useRouter();

  // Safety Check: Agar product load nahi hua ya images array khali hai
  const hasImages = product?.images && product.images.length > 0;

  const parsedColors = useMemo(() => {
    if (typeof colors === 'string') {
      try { return JSON.parse(colors); } catch { return []; }
    }
    return Array.isArray(colors) ? colors : [];
  }, [colors]);

  const handleAddToCart = useCallback(() => {
    // Agar images nahi hain toh add to cart block kar dein taake khali product cart me na jaye
    if (!product || !hasImages) {
      alert("Product details are loading or image is missing. Please refresh.");
      return;
    }
    setIsAdding(true);
    setShowFlyAnim(true); 
    addToCart(product, selectedColor, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
      setShowFlyAnim(false);
    }, 800);
  }, [addToCart, product, selectedColor, quantity, hasImages]);

  const handleBuyNow = useCallback(() => {
    if (!product || !hasImages) return;
    addToCart(product, selectedColor, quantity);
    router.push("/cart"); 
  }, [addToCart, product, selectedColor, quantity, router, hasImages]);

  // Agar product hi nahi hai toh render hi na karein
  if (!product) return null;

  return (
    <div className="space-y-8 relative">
      {/* Missing Image Alert for Admin (Optional but helpful) */}
      {!hasImages && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 text-red-600 mb-4">
          <AlertCircle size={20} />
          <span className="text-xs font-bold uppercase tracking-tight">
            Warning: Paradise Bag ki image database se missing hai!
          </span>
        </div>
      )}

      <AnimatePresence>
        {showFlyAnim && (
          <motion.div
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.2, x: 300, y: -500, rotate: 45 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed z-[9999] pointer-events-none"
            style={{ left: '50%', top: '50%', marginLeft: '-25px', marginTop: '-25px' }}
          >
            <div className="bg-[#C5A25D] p-4 rounded-full shadow-2xl">
              <ShoppingBag size={30} className="text-black" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COLOR SELECTOR */}
      {parsedColors.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Palette size={14} className="text-[#C5A25D]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-black font-black">
              Select Color: <span className="text-[#C5A25D]">{selectedColor || "None"}</span>
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {parsedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`px-5 py-2 text-[10px] uppercase tracking-widest font-bold border-2 transition-all duration-200 flex items-center gap-2 active:scale-95 ${
                  selectedColor === color
                    ? "border-black bg-black text-white shadow-md"
                    : "border-gray-100 bg-white text-gray-500 hover:border-black hover:text-black"
                }`}
              >
                {selectedColor === color && <Check size={12} />}
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* QUANTITY */}
      <div className="flex items-center gap-6 mt-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-black font-black">Quantity</span>
        <div className="flex items-center border-2 border-black bg-black">
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-5 py-3 text-white"><Minus size={14} /></button>
          <span className="px-6 text-sm font-black text-white">{quantity}</span>
          <button type="button" onClick={() => setQuantity(quantity + 1)} className="px-5 py-3 text-white"><Plus size={14} /></button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Button tabhi enable hoga jab image maujood hogi */}
        <button 
          onClick={handleAddToCart} 
          disabled={isAdding || !hasImages} 
          className={`py-6 font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 transition-all shadow-xl ${
            !hasImages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white hover:bg-[#C5A25D] hover:text-black"
          }`}
        >
          {isAdding ? "PROCESSING..." : (label || "ADD TO CART")}
        </button>
        
        <button 
          onClick={handleBuyNow} 
          disabled={!hasImages}
          className={`py-6 font-black uppercase tracking-[0.4em] text-[11px] border-2 transition-all ${
            !hasImages ? "border-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-black hover:bg-black hover:text-white border-black"
          }`}
        >
          BUY IT NOW
        </button>
      </div>
    </div>
  );
}