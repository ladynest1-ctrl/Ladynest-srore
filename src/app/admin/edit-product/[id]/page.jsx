"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Plus, ArrowLeft, Save, X, Loader2 } from "lucide-react";

export default function EditProductPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newBag, setNewBag] = useState({ url: "", color: "" });
  const [productId, setProductId] = useState(null);

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    rating: 5,
    priority: 0,
    images: [],
    colors: [],
    description: "",
  });

  // Get ID
  useEffect(() => {
    async function getParams() {
      const unwrapped = await params;
      setProductId(unwrapped.id);
    }
    getParams();
  }, [params]);

  // Fetch product
  useEffect(() => {
    async function fetchProduct() {
      if (!productId) return;
      
      setLoading(true);
      
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);
        
        setProduct({
          name: data.name || "",
          price: data.price || "",
          category: data.category || "",
          rating: data.rating || 5,
          priority: data.priority || 0,
          images: data.images || [],
          colors: data.colors || [],
          description: data.description || "",
        });
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProduct();
  }, [productId]);

  const handleAddVariation = () => {
    if (!newBag.url || !newBag.color) {
      alert("Image URL aur Color dono likhen!");
      return;
    }
    
    setProduct({
      ...product,
      images: [...product.images, newBag.url],
      colors: [...product.colors, newBag.color.trim()]
    });
    setNewBag({ url: "", color: "" });
    setShowModal(false);
  };

  const removeVariation = (index) => {
    if (product.images.length <= 1) {
      return alert("Ek image hona lazmi hai!");
    }
    setProduct({
      ...product,
      images: product.images.filter((_, i) => i !== index),
      colors: product.colors.filter((_, i) => i !== index)
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          priority: parseInt(product.priority),
          rating: parseFloat(product.rating),
        }),
      });
      
      if (res.ok) {
        alert("✅ Product updated successfully!");
        router.push("/admin/products");
      } else {
        const data = await res.json();
        alert("Update failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Network error!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-[#C5A25D]" size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button onClick={() => router.back()} className="bg-[#C5A25D] text-black px-6 py-3 rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-12 bg-black min-h-screen text-white">
      {/* Header */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-[#C5A25D] mb-8">
        <ArrowLeft size={16} /> Back
      </button>
      
      <h1 className="text-3xl font-serif text-[#C5A25D] mb-6">Edit: {product.name}</h1>
      
      <form onSubmit={handleUpdate} className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-[#C5A25D] mb-6 text-sm uppercase">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Product Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => setProduct({...product, name: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-[#C5A25D] outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => setProduct({...product, price: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-[#C5A25D] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Category</label>
                  <input
                    type="text"
                    value={product.category}
                    onChange={(e) => setProduct({...product, category: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-[#C5A25D] outline-none"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={product.rating}
                    onChange={(e) => setProduct({...product, rating: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-[#C5A25D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Priority</label>
                  <input
                    type="number"
                    value={product.priority}
                    onChange={(e) => setProduct({...product, priority: e.target.value})}
                    className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-[#C5A25D] outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Description</label>
                <textarea
                  rows="5"
                  value={product.description}
                  onChange={(e) => setProduct({...product, description: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 focus:border-[#C5A25D] outline-none resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Images */}
        <div className="bg-zinc-900/20 p-6 rounded-xl border border-zinc-800 h-fit">
          <h2 className="text-[#C5A25D] mb-6 text-sm uppercase">Images ({product.images.length})</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            {product.images.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden group border border-zinc-800">
                <img src={img} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 text-center">
                  <p className="text-[8px] text-white truncate">{product.colors[idx]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVariation(idx)}
                  className="absolute top-2 right-2 bg-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="aspect-[3/4] border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center hover:border-[#C5A25D]"
            >
              <Plus size={24} />
              <span className="text-[10px] mt-2">Add Image</span>
            </button>
          </div>
          
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#C5A25D] text-black py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-white disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="animate-spin" size={18} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#C5A25D] font-bold">Add New Variation</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Image URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={newBag.url}
                  onChange={(e) => setNewBag({...newBag, url: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[#C5A25D] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Color Name</label>
                <input
                  type="text"
                  placeholder="e.g., Black"
                  value={newBag.color}
                  onChange={(e) => setNewBag({...newBag, color: e.target.value})}
                  className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-sm focus:border-[#C5A25D] outline-none"
                />
              </div>
              
              <button
                onClick={handleAddVariation}
                className="w-full bg-[#C5A25D] text-black py-3 rounded-lg font-bold hover:bg-white"
              >
                Add Variation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}