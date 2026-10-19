import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Truck, RefreshCw, ChevronLeft, ChevronRight, Star, Flame, Eye } from 'lucide-react';

export default function AutoHeroSlider({ onSelectProduct, onDirectCheckout, onShopAll, products, settings, banners }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Widescreen Luxury Cinematic Default Banners
  const defaultSlides = [
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
      subtitle: 'From golden sunsets to mysterious midnight whispers. Discover the complete luxury collection crafted with 35% pure French fragrance oils for 8+ hours of prestige.',
      price: 2490,
      comparePrice: 3800,
      bannerImage: '/images/rove-all-collection-banner.jpg',
      bottleImage: '/images/bottle-rukh.jpg',
      rating: '5.0',
      reviews: '500+ Verified Buyers',
      topNote: '4 Iconic Signatures',
      heartNote: '8+ Hours Lasting Sillage',
      baseNote: 'Free Nationwide COD Delivery',
      btnText: 'SHOP ALL PRODUCTS',
      accentGlow: 'rgba(212, 175, 55, 0.4)'
    }
  ];

  // Active custom banners from MongoDB/Admin or default slides
  const activeBanners = (banners && Array.isArray(banners) && banners.length > 0)
    ? banners.filter(b => b.isActive !== false)
    : [];
  const slides = activeBanners.length > 0 ? activeBanners : defaultSlides;

  // Auto-play timer (5.5 seconds)
  useEffect(() => {
    if (!isHovered && slides.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5500);
    }
    return () => clearInterval(timerRef.current);
  }, [isHovered, slides.length]);

  const safeIndex = currentSlide >= slides.length ? 0 : currentSlide;
  const slide = slides[safeIndex] || defaultSlides[0];
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
        className="relative w-full aspect-[16/9] md:aspect-auto md:min-h-[560px] lg:min-h-[640px] flex items-center cursor-pointer transition-all duration-700 group overflow-hidden bg-[#070707]"
      >
        {/* Real User-Designed 16:9 Banner Image (100% Full Width, 0% Cut-Off on all devices) */}
        <div className="absolute inset-0 z-0">
          <img 
            src={slide.bannerImage} 
            alt={slide.title} 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out"
          />

          {/* Left-Aligned Soft Gradient for Crisp Typography Legibility (Right-side perfume bottle stays 100% visible) */}
          <div className="absolute inset-y-0 left-0 w-[58%] sm:w-[50%] bg-gradient-to-r from-black/90 via-black/55 to-transparent pointer-events-none md:hidden" />
          <div className="absolute inset-y-0 left-0 w-[68%] lg:w-[60%] bg-gradient-to-r from-black/95 via-black/75 to-transparent pointer-events-none hidden md:block" />
          <div className="absolute inset-x-0 bottom-0 h-10 sm:h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

          {/* Subtle Golden Volumetric Ambient Glow on Desktop */}
          <div 
            className="hidden md:block absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full blur-[140px] pointer-events-none"
            style={{ background: slide.accentGlow }}
          />
        </div>

        {/* 1. MOBILE OVERLAY (md:hidden): Compact, Left-Aligned Title & Price Only — Bottle on right is 100% unobstructed */}
        <div className="absolute inset-y-0 left-0 w-[56%] sm:w-[50%] flex flex-col justify-center pl-3.5 sm:pl-6 pr-1 z-10 md:hidden pointer-events-none">
          <div className="space-y-1 sm:space-y-1.5 text-left">
            
            {/* Tag / Arabic */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-gold-500/40 text-gold-300 text-[7.5px] sm:text-[9px] font-bold tracking-wider uppercase">
                <Sparkles size={8} className="text-gold-400 shrink-0" />
                <span className="truncate max-w-[110px] sm:max-w-none">{slide.badge || 'LUXURY'}</span>
              </span>
              {slide.arabic && (
                <span className="text-[10px] sm:text-xs font-serif text-gold-300 font-bold px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-gold-500/40">
                  {slide.arabic}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h2 className="text-sm sm:text-xl font-black font-serif tracking-tight text-white leading-tight drop-shadow-md">
                <span className="gold-gradient-text uppercase block">
                  {slide.title}
                </span>
              </h2>
              <p className="text-[7.5px] sm:text-[9.5px] font-semibold text-zinc-300 tracking-wider uppercase truncate">
                {slide.genre}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1.5 pt-0.5">
              <span className="text-xs sm:text-base font-black gold-gradient-text font-serif">
                {slide.isCollection 
                  ? `From Rs. ${Number(slide.price || 2490).toLocaleString()}` 
                  : `Rs. ${Number(slide.price || 2650).toLocaleString()}`}
              </span>
              {slide.comparePrice ? (
                <span className="text-[8.5px] sm:text-[10px] text-zinc-400 line-through">
                  Rs. {Number(slide.comparePrice).toLocaleString()}
                </span>
              ) : null}
            </div>

            {/* Compact CTA */}
            <div className="pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerAction();
                }}
                className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 text-black font-black text-[8px] sm:text-[9.5px] uppercase tracking-wider shadow-[0_0_12px_rgba(212,175,55,0.4)] active:scale-95 transition"
              >
                <span>{slide.btnText || (slide.isCollection ? 'SHOP ALL' : 'BUY NOW')}</span>
                <ArrowRight size={9} />
              </button>
            </div>

          </div>
        </div>

        {/* 2. DESKTOP OVERLAY (hidden md:block): Full Luxury Cinematic Showcase */}
        <div className="hidden md:block max-w-7xl mx-auto px-6 lg:px-8 py-16 relative z-10 w-full">
          <div className="max-w-xl lg:max-w-2xl space-y-4 lg:space-y-5 text-left">
            
            {/* Tag Badge & Arabic Calligraphy */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-black/90 backdrop-blur-md border border-gold-500/50 text-gold-300 text-[11px] font-bold tracking-[0.15em] uppercase shadow-[0_0_15px_rgba(212,175,55,0.25)]">
                <Sparkles size={11} className="text-gold-400 shrink-0" />
                <span>{slide.tag || slide.badge || 'HAUTE PARFUMERIE'}</span>
              </span>

              {slide.arabic && (
                <span className="text-xl lg:text-2xl font-serif text-gold-300 font-bold px-3 py-0.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow">
                  {slide.arabic}
                </span>
              )}
            </div>

            {/* Main Title & Slogan */}
            <div className="space-y-1">
              <h1 className="text-5xl lg:text-7xl font-black font-serif tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
                <span className="gold-gradient-text uppercase block">
                  {slide.title}
                </span>
              </h1>
              {slide.genre && (
                <p className="text-xs sm:text-sm font-bold text-zinc-300 tracking-[0.2em] uppercase drop-shadow">
                  {slide.genre}
                </p>
              )}
            </div>

            {/* Subtitle / Story */}
            {slide.subtitle && (
              <p className="text-zinc-200 text-xs sm:text-sm max-w-xl font-light leading-relaxed drop-shadow">
                {slide.subtitle}
              </p>
            )}

            {/* Olfactory Notes Capsules */}
            {(slide.topNote || slide.heartNote || slide.baseNote) && (
              <div className="grid grid-cols-3 gap-2.5 pt-1 max-w-xl">
                {slide.topNote && (
                  <div className="p-2 lg:p-2.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">🌿 TOP</span>
                    <span className="text-xs text-white font-medium leading-tight block truncate">{slide.topNote}</span>
                  </div>
                )}
                {slide.heartNote && (
                  <div className="p-2 lg:p-2.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">🌸 HEART</span>
                    <span className="text-xs text-white font-medium leading-tight block truncate">{slide.heartNote}</span>
                  </div>
                )}
                {slide.baseNote && (
                  <div className="p-2 lg:p-2.5 rounded-lg bg-black/90 backdrop-blur-md border border-gold-500/40 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-gold-400 block tracking-wider">🪵 BASE</span>
                    <span className="text-xs text-white font-medium leading-tight block truncate">{slide.baseNote}</span>
                  </div>
                )}
              </div>
            )}

            {/* Price Row & Guarantee */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl lg:text-4xl font-extrabold gold-gradient-text font-serif drop-shadow-md">
                {slide.isCollection 
                  ? `From Rs. ${Number(slide.price || 2490).toLocaleString()}` 
                  : `Rs. ${Number(slide.price || 2650).toLocaleString()}`}
              </span>
              {slide.comparePrice ? (
                <span className="text-base lg:text-lg text-zinc-400 line-through">
                  Rs. {Number(slide.comparePrice).toLocaleString()}
                </span>
              ) : null}
              {slide.comparePrice && slide.price && Number(slide.comparePrice) > Number(slide.price) && (
                <span className="px-2 py-0.5 rounded bg-red-600/90 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                  SAVE {Math.round(((Number(slide.comparePrice) - Number(slide.price)) / Number(slide.comparePrice)) * 100)}%
                </span>
              )}
              <span className="text-xs text-emerald-400 font-semibold">
                • Free Nationwide Delivery Included
              </span>
            </div>

            {/* High-Converting Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBannerAction();
                }}
                className="px-8 py-3.5 lg:py-4 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-black text-xs lg:text-sm uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-95"
              >
                <span>{slide.btnText || 'BUY NOW (COD)'}</span>
                <ArrowRight size={14} className="shrink-0" />
              </button>
            </div>

          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute right-2 sm:right-6 bottom-2.5 sm:bottom-6 z-20 flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="p-1.5 sm:p-2.5 rounded-full bg-black/80 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 transition shadow-xl"
            aria-label="Previous Banner"
          >
            <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-1.5 sm:p-2.5 rounded-full bg-black/80 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 transition shadow-xl"
            aria-label="Next Banner"
          >
            <ChevronRight size={14} className="sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Slide Indicators at Bottom */}
        <div className="absolute left-3.5 sm:left-8 bottom-2 sm:bottom-6 z-20 flex items-center gap-1.5 sm:gap-2">
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
                className={`h-1 sm:h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-5 sm:w-10 bg-gradient-to-r from-gold-400 to-amber-500 shadow-[0_0_12px_rgba(212,175,55,0.7)]'
                    : 'w-1.5 sm:w-2.5 bg-white/30 hover:bg-white/60'
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
              <h5 className="text-xs font-bold text-white uppercase tracking-wider">8+ Hours Lasting</h5>
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
