import React from 'react';
import { Star, ShoppingBag, Eye, MessageCircle, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct, onAddToCart, settings }) {
  const discountPercent = product.comparePrice && product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : null;

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group relative bg-[#121212] border border-[#222] hover:border-gold-500/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(212,175,55,0.15)] flex flex-col justify-between cursor-pointer"
    >
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#0d0d0d] flex items-center justify-center p-2">
        
        {/* Product Image - Full bottle visibility */}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center rounded-xl group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Subtle Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none rounded-xl" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-gold-400 text-black shadow-md">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-600/90 text-white shadow-md w-max">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Gender / Concentration Tag */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[10px] text-zinc-300 border border-white/10 uppercase tracking-widest font-mono">
          {product.gender || 'Extrait'}
        </div>

        {/* View Details Hover Overlay Pill */}
        <div className="absolute inset-x-4 bottom-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:flex items-center justify-center">
          <div className="px-4 py-2 rounded-full bg-white/95 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xl backdrop-blur-md">
            <span>View Full Details</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>

      {/* Product Details Body */}
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Inspired By Label */}
          {product.inspiredBy && (
            <div className="text-[11px] text-gold-400 font-medium tracking-wide truncate mb-1" title={product.inspiredBy}>
              Inspired by: <span className="text-zinc-300">{product.inspiredBy}</span>
            </div>
          )}

          {/* Product Title */}
          <h3 
            className="font-serif text-base font-bold text-white group-hover:text-gold-300 transition truncate"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Scent notes snippet */}
          <p className="text-[11px] text-zinc-400 truncate mt-1">
            {product.topNotes ? product.topNotes : product.shortDesc}
          </p>

          {/* Ratings & Longevity */}
          <div className="flex items-center justify-between mt-2.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-white">{product.rating || '4.9'}</span>
              <span className="text-zinc-500 text-[11px]">({product.reviewsCount || 48})</span>
            </div>
            {product.longevity && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1c1c1c] text-gold-300 border border-gold-500/20 font-medium">
                {product.longevity}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA Buttons */}
        <div className="mt-4 pt-3 border-t border-[#222]">
          <div className="flex items-baseline justify-between mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-white tracking-tight">
                Rs. {product.price?.toLocaleString()}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-xs text-zinc-500 line-through">
                  Rs. {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-amber-400 font-medium animate-pulse">
                Only {product.stock} left!
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // don't open product page, just add to cart!
                onAddToCart(product);
              }}
              className="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <ShoppingBag size={14} />
              <span>Add to Cart</span>
            </button>

            <a
              href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20ROVE%20Scents!%20I%20want%20to%20order%20*${encodeURIComponent(product.name)}*%20for%20Rs.%20${product.price}.%20Please%20confirm%20availability.`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 px-2 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-semibold text-xs tracking-wider transition flex items-center justify-center gap-1.5"
              title="Order directly on WhatsApp"
            >
              <MessageCircle size={14} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
