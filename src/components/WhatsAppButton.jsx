import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ settings }) {
  const number = settings?.whatsappNumber || '923001234567';
  const url = `https://wa.me/${number}?text=Assalam-o-Alaikum%20ROVE%20Scents!%20I%20want%20to%20order%20perfumes%20via%20Cash%20on%20Delivery.`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 text-white font-bold text-xs shadow-[0_4px_25px_rgba(16,185,129,0.4)] hover:scale-105 transition-transform duration-300 group"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        <MessageCircle size={20} className="fill-white/20" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full" />
      </div>
      <span className="hidden sm:inline tracking-wider font-semibold">Order on WhatsApp</span>
    </a>
  );
}
