'use client';

import { useState, useEffect } from 'react';

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: 'Lahore',
    address: '',
  });

  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  const deliveryCharges = 300;
  const total = subtotal + deliveryCharges;

  const handleWhatsAppSend = () => {
    const phoneNumber = "923214453830";
    const itemsList = cart.map(item => `${item.name} (${item.selectedColor || 'Standard'}) x${item.quantity || 1}`).join(', ');
    const baseUrl = "https://api.whatsapp.com/send";
    let message = `Order Details: ${itemsList}`;

    window.open(`${baseUrl}?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleOrderSubmit = async () => {
    handleWhatsAppSend();

    try {
      const itemsList = cart.map(item => `${item.name} (${item.selectedColor || 'Standard'}) x${item.quantity || 1}`).join(', ');
      
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemsList, total }),
      });
    } catch (err) {
      console.error("Email send failed:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="space-y-4 pt-6 border-t border-black/10">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-black font-bold">
          <span>Subtotal</span>
          <span className="text-black font-black">Rs. {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-black font-bold">
          <span>Delivery</span>
          <span className="text-black font-black">Rs. {deliveryCharges}</span>
        </div>
        <div className="flex justify-between pt-6 border-t border-black/10">
          <span className="text-[11px] uppercase tracking-[0.3em] font-black text-black">Total Bill</span>
          <span className="text-2xl font-serif text-[#C5A25D] font-bold">Rs. {total.toLocaleString()}</span>
        </div>

        <button
          onClick={handleOrderSubmit}
          className="w-full bg-black text-white py-5 flex items-center justify-center gap-3 font-bold uppercase tracking-wider rounded-md"
        >
          Confirm Order & Send Email
        </button>
      </div>
    </div>
  );
}