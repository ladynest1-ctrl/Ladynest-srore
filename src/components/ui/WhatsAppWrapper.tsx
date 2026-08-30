"use client";

import dynamic from "next/dynamic";

// Yahan dynamic import sahi chalega kyunke ye "use client" file hai
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), {
  ssr: false,
});

export default function WhatsAppWrapper() {
  return <WhatsAppButton />;
}