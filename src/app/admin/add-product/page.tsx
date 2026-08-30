"use client";
import { useState } from "react";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("tote-bags"); 
  const [imageUrls, setImageUrls] = useState(""); 
  const [colors, setColors] = useState(""); 
  const [rating, setRating] = useState("5.0");
  const [priority, setPriority] = useState("0"); // NEW: Priority State
  const [loading, setLoading] = useState(false);

  const shopifyCategories = [
    { label: "Tote Bags", value: "tote-bags" },
    { label: "Cross Body", value: "cross-body" },
    { label: "Hand Bag", value: "hand-bag" },
    { label: "Shoulder Bag", value: "shoulder-bag" },
    { label: "Three Piece", value: "three-piece" },
    { label: "Two Piece", value: "two-piece" },
    { label: "Clutches", value: "clutches" },
    { label: "Four-piece", value: "four-piece" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagesArray = imageUrls.split(",").map(url => url.trim()).filter(url => url !== "");
    const colorsArray = colors.split(",").map(c => c.trim()).filter(c => c !== "");

    if(imagesArray.length === 0) return alert("Please paste at least one image URL!");
    
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          price: parseFloat(price), 
          description: description.trim(), 
          category: category, 
          images: imagesArray, 
          colors: colorsArray,
          rating: parseFloat(rating),
          priority: parseInt(priority) // NEW: Sending priority to backend
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Lady Nest: Product Added Successfully! ✨");
        // Resetting all fields
        setName(""); setPrice(""); setDescription(""); setCategory("tote-bags"); 
        setImageUrls(""); setColors(""); setRating("5.0"); setPriority("0");
      } else {
        alert(`Error: ${data.message || data.error || "Failed to save"}`);
      }
    } catch (error) {
      console.error("Frontend Fetch Error:", error);
      alert("Network error! Server check karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10 font-sans">
      <div className="max-w-2xl mx-auto border border-zinc-800 p-8 bg-zinc-950 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-serif mb-2 text-[#C5A25D] tracking-widest uppercase text-center">Launch Product</h1>
        <p className="text-zinc-500 text-[10px] mb-8 tracking-widest uppercase italic border-b border-zinc-800 pb-4 text-center">Professional Inventory System</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
               <label className="text-[9px] text-zinc-500 uppercase ml-1 tracking-widest">Product Name</label>
               <input type="text" placeholder="E.G. LUXE TOTE" value={name} onChange={(e) => setName(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-800 rounded outline-none focus:border-[#C5A25D] text-sm" required />
            </div>
            <div className="flex flex-col gap-1">
               <label className="text-[9px] text-zinc-500 uppercase ml-1 tracking-widest">Price (PKR)</label>
               <input type="number" placeholder="4500" value={price} onChange={(e) => setPrice(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-800 rounded outline-none focus:border-[#C5A25D] text-sm" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-[#C5A25D] uppercase ml-1 font-bold tracking-widest">Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="p-3 bg-zinc-900 border border-zinc-800 rounded outline-none focus:border-[#C5A25D] text-sm text-white cursor-pointer"
              >
                {shopifyCategories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-zinc-950">
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-zinc-500 font-bold uppercase ml-1 tracking-widest">Rating (1-5)</label>
              <input type="number" step="0.1" max="5" min="1" value={rating} onChange={(e) => setRating(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-800 rounded outline-none focus:border-[#C5A25D] text-sm" />
            </div>
            {/* NEW: Priority Input Field */}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] text-[#C5A25D] font-bold uppercase ml-1 tracking-widest underline">Arrangement (Order)</label>
              <input type="number" placeholder="1" value={priority} onChange={(e) => setPriority(e.target.value)} className="p-3 bg-zinc-900 border border-[#C5A25D]/50 rounded outline-none focus:border-[#C5A25D] text-sm" title="Lower number = Shows first" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-zinc-500 uppercase ml-1 tracking-widest">Description</label>
            <textarea placeholder="Luxury details..." value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 bg-zinc-900 border border-zinc-800 rounded h-28 outline-none focus:border-[#C5A25D] resize-none text-sm" required />
          </div>
          
          <div className="grid grid-cols-1 gap-5">
            <div className="flex flex-col gap-2 bg-zinc-900/30 p-4 rounded border border-dashed border-zinc-700">
              <label className="text-[#C5A25D] text-[10px] uppercase tracking-widest font-bold">Image URLs (Comma Separated)</label>
              <textarea 
                placeholder="https://img1.com, https://img2.com" 
                value={imageUrls} 
                onChange={(e) => setImageUrls(e.target.value)} 
                className="p-3 bg-black border border-zinc-800 rounded text-[11px] outline-none focus:border-[#C5A25D] h-20 font-mono" 
                required 
              />
            </div>

            <div className="flex flex-col gap-2 bg-zinc-900/30 p-4 rounded border border-dashed border-zinc-700">
              <label className="text-[#C5A25D] text-[10px] uppercase tracking-widest font-bold">Available Colors</label>
              <input 
                type="text"
                placeholder="Black, Baby Pink, Maroon" 
                value={colors} 
                onChange={(e) => setColors(e.target.value)} 
                className="p-3 bg-black border border-zinc-800 rounded text-[11px] outline-none focus:border-[#C5A25D] font-mono" 
              />
              <p className="text-[8px] text-zinc-500 italic uppercase tracking-tighter">Tip: Separate with commas for product detail page selection.</p>
            </div>
          </div>

          <button type="submit" disabled={loading} className="mt-4 bg-[#C5A25D] text-black font-bold p-5 rounded uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-50">
            {loading ? "ARCHIVING TO DATABASE..." : "LAUNCH PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
}