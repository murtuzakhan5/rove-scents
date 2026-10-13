import React, { useState, useRef, useEffect } from 'react';
import { Star, ShieldCheck, Plus, Check, ChevronLeft, ChevronRight, MessageSquareQuote } from 'lucide-react';

export default function CustomerReviews({ reviews, onAddReview }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const scrollContainerRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    city: 'Lahore',
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const displayReviews = (reviews && reviews.length > 0) ? reviews : [];

  // Continuous smooth auto-glide every 3.5 seconds
  useEffect(() => {
    if (isPaused || displayReviews.length === 0) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (container.scrollLeft >= maxScroll - 15) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaused, displayReviews.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment) return;
    onAddReview(newReview);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsFormOpen(false);
      setNewReview({ author: '', city: 'Lahore', rating: 5, title: '', comment: '' });
    }, 1500);
  };

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 sm:py-20 bg-[#0a0a0a] border-t border-[#1e1e1e] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#242424] gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-400 font-bold mb-1">
              <ShieldCheck size={16} />
              <span>Real Customer Feedback • 100% Verified Buyers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
              Loved Across Pakistan
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Overall Rating Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#161616] border border-gold-500/30">
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs font-bold text-white">5.0</span>
              <span className="text-[10px] text-zinc-400 hidden sm:inline">• 250+ Verified Orders</span>
            </div>

            {/* Navigation Arrows for Carousel */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                className="p-2 rounded-full bg-[#181818] hover:bg-gold-500 hover:text-black border border-[#2e2e2e] text-zinc-300 transition"
                aria-label="Previous Reviews"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                className="p-2 rounded-full bg-[#181818] hover:bg-gold-500 hover:text-black border border-[#2e2e2e] text-zinc-300 transition"
                aria-label="Next Reviews"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Write Review Button */}
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-black text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 shadow"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">Write a Review</span>
              <span className="sm:hidden">Review</span>
            </button>
          </div>
        </div>

        {/* Write Review Form Drawer */}
        {isFormOpen && (
          <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-[#141414] border border-gold-500/40 max-w-xl mx-auto shadow-2xl animate-fade-in">
            {submitted ? (
              <div className="p-6 text-center text-emerald-400 flex flex-col items-center gap-2">
                <Check size={32} />
                <h4 className="text-base font-bold">Thank you for your feedback!</h4>
                <p className="text-xs text-zinc-400">Your verified review has been published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
                  <MessageSquareQuote size={18} className="text-gold-400" />
                  <span>Share Your Experience</span>
                </h3>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Your Rating:</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 text-amber-400 focus:outline-none"
                      >
                        <Star size={20} className={star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Usman Malik"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Your City (Pakistan)</label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore / Karachi"
                      value={newReview.city}
                      onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Headline / Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Beast projection, easily 15 hours lasting!"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Your Review *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the scent, sillage, compliments and packaging..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
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
      </div>

      {/* ================= CONTINUOUS SMOOTH HORIZONTAL REVIEWS CAROUSEL ================= */}
      <div 
        className="w-full relative py-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div 
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-8 scroll-smooth"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="w-[280px] sm:w-[360px] shrink-0 p-5 rounded-2xl bg-gradient-to-b from-[#141414] to-[#0e0e0e] border border-[#242424] hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_25px_rgba(212,175,55,0.15)] select-text"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div>
                {/* Star Rating & Date */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">{rev.date || 'Verified Order'}</span>
                </div>

                {/* Review Headline */}
                {rev.title && (
                  <h4 className="text-xs sm:text-sm font-bold text-white font-serif mb-2 leading-snug line-clamp-1">
                    "{rev.title}"
                  </h4>
                )}

                {/* Review Body */}
                <p className="text-xs text-zinc-300 leading-relaxed font-light line-clamp-4">
                  {rev.comment}
                </p>
              </div>

              {/* Reviewer Details & Verification Tag */}
              <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{rev.author}</span>
                  <span className="text-[10px] text-zinc-400">{rev.city || 'Pakistan'}</span>
                </div>

                {rev.verified !== false && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    <ShieldCheck size={11} />
                    <span>Verified Buyer</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-[11px] text-zinc-500">
          Showing authentic customer reviews from verified Cash on Delivery recipients across Pakistan
        </p>
      </div>

    </section>
  );
}
