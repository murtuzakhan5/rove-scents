import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Clock, Wind, Calendar, MessageCircle, Check, Truck } from 'lucide-react';

export default function ProductDetailModal({ product, onClose, onAddToCart, settings }) {
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('notes'); // notes, description, shipping

  if (!product) return null;

  // Size pricing options
  const sizes = [
    { label: '50ml Extrait', key: '50ml', priceMultiplier: 1.0, sub: 'Signature Luxury Bottle' },
    { label: '100ml Grand', key: '100ml', priceMultiplier: 1.7, sub: 'Best Value (Save 20%)' },
    { label: '10ml Travel Spray', key: '10ml', priceMultiplier: 0.35, sub: 'Pocket Atomizer' }
  ];

  const currentSizeObj = sizes.find(s => s.key === selectedSize) || sizes[0];
  const unitPrice = Math.round(product.price * currentSizeObj.priceMultiplier);
  const compareUnitPrice = product.comparePrice ? Math.round(product.comparePrice * currentSizeObj.priceMultiplier) : null;

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedSize: currentSizeObj.label,
      price: unitPrice,
      quantity
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#121212] border border-gold-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_60px_rgba(212,175,55,0.2)]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1e1e1e] text-zinc-400 hover:text-white hover:bg-gold-500 hover:text-black transition duration-200"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#2a2a2a] bg-[#181818] shadow-inner">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-gold-400 text-black shadow">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Quick Guarantees Under Image */}
            <div className="p-3.5 rounded-xl bg-[#181818] border border-[#252525] space-y-2 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-gold-400 shrink-0" />
                <span>35% Pure French Fragrance Oil Concentration</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-gold-400 shrink-0" />
                <span>Cash on Delivery (COD) across Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gold-400 shrink-0" />
                <span>Fast 2-4 Business Days Courier Delivery</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Actions */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-5">
            <div>
              {/* Inspired By Highlight */}
              {product.inspiredBy && (
                <div className="inline-block px-3 py-1 rounded-full bg-gold-950/70 border border-gold-500/30 text-gold-300 text-xs font-medium tracking-wide mb-2">
                  ✨ Impression of: <strong className="text-white">{product.inspiredBy}</strong>
                </div>
              )}

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {product.name}
              </h2>

              {/* Ratings */}
              <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-white">{product.rating || '4.9'}</span>
                <span>•</span>
                <span className="text-zinc-400">{product.reviewsCount || 48} Verified Customer Reviews</span>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-extrabold gold-gradient-text">
                  Rs. {unitPrice.toLocaleString()}
                </span>
                {compareUnitPrice && (
                  <span className="text-base text-zinc-500 line-through">
                    Rs. {compareUnitPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/30 font-semibold">
                  In Stock (COD Available)
                </span>
              </div>

              {/* Size Selector */}
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Select Bottle Size:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {sizes.map((s) => {
                    const isSelected = selectedSize === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setSelectedSize(s.key)}
                        className={`p-2.5 rounded-xl text-left border transition ${
                          isSelected
                            ? 'bg-gold-500/15 border-gold-400 text-white shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                            : 'bg-[#181818] border-[#2b2b2b] text-zinc-400 hover:border-zinc-600'
                        }`}
                      >
                        <div className="text-xs font-bold">{s.label}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5 truncate">{s.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fragrance Performance Metrics (Elyscents style) */}
              <div className="mt-5 grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#171717] border border-[#262626] text-center">
                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 mb-1">
                    <Clock size={12} className="text-gold-400" />
                    <span>Longevity</span>
                  </div>
                  <span className="text-xs font-bold text-gold-300">{product.longevity || '14+ Hours'}</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 mb-1">
                    <Wind size={12} className="text-gold-400" />
                    <span>Sillage</span>
                  </div>
                  <span className="text-xs font-bold text-gold-300">{product.sillage || 'Heavy'}</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-[11px] text-zinc-400 mb-1">
                    <Calendar size={12} className="text-gold-400" />
                    <span>Best Season</span>
                  </div>
                  <span className="text-xs font-bold text-gold-300 truncate block">{product.season || 'All Season'}</span>
                </div>
              </div>

              {/* Tabs: Notes Breakdown, Story, Delivery */}
              <div className="mt-5">
                <div className="flex border-b border-[#262626] gap-4 text-xs font-semibold uppercase tracking-wider">
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className={`pb-2 border-b-2 transition ${activeTab === 'notes' ? 'border-gold-400 text-gold-300' : 'border-transparent text-zinc-400 hover:text-white'}`}
                  >
                    Olfactory Notes
                  </button>
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`pb-2 border-b-2 transition ${activeTab === 'description' ? 'border-gold-400 text-gold-300' : 'border-transparent text-zinc-400 hover:text-white'}`}
                  >
                    The Story
                  </button>
                  <button 
                    onClick={() => setActiveTab('shipping')}
                    className={`pb-2 border-b-2 transition ${activeTab === 'shipping' ? 'border-gold-400 text-gold-300' : 'border-transparent text-zinc-400 hover:text-white'}`}
                  >
                    Delivery & Returns
                  </button>
                </div>

                <div className="pt-3 text-xs leading-relaxed text-zinc-300">
                  {activeTab === 'notes' && (
                    <div className="space-y-2 bg-[#161616] p-3 rounded-lg border border-[#242424]">
                      <div>
                        <span className="text-gold-400 font-bold uppercase tracking-wider block text-[10px]">🌿 Top Notes (First 15-30 mins):</span>
                        <p className="text-zinc-200">{product.topNotes || "Bergamot, Fresh Citrus, Cardamom"}</p>
                      </div>
                      <div>
                        <span className="text-gold-400 font-bold uppercase tracking-wider block text-[10px]">🌸 Heart / Middle Notes (2 - 6 hours):</span>
                        <p className="text-zinc-200">{product.heartNotes || "Exotic Rose, Smoky Oud, Wild Lavender"}</p>
                      </div>
                      <div>
                        <span className="text-gold-400 font-bold uppercase tracking-wider block text-[10px]">🪵 Base Notes (Drydown 8 - 14+ hours):</span>
                        <p className="text-zinc-200">{product.baseNotes || "Amber, Tonka Bean, Sandalwood, Vanilla"}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'description' && (
                    <p className="text-zinc-300 leading-relaxed">
                      {product.description || product.shortDesc}
                    </p>
                  )}

                  {activeTab === 'shipping' && (
                    <div className="space-y-2 text-zinc-300">
                      <p>• <strong>Delivery Time:</strong> 2-3 working days for Lahore, Karachi, Islamabad/Rawalpindi; 3-4 days for other cities across Pakistan.</p>
                      <p>• <strong>Shipping Charges:</strong> Free delivery on orders above Rs. {settings?.freeDeliveryThreshold || 2500}. Flat Rs. {settings?.deliveryCharge || 200} for smaller orders.</p>
                      <p>• <strong>Exchange Policy:</strong> 7 days hassle-free bottle exchange if you prefer a different fragrance.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Quantity & Action Buttons */}
            <div className="pt-4 border-t border-[#262626] space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-[#333] rounded-lg bg-[#181818] overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#252525] transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-sm font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-zinc-400 hover:text-white hover:bg-[#252525] transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-grow py-3 px-6 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:from-gold-300 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.25)] active:scale-95"
                >
                  <ShoppingBag size={17} />
                  <span>Add to Cart • Rs. {(unitPrice * quantity).toLocaleString()}</span>
                </button>
              </div>

              {/* 1-Click WhatsApp Quick Order */}
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20ROVE%20Scents!%0A%0AI%20want%20to%20order:%0A- *Product:* ${encodeURIComponent(product.name)}%0A- *Size:* ${encodeURIComponent(currentSizeObj.label)}%0A- *Qty:* ${quantity}%0A- *Total:* Rs. ${(unitPrice * quantity).toLocaleString()}%0A%0APlease%20deliver%20via%20Cash%20on%20Delivery.%20My%20address%20is:`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#142318] hover:bg-[#1b3021] border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs font-bold tracking-wider transition flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Order via WhatsApp (Instant COD Confirmation)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
