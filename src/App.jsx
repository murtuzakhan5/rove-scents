import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AutoHeroSlider from './components/AutoHeroSlider';
import CategoryCirclesCarousel from './components/CategoryCirclesCarousel';
import ProductCard from './components/ProductCard';
import ProductPage from './components/ProductPage';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import CustomerReviews from './components/CustomerReviews';
import AboutUsModal from './components/AboutUsModal';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginModal from './components/AdminLoginModal';
import InvoiceModal from './components/InvoiceModal';
import WhatsAppButton from './components/WhatsAppButton';
import SocialProofToasts from './components/SocialProofToasts';
import { Sparkles, ArrowUpDown, ArrowRight, ShieldCheck, Lock, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Views: 'home' | 'product'
  const [currentView, setCurrentView] = useState('home');
  const [activeProduct, setActiveProduct] = useState(null);

  // Storefront Filtering & Search
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // featured, price-low, price-high, rating

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('rove_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Panels
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('rove_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch all data from Express API
  const fetchData = async () => {
    try {
      const [resSet, resCat, resProd, resOrd, resCoup, resRev] = await Promise.all([
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json())
      ]);
      setSettings(resSet);
      setCategories(resCat);
      setProducts(resProd);
      setOrders(resOrd);
      setCoupons(resCoup);
      setReviews(resRev);
    } catch (err) {
      console.error('Failed to load store data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keyboard shortcut Ctrl+Shift+A or #admin in URL to open admin login
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        handleTriggerAdminAccess();
      }
    };

    if (window.location.hash === '#admin') {
      handleTriggerAdminAccess();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  const handleTriggerAdminAccess = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  // Open Full-Page Product View (100% Reliable React State)
  const handleOpenProductPage = (prod) => {
    if (!prod) return;
    setActiveProduct(prod);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to Storefront
  const handleBackToStore = () => {
    setCurrentView('home');
    setActiveProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const handleAddToCart = (productToAdd) => {
    setCartItems(prev => {
      const sizeKey = productToAdd.selectedSize || '50ml Extrait Bottle';
      const existingIdx = prev.findIndex(item => item.id === productToAdd.id && item.selectedSize === sizeKey);
      const qtyToAdd = productToAdd.quantity || 1;

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qtyToAdd;
        return next;
      } else {
        return [...prev, {
          ...productToAdd,
          selectedSize: sizeKey,
          quantity: qtyToAdd
        }];
      }
    });

    setIsCartOpen(true);
  };

  // Direct 1-Click Buy Now (Skip directly to Checkout)
  const handleDirectCheckout = (productToBuy) => {
    handleAddToCart(productToBuy);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (id, size, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id, size);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id, size) => {
    setCartItems(prev => prev.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Add review from storefront or product page
  const handleAddReview = async (reviewData) => {
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      fetchData();
    } catch (err) {
      console.error('Failed to submit review');
    }
  };

  // Filtered and Sorted Products
  let displayProducts = [...products];

  if (activeCategory && activeCategory !== 'all') {
    displayProducts = displayProducts.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayProducts = displayProducts.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.inspiredBy && p.inspiredBy.toLowerCase().includes(q)) ||
      (p.topNotes && p.topNotes.toLowerCase().includes(q)) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(q))
    );
  }

  if (sortBy === 'price-low') {
    displayProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    displayProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    displayProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col font-sans">
      
      {/* 1. Header Navigation (100% Clean Customer-Facing, No Public Admin Button) */}
      <Navbar
        settings={settings}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={(cat) => {
          setActiveCategory(cat);
          if (currentView !== 'home') handleBackToStore();
        }}
        cartCount={cartCount}
        cartTotal={cartTotal}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAbout={() => setIsAboutUsOpen(true)}
      />

      {/* 2. CONDITIONAL VIEW: FULL PRODUCT PAGE vs. HOME STORE */}
      {currentView === 'product' && activeProduct ? (
        <ProductPage
          product={activeProduct}
          allProducts={products}
          onBack={handleBackToStore}
          onSelectProduct={handleOpenProductPage}
          onAddToCart={handleAddToCart}
          onDirectCheckout={handleDirectCheckout}
          settings={settings}
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      ) : (
        /* ================= HOME STOREFRONT VIEW ================= */
        <>
          {/* A. 3D Premium Auto-Playing Hero Showcase Banner (3D Pedestals, Notes, Glow) */}
          {activeCategory === 'all' && !searchQuery && (
            <AutoHeroSlider
              products={products}
              settings={settings}
              onSelectProduct={handleOpenProductPage}
              onDirectCheckout={handleDirectCheckout}
              onShopAll={() => {
                setActiveCategory('all');
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}

          {/* B. Homepage Luxury Category Circles Carousel (4s Auto Animation & No Cut-Off) */}
          {activeCategory === 'all' && !searchQuery && (
            <CategoryCirclesCarousel
              categories={categories}
              activeCategory={activeCategory}
              setActiveCategory={(catId) => {
                setActiveCategory(catId);
                const el = document.getElementById('catalog-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              products={products}
            />
          )}

          {/* C. Main Catalog Section */}
          <main id="catalog-section" className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
            
            {/* Category Heading & Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#242424] gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-400 font-bold mb-1">
                  <Sparkles size={13} />
                  <span>
                    {categories.find(c => c.id === activeCategory)?.name || 'Curated Masterpieces'}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 
                   activeCategory === 'men' ? "Men's Luxury Impression Fragrances" :
                   activeCategory === 'women' ? "Women's Signature Floral & Amber Scents" :
                   activeCategory === 'unisex' ? "Universal Extrait De Parfum Signatures" :
                   activeCategory === 'attars' ? "Pure Concentrated Royal Attars" :
                   "High-Sillage French Impressions (All Perfumes)"}
                </h2>
              </div>

              {/* Sort & Count Controls */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 font-medium hidden sm:inline">
                  Showing {displayProducts.length} Fragrances
                </span>

                <div className="flex items-center gap-1.5 bg-[#161616] border border-[#262626] rounded-lg px-3 py-1.5 text-xs">
                  <ArrowUpDown size={13} className="text-gold-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    <option value="featured" className="bg-[#161616] text-white">Sort: Featured</option>
                    <option value="price-low" className="bg-[#161616] text-white">Price: Low to High</option>
                    <option value="price-high" className="bg-[#161616] text-white">Price: High to Low</option>
                    <option value="rating" className="bg-[#161616] text-white">Top Rated (★)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid or Professional Coming Soon State */}
            {displayProducts.length === 0 ? (
              <div className="py-20 px-4 text-center rounded-2xl bg-[#121212] border border-[#222] space-y-4 max-w-2xl mx-auto shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mx-auto">
                  <Sparkles size={28} />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-widest border border-amber-500/40">
                    EXQUISITE RELEASE IN PROGRESS
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-white pt-2">
                    Coming Very Soon
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
                    We are currently curing and formulating exclusive new creations for the <strong className="text-gold-300">{categories.find(c => c.id === activeCategory)?.name || 'this collection'}</strong> line. Stay tuned for our upcoming launch!
                  </p>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
                    className="px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-black font-extrabold text-xs uppercase tracking-wider transition shadow-lg"
                  >
                    Explore Available Best Sellers
                  </button>
                  <a
                    href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20ROVE%20Scents!%20Please%20notify%20me%20when%20new%20${encodeURIComponent(categories.find(c => c.id === activeCategory)?.name || 'perfumes')}%20arrive!`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#1c1c1c] border border-emerald-500/40 text-emerald-400 hover:text-white font-bold text-xs uppercase tracking-wider transition"
                  >
                    Pre-Order / VIP Alert via WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
                {displayProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    settings={settings}
                    onSelectProduct={handleOpenProductPage}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {/* Promotional Bundle Feature Card */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="mt-16 p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-[#17140b] via-[#241c0e] to-[#17140b] border border-gold-500/30 shadow-[0_0_40px_rgba(212,175,55,0.15)] relative overflow-hidden">
                <div className="max-w-xl space-y-4 relative z-10">
                  <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[11px] font-bold tracking-widest uppercase">
                    EXCLUSIVE BUNDLE DEAL
                  </span>
                  <h3 className="font-serif text-3xl font-extrabold text-white">
                    Buy Any 2 Perfumes & Get <span className="gold-gradient-text">FREE Shipping + Tester Gift</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                    Mix and match your favorite designer impressions. Enjoy 16+ hours of opulent French projection and receive a complimentary 10ml travel atomizer with every order of 2 or more bottles.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const el = document.getElementById('catalog-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2"
                    >
                      <span>Build Your 2-Bottle Bundle</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>

          {/* C. Verified Customer Reviews Section (Judge.me style) */}
          <CustomerReviews
            reviews={reviews}
            onAddReview={handleAddReview}
          />

          {/* D. Brand Standard / Comparison Section */}
          <section className="py-16 bg-[#0a0a0a] border-t border-[#222]">
            <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold">
                The ROVE SCENTS Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Why Our Impressions Outperform The Market
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                Most local perfumes use cheap commercial water-diluted bases with only 10-15% oil concentration. ROVE Scents bottles are individually cured with <strong>35% Pure Extrait De Parfum French oils</strong> for rich complexity and true 16-hour longevity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 text-left">
                <div className="p-5 rounded-xl bg-[#141414] border border-[#222]">
                  <h4 className="font-bold text-sm text-gold-300 mb-1 font-serif">Pure 35% Extrait Grade</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Higher concentration than Eau de Parfum (EDP) and Eau de Toilette (EDT) for deep projection on Pakistani fabrics.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#141414] border border-[#222]">
                  <h4 className="font-bold text-sm text-gold-300 mb-1 font-serif">Zero Harsh Chemical Smell</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Smooth natural opening from the first spray without the stinging alcohol sharpness found in cheaper copies.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[#141414] border border-[#222]">
                  <h4 className="font-bold text-sm text-gold-300 mb-1 font-serif">Cash On Delivery Nationwide</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Inspect your package securely. Delivered directly to your home or office in 2 to 4 business days.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 3. Footer */}
      <footer className="bg-[#050505] border-t border-[#1a1a1a] pt-12 pb-8 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/images/rove-logo.jpg" alt="ROVE" className="w-8 h-8 rounded-full border border-gold-500/40" />
              <span className="font-serif font-bold text-base gold-gradient-text">ROVE SCENTS</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Crafting premium French-grade luxury fragrance impressions and scented stories in Pakistan.
            </p>
            <p className="text-[10px] text-gold-400">
              Scent Your Story • Extrait De Parfum
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Quick Navigation</h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li><button onClick={() => setIsAboutUsOpen(true)} className="hover:text-gold-300 text-gold-400 font-semibold flex items-center gap-1">✨ Our Story & Craft (About Us)</button></li>
              <li><button onClick={() => { setActiveCategory('men'); if (currentView !== 'home') handleBackToStore(); }} className="hover:text-gold-300">Men's Best Sellers</button></li>
              <li><button onClick={() => { setActiveCategory('women'); if (currentView !== 'home') handleBackToStore(); }} className="hover:text-gold-300">Women's Luxury</button></li>
              <li><button onClick={() => { setActiveCategory('unisex'); if (currentView !== 'home') handleBackToStore(); }} className="hover:text-gold-300">Unisex Impressions</button></li>
              <li><button onClick={() => { setActiveCategory('discovery'); if (currentView !== 'home') handleBackToStore(); }} className="hover:text-gold-300">Discovery Sets & Bundles</button></li>
              <li><button onClick={() => { setActiveCategory('candles'); if (currentView !== 'home') handleBackToStore(); }} className="hover:text-gold-300">Scented Candles</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Customer Care</h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>WhatsApp Support: <strong className="text-white">{settings?.whatsappNumber || '03001234567'}</strong></li>
              <li>Shipping Time: 2 - 4 Days Nationwide</li>
              <li>Payment: Cash on Delivery (COD) & Raast</li>
              <li>Exchange Guarantee: 7 Days Hassle-Free</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">Store Policies</h4>
            <ul className="space-y-1.5 text-zinc-400">
              <li>100% Satisfaction Guarantee</li>
              <li>Fragrance Curing & Quality Check</li>
              <li>Direct Dispatch from Lab</li>
              <li>
                <button
                  onClick={handleTriggerAdminAccess}
                  className="mt-2 text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition"
                  title="Staff & Store Administration (Password Protected)"
                >
                  <Lock size={10} />
                  <span>Staff Portal</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#141414] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
          <p>© {new Date().getFullYear()} {settings?.storeName || 'ROVE SCENTS'} Pakistan. All Rights Reserved.</p>
          <p>Cash on Delivery across Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad & Nationwide</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <WhatsAppButton settings={settings} />

      {/* Cart Drawer */}
      {isCartOpen && (
        <CartDrawer
          isOpen={isCartOpen}
          settings={settings}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckoutClick={() => setIsCheckoutOpen(true)}
        />
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          settings={settings}
          cartItems={cartItems}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={(createdOrder) => {
            handleClearCart();
            fetchData();
          }}
        />
      )}

      {/* Admin Login Modal (Password Protected for Staff Only) */}
      {isAdminLoginOpen && (
        <AdminLoginModal
          isOpen={isAdminLoginOpen}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={() => {
            setIsAdminAuthenticated(true);
            setIsAdminOpen(true);
          }}
        />
      )}

      {/* Live Social Proof / Order Activity Toasts */}
      <SocialProofToasts products={products} />

      {/* Admin Dashboard */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          products={products}
          orders={orders}
          coupons={coupons}
          reviews={reviews}
          settings={settings}
          categories={categories}
          onRefreshData={fetchData}
          onOpenInvoice={(order) => setInvoiceOrder(order)}
        />
      )}

      {/* Printable Invoice Packing Slip Modal */}
      {invoiceOrder && (
        <InvoiceModal
          order={invoiceOrder}
          settings={settings}
          onClose={() => setInvoiceOrder(null)}
        />
      )}

      {/* Luxury Brand Story & Craft (About Us) Modal */}
      <AboutUsModal
        isOpen={isAboutUsOpen}
        settings={settings}
        onClose={() => setIsAboutUsOpen(false)}
      />

    </div>
  );
}
