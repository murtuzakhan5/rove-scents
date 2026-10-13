import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCirclesCarousel({ categories, activeCategory, setActiveCategory, products }) {
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance mobile carousel every 4 seconds
  useEffect(() => {
    if (isPaused || !categories || categories.length === 0) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        
        // If reached end, smooth scroll back to start; otherwise advance by 1 circle width (~115px)
        if (container.scrollLeft >= maxScrollLeft - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 120, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, categories]);

  const handleManualScroll = (direction) => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -180 : 180;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#0c0c0c] border-b border-[#1f1f1f] py-6 sm:py-8 px-2 sm:px-6 lg:px-8 relative select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 px-2 sm:px-0">
          <div className="text-left">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-gold-400 block">
              EXPLORE BY CATEGORY
            </span>
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-white mt-0.5">
              Curated Collections
            </h3>
          </div>

          {/* Small Navigation Arrows */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleManualScroll('left')}
              className="p-1.5 rounded-full bg-[#161616] hover:bg-gold-500 hover:text-black border border-[#262626] text-zinc-300 transition"
              aria-label="Previous Category"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleManualScroll('right')}
              className="p-1.5 rounded-full bg-[#161616] hover:bg-gold-500 hover:text-black border border-[#262626] text-zinc-300 transition"
              aria-label="Next Category"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Carousel Row (Properly padded, never cuts off first circle on mobile) */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsPaused(false), 3000);
          }}
          className="flex items-center justify-start md:justify-center gap-4 sm:gap-8 overflow-x-auto py-2 px-3 sm:px-6 no-scrollbar scroll-smooth"
        >
          {(categories || []).map((cat) => {
            const isActive = activeCategory === cat.id;
            const catCount = cat.id === 'all' 
              ? (products || []).length 
              : (products || []).filter(p => p.category?.toLowerCase() === cat.id.toLowerCase()).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group flex flex-col items-center gap-2 shrink-0 focus:outline-none transition-transform active:scale-95"
              >
                {/* Circular Image Frame with 24K Gold Ring */}
                <div className={`relative w-[76px] h-[76px] sm:w-24 sm:h-24 rounded-full p-1 transition-all duration-300 ${
                  isActive 
                    ? 'ring-2 ring-gold-400 scale-105 shadow-[0_0_22px_rgba(212,175,55,0.45)]' 
                    : 'ring-1 ring-gold-500/30 group-hover:ring-gold-400/80 group-hover:scale-105'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#181818] border border-black/40">
                    <img 
                      src={cat.image || '/images/cat-all.jpg'} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {catCount === 0 && (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-tight shadow">
                      Soon
                    </span>
                  )}
                </div>

                {/* Title & Count */}
                <div className="text-center max-w-[85px] sm:max-w-none">
                  <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider block truncate transition ${
                    isActive ? 'text-gold-300' : 'text-zinc-300 group-hover:text-gold-300'
                  }`}>
                    {cat.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 block">
                    {catCount > 0 ? `${catCount} Bottles` : 'Coming Soon'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
