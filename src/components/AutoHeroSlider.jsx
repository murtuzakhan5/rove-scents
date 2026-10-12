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
      rating: '5.0',
      reviews: '164 Verified Buyers',
      topNote: 'Italian Bergamot & Cardamom',
      heartNote: 'Tuscan Iris & White Jasmine',
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
      rating: '5.0',
      reviews: '129 Verified Buyers',
      topNote: 'Sun-Kissed Peach & Wild Berries',
      heartNote: 'Damask Rose & Magnolia Petals',
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
        className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] flex items-center cursor-pointer transition-all duration-700 group overflow-hidden"
      >
        {/* Full Widescreen Background Photo */}
        <div className="absolute inset-0 z-0">
          <img 
            src={slide.bannerImage} 
            alt={slide.title} 
            className="w-full h-full object-cover object-right sm:object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          
          {/* Left-Aligned Luxury Dark Scrim Gradient for Crisp Typography Reading */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent sm:via-black/70 w-full sm:w-[78%] lg:w-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />
          
          {/* Subtle Golden Volumetric Glow */}
          <div 
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full blur-[140px] pointer-events-none"
            style={{ background: slide.accentGlow }}
          />
        </div>

        {/* Overlaid Left-Aligned Luxury Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10 w-full">
          <div className="max-w-xl sm:max-w-2xl space-y-5 sm:space-y-6 text-left">
            
            {/* Tag Badge & Arabic Calligraphy Pill */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md border border-gold-500/50 text-gold-300 text-[11px] font-bold tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.25)]">
                <Sparkles size={13} className="text-gold-400" />
                <span>{slide.tag}</span>
              </span>

              {slide.arabic && (
                <span className="text-2xl font-serif text-gold-300 font-bold px-3 py-0.5 rounded-xl bg-black/85 backdrop-blur-md border border-gold-500/40 shadow-lg">
                  {slide.arabic}
                </span>
              )}
            </div>

            {/* Main Title & Slogan */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-serif tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                <span className="gold-gradient-text uppercase block">
                  {slide.title}
                </span>
              </h1>
              <p className="text-xs sm:text-sm font-bold text-zinc-300 tracking-[0.3em] uppercase drop-shadow">
                {slide.genre}
              </p>
            </div>

            {/* Subtitle / Story */}
            <p className="text-zinc-200 text-xs sm:text-sm max-w-xl font-light leading-relaxed drop-shadow">
              {slide.subtitle}
            </p>

            {/* 3D Floating Olfactory Notes Capsules (Clean wrapping, no ugly truncation) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 max-w-xl">
              <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-gold-500/40 shadow-md">
                <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider mb-0.5">🌿 TOP NOTES</span>
                <span className="text-xs text-white font-medium leading-snug block">{slide.topNote}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-gold-500/40 shadow-md">
                <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider mb-0.5">🌸 HEART NOTES</span>
                <span className="text-xs text-white font-medium leading-snug block">{slide.heartNote}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-gold-500/40 shadow-md">
                <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider mb-0.5">🪵 BASE NOTES</span>
                <span className="text-xs text-white font-medium leading-snug block">{slide.baseNote}</span>
              </div>
            </div>

            {/* Price Row & Guarantee */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl sm:text-4xl font-extrabold gold-gradient-text font-serif drop-shadow-md">
                {slide.isCollection ? 'From Rs. 2,490' : `Rs. ${slide.price.toLocaleString()}`}
              </span>
              <span className="text-base sm:text-lg text-zinc-400 line-through">
                Rs. {slide.comparePrice.toLocaleString()}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-red-600/90 text-white text-[11px] font-extrabold uppercase tracking-wider shadow">
                SAVE {Math.round(((slide.comparePrice - slide.price) / slide.comparePrice) * 100)}%
              </span>
              <span className="text-xs text-emerald-400 font-semibold hidden sm:inline">
                • Free Nationwide Delivery Included
              </span>
            </div>

            {/* High-Converting Action Button (Single Button Only: Buy Now or Shop All) */}
            <div className="pt-2 flex items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerAction();
                }}
                className="w-full sm:w-auto px-9 py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-black text-xs sm:text-sm uppercase tracking-widest transition flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(212,175,55,0.45)] active:scale-95"
              >
                <span>{slide.btnText}</span>
                <ArrowRight size={17} />
              </button>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute right-4 sm:right-8 bottom-6 z-20 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="p-3 rounded-full bg-black/80 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 transition shadow-xl"
            aria-label="Previous Banner"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-3 rounded-full bg-black/80 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 transition shadow-xl"
            aria-label="Next Banner"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slide Indicators at Bottom Left */}
        <div className="absolute left-4 sm:left-8 bottom-6 z-20 flex items-center gap-2.5">
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
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-12 bg-gradient-to-r from-gold-400 to-amber-500 shadow-[0_0_12px_rgba(212,175,55,0.7)]'
                    : 'w-3 bg-white/30 hover:bg-white/60'
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
