"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Package, 
  ShoppingBag, 
  MessageSquare, 
  PlusCircle, 
  LayoutGrid, 
  ClipboardList,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        setError(null);

        const safeFetch = async (url) => {
          const res = await fetch(url, { cache: 'no-store' }); // Live data ke liye
          if (!res.ok) throw new Error(`Failed to fetch ${url}`);
          return res.json();
        };

        // Parallel fetching for speed
        const [prodData, orderData, msgData] = await Promise.all([
          safeFetch("/api/products").catch(() => []),
          safeFetch("/api/orders").catch(() => []),
          safeFetch("/api/contact").catch(() => [])
        ]);

        // Helper function to handle both Array and Object responses
        const getCount = (data) => {
          if (!data) return 0;
          if (Array.isArray(data)) return data.length;
          if (typeof data === 'object') {
            // Check for common keys like .products, .orders, etc.
            const possibleArray = data.products || data.orders || data.messages || data.data;
            return Array.isArray(possibleArray) ? possibleArray.length : 0;
          }
          return 0;
        };

        setStats({
          products: getCount(prodData),
          orders: getCount(orderData),
          messages: getCount(msgData)
        });

      } catch (err) {
        console.error("Dashboard Stats Error:", err);
        setError("Could not load stats. Please check admin session.");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Animation variants (Fix for ReferenceError)
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="bg-white min-h-screen text-black p-6 md:p-12 font-sans selection:bg-[#C5A25D] selection:text-white">
      
      {/* Header Section */}
      <motion.header 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="mb-16 border-b border-gray-100 pb-8"
      >
        <span className="text-[#C5A25D] text-[10px] uppercase tracking-[0.5em] mb-3 block font-bold">Internal Access</span>
        <h1 className="text-4xl md:text-5xl font-serif text-black uppercase tracking-tighter">
          Admin <span className="text-[#C5A25D] italic">Dashboard</span>
        </h1>
        <div className="flex justify-between items-center mt-2">
            <p className="text-gray-400 text-[10px] uppercase tracking-widest">LadyNest Management Control</p>
            {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase tracking-tighter">
                    <AlertCircle size={14} /> {error}
                </div>
            )}
        </div>
      </motion.header>
      
      {/* Stats Grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
      >
        {[
          { label: "Total Products", value: stats.products, icon: <Package size={20} />, link: "/admin/products" },
          { label: "Active Orders", value: stats.orders, icon: <ShoppingBag size={20} />, link: "/admin/orders" },
          { label: "Inquiries", value: stats.messages, icon: <MessageSquare size={20} />, link: "/admin/messages" }
        ].map((stat, index) => (
          <Link href={stat.link} key={index}>
            <motion.div 
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-100 p-10 flex flex-col items-center justify-center relative group shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
            >
              <div className="text-[#C5A25D]/20 group-hover:text-[#C5A25D] transition-colors duration-500 mb-4">
                {stat.icon}
              </div>
              <span className="text-gray-400 text-[9px] uppercase tracking-[0.3em] mb-2 font-bold">{stat.label}</span>
              <span className="text-5xl font-serif text-black group-hover:text-[#C5A25D] transition-colors">
                {loading ? "..." : stat.value}
              </span>
              
              <div className="mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[9px] uppercase tracking-widest text-[#C5A25D]">View Details</span>
                <ArrowRight size={10} className="text-[#C5A25D]" />
              </div>

              <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C5A25D] group-hover:w-full transition-all duration-700"></div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-6"
      >
        <h3 className="text-[11px] uppercase tracking-[0.4em] text-gray-400 font-bold mb-6">Quick Management</h3>
        <div className="flex flex-wrap gap-6">
          <Link href="/admin/add-product" className="group flex items-center justify-center gap-3 px-10 py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A25D] transition-all duration-500 shadow-lg">
            <PlusCircle size={16} /> <span>Launch New Product</span>
          </Link>
          
          <Link href="/admin/orders" className="group flex items-center justify-center gap-3 px-10 py-5 bg-[#C5A25D] text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all duration-500 shadow-lg">
            <ClipboardList size={16} /> <span>Manage Orders</span>
          </Link>

          <Link href="/admin/products" className="group flex items-center justify-center gap-3 px-10 py-5 border border-black text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-500">
            <LayoutGrid size={16} /> <span>View Inventory</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}