"use client";

import React, { useState } from 'react';

export default function CheckoutPage() {
  const [cart] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Lahore',
  });

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const deliveryCharges = 300;
  const total = subtotal + deliveryCharges;
const handleWhatsAppSend = (isProofRequest = false) => {
    const phoneNumber = "923214453830";
const itemsList = cart.map(item => `${item.name} (${item.selectedColor || 'Standard'}) x${item.quantity}`).join(', ');
    const baseUrl = "https://api.whatsapp.com/send";
    let message = `Order Details: ${itemsList}`;
    window.open(`${baseUrl}?phone=${phoneNumber}&text=${encodeURIComponent(message)}`, '_blank');
    const cities = ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendWhatsAppMessage = (isProofRequest = false) => {
    const phoneNumber = "923214453830";
    const itemsList = cart.map(item => "* " + item.name + " (" + (item.selectedColor || 'Standard') + ") x" + item.quantity + " - Rs. " + (item.price * item.quantity)).join("\n");

    const baseUrl = "https://api.whatsapp.com/send";
    let message = "";

    if (isProofRequest) {
      message = "PAYMENT PROOF - LedyNest\n\nName: " + formData.name + "\nPhone: " + formData.phone + "\nCity: " + formData.city + "\nAddress: " + formData.address + "\n\nItems:\n" + itemsList + "\n\nTotal Bill: Rs. " + total;
    } else {
      message = "NEW ORDER - LedyNest\n\nName: " + formData.name + "\nPhone: " + formData.phone + "\nCity: " + formData.city + "\nAddress: " + formData.address + "\n\nItems:\n" + itemsList + "\n\nTotal Bill: Rs. " + total;
    }

    window.open(baseUrl + "?phone=" + phoneNumber + "&text=" + encodeURIComponent(message), "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <div className="space-y-4 pt-6 border-t border-black/10">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-black font-bold">
          <span>Subtotal</span>
          <span className="text-black font-black">Rs. {subtotal.toLocaleString()}</span>
        </div>
const sendWhatsAppMessage = (isProofRequest = false) => {
  const phoneNumber = "923214453830";
  const itemsList = cart.map(item => ${item.name} (${item.selectedColor || 'Standard'}) x${item.quantity}).join(', ');
  const baseUrl = "https://api.whatsapp.com/send";
  let message = "";
  // ... rest of your function code
};          <span>Delivery</span>
          <span className="text-black font-black">Rs. {deliveryCharges}</span>
        </div>
        <div className="flex justify-between pt-6 border-t border-black/10">
          <span className="text-[11px] uppercase tracking-[0.3em] font-black text-black">Total Bill</span>
          <span className="text-2xl font-serif text-[#C5A25D] font-bold">Rs. {total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}