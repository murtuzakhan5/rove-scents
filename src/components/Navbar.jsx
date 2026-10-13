import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Phone, Heart } from 'lucide-react';

export default function Navbar({ 
  settings, 
  categories, 
  activeCategory, 
  setActiveCategory, 
  cartCount, 
  setIsCartOpen, 
  searchQuery, 
  setSearchQuery, 
  cartTotal,
  onOpenAbout
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const marqueeText = settings?.announcementText || 
    "✨ FREE NATIONWIDE SHIPPING ON ORDERS OVER RS. 2,500  •  🚚 CASH ON DELIVERY AVAILABLE ACROSS PAKISTAN  •  💎 100% FRENCH EXTRAIT OILS (35% CONCENTRATION)  •  ⏳ 16+ HOURS LONGEVITY GUARANTEE  •  🔄 7-DAY HASSLE-FREE EXCHANGE";

  return (
    <header className="sticky top-0 z-40 bg-[#070707]/95 backdrop-blur-md border-b border-[#222]">
      
      {/* 1. Continuous Infinite Scrolling Marquee Announcement Bar */}
      <div className="bg-gradient-to-r from-[#17130a] via-[#281d09] to-[#17130a] border-b border-gold-600/30 text-xs py-2 overflow-hidden text-gold-200 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-12 font-medium tracking-wider">
          <span className="flex items-center gap-8">{marqueeText}</span>
          <span className="flex items-center gap-8">{marqueeText}</span>
          <span className="flex items-center gap-8">{marqueeText}</span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="p-2 text-zinc-400 hover:text-gold-400 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveCategory('all')}>
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold-500/50 p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
              <img 
                src="/images/rove-logo.jpg" 
                alt="ROVE SCENTS" 
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading tracking-[0.25em] text-xl font-bold gold-gradient-text uppercase">
                {settings?.storeName || "ROVE SCENTS"}
              </span>
              <span className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase -mt-0.5">
                {settings?.storeSlogan || "SCENT YOUR STORY"}
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center relative max-w-xs w-full">
            <Search className="absolute left-3 text-zinc-500" size={16} />
            <input 
              type="text"
              placeholder="Search perfumes, impressions, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414] border border-[#2a2a2a] text-xs text-white pl-9 pr-4 py-2 rounded-full focus:outline-none focus:border-gold-500 transition placeholder:text-zinc-500"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Customer Action Icons (NO ADMIN BUTTON VISIBLE TO BUYERS) */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Toggle on Mobile */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-gold-400 transition"
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* WhatsApp Quick Order button */}
            <a 
              href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20ROVE%20Scents,%20I%20have%20an%20inquiry%20regarding%20your%20perfumes`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-600/30 hover:bg-emerald-600 hover:text-white transition"
              title="WhatsApp Store Chat"
            >
              <Phone size={13} />
              <span>WhatsApp</span>
            </a>

            {/* Cart Drawer Trigger */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-[#161616] border border-[#2b2b2b] text-white hover:border-gold-500 transition group flex items-center gap-2"
              aria-label="View Cart"
            >
              <ShoppingBag size={19} className="group-hover:text-gold-400 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-gold-500 to-amber-600 text-black font-bold text-[11px] w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden md:inline text-xs font-semibold text-gold-400">
                  Rs. {cartTotal.toLocaleString()}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search Input Row */}
        {isSearchOpen && (
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 text-zinc-500" size={16} />
              <input 
                type="text"
                placeholder="Search perfumes, impressions, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161616] border border-[#2a2a2a] text-sm text-white pl-9 pr-8 py-2 rounded-lg focus:outline-none focus:border-gold-500"
                autoFocus
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Categories Bar Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-1 lg:space-x-3 border-t border-[#1a1a1a] py-2.5 overflow-x-auto no-scrollbar">
          {(categories || []).map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full font-medium transition whitespace-nowrap ${
                  isActive
                    ? 'bg-gold-500 text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                    : 'text-zinc-400 hover:text-gold-300 hover:bg-[#161616]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
          {onOpenAbout && (
            <button
              onClick={onOpenAbout}
              className="text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-full font-semibold transition whitespace-nowrap text-gold-300 hover:text-white hover:bg-gold-500/20 border border-gold-500/40 shadow-sm"
            >
              ✨ Our Story / About
            </button>
          )}
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#101010] border-b border-[#222] px-4 py-4 space-y-2">
          <p className="text-[10px] tracking-widest uppercase text-gold-400 font-bold mb-2">Browse Collections</p>
          {(categories || []).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded text-sm uppercase tracking-wider ${
                activeCategory === cat.id
                  ? 'bg-gold-500/20 text-gold-300 font-semibold border-l-2 border-gold-400'
                  : 'text-zinc-300 hover:bg-[#1a1a1a]'
              }`}
            >
              {cat.name}
            </button>
          ))}
          {onOpenAbout && (
            <button
              onClick={() => {
                onOpenAbout();
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2.5 rounded text-sm uppercase tracking-wider text-gold-300 font-bold hover:bg-[#1a1a1a] border-l-2 border-gold-500 bg-gold-500/10 mt-2"
            >
              ✨ Our Story & Craft (About Us)
            </button>
          )}
        </div>
      )}
    </header>
  );
}
