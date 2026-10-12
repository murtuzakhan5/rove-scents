import React from 'react';
import { Sparkles, Clock, ShieldCheck, Truck, RefreshCw, ArrowRight } from 'lucide-react';

export default function HeroBanner({ settings, onExploreClick }) {
  return (
    <div className="relative overflow-hidden bg-radial-luxury border-b border-[#222]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-950/60 border border-gold-500/40 text-gold-300 text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={13} className="text-gold-400" />
              <span>{settings?.heroBadge || "HAUTE PARFUMERIE COLLECTION 2026"}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              <span className="block text-white">SCENT YOUR</span>
              <span className="gold-gradient-text uppercase font-serif">UNFORGETTABLE STORY</span>
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 font-light leading-relaxed">
              {settings?.heroSubtitle || 
                "Masterpiece French-grade impressions crafted with 35% pure oil concentration. Exquisite sillage that lingers 14+ hours on skin and fabrics."}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => onExploreClick('all')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-black font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-[0_0_25px_rgba(212,175,55,0.3)] transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>{settings?.heroBtnText || "SHOP BEST SELLERS"}</span>
                <ArrowRight size={15} />
              </button>
              
              <button 
                onClick={() => onExploreClick('men')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#181818] border border-gold-500/30 text-gold-300 font-semibold text-xs uppercase tracking-widest hover:bg-[#222] hover:border-gold-400 transition"
              >
                <span>{settings?.heroSecondaryBtnText || "MEN'S SIGNATURES"}</span>
              </button>
            </div>

            {/* Quick stats counter */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#222] max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold font-serif gold-gradient-text">35%</p>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Oil Concentration</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif gold-gradient-text">14+ Hrs</p>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Longevity Guarantee</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif gold-gradient-text">25k+</p>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Hero Imagery Banner */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-gold-500/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] group">
              <img 
                src={settings?.heroImageUrl || "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200"} 
                alt="ROVE Scents Luxury Perfume" 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

              {/* Floating Featured Bottle Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#141414]/90 backdrop-blur-md border border-gold-500/40 text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400">Featured Masterpiece</span>
                <h4 className="text-base font-bold text-white font-serif">ROVE Imperial Oud</h4>
                <p className="text-xs text-zinc-300">Inspired by Royal Oud & Cambodian Agarwood</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-gold-300">Rs. 2,450 <span className="text-xs line-through text-zinc-500 font-normal">Rs. 3,700</span></span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-semibold border border-gold-500/30">Free Shipping</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Badges Bar (Elyscents style) */}
      <div className="bg-[#121212] border-t border-[#222] py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              <Clock size={18} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">14+ Hours Lasting</h5>
              <p className="text-[11px] text-zinc-400">High oil concentration</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">French Oils</h5>
              <p className="text-[11px] text-zinc-400">Imported premium grade</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              <Truck size={18} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Cash On Delivery</h5>
              <p className="text-[11px] text-zinc-400">Nationwide across Pakistan</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-9 h-9 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
              <RefreshCw size={18} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Easy Exchange</h5>
              <p className="text-[11px] text-zinc-400">7 days friendly support</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
