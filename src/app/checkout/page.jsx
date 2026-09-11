"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Truck, ChevronLeft, Smartphone, Building2, ShieldCheck } from "lucide-react";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const [mounted, setMounted] = useState(false); 
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    billingAddress: "", billingCity: "Lahore", billingPostcode: "",
    paymentMethod: "cod",
    orderNotes: "" 
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProductImage = (item) => {
    try {
      const imgs = typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []);
      const idx = item.imageIndex !== undefined ? item.imageIndex : 0;
      return imgs[idx] || imgs[0] || "/placeholder-bag.jpg";
    } catch (e) { 
      return item.image || "/placeholder-bag.jpg"; 
    }
  };

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharges = 300; 
  const total = subtotal + deliveryCharges;

  const cities = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendWhatsAppMessage = (isProofRequest = false) => {
    const phoneNumber = "923214453830";
    const itemsList = cart.map(item => * ${item.name} (${item.selectedColor || 'Standard'}) x${item.quantity} - Rs. ${item.price * item.quantity}).join('\n');

    const baseUrl = "https://api.whatsapp.com/send";
    let message = "";

    if (isProofRequest) {
      const accountTitle = formData.paymentMethod === 'bank' ? 'RAFI TRADERS' : 'RANA ASIM RAFI';
      message = *PAYMENT PROOF - LadyNest*\n\nHi, I am sharing the payment screenshot.\n*Name:* ${formData.firstName} ${formData.lastName}\n*Phone:* ${formData.phone}\n*Amount:* Rs. ${total}\n*Account:* ${accountTitle}\n\n*Order Details:*\n${itemsList};
    } else {
      message = *NEW ORDER - LadyNest*\n\n*Name:* ${formData.firstName} ${formData.lastName}\n*Phone:* ${formData.phone}\n*City:* ${formData.city}\n*Address:* ${formData.address}\n*Payment Method:* ${formData.paymentMethod}\n\n*Items:*\n${itemsList}\n\n*Subtotal:* Rs. ${subtotal}\n*Delivery Charges:* Rs. ${deliveryCharges}\n*Total Bill:* Rs. ${total};
    }

    window.open(${baseUrl}?phone=${phoneNumber}&text=${encodeURIComponent(message)}, '_blank');
  };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your bag is empty!");
    
    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: ${formData.firstName} ${formData.lastName},
        email: formData.email,
        phone: formData.phone,
        address: ${formData.billingAddress}, ${formData.billingCity},
        productName: cart.map(item => ${item.name} (${item.selectedColor || 'Standard'}) x${item.quantity}).join(", "),
        totalPrice: total,
        deliveryCharges,
        paymentMethod: formData.paymentMethod,
        notes: formData.orderNotes 
      };

      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        if (formData.paymentMethod !== 'cod') {
          sendWhatsAppMessage();
        }
        setOrderPlaced(true);
        clearCart();
      } else {
        const errorData = await response.json();
        alert(Order placement failed: ${errorData.error || "Server Error"});
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Network Error! Please check your internet connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center text-center px-6 font-sans">
        <CheckCircle size={60} className="text-[#C5A25D] mb-6 animate-bounce" />
        <h2 className="text-3xl font-serif text-black mb-2 uppercase tracking-widest">Order Received</h2>
        <p className="text-black mb-10 text-[10px] uppercase tracking-widest italic font-bold">Thank you for choosing LadyNest Luxury.</p>
        <Link href="/products" className="bg-black text-white px-12 py-4 text-[10px] uppercase tracking-[0.3em] hover:bg-[#C5A25D] transition-all duration-500">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black py-12 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Link href="/cart" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest mb-10 text-black font-bold hover:text-[#C5A25D] transition-colors">
          <ChevronLeft size={14} /> Back to Bag
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* 01. Delivery Details */}
              <div className="bg-white p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] flex items-center gap-3 text-black">
                  <span className="w-6 h-6 bg-black text-white flex items-center justify-center rounded-full text-[10px]">01</span> Delivery Details
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input required name="firstName" onChange={handleChange} type="text" placeholder="FIRST NAME *" className="w-full border-b border-black/10 p-3 text-[11px] focus:border-[#C5A25D] outline-none transition-all uppercase placeholder:text-black/40 text-black font-medium" />
                  <input required name="lastName" onChange={handleChange} type="text" placeholder="LAST NAME *" className="w-full border-b border-black/10 p-3 text-[11px] focus:border-[#C5A25D] outline-none transition-all uppercase placeholder:text-black/40 text-black font-medium" />
                  <input required name="phone" onChange={handleChange} type="tel" placeholder="PHONE / WHATSAPP *" className="w-full border-b border-black/10 p-3 text-[11px] focus:border-[#C5A25D] outline-none transition-all placeholder:text-black/40 text-black font-medium" />
                  <input name="email" onChange={handleChange} type="email" placeholder="EMAIL (OPTIONAL)" className="w-full border-b border-black/10 p-3 text-[11px] focus:border-[#C5A25D] outline-none transition-all placeholder:text-black/40 text-black font-medium" />
                </div>
                <div className="mt-6 space-y-6">
                  <input required name="billingAddress" onChange={handleChange} type="text" placeholder="FULL STREET ADDRESS, APARTMENT, AREA *" className="w-full border-b border-black/10 p-3 text-[11px] focus:border-[#C5A25D] outline-none transition-all uppercase placeholder:text-black/40 text-black font-medium" />
                  <select name="billingCity" onChange={handleChange} className="w-full border-b border-black/10 p-3 text-[11px] outline-none focus:border-[#C5A25D] bg-transparent uppercase text-black font-medium">
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* 02. Extra Notes */}
              <div className="bg-white p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xs font-bold mb-6 uppercase tracking-[0.2em] flex items-center gap-3 text-black">
                  <span className="w-6 h-6 bg-black text-white flex items-center justify-center rounded-full text-[10px]">02</span> Extra Notes
                </h2>
                <textarea 
                  name="orderNotes" 
                  onChange={handleChange} 
                  placeholder="ANY SPECIFIC DELIVERY INSTRUCTIONS OR GIFT NOTES? (OPTIONAL)" 
                  rows={3}
                  className="w-full border border-gray-100 p-4 text-[11px] focus:border-[#C5A25D] outline-none transition-all uppercase placeholder:text-black/30 text-black font-medium bg-gray-50/30"
                />
              </div>

              {/* 03. Payment Method */}
              <div className="bg-white p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xs font-bold mb-8 uppercase tracking-[0.2em] flex items-center gap-3 text-black">
                  <span className="w-6 h-6 bg-black text-white flex items-center justify-center rounded-full text-[10px]">03</span> Payment Method
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className={flex flex-col items-center justify-center p-4 border cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-100 opacity-40'}}>
                    <Truck size={20} className="mb-2 text-black" />
                    <input type="radio" name="paymentMethod" value="cod" onChange={handleChange} className="hidden" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center text-black">Cash On Delivery</span>
                  </label>
                  
                  <label className={flex flex-col items-center justify-center p-4 border cursor-pointer transition-all ${formData.paymentMethod === 'bank' ? 'border-black bg-gray-50' : 'border-gray-100 opacity-40'}}>
                    <Building2 size={20} className="mb-2 text-black" />
                    <input type="radio" name="paymentMethod" value="bank" onChange={handleChange} className="hidden" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center text-black">Bank Transfer</span>
                  </label>

                  <label className={flex flex-col items-center justify-center p-4 border cursor-pointer transition-all ${formData.paymentMethod === 'jazzcash' ? 'border-black bg-gray-50' : 'border-gray-100 opacity-40'}}>
                    <Smartphone size={20} className="mb-2 text-black" />
                    <input type="radio" name="paymentMethod" value="jazzcash" onChange={handleChange} className="hidden" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center text-black">JazzCash</span>
                  </label>
                </div>

                {formData.paymentMethod !== 'cod' && (
                  <div className="mt-6 p-6 bg-black text-white rounded-sm space-y-4 shadow-xl border border-[#C5A25D]/20">
                    <p className="text-[10px] text-[#C5A25D] uppercase tracking-[0.2em] font-bold">
                      {formData.paymentMethod === 'bank' ? 'Meezan Bank Details' : 'JazzCash Account Details'}
                    </p>
                    <div className="space-y-2 text-[11px] font-mono">
                      <div className="flex justify-between"><span className="opacity-60 uppercase">Title:</span><span className="text-[#C5A25D] font-bold">{formData.paymentMethod === 'bank' ? 'RAFI TRADERS' : 'RANA ASIM RAFI'}</span></div>
                      <div className="flex justify-between"><span className="opacity-60 uppercase">Account:</span><span>{formData.paymentMethod === 'bank' ? '02410105242851' : '03004453830'}</span></div>
                    </div>
                    <div onClick={() => sendWhatsAppMessage(true)} className="flex items-center justify-center gap-2 cursor-pointer bg-green-600/20 border border-green-600/50 py-3 hover:bg-green-600 transition-all group">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-green-500 group-hover:text-white">📸 Share Payment Proof</span>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400">
                  <ShieldCheck size={14} />
                  <span className="text-[9px] uppercase tracking-widest font-medium">100% Secure Checkout & Inspection on Delivery</span>
                </div>

                <button disabled={isSubmitting} type="submit" className="w-full bg-black text-white py-5 font-bold uppercase tracking-[0.4em] text-[11px] hover:bg-[#C5A25D] transition-all duration-700 mt-6 shadow-xl disabled:opacity-50">
                  {isSubmitting ? "Processing..." : "Confirm & Place Order"}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 border-b border-black/10 pb-4 text-black">Your Selection</h3>
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4 items-center">
                    <div className="relative w-16 h-20 bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                      <Image 
                        src={getProductImage(item)} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-[9px] uppercase tracking-widest font-black text-black leading-tight">{item.name}</h4>
                      <p className="text-[9px] text-[#C5A25D] mt-1 uppercase tracking-[0.1em] font-bold italic">
                        {item.selectedColor} <span className="text-black/40">/ Qty: {item.quantity}</span>
                      </p>
                    </div>
                    <div className="text-[10px] font-black text-black font-mono">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}