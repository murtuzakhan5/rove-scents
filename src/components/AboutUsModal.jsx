import React from 'react';
import { X, Sparkles, ShieldCheck, Clock, Award, Droplets, Heart, MessageCircle } from 'lucide-react';

export default function AboutUsModal({ isOpen, onClose, settings }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-[#101010] border border-gold-500/40 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-10 shadow-[0_0_60px_rgba(212,175,55,0.2)]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#181818] hover:bg-gold-500 hover:text-black text-zinc-400 transition"
          aria-label="Close About Us"
        >
          <X size={20} />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-3 pb-8 border-b border-[#242424]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-950/60 border border-gold-500/40 text-gold-300 text-[11px] font-bold tracking-[0.25em] uppercase">
            <Sparkles size={13} className="text-gold-400" />
            <span>THE ROVE SCENTS LEGACY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-serif text-white tracking-tight">
            SCENT YOUR <span className="gold-gradient-text">STORY</span>
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed font-light">
            Crafting French-grade haute perfumerie impressions with 35% pure oil concentration for the modern connoisseur in Pakistan.
          </p>
        </div>

        {/* Narrative & Craft Section */}
        <div className="py-8 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-2 text-gold-300">
              Our Origin: Why We Started ROVE SCENTS
            </h3>
            <p>
              For years, fragrance lovers in Pakistan faced a frustrating dilemma: pay exorbitant prices exceeding Rs. 50,000 for original European designer bottles, or settle for cheap local copies diluted with synthetic alcohol and harsh chemical smells that vanish within two hours.
            </p>
            <p className="mt-3">
              <strong>ROVE SCENTS</strong> was born to challenge that status quo. We believe that true luxury, beast-mode projection, and artistic sillage should be accessible without compromise. Every creation in our library is an homage to world-renowned olfactory masterpieces, elevated to uncompromising artisanal quality.
            </p>
          </div>

          {/* 3 Pillars of Craftsmanship */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Droplets size={20} />
              </div>
              <h4 className="font-bold text-white font-serif text-sm">35% Pure Extrait Grade</h4>
              <p className="text-[11px] text-zinc-400">
                Significantly higher oil load than standard commercial Eau de Parfum. Deep sillage that clings magnetically to fabrics.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Clock size={20} />
              </div>
              <h4 className="font-bold text-white font-serif text-sm">6-Week Maceration</h4>
              <p className="text-[11px] text-zinc-400">
                Each batch is cured and aged in dark glass vessels to allow base notes, resins, and florals to harmonize naturally.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#161616] border border-[#262626] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <ShieldCheck size={20} />
              </div>
              <h4 className="font-bold text-white font-serif text-sm">8+ Hours Longevity</h4>
              <p className="text-[11px] text-zinc-400">
                Tested against Pakistan's warm climate. Zero stinging alcohol sharpness, just seamless evolution from top to base.
              </p>
            </div>
          </div>

          {/* Heavy Glass Presentation */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17140b] via-[#241c0e] to-[#17140b] border border-gold-500/30 space-y-2">
            <h4 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-gold-400" />
              <span>Heavyweight Crystal Curing & Presentation</span>
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Our perfumes are housed in heavyweight, crystal-clear glass vessels with precision micro-mist atomizers and 24K gold foil embossed seals. Accompanied by bespoke rigid black velvet gift presentation boxes, ready to grace any vanity or make an unforgettable gift.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-zinc-400 block">Questions or custom consultations?</span>
            <span className="text-[11px] text-gold-400 font-mono">Direct dispatch lab: Karachi & Lahore, Pakistan</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20ROVE%20Scents!%20I%20want%20to%20know%20more%20about%20your%20perfumes.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#1c1c1c] border border-emerald-500/40 text-emerald-400 hover:text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <MessageCircle size={15} />
              <span>WhatsApp Concierge</span>
            </a>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg"
            >
              Explore Collection
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
