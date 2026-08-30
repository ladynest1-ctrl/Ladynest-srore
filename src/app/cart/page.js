"use client";

import { useCart } from "../../context/CartContext"; 
import { useEffect, useState } from "react"; 
import Link from "next/link";
import Image from "next/image"; 
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Palette, Loader2 } from "lucide-react";

export default function CartPage() {
  const { cart, addToCart, removeFromCart, removeFromCartOne, isLoaded } = useCart();
  const [realProducts, setRealProducts] = useState([]); 

  useEffect(() => {
    async function fetchLiveProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        // Check if data is array before slicing
        const productsArray = Array.isArray(data) ? data : (data.products || []);
        setRealProducts(productsArray.slice(0, 4));
      } catch (err) {
        console.error("Error fetching related products", err);
      }
    }
    fetchLiveProducts();
  }, []);

  const handleQuantityChange = (item, action) => {
    if (action === "plus") {
      addToCart(item, item.selectedColor, 1);
    } else if (action === "minus") {
      removeFromCartOne(item.cartItemId);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);

  const generateSeoUrl = (item) => {
    const nameSlug = item.name ? item.name.toLowerCase().replace(/ /g, '-') : 'product';
    const colorSlug = (item.selectedColor || 'standard').toLowerCase().replace(/ /g, '-');
    return `/products/${nameSlug}-${colorSlug}-${item.id}`;
  };

  const getProductImage = (item) => {
    try {
      const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []);
      const idx = item.imageIndex !== undefined ? item.imageIndex : 0;
      return imgs[idx] || imgs[0] || "/placeholder-bag.jpg";
    } catch (e) { 
      return item.image || "/placeholder-bag.jpg"; 
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-[#C5A25D]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans selection:bg-[#C5A25D] selection:text-white">
      <div className="bg-white border-b border-gray-100 py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-serif uppercase tracking-[0.3em] text-black">
          Shopping <span className="text-[#C5A25D]">Bag</span>
        </h1>
        <p className="text-[10px] text-black uppercase tracking-widest mt-4 italic font-bold">Review your artisanal selections</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {cart.length === 0 ? (
          <div className="text-center py-32 bg-white shadow-sm border border-gray-100">
            <ShoppingBag size={48} className="mx-auto text-black/20 mb-6" strokeWidth={1} />
            <p className="text-black text-sm mb-8 font-bold italic tracking-widest uppercase">Your bag is currently empty.</p>
            <Link href="/products" className="bg-black text-white px-10 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-[#C5A25D] transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item, index) => (
                <div 
                  // FIX: Added index as fallback to ensure a unique key always exists
                  key={item.cartItemId || `cart-item-${item.id}-${index}`} 
                  className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 shadow-sm border border-gray-100 group relative transition-all hover:border-[#C5A25D]/30"
                >
                  <Link href={generateSeoUrl(item)} className="relative w-24 h-32 bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-50">
                    <Image 
                      src={getProductImage(item)} 
                      alt={`${item.name || 'Product'} in ${item.selectedColor || 'Standard'}`} 
                      fill 
                      className="object-contain p-1 group-hover:scale-110 transition-transform duration-700" 
                    />
                  </Link>

                  <div className="flex-grow text-center sm:text-left">
                    <Link href={generateSeoUrl(item)}>
                       <h3 className="text-sm font-serif uppercase tracking-widest text-black font-bold hover:text-[#C5A25D] transition-colors">{item.name}</h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                      <Palette size={10} className="text-[#C5A25D]" />
                      <span className="text-[9px] text-black uppercase tracking-[0.2em] font-black italic">
                        Color: <span className="text-[#C5A25D] font-black">{item.selectedColor || "Standard"}</span>
                      </span>
                    </div>

                    <p className="text-[9px] text-black/40 uppercase tracking-widest mt-1 font-medium italic">Ref: {String(item.id || index).slice(-6).toUpperCase()}</p>
                    <p className="text-[#C5A25D] font-mono text-sm mt-3 font-bold">Rs. {(item.price || 0).toLocaleString()}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center border border-black/10 rounded-full px-4 py-2 space-x-6 bg-gray-50/50">
                    <button onClick={() => handleQuantityChange(item, "minus")} className="hover:text-[#C5A25D] transition-colors p-1"><Minus size={12}/></button>
                    <span className="text-xs font-black min-w-[20px] text-center">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item, "plus")} className="hover:text-[#C5A25D] transition-colors p-1"><Plus size={12}/></button>
                  </div>

                  <div className="flex flex-col items-end gap-2 min-w-[120px]">
                    <p className="text-sm font-black text-black font-mono tracking-tighter">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)} 
                      className="text-black/20 hover:text-red-600 transition-colors flex items-center gap-1 group/del"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white p-8 shadow-sm border border-gray-100 sticky top-10">
                <h2 className="text-xs font-bold uppercase tracking-widest border-b border-gray-100 pb-4 mb-6 text-black">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-black font-medium">
                    <span>Subtotal Items</span>
                    <span className="text-black font-bold">Rs. {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] uppercase tracking-widest text-black font-medium">
                    <span>Delivery</span>
                    <span className="text-black font-bold italic text-[9px]">Calculated at checkout</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-black">Grand Total</span>
                  <span className="text-2xl font-serif text-[#C5A25D] font-bold">Rs. {total.toLocaleString()}</span>
                </div>
                <Link href="/checkout" className="w-full bg-black text-white py-5 flex items-center justify-center gap-3 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-[#C5A25D] hover:text-white transition-all group shadow-xl border-2 border-black">
                  Checkout Now <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}