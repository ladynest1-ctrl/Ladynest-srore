"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function StatusDropdown({ orderId, currentStatus }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  // Badge colors (Jab select ho jaye)
  const getBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return "bg-amber-500/20 border-amber-500/40 text-amber-500";
      case 'CONFIRMED': return "bg-emerald-500/20 border-emerald-500/40 text-emerald-500";
      case 'SHIPPED': return "bg-blue-500/20 border-blue-500/40 text-blue-400";
      case 'DELIVERED': return "bg-green-500/20 border-green-500/40 text-green-400";
      case 'CANCELLED': return "bg-red-500/20 border-red-500/40 text-red-500";
      default: return "bg-gray-500/20 border-gray-500/40 text-gray-400";
    }
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentStatus}
        disabled={loading}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={`appearance-none px-4 py-1.5 border text-[10px] font-bold tracking-widest rounded-full cursor-pointer outline-none transition-all shadow-sm
          ${getBadgeClass(currentStatus)} 
          ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}
        `}
        style={{ textAlign: 'center', textTransform: 'uppercase' }}
      >
        {/* 'text-black' lagaya hai taake white background par options saaf nazar aayein */}
        <option value="PENDING" className="text-black bg-white">PENDING</option>
        <option value="CONFIRMED" className="text-black bg-white">CONFIRMED</option>
        <option value="SHIPPED" className="text-black bg-white">SHIPPED</option>
        <option value="DELIVERED" className="text-black bg-white">DELIVERED</option>
        <option value="CANCELLED" className="text-black bg-white font-bold">CANCELLED</option>
      </select>
      
      {/* Chota sa arrow icon taake pata chale dropdown hai */}
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">
        ▼
      </span>
    </div>
  );
}