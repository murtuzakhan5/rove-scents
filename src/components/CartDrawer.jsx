import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutClick,
  settings
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeThreshold = settings?.freeDeliveryThreshold || 2500;
  const isFreeDelivery = subtotal >= freeThreshold;
  const amountNeeded = Math.max(0, freeThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-[#242424] text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-gold-400" />
              <h3 className="font-serif text-lg font-bold tracking-wide">Your Shopping Bag</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-bold">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-[#222] transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#181818] px-5 py-3 border-b border-[#222]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              {isFreeDelivery ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  🎉 You have unlocked <strong>FREE Delivery Nationwide</strong>!
                </span>
              ) : (
                <span className="text-zinc-300">
                  Add <strong className="text-gold-300 font-bold">Rs. {amountNeeded.toLocaleString()}</strong> more for <strong>FREE Delivery</strong>
                </span>
              )}
              <span className="text-gold-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#2a2a2a] h-2 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gold-500 to-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-grow overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-[#222]">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
                <div className="w-16 h-16 rounded-full bg-[#1a1a1a] flex items-center justify-center text-zinc-600 mb-4">
                  <ShoppingBag size={30} />
                </div>
                <h4 className="text-base font-bold text-white mb-1">Your bag is empty</h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Discover our signature French Extrait impressions and enjoy long-lasting luxury.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-gold-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={`${item.id}-${item.selectedSize || index}`} className="pt-4 first:pt-0 flex gap-4">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-[#181818] border border-[#262626] shrink-0">
                    <img 
                      src={item.image || '/images/bottle-rukh.jpg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.target.src !== '/images/bottle-rukh.jpg') {
                          e.target.src = '/images/bottle-rukh.jpg';
                        }
                      }}
                    />
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-white leading-snug font-serif">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => onRemoveItem(item.id, item.selectedSize)}
                          className="text-zinc-500 hover:text-red-400 transition"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="text-[11px] text-gold-400 mt-0.5">
                        {item.selectedSize || '50ml Extrait'}
                      </div>

                      <div className="text-xs font-bold text-white mt-1">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-zinc-500 font-normal ml-1">
                            (Rs. {item.price.toLocaleString()} each)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#333] rounded-md bg-[#181818]">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-white min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#222] bg-[#141414] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estimated Delivery:</span>
                  <span className={isFreeDelivery ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                    {isFreeDelivery ? 'FREE' : `Rs. ${settings?.deliveryCharge || 200}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-[#262626]">
                  <span className="font-bold text-white">Estimated Total:</span>
                  <span className="font-extrabold gold-gradient-text text-base">
                    Rs. {(subtotal + (isFreeDelivery ? 0 : (settings?.deliveryCharge || 200))).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckoutClick();
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-95"
              >
                <span>PROCEED TO CHECKOUT (COD)</span>
                <ArrowRight size={16} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
                <ShieldCheck size={13} className="text-gold-400" />
                <span>Cash on Delivery Available • No Advance Payment Required</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
