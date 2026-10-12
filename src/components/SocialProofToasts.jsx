import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, X, Flame } from 'lucide-react';

export default function SocialProofToasts({ products }) {
  const [toast, setToast] = useState(null);

  const pakistaniCities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Sialkot', 'Gujranwala', 'Hyderabad'];
  const pakistaniNames = [
    'Hamza T.', 'Bilal A.', 'Ayesha K.', 'Zain U.', 'Usman S.', 
    'Fatima M.', 'Ahmed R.', 'Hassan N.', 'Saad B.', 'Komal R.',
    'Danish Q.', 'Maryam J.', 'Farhan S.', 'Sana W.', 'Waqas A.'
  ];

  useEffect(() => {
    if (!products || products.length === 0) return;

    // Show periodic popup every 12 to 20 seconds
    const interval = setInterval(() => {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomCity = pakistaniCities[Math.floor(Math.random() * pakistaniCities.length)];
      const randomName = pakistaniNames[Math.floor(Math.random() * pakistaniNames.length)];
      const randomMinutes = Math.floor(Math.random() * 8) + 1;
      const randomViewers = Math.floor(Math.random() * 24) + 18;

      // 70% chance of "Someone just ordered", 30% chance of "People currently viewing"
      const isPurchase = Math.random() > 0.3;

      setToast({
        type: isPurchase ? 'purchase' : 'viewers',
        product: randomProduct,
        city: randomCity,
        name: randomName,
        minutes: randomMinutes,
        viewers: randomViewers
      });

      // Auto dismiss after 6 seconds
      setTimeout(() => {
        setToast(null);
      }, 5500);

    }, 14000);

    return () => clearInterval(interval);
  }, [products]);

  if (!toast || !toast.product) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm w-full bg-[#141414]/95 backdrop-blur-md border border-gold-500/40 rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-slide-in flex items-center gap-3.5 transition-all">
      {/* Product Image */}
      <div className="w-12 h-14 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
        <img 
          src={toast.product.image} 
          alt={toast.product.name} 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Info Body */}
      <div className="flex-grow min-w-0 pr-1">
        {toast.type === 'purchase' ? (
          <>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Verified Order Placed</span>
            </div>
            <p className="text-xs text-white font-medium truncate">
              <strong>{toast.name}</strong> from {toast.city}
            </p>
            <p className="text-[11px] text-gold-300 font-serif truncate">
              Bought {toast.product.name}
            </p>
            <span className="text-[9px] text-zinc-500">
              {toast.minutes} minutes ago • COD
            </span>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-0.5">
              <Flame size={12} className="text-amber-400 animate-pulse" />
              <span>High Demand Right Now</span>
            </div>
            <p className="text-xs text-white font-medium truncate">
              <strong>{toast.viewers} people</strong> are viewing this perfume
            </p>
            <p className="text-[11px] text-gold-300 font-serif truncate">
              {toast.product.name}
            </p>
            <span className="text-[9px] text-zinc-500">
              In high demand today
            </span>
          </>
        )}
      </div>

      {/* Dismiss Button */}
      <button 
        onClick={() => setToast(null)}
        className="text-zinc-500 hover:text-white p-1"
        aria-label="Dismiss toast"
      >
        <X size={14} />
      </button>
    </div>
  );
}
