import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Clock, 
  Wind, 
  Calendar, 
  Truck, 
  RefreshCw, 
  MessageCircle, 
  Flame, 
  Sparkles, 
  Check, 
  Plus, 
  ChevronRight,
  Eye,
  Gift,
  ThumbsUp,
  Image as ImageIcon
} from 'lucide-react';

export default function ProductPage({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onAddToCart,
  onDirectCheckout,
  settings,
  reviews,
  onAddReview
}) {
  const [selectedSize, setSelectedSize] = useState('50ml');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('notes'); // notes, description, shipping
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [activeImage, setActiveImage] = useState(product?.image);

  // Review Form state
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    author: '',
    city: 'Lahore',
    rating: 5,
    title: '',
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const firstKey = (product?.hasVariants && product.variants?.[0]?.name) || '50ml';
    setSelectedSize(firstKey);
    setQuantity(1);
    setActiveImage(product?.image || '/images/bottle-rukh.jpg');
  }, [product?.id, product?.image]);

  if (!product) return null;

  // Curated Related Views/Gallery Images for this product
  const rawGallery = Array.isArray(product.galleryImages) && product.galleryImages.length > 0
    ? product.galleryImages
    : [product.image, '/images/rove-all-collection-banner.jpg'];

  const galleryImages = rawGallery.map((url, idx) => ({
    label: idx === 0 ? 'Signature Bottle View' : `View ${idx + 1}`,
    url
  }));

  // Default sizes if product has no custom variants
  const defaultSizes = [
    { label: '50ml Extrait Bottle', key: '50ml', price: product.price, comparePrice: product.comparePrice, sub: 'Signature Heavy Glass' },
    { label: '100ml Grand Bottle', key: '100ml', price: Math.round(product.price * 1.7), comparePrice: product.comparePrice ? Math.round(product.comparePrice * 1.7) : null, sub: 'Best Value (Save 20%)' },
    { label: '10ml Travel Pocket Spray', key: '10ml', price: Math.round(product.price * 0.35), comparePrice: null, sub: 'Pocket Atomizer' }
  ];

  // Dynamic variants support (WordPress WooCommerce style)
  const availableVariants = (product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0)
    ? product.variants.map(v => ({
        label: v.bottleSize || `${v.name} Extrait Bottle`,
        key: v.name || v.id,
        price: v.price || product.price,
        comparePrice: v.comparePrice || product.comparePrice,
        sub: v.bottleSize || `${v.name} Luxury Flacon`
      }))
    : defaultSizes;

  const currentVariant = availableVariants.find(s => s.key === selectedSize) || availableVariants[0];
  const currentSizeObj = currentVariant;
  const unitPrice = currentVariant?.price || product.price;
  const compareUnitPrice = currentVariant?.comparePrice || product.comparePrice;
  const savings = compareUnitPrice ? compareUnitPrice - unitPrice : 0;

  // Filter reviews for this specific product
  const productReviews = (reviews || []).filter(r => r.productId === product.id);

  // Related products from same category or complementary
  const relatedProducts = (allProducts || [])
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // Bundle Upsell Pair Product
  const bundlePair = relatedProducts[0] || allProducts?.[1];
  const bundleCombinedPrice = bundlePair ? Math.round((unitPrice + bundlePair.price) * 0.85) : 0; // 15% off bundle

  const handleAdd = () => {
    onAddToCart({
      ...product,
      selectedSize: currentVariant.label,
      variantName: currentVariant.key,
      price: unitPrice,
      quantity
    });
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    onDirectCheckout({
      ...product,
      selectedSize: currentVariant.label,
      variantName: currentVariant.key,
      price: unitPrice,
      quantity
    });
  };

  const handleAddBundle = () => {
    if (!bundlePair) return;
    onAddToCart({
      ...product,
      selectedSize: currentSizeObj.label,
      price: unitPrice,
      quantity: 1
    });
    onAddToCart({
      ...bundlePair,
      selectedSize: '50ml Extrait Bottle',
      price: bundlePair.price,
      quantity: 1
    });
  };

  // Submit customer review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.author || !reviewForm.comment) return;
    
    onAddReview({
      productId: product.id,
      productName: product.name,
      ...reviewForm
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setIsReviewFormOpen(false);
      setReviewForm({ author: '', city: 'Lahore', rating: 5, title: '', comment: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans pb-24">
      
      {/* 1. Breadcrumbs Navigation */}
      <div className="bg-[#101010] border-b border-[#222] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition"
          >
            <ArrowLeft size={15} />
            <span>Back to All Fragrances</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
            <span className="hover:text-white cursor-pointer" onClick={onBack}>Home</span>
            <ChevronRight size={12} />
            <span className="capitalize">{product.category || 'Perfumes'}</span>
            <ChevronRight size={12} />
            <span className="text-gold-300 font-semibold truncate max-w-xs">{product.name}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Product Showcase Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Multi-Image Luxury Gallery */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#141414] border-2 border-gold-500/40 shadow-[0_0_50px_rgba(212,175,55,0.2)] group">
              <img 
                src={activeImage || product.image || '/images/bottle-rukh.jpg'} 
                alt={product.name} 
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  if (e.target.src !== '/images/bottle-rukh.jpg') {
                    e.target.src = '/images/bottle-rukh.jpg';
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-gold-400 text-black shadow-lg">
                    {product.badge}
                  </span>
                )}
                {compareUnitPrice && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-red-600/90 text-white shadow-lg w-max">
                    SAVE {Math.round(((compareUnitPrice - unitPrice) / compareUnitPrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Sillage Watermark */}
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-gold-500/30 text-xs font-bold text-gold-300">
                ✨ 35% Pure French Oil Extrait
              </div>
            </div>

            {/* Related Image Thumbnails Selector */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Related Angles & Views:
              </span>
              <div className="grid grid-cols-4 gap-2.5">
                {galleryImages.map((img, idx) => {
                  const isActive = (activeImage || product.image) === img.url;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img.url)}
                      className={`relative aspect-[3/4] rounded-xl overflow-hidden border transition ${
                        isActive
                          ? 'border-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                          : 'border-[#262626] opacity-60 hover:opacity-100 hover:border-zinc-500'
                      }`}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/75 py-0.5 text-[9px] text-center text-zinc-300 truncate">
                        {img.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust Guarantee Cards Under Image */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#131313] border border-[#222] text-center">
                <Clock size={18} className="text-gold-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">{product.longevity || '8+ Hours'}</span>
                <span className="text-[10px] text-zinc-400">Guaranteed Lasting</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#131313] border border-[#222] text-center">
                <Truck size={18} className="text-gold-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">Cash on Delivery</span>
                <span className="text-[10px] text-zinc-400">Nationwide Pakistan</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#131313] border border-[#222] text-center">
                <RefreshCw size={18} className="text-gold-400 mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">7-Day Exchange</span>
                <span className="text-[10px] text-zinc-400">Hassle-Free Return</span>
              </div>
            </div>

          </div>

          {/* Right Column: Purchasing & Story Information */}
          <div className="lg:col-span-6 space-y-6">
            
            <div>
              {/* Inspired By / Collection Pill */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full bg-gold-950/80 border border-gold-500/40 text-gold-300 text-xs font-semibold tracking-wider">
                  {product.gender || 'Universal'} • {product.category?.toUpperCase() || 'HAUTE PARFUM'}
                </span>
                {product.inspiredBy && (
                  <span className="text-xs text-zinc-400">
                    Inspired by: <strong className="text-zinc-200">{product.inspiredBy}</strong>
                  </span>
                )}
              </div>

              {/* Perfume Name */}
              <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-white tracking-wide leading-tight">
                {product.name}
              </h1>

              {/* Ratings and Reviews count */}
              <div className="flex items-center gap-3 mt-2 text-sm">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-white">{product.rating || '5.0'}</span>
                <span className="text-zinc-400">({product.reviewsCount || 120} Verified Buyer Reviews)</span>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 mt-4 pt-3 border-t border-[#222]">
                <span className="text-3xl sm:text-4xl font-extrabold gold-gradient-text font-serif">
                  Rs. {unitPrice.toLocaleString()}
                </span>
                {compareUnitPrice && (
                  <span className="text-lg text-zinc-500 line-through">
                    Rs. {compareUnitPrice.toLocaleString()}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs px-2.5 py-1 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30 font-bold">
                    Save Rs. {savings.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Live Urgency / Social Proof Banner (Purchasing Booster) */}
              <div className="mt-4 p-3.5 rounded-xl bg-[#17140e] border border-gold-600/30 text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-300 font-semibold">
                  <Flame size={15} className="text-amber-400 animate-pulse" />
                  <span>High Demand: 14 people from Pakistan are viewing this right now!</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-300 text-[11px]">
                  <Check size={13} className="text-emerald-400" />
                  <span>In Stock (Only {product.stock || 8} bottles left) • Ships Today via TCS / PostEx</span>
                </div>
              </div>
            </div>

            {/* Bottle Size Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                Select Bottle Volume:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableVariants.map((s) => {
                  const isSelected = selectedSize === s.key || currentVariant.key === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => setSelectedSize(s.key)}
                      className={`p-3 rounded-xl text-left border transition ${
                        isSelected
                          ? 'bg-gold-500/15 border-gold-400 text-white shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                          : 'bg-[#151515] border-[#292929] text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{s.label}</div>
                      <div className="text-[11px] font-bold text-gold-300 mt-0.5">
                        Rs. {s.price.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{s.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Action CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Qty Counter */}
                <div className="flex items-center border border-[#333] rounded-xl bg-[#161616] overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 text-zinc-400 hover:text-white hover:bg-[#222] transition text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-sm font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-3 text-zinc-400 hover:text-white hover:bg-[#222] transition text-sm"
                  >
                    +
                  </button>
                </div>

                {/* Instant Buy Now Button (High Conversion) */}
                <button
                  onClick={handleBuyNow}
                  className="flex-grow py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs sm:text-sm uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95"
                >
                  <span>BUY NOW (CASH ON DELIVERY)</span>
                </button>
              </div>

              {/* Add to Cart Secondary Button */}
              <button
                onClick={handleAdd}
                className="w-full py-3.5 px-6 rounded-xl bg-[#1a1a1a] hover:bg-[#242424] border border-gold-500/40 text-gold-300 hover:text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>{addedAnimation ? '✓ ADDED TO YOUR BAG!' : `ADD TO CART • RS. ${(unitPrice * quantity).toLocaleString()}`}</span>
              </button>

              {/* 1-Click WhatsApp Direct Order Button */}
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20ROVE%20Scents!%0A%0AI%20want%20to%20order%20*${encodeURIComponent(product.name)}*%0A- Size: ${encodeURIComponent(currentSizeObj.label)}%0A- Qty: ${quantity}%0A- Price: Rs. ${(unitPrice * quantity).toLocaleString()}%0A%0APlease%20deliver%20via%20Cash%20on%20Delivery%20to%20my%20address:`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#14261a] hover:bg-[#1a3323] border border-emerald-500/40 text-emerald-300 font-semibold text-xs tracking-wider transition flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                <span>Instant Order via WhatsApp (Chat with Representative)</span>
              </a>
            </div>

            {/* Accordion Tabs: Notes, Scent Story, Delivery Policy */}
            <div className="pt-4 border-t border-[#222]">
              <div className="flex border-b border-[#252525] gap-4 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2.5 border-b-2 transition ${activeTab === 'notes' ? 'border-gold-400 text-gold-300' : 'border-transparent text-zinc-400 hover:text-white'}`}
                >
                  Fragrance Pyramid
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-2.5 border-b-2 transition ${activeTab === 'description' ? 'border-gold-400 text-gold-300' : 'border-transparent text-zinc-400 hover:text-white'}`}
                >
                  The Inspiration
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-2.5 border-b-2 transition ${activeTab === 'shipping' ? 'border-gold-400 text-gold-300' : 'border-transparent text-zinc-400 hover:text-white'}`}
                >
                  Shipping & Exchange
                </button>
              </div>

              <div className="pt-4 text-xs leading-relaxed">
                {activeTab === 'notes' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
                      <span className="text-gold-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
                        🌿 TOP NOTES (First 15 to 30 mins)
                      </span>
                      <p className="text-zinc-200 text-sm font-serif">{product.topNotes || "Italian Bergamot, Cardamom, Crisp Apple"}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
                      <span className="text-gold-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
                        🌸 HEART / MIDDLE NOTES (2 to 6 hours)
                      </span>
                      <p className="text-zinc-200 text-sm font-serif">{product.heartNotes || "Tuscan Iris, White Jasmine, Pink Peppercorn"}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#141414] border border-[#242424]">
                      <span className="text-gold-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
                        🪵 BASE NOTES (Drydown 8+ hours)
                      </span>
                      <p className="text-zinc-200 text-sm font-serif">{product.baseNotes || "Smoked Golden Amber, Royal Sandalwood, Vetiver"}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'description' && (
                  <div className="space-y-3 text-zinc-300 leading-relaxed bg-[#141414] p-4 rounded-xl border border-[#242424]">
                    <p>{product.description || product.shortDesc}</p>
                    <p className="text-[11px] text-zinc-400">
                      Formulated with 35% pure oil concentration for extreme projection in humid Pakistani climates.
                    </p>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="space-y-2 text-zinc-300 bg-[#141414] p-4 rounded-xl border border-[#242424]">
                    <p>• <strong>Delivery Time:</strong> 2 - 3 working days for Lahore, Karachi, Islamabad/Rawalpindi; 3 - 4 days for other cities.</p>
                    <p>• <strong>Delivery Charges:</strong> Free delivery on orders over Rs. {settings?.freeDeliveryThreshold || 2500}. Flat Rs. {settings?.deliveryCharge || 200} on single bottles.</p>
                    <p>• <strong>Exchange Policy:</strong> 7 days hassle-free bottle exchange if you wish to try another fragrance.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Frequently Bought Together Bundle (Upsell) */}
            {bundlePair && (
              <div className="p-4 rounded-xl bg-[#15130d] border border-gold-500/30 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gold-400 uppercase tracking-wider">
                  <Gift size={15} />
                  <span>Frequently Bought Together (Save 15%)</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded bg-[#222]" />
                  <span className="text-zinc-400 font-bold">+</span>
                  <img src={bundlePair.image} alt={bundlePair.name} className="w-12 h-14 object-cover rounded bg-[#222]" />
                  <div className="flex-grow text-xs">
                    <p className="font-bold text-white leading-snug">{product.name} + {bundlePair.name}</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-bold text-gold-300">Rs. {bundleCombinedPrice.toLocaleString()}</span>
                      <span className="text-[10px] text-zinc-500 line-through">Rs. {(unitPrice + bundlePair.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddBundle}
                  className="w-full py-2.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition"
                >
                  Add Both to Cart & Save 15%
                </button>
              </div>
            )}

          </div>

        </div>

        {/* 3. DEDICATED CUSTOMER REVIEWS & "WRITE A REVIEW" SECTION */}
        <section className="mt-16 pt-12 border-t border-[#222]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-1">
                Verified Feedback
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Customer Reviews for {product.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
                <span>5.0 Rating based on {productReviews.length || 1} verified review(s)</span>
              </div>
            </div>

            <button
              onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
              className="px-5 py-2.5 rounded-full bg-gold-500/20 hover:bg-gold-500 hover:text-black border border-gold-500/50 text-gold-300 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus size={15} />
              <span>Write a Review</span>
            </button>
          </div>

          {/* Inline "Write a Review" Form */}
          {isReviewFormOpen && (
            <div className="mb-10 p-6 rounded-2xl bg-[#141414] border border-gold-500/40 max-w-2xl">
              {reviewSubmitted ? (
                <div className="p-6 text-center text-emerald-400 flex flex-col items-center gap-2">
                  <Check size={32} />
                  <h4 className="text-base font-bold">Review Submitted Successfully!</h4>
                  <p className="text-xs text-zinc-400">Your review will be saved and visible in the Admin Panel.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-white">Leave a Verified Review for {product.name}</h3>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Your Rating:</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className="p-1 text-amber-400"
                        >
                          <Star size={22} className={star <= reviewForm.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Asad Siddiqui"
                        value={reviewForm.author}
                        onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-zinc-300 mb-1">Your City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Karachi / Lahore / Islamabad"
                        value={reviewForm.city}
                        onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                        className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Headline (e.g. Lasts all day, loved the scent!)</label>
                    <input
                      type="text"
                      placeholder="Summary of your review"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Detailed Review *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your experience regarding projection, packaging, and compliments..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewFormOpen(false)}
                      className="px-4 py-2 rounded-lg bg-[#222] text-zinc-400 text-xs hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-lg bg-gold-500 text-black text-xs font-bold uppercase tracking-wider hover:bg-gold-400 transition"
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(productReviews.length > 0 ? productReviews : (reviews || []).slice(0, 3)).map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl bg-[#121212] border border-[#222] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-zinc-500">{rev.date || 'Recent'}</span>
                  </div>

                  {rev.title && (
                    <h4 className="font-serif text-sm font-bold text-white mb-1.5 leading-snug">
                      "{rev.title}"
                    </h4>
                  )}

                  <p className="text-xs text-zinc-300 font-light leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e1e1e] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">{rev.author}</span>
                    <span className="text-[10px] text-zinc-500">{rev.city || 'Pakistan'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. RELATED PRODUCTS SECTION */}
        <section className="mt-20 pt-12 border-t border-[#222]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-1">
                Curated Suggestions
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                You May Also Like
              </h2>
            </div>
            <button
              onClick={onBack}
              className="text-xs font-bold text-gold-400 hover:text-gold-300 transition"
            >
              Explore Full Catalogue →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectProduct(rel)}
                className="group bg-[#121212] border border-[#222] hover:border-gold-500/50 rounded-2xl overflow-hidden transition cursor-pointer flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#181818]">
                  <img 
                    src={rel.image} 
                    alt={rel.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {rel.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-black">
                      {rel.badge}
                    </span>
                  )}
                </div>

                <div className="p-3.5 flex flex-col justify-between flex-grow">
                  <div>
                    {rel.inspiredBy && (
                      <p className="text-[10px] text-gold-400 truncate">Inspired by {rel.inspiredBy}</p>
                    )}
                    <h4 className="font-serif text-sm font-bold text-white group-hover:text-gold-300 transition truncate mt-0.5">
                      {rel.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 truncate mt-1">{rel.topNotes || rel.shortDesc}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#222] flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Rs. {rel.price?.toLocaleString()}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart({ ...rel, selectedSize: '50ml Extrait Bottle', quantity: 1 });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-[10px] uppercase"
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 5. Sticky Mobile Bottom Floating Purchase Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#101010]/95 backdrop-blur-md border-t border-[#262626] p-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2 max-w-[50%]">
          <img src={activeImage || product.image} alt={product.name} className="w-10 h-10 object-cover rounded bg-[#222]" />
          <div className="truncate">
            <p className="font-bold text-xs text-white truncate">{product.name}</p>
            <p className="text-xs font-extrabold gold-gradient-text">Rs. {unitPrice.toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={handleBuyNow}
          className="flex-grow py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-400 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow"
        >
          BUY NOW (COD)
        </button>
      </div>

    </div>
  );
}
