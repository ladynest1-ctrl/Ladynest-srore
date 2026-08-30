"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Edit3, XCircle } from "lucide-react"; 

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 1. FULL PRODUCT DELETE FUNCTION ---
  const handleDeleteProduct = async (id) => {
    const isConfirmed = confirm("⚠️ Are you sure? Pura Model (saare bags) delete ho jayenge!");
    if (!isConfirmed) return;

    try {
      const res = await fetch(`/api/products/${id}`, { 
        method: "DELETE" 
      });

      if (res.ok) {
        // Table se foran remove karne ke liye state update
        setProducts(products.filter((p) => p.id !== id));
        alert("Product deleted successfully!");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || "Delete nahi ho saka"}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Server error: Delete process fail ho gaya.");
    }
  };

  // --- 2. SINGLE BAG (VARIATION) DELETE FUNCTION ---
  const deleteVariation = async (productId, imgIndex) => {
    const isConfirmed = confirm("Kya aap ye specific bag image delete karna chahte hain?");
    if (!isConfirmed) return;

    // Isme hum product find karenge aur uski images array se wo index nikal denge
    const productToUpdate = products.find(p => p.id === productId);
    let currentImages = Array.isArray(productToUpdate.images) 
      ? productToUpdate.images 
      : JSON.parse(productToUpdate.images || "[]");

    const updatedImages = currentImages.filter((_, idx) => idx !== imgIndex);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT", // Edit API use hogi images update karne ke liye
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...productToUpdate, images: updatedImages }),
      });

      if (res.ok) {
        // UI mein images update karne ke liye
        setProducts(products.map(p => p.id === productId ? { ...p, images: updatedImages } : p));
        alert("Variation removed!");
      }
    } catch (error) {
      alert("Error updating variations");
    }
  };

  if (loading) return <div className="p-10 text-[#C5A25D] bg-[#0A0A0A] min-h-screen uppercase tracking-widest">Loading Inventory...</div>;

  return (
    <div className="p-6 md:p-10 bg-[#0A0A0A] min-h-screen text-white">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-serif text-[#C5A25D] uppercase tracking-widest font-bold">Inventory Control</h1>
        <Link href="/admin/add-product" className="bg-[#C5A25D] text-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-colors">
          <Plus size={14} /> Add New Model
        </Link>
      </div>
      
      <div className="overflow-x-auto border border-zinc-800 rounded-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-zinc-900 text-[#C5A25D] text-[10px] uppercase tracking-[0.2em]">
            <tr>
              <th className="p-5 border-b border-zinc-800">Model Details</th>
              <th className="p-5 border-b border-zinc-800">Variations (Bags)</th>
              <th className="p-5 border-b border-zinc-800">Price</th>
              <th className="p-5 border-b border-zinc-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center text-zinc-500 uppercase text-xs tracking-widest">No products found in inventory.</td>
              </tr>
            ) : (
              products.map((item) => {
                const images = Array.isArray(item.images) ? item.images : JSON.parse(item.images || "[]");
                
                return (
                  <tr key={item.id} className="border-b border-zinc-900 hover:bg-zinc-900/40 transition-colors">
                    <td className="p-5">
                      <p className="font-bold uppercase tracking-wider text-zinc-200">{item.name}</p>
                      <p className="text-[9px] text-[#C5A25D] uppercase mt-1">Category: {item.category}</p>
                    </td>

                    <td className="p-5">
                      <div className="flex flex-wrap gap-3 items-center">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group w-12 h-16 border border-zinc-800 bg-zinc-900 shadow-lg">
                            <Image src={img} alt="variation" fill className="object-cover" />
                            <button 
                              onClick={() => deleteVariation(item.id, idx)}
                              className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 shadow-xl"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        ))}
                        
                        <Link 
                          href={`/admin/edit-product/${item.id}`}
                          className="w-12 h-16 border-2 border-dashed border-zinc-800 flex items-center justify-center text-zinc-600 hover:text-[#C5A25D] hover:border-[#C5A25D] transition-all"
                          title="Add Variation"
                        >
                          <Plus size={20} />
                        </Link>
                      </div>
                    </td>

                    <td className="p-5 text-[#C5A25D] font-mono font-bold">Rs. {Number(item.price).toLocaleString()}</td>

                    <td className="p-5">
                      <div className="flex justify-end gap-6">
                        <Link href={`/admin/edit-product/${item.id}`} className="text-zinc-500 hover:text-white transition-colors">
                          <Edit3 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeleteProduct(item.id)} 
                          className="text-zinc-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
