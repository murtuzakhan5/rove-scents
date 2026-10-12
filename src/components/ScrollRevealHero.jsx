import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Clock, ShieldCheck, Flame, ChevronDown, CheckCircle2 } from 'lucide-react';

export default function ScrollRevealHero({ onExploreClick, onSelectProduct, products, settings }) {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Find the flagship product RUKH
  const rukhProduct = (products || []).find(p => p.id === 'prod-rukh') || products?.[0];

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / (rect.height - window.innerHeight || 1), 0), 1);
      setScrollY(progress);
    };

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15;
      const y = (e.clientY / innerHeight - 0.5) * 15;
      setMousePos({ x, y });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Compute animations based on scroll progress (0 to 1)
  // Stage 0 -> Top hero, Stage 0.5 -> Bottle scales & reveals notes, Stage 1.0 -> Complete reveal & call to action
  const bottleScale = 0.95 + scrollY * 0.25; // 0.95 -> 1.2
  const bottleY = -scrollY * 50; // gentle float upward
  const bottleRotateY = mousePos.x + (scrollY * 8);
  const bottleRotateX = -mousePos.y;
  const glowOpacity = 0.35 + scrollY * 0.65;
  const notesOpacity = Math.min(Math.max((scrollY - 0.15) / 0.3, 0), 1);
  const finalCtaOpacity = Math.min(Math.max((scrollY - 0.5) / 0.4, 0), 1);

  return (
    <div ref={containerRef} className="relative min-h-[160vh] bg-[#070707] text-white">
      
      {/* Sticky Presentation Viewport */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        
        {/* Background Atmosphere: Royal Gold Fog & Radial Lighting */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 45%, rgba(212,175,55,${0.18 + scrollY * 0.22}) 0%, rgba(18,15,10,0.85) 50%, #070707 90%)`
          }}
        />

        {/* Ambient Shimmer Light Beams */}
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-300"
          style={{
            background: 'radial-gradient(circle, rgba(212,175,55,0.25) 0%, rgba(197,160,89,0.05) 70%, transparent 100%)',
            opacity: glowOpacity,
            transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.5})`
          }}
        />

        {/* Top Header Floating Badge */}
        <div className="relative z-20 pt-8 text-center px-4 max-w-4xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-950/70 border border-gold-500/40 text-gold-300 text-xs font-bold tracking-[0.25em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.25)]">
            <Sparkles size={14} className="text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>HAUTE PARFUMERIE • 2026 FLAGSHIP RELEASE</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-serif uppercase">
            <span className="block text-white">SCENT YOUR LEGEND</span>
            <span className="gold-gradient-text tracking-widest text-4xl sm:text-6xl lg:text-7xl">
              ROVE RUKH <span className="font-sans font-normal text-gold-400">رخ</span>
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 tracking-wide max-w-xl mx-auto font-light leading-relaxed">
            {scrollY < 0.2 ? "Scroll down to witness the reveal of Pakistan's finest 16-hour French Extrait perfume." : "Encased in crystalline glass, captured on imperial marble."}
          </p>
        </div>

        {/* Central 3D Bottle Showcase & Animated Reveal Stage */}
        <div className="relative z-10 flex-grow flex items-center justify-center px-4">
          
          {/* Bottle Stage Container with 3D Perspective */}
          <div 
            className="relative flex items-center justify-center max-w-md w-full"
            style={{ perspective: '1200px' }}
          >
            
            {/* The Animated Perfume Bottle Card */}
            <div 
              className="relative rounded-3xl overflow-hidden border border-gold-500/50 shadow-[0_0_70px_rgba(212,175,55,0.35)] transition-transform duration-100 ease-out cursor-pointer group"
              onClick={() => rukhProduct && onSelectProduct(rukhProduct)}
              style={{
                transform: `scale(${bottleScale}) translateY(${bottleY}px) rotateY(${bottleRotateY}deg) rotateX(${bottleRotateX}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Bottle Real Photo */}
              <div className="relative aspect-[3/4] w-72 sm:w-80 md:w-96 overflow-hidden bg-[#111]">
                <img 
                  src="/images/rove-rukh.jpg" 
                  alt="ROVE RUKH Eau De Parfum" 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20 opacity-60" />

                {/* Golden Corner Accents */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold-400" />
                <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold-400" />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold-400" />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold-400" />

                {/* Overlaid Arabic & English Calligraphy Tag */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-gold-500/40 text-center">
                  <div className="flex items-center justify-between text-xs font-bold text-gold-300">
                    <span className="tracking-widest uppercase">ROVE SCENTS</span>
                    <span className="text-base text-gold-200">رخ</span>
                  </div>
                  <div className="text-[11px] text-zinc-300 mt-0.5">EAU DE PARFUM • 50ML • FOR MEN</div>
                  <div className="mt-1 flex items-center justify-center gap-2 text-xs font-extrabold text-white">
                    <span className="gold-gradient-text">Rs. 2,650</span>
                    <span className="text-[10px] text-zinc-500 line-through">Rs. 3,950</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-600/80 text-white uppercase font-bold">-33%</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Scent Note Card 1 (Top Left) - Reveals at scroll */}
            <div 
              className="absolute -left-4 sm:-left-32 md:-left-44 top-8 sm:top-16 p-3 sm:p-4 rounded-xl bg-[#141414]/90 backdrop-blur-md border border-gold-500/40 max-w-[180px] sm:max-w-[210px] shadow-2xl transition-all duration-500 pointer-events-none"
              style={{
                opacity: notesOpacity,
                transform: `translateX(${(1 - notesOpacity) * -40}px) translateY(${mousePos.y * 0.5}px)`
              }}
            >
              <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase block mb-1">
                🌿 TOP NOTES
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white font-serif">Italian Bergamot</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Crushed Cardamom & Crisp Royal Apple</p>
            </div>

            {/* Scent Note Card 2 (Bottom Right) - Reveals at scroll */}
            <div 
              className="absolute -right-4 sm:-right-32 md:-right-44 top-32 sm:top-40 p-3 sm:p-4 rounded-xl bg-[#141414]/90 backdrop-blur-md border border-gold-500/40 max-w-[180px] sm:max-w-[210px] shadow-2xl transition-all duration-500 pointer-events-none"
              style={{
                opacity: notesOpacity,
                transform: `translateX(${(1 - notesOpacity) * 40}px) translateY(${-mousePos.y * 0.5}px)`
              }}
            >
              <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase block mb-1">
                🌸 HEART NOTES
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white font-serif">Tuscan Iris & Jasmine</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">White Petals on Polished Marble</p>
            </div>

            {/* Scent Note Card 3 (Bottom Left) - Reveals at scroll */}
            <div 
              className="absolute -left-2 sm:-left-28 md:-left-36 bottom-6 sm:bottom-12 p-3 sm:p-4 rounded-xl bg-[#141414]/90 backdrop-blur-md border border-gold-500/40 max-w-[180px] sm:max-w-[210px] shadow-2xl transition-all duration-500 pointer-events-none"
              style={{
                opacity: notesOpacity,
                transform: `translateX(${(1 - notesOpacity) * -30}px) translateY(${notesOpacity * 10}px)`
              }}
            >
              <span className="text-[10px] font-bold tracking-widest text-gold-400 uppercase block mb-1">
                🪵 BASE DRYDOWN
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-white font-serif">Smoked Golden Amber</h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">Royal Sandalwood • 16+ Hours Sillage</p>
            </div>

          </div>

        </div>

        {/* Bottom Scroll Call to Action Bar */}
        <div className="relative z-20 pb-8 px-4 text-center">
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
            
            <button
              onClick={() => rukhProduct && onSelectProduct(rukhProduct)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95"
            >
              <span>EXPERIENCE ROVE RUKH (رخ)</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={() => onExploreClick('all')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#161616] border border-gold-500/30 text-gold-300 hover:bg-[#222] font-semibold text-xs uppercase tracking-wider transition"
            >
              <span>VIEW FULL PERFUME COLLECTION</span>
            </button>
          </div>

          {/* Scroll Down Indicator */}
          {scrollY < 0.25 && (
            <div className="mt-4 flex flex-col items-center justify-center text-gold-400 text-[10px] tracking-widest uppercase animate-bounce">
              <span>Scroll to reveal fragrance details</span>
              <ChevronDown size={16} />
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
