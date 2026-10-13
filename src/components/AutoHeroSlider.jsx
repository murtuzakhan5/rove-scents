import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Truck, RefreshCw, ChevronLeft, ChevronRight, Star, Flame, Eye } from 'lucide-react';

export default function AutoHeroSlider({ onSelectProduct, onDirectCheckout, onShopAll, products, settings }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Widescreen Luxury Cinematic Banners with Left-Aligned Overlaid Typography
  const slides = [
    {
      id: 'slide-rukh',
      productId: 'prod-rukh',
      isCollection: false,
      tag: 'HAUTE PARFUMERIE • 2026 FLAGSHIP RELEASE',
      badge: 'TOP SELLER',
      title: 'ROVE RUKH',
      arabic: 'رُخ',
      genre: 'EAU DE PARFUM FOR MEN • 50 ML',
      subtitle: 'The pinnacle of masculine refinement. Captured amid imperial dark stone and golden water reflections, blending Italian Bergamot, Tuscan Iris, and Smoked Golden Amber.',
      price: 2650,
      comparePrice: 3950,
      bannerImage: '/images/rove-rukh-banner.jpg',
      bottleImage: '/images/bottle-rukh.jpg',
      rating: '5.0',
      reviews: '164 Verified Buyers',
      topNote: 'Bergamot & Cardamom',
      heartNote: 'Tuscan Iris & Jasmine',
      baseNote: 'Smoked Amber & Sandalwood',
      btnText: 'BUY NOW (COD) — RS. 2,650',
      accentGlow: 'rgba(212, 175, 55, 0.35)'
    },
    {
      id: 'slide-raaz',
      productId: 'prod-raaz',
      isCollection: false,
      tag: 'DARK GOLD LUXURY • WOMAN SIGNATURE',
      badge: 'MYSTERIOUS SEDUCTION',
      title: 'ROVE RAAZ',
      arabic: 'راز',
      genre: 'EAU DE PARFUM FOR WOMEN • 50 ML',
      subtitle: 'An enigmatic elixir of dark marble elegance. Radiant white blossoms and golden honeyed nectar dissolving into creamy cashmere and smoky black vanilla.',
      price: 2650,
      comparePrice: 3950,
      bannerImage: '/images/rove-raaz-banner.jpg',
      bottleImage: '/images/bottle-raaz.jpg',
      rating: '5.0',
      reviews: '142 Verified Buyers',
      topNote: 'White Blossom & Mandarin',
      heartNote: 'Velvet Jasmine & Cashmere',
      baseNote: 'Dark Vanilla & Rich Amber',
      btnText: 'BUY NOW (COD) — RS. 2,650',
      accentGlow: 'rgba(212, 175, 55, 0.4)'
    },
    {
      id: 'slide-afsana',
      productId: 'prod-afsana',
      isCollection: false,
      tag: 'GOLDEN HOUR FLORAL POETRY',
      badge: 'ROMANTIC ESSENCE',
      title: 'ROVE AFSANA',
      arabic: 'افسانہ',
      genre: 'EAU DE PARFUM FOR WOMEN • 50 ML',
      subtitle: 'A tale of irresistible beauty. Sun-ripened golden peaches, wild forest berries, and Damask pink roses suspended in golden sunset amber.',
      price: 2650,
      comparePrice: 3950,
      bannerImage: '/images/rove-afsana-banner.jpg',
      bottleImage: '/images/bottle-afsana.jpg',
      rating: '5.0',
      reviews: '129 Verified Buyers',
      topNote: 'Peach & Wild Berries',
      heartNote: 'Damask Rose & Magnolia',
      baseNote: 'Spun Sugar & White Musk',
      btnText: 'BUY NOW (COD) — RS. 2,650',
      accentGlow: 'rgba(244, 114, 182, 0.35)'
    },
    {
      id: 'slide-all-collection',
      productId: null,
      isCollection: true,
      tag: 'THE SIGNATURE ANTHOLOGY • 4 MASTERPIECES',
      badge: 'A FRAGRANCE FOR EVERY STORY',
      title: 'ROVE SCENTS',
      arabic: 'مجموعہ',
      genre: 'NAZ • AFSANA • RAAZ • RUKH',
      subtitle: 'From golden sunsets to mysterious midnight whispers. Discover the complete luxury collection crafted with 35% pure French fragrance oils for 16+ hours of prestige.',
      price: 2490,
      comparePrice: 3800,
      bannerImage: '/images/rove-all-collection-banner.jpg',
      bottleImage: '/images/bottle-rukh.jpg',
      rating: '5.0',
      reviews: '500+ Verified Buyers',
      topNote: '4 Iconic Signatures',
      heartNote: '16+ Hours Lasting Sillage',
      baseNote: 'Free Nationwide COD Delivery',
      btnText: 'SHOP ALL PRODUCTS',
      accentGlow: 'rgba(212, 175, 55, 0.4)'
    }
  ];

  // Auto-play timer (5.5 seconds)
  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5500);
    }
    return () => clearInterval(timerRef.current);
  }, [isHovered, slides.length]);

  const slide = slides[currentSlide];
  const targetProduct = slide.productId ? (products || []).find(p => p.id === slide.productId) : null;

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Click on banner redirects to perfume page OR shop all
  const handleBannerAction = () => {
    if (slide.isCollection) {
      if (onShopAll) {
        onShopAll();
      } else {
        const el = document.getElementById('catalog-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (targetProduct) {
      onSelectProduct(targetProduct);
    }
  };

  return (
    <div 
      className="relative bg-[#070707] border-b border-[#222] overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ================= MAIN WIDESCREEN CINEMATIC SLIDE ================= */}
      <div 
        onClick={handleBannerAction}
        className="relative w-full min-h-[500px] sm:min-h-[560px] md:min-h-[640px] lg:min-h-[700px] flex items-center cursor-pointer transition-all duration-700 group overflow-hidden bg-[#070707]"
      >
        {/* Background: Widescreen photo on Desktop | Ambient background on Mobile */}
        <div className="absolute inset-0 z-0">
          <img 
            src={slide.bannerImage} 
            alt={slide.title} 
            className="w-full h-full object-cover object-center hidden md:block group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          
          {/* Mobile ambient background with subtle golden aura */}
          <div className="md:hidden absolute inset-0 bg-[#080808]">
            <img 
              src={slide.bannerImage} 
              alt={slide.title} 
              className="w-full h-full object-cover opacity-20 blur-sm scale-110"
            />
          </div>

          {/* Desktop left-aligned gradient for crisp reading & visible bottle */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent hidden md:block w-[72%] lg:w-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
          
          {/* Subtle Golden Volumetric Glow */}
          <div 
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full blur-[140px] pointer-events-none"
            style={{ background: slide.accentGlow }}
          />
        </div>

        {/* Overlaid Content Container (2-Column on Mobile: Left Content, Right Bottle Image) */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-5 pb-14 sm:py-20 relative z-10 w-full">
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-6">
            
            {/* LEFT COLUMN: Content, Typography, Notes, Price, Button */}
            <div className="w-[58%] sm:w-[58%] md:w-full md:max-w-xl lg:max-w-2xl space-y-2 sm:space-y-3.5 md:space-y-6 text-left shrink-0">
              
              {/* Tag Badge & Arabic Calligraphy Pill */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <span className="inline-flex items-center gap-1 px-2 sm:px-3.5 py-0.5 sm:py-1 rounded-full bg-black/90 backdrop-blur-md border border-gold-500/50 text-gold-300 text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase shadow-[0_0_15px_rgba(212,175,55,0.25)] truncate max-w-[170px] sm:max-w-none">
                  <Sparkles size={10} className="text-gold-400 shrink-0" />
                  <span className="truncate">{slide.tag}</span>
                </span>

                {slide.arabic && (
                  <span className="text-sm sm:text-xl md:text-2xl font-serif text-gold-300 font-bold px-2 sm:px-3 py-0.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow">
                    {slide.arabic}
                  </span>
                )}
              </div>

              {/* Main Title & Slogan */}
              <div className="space-y-0.5 sm:space-y-1">
                <h1 className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-black font-serif tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                  <span className="gold-gradient-text uppercase block">
                    {slide.title}
                  </span>
                </h1>
                <p className="text-[8px] sm:text-xs md:text-sm font-bold text-zinc-300 tracking-[0.2em] uppercase drop-shadow truncate">
                  {slide.genre}
                </p>
              </div>

              {/* Subtitle / Story */}
              <p className="text-zinc-200 text-[10px] sm:text-xs md:text-sm max-w-xl font-light leading-relaxed drop-shadow line-clamp-2 sm:line-clamp-3 md:line-clamp-none">
                {slide.subtitle}
              </p>

              {/* Olfactory Notes Capsules (Compact on mobile) */}
              <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-2.5 pt-0.5 max-w-xl">
                <div className="p-1 sm:p-2 md:p-2.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow-sm">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] uppercase font-bold text-gold-400 block tracking-wider truncate">🌿 TOP</span>
                  <span className="text-[8.5px] sm:text-xs text-white font-medium leading-tight block truncate sm:whitespace-normal">{slide.topNote}</span>
                </div>
                <div className="p-1 sm:p-2 md:p-2.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow-sm">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] uppercase font-bold text-gold-400 block tracking-wider truncate">🌸 HEART</span>
                  <span className="text-[8.5px] sm:text-xs text-white font-medium leading-tight block truncate sm:whitespace-normal">{slide.heartNote}</span>
                </div>
                <div className="p-1 sm:p-2 md:p-2.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow-sm">
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] uppercase font-bold text-gold-400 block tracking-wider truncate">🪵 BASE</span>
                  <span className="text-[8.5px] sm:text-xs text-white font-medium leading-tight block truncate sm:whitespace-normal">{slide.baseNote}</span>
                </div>
              </div>

              {/* Price Row & Guarantee */}
              <div className="flex items-baseline gap-1.5 sm:gap-3 pt-0.5">
                <span className="text-base sm:text-2xl md:text-4xl font-extrabold gold-gradient-text font-serif drop-shadow-md">
                  {slide.isCollection ? 'From Rs. 2,490' : `Rs. ${slide.price.toLocaleString()}`}
                </span>
                <span className="text-[10px] sm:text-sm md:text-lg text-zinc-400 line-through">
                  Rs. {slide.comparePrice.toLocaleString()}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-600/90 text-white text-[7.5px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow">
                  SAVE {Math.round(((slide.comparePrice - slide.price) / slide.comparePrice) * 100)}%
                </span>
                <span className="text-xs text-emerald-400 font-semibold hidden md:inline">
                  • Free Nationwide Delivery Included
                </span>
              </div>

              {/* High-Converting Action Button (Single Button Only) */}
              <div className="pt-0.5 sm:pt-1 flex items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBannerAction();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-7 md:px-9 py-2.5 sm:py-3.5 md:py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-wider md:tracking-widest transition flex items-center justify-center gap-1.5 shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-95"
                >
                  <span className="truncate">{slide.btnText}</span>
                  <ArrowRight size={13} className="shrink-0" />
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN (MOBILE EXCLUSIVE): Prominent Luxury Bottle Showcase */}
            <div className="w-[42%] sm:w-[42%] md:hidden flex items-center justify-center relative shrink-0">
              <div className="relative w-full max-w-[190px] aspect-[3/4] flex items-center justify-center">
                {/* Glowing Aura behind bottle */}
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-60 scale-90 pointer-events-none"
                  style={{ background: slide.accentGlow }}
                />
                
                {/* Full Perfume Bottle */}
                <img 
                  src={slide.bottleImage || slide.bannerImage} 
                  alt={slide.title}
                  className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)] group-hover:scale-105 transition-transform duration-500 relative z-10"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute right-3 sm:right-8 bottom-3 sm:bottom-6 z-20 flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="p-2 sm:p-3 rounded-full bg-black/80 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 transition shadow-xl"
            aria-label="Previous Banner"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-2 sm:p-3 rounded-full bg-black/80 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 transition shadow-xl"
            aria-label="Next Banner"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Slide Indicators at Bottom Left */}
        <div className="absolute left-4 sm:left-8 bottom-3 sm:bottom-6 z-20 flex items-center gap-2">
          {slides.map((s, idx) => {
            const isActive = currentSlide === idx;
            return (
              <button
                key={s.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                className={`h-1.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 sm:w-12 bg-gradient-to-r from-gold-400 to-amber-500 shadow-[0_0_12px_rgba(212,175,55,0.7)]'
                    : 'w-2 sm:w-3 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Trust & Guarantee Ribbon Directly Below Banner (Elyscents style) */}
      <div className="bg-[#0b0b0b] border-t border-[#1e1e1e] py-4">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 shadow-sm">
              <Clock size={19} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">16+ Hours Lasting</h5>
              <p className="text-[11px] text-zinc-400">Pure 35% Extrait concentration</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 shadow-sm">
              <ShieldCheck size={19} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">French Formulas</h5>
              <p className="text-[11px] text-zinc-400">Imported perfume oils</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 shadow-sm">
              <Truck size={19} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">Cash On Delivery</h5>
              <p className="text-[11px] text-zinc-400">Karachi, Lahore & All Pakistan</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 p-2">
            <div className="w-10 h-10 rounded-full bg-gold-950/60 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 shadow-sm">
              <RefreshCw size={19} />
            </div>
            <div className="text-left">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">7-Day Exchange</h5>
              <p className="text-[11px] text-zinc-400">Hassle-free guarantee</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
