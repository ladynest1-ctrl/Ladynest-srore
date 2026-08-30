"use client";
import React from 'react';

export default function ConfirmOrderButton({ order }) {
  const handleWhatsAppClick = () => {
    const rawID = String(order?.id || order?._id || "0000");
    const orderID = rawID.slice(-6).toUpperCase();

    // Phone format clean up
    let cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;

    // Status ke mutabiq message change karne ka logic
    let message = "";
    const customer = order.customerName;
    const product = `*${order.productName}* (${order.colorSelected})`;

    switch (order.status) {
      case 'SHIPPED':
        message = `Assalam-o-Alaikum ${customer}!\n\nGood news! Your order for ${product} has been *SHIPPED* 🚚.\n\n*Order ID:* #${orderID}\nIt will reach you within 2-3 working days. Please keep Rs. ${order.totalPrice} ready for COD.\n\nThank you for choosing LadyNest! ✨`;
        break;
      
      case 'DELIVERED':
        message = `Assalam-o-Alaikum ${customer}!\n\nYour order #${orderID} has been *DELIVERED* ✅.\n\nWe hope you love your new ${product}! We would love to hear your feedback. Tag us on Instagram! 📸\n\nThank you for shopping with LadyNest!`;
        break;

      case 'CANCELLED':
        message = `Assalam-o-Alaikum ${customer}!\n\nWe are sorry to inform you that your order #${orderID} for ${product} has been *CANCELLED* ❌.\n\nIf you have any questions, feel free to ask here.\n\nRegards,\nTeam LadyNest.`;
        break;

      default: // For PENDING or CONFIRMED
        message = `Assalam-o-Alaikum ${customer}!\n\nThis is LadyNest Luxury. Your order for ${product} has been *CONFIRMED* ✅!\n\n*Order ID:* #${orderID}\n*Total Amount:* Rs. ${order.totalPrice}\n*Shipping Address:* ${order.address}\n\nThank you for shopping with us! ✨`;
    }

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="px-4 py-2 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-[9px] uppercase font-bold tracking-widest rounded-sm hover:bg-[#25D366] hover:text-white transition-all duration-300"
    >
      WhatsApp {order.status === 'PENDING' ? 'Confirm' : 'Update'}
    </button>
  );
}