import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, MessageSquare, Plus, Check } from 'lucide-react';

export default function CustomerReviews({ reviews, onAddReview }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    city: 'Lahore',
    rating: 5,
    title: '',
    comment: ''
  });
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <section className="py-16 bg-[#0f0f0f] border-t border-[#222]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-[#242424] gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold-400 font-bold mb-1">
              <ShieldCheck size={16} />
              <span>Verified Customer Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Loved by Fragrance Enthusiasts Across Pakistan
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-1 justify-end text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">Based on 250+ Verified Buyers</p>
            </div>

            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-5 py-2.5 rounded-full bg-gold-500/15 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
            >
              <Plus size={15} />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Write Review Drawer/Form */}
        {isFormOpen && (
          <div className="mb-10 p-6 rounded-2xl bg-[#161616] border border-gold-500/30 max-w-2xl mx-auto">
            {submitted ? (
              <div className="p-6 text-center text-emerald-400 flex flex-col items-center gap-2">
                <Check size={32} />
                <h4 className="text-base font-bold">Thank you for your feedback!</h4>
                <p className="text-xs text-zinc-400">Your review has been published.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-white">Share Your Fragrance Experience</h3>

                {/* Rating selection */}
                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Your Rating:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className="p-1 text-amber-400"
                      >
                        <Star size={22} className={star <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'} />
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
                      placeholder="e.g. Usman Malik"
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-300 mb-1">Your City</label>
                    <input
                      type="text"
                      placeholder="e.g. Karachi / Islamabad"
                      value={newReview.city}
                      onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-zinc-300 mb-1">Review Headline</label>
                  <input
                    type="text"
                    placeholder="e.g. Beast projection, easily 14 hours!"
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
                    placeholder="Tell other fragrance lovers about the sillage, lasting, and bottle packaging..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full bg-[#1e1e1e] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
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

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(reviews || []).slice(0, 6).map((rev) => (
            <div 
              key={rev.id} 
              className="p-5 rounded-xl bg-[#141414] border border-[#222] hover:border-gold-500/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-500">{rev.date || 'Recent'}</span>
                </div>

                {rev.title && (
                  <h4 className="text-sm font-bold text-white font-serif mb-1.5 leading-snug">
                    "{rev.title}"
                  </h4>
                )}

                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                  {rev.comment}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">{rev.author}</span>
                  <span className="text-[10px] text-zinc-500">{rev.city || 'Pakistan'}</span>
                </div>

                {rev.verified && (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                    <ShieldCheck size={12} />
                    <span>Verified Buyer</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
