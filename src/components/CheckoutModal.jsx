import React, { useState } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, Tag, ArrowRight, MessageCircle, AlertCircle, Copy, Check } from 'lucide-react';

const PAKISTAN_CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan',
  'Peshawar', 'Sialkot', 'Gujranwala', 'Quetta', 'Hyderabad', 'Abbottabad',
  'Bahawalpur', 'Sargodha', 'Sahiwal', 'Gujrat', 'Mardan', 'Kasur', 'Rahim Yar Khan', 'Other City'
];

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
  settings
}) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    city: 'Lahore',
    otherCity: '',
    address: '',
    notes: '',
    paymentMethod: 'COD' // COD or Bank
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copiedBank, setCopiedBank] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeThreshold = settings?.freeDeliveryThreshold || 2500;
  const deliveryCharge = subtotal >= freeThreshold ? 0 : (settings?.deliveryCharge || 200);
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

  // Validate coupon via backend
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal })
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedCoupon(data);
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid or expired coupon code');
        setAppliedCoupon(null);
      }
    } catch (err) {
      setCouponError('Network error verifying coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  // Submit order to API
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setFormError('Please enter a valid Pakistani mobile number (e.g. 03001234567)');
      return;
    }
    if (!formData.address.trim()) {
      setFormError('Please provide your complete delivery street address');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const finalCity = formData.city === 'Other City' ? formData.otherCity || 'Pakistan' : formData.city;

    const orderPayload = {
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      city: finalCity,
      address: formData.address,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
      items: cartItems.map(item => ({
        productId: item.id,
        name: item.name,
        size: item.selectedSize || '50ml Extrait',
        price: item.price,
        quantity: item.quantity
      })),
      subtotal,
      discount: discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : '',
      deliveryCharge,
      total: grandTotal
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const createdOrder = await res.json();
      if (res.ok) {
        setCompletedOrder(createdOrder);
        onOrderSuccess(createdOrder);
      } else {
        setFormError(createdOrder.error || 'Failed to place order. Please try again.');
      }
    } catch (err) {
      setFormError('Server connection error. Please contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBankInfo = () => {
    if (settings?.bankDetails) {
      navigator.clipboard.writeText(settings.bankDetails);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-[#131313] border border-gold-500/40 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#1e1e1e] text-zinc-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {completedOrder ? (
          /* ================= ORDER SUCCESS SCREEN ================= */
          <div className="p-6 sm:p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={44} />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-1">
                Order Placed Successfully!
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Thank You, {completedOrder.customerName}!
              </h2>
              <p className="text-sm text-zinc-300 mt-2 max-w-md mx-auto">
                Your order ID is <span className="font-mono font-bold text-gold-300 px-2 py-0.5 rounded bg-[#1e1e1e] border border-gold-500/30">{completedOrder.id}</span>. We will call you for courier dispatch verification.
              </p>
            </div>

            {/* Order Summary Receipt Box */}
            <div className="max-w-md mx-auto bg-[#181818] p-5 rounded-xl border border-[#2a2a2a] text-left text-xs space-y-3">
              <div className="flex justify-between border-b border-[#252525] pb-2 font-semibold">
                <span className="text-zinc-400">Delivery Address:</span>
                <span className="text-white text-right">{completedOrder.address}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between border-b border-[#252525] pb-2 font-semibold">
                <span className="text-zinc-400">Payment Mode:</span>
                <span className="text-gold-300">{completedOrder.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Direct Bank Transfer'}</span>
              </div>
              <div className="flex justify-between border-b border-[#252525] pb-2 font-semibold">
                <span className="text-zinc-400">Total Payable:</span>
                <span className="text-base font-bold text-white">Rs. {completedOrder.total.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-zinc-400 pt-1">
                Ordered: {completedOrder.items.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', ')}
              </div>
            </div>

            {/* WhatsApp Confirmation CTA */}
            <div className="max-w-md mx-auto space-y-3">
              <a
                href={`https://wa.me/${settings?.whatsappNumber || '923001234567'}?text=Assalam-o-Alaikum%20ROVE%20Scents!%20I%20have%20placed%20Order%20*${completedOrder.id}*%20under%20the%20name%20*${encodeURIComponent(completedOrder.customerName)}*%20for%20Rs.%20${completedOrder.total}.%20Please%20dispatch%20my%20order!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              >
                <MessageCircle size={18} />
                <span>Confirm Order on WhatsApp for Faster Dispatch</span>
              </a>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 rounded-xl bg-[#222] hover:bg-[#2c2c2c] text-zinc-300 text-xs font-semibold tracking-wider transition"
              >
                Back to Store
              </button>
            </div>
          </div>
        ) : (
          /* ================= CHECKOUT FORM ================= */
          <div className="p-6 sm:p-8">
            <div className="border-b border-[#242424] pb-4 mb-6">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-bold block mb-1">
                Fast & Secure Checkout
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Delivery & Payment Details
              </h2>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Customer & Shipping Inputs */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="e.g. Ali Ahmed"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="03001234567"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition"
                    />
                  </div>
                </div>

                {/* City Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition"
                    >
                      {PAKISTAN_CITIES.map(c => (
                        <option key={c} value={c} className="bg-[#181818] text-white">{c}</option>
                      ))}
                    </select>
                  </div>
                  {formData.city === 'Other City' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                        Specify Your City *
                      </label>
                      <input
                        type="text"
                        name="otherCity"
                        placeholder="Enter City Name"
                        value={formData.otherCity}
                        onChange={handleInputChange}
                        className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition"
                      />
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                    Delivery Address *
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    required
                    placeholder="House / Apartment #, Street #, Sector / Area / Landmark"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-gold-500 transition resize-none"
                  />
                </div>

                {/* Special Delivery Notes */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Special Instructions (Optional):
                  </label>
                  <input
                    type="text"
                    name="notes"
                    placeholder="e.g. Call before delivery, gift wrap, leave with gatekeeper"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full bg-[#181818] border border-[#2b2b2b] rounded-lg px-3.5 py-2 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                    Payment Method:
                  </label>
                  <div className="space-y-2">
                    <label 
                      onClick={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                        formData.paymentMethod === 'COD'
                          ? 'bg-gold-500/10 border-gold-400 text-white'
                          : 'bg-[#181818] border-[#2b2b2b] text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="COD"
                          checked={formData.paymentMethod === 'COD'}
                          onChange={handleInputChange}
                          className="accent-gold-500"
                        />
                        <div>
                          <span className="text-xs font-bold block text-white">Cash on Delivery (COD)</span>
                          <span className="text-[10px] text-zinc-400">Pay cash to rider when package arrives</span>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-600/30 font-semibold">
                        Recommended
                      </span>
                    </label>

                    <label 
                      onClick={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer' })}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        formData.paymentMethod === 'Bank Transfer'
                          ? 'bg-gold-500/10 border-gold-400 text-white'
                          : 'bg-[#181818] border-[#2b2b2b] text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Bank Transfer"
                        checked={formData.paymentMethod === 'Bank Transfer'}
                        onChange={handleInputChange}
                        className="accent-gold-500 mt-1"
                      />
                      <div className="flex-grow">
                        <span className="text-xs font-bold block text-white">Direct Bank / Raast / Sadapay</span>
                        <span className="text-[10px] text-zinc-400 block mb-2">Transfer directly to our account</span>
                        
                        {formData.paymentMethod === 'Bank Transfer' && (
                          <div className="mt-2 p-2.5 rounded bg-[#101010] border border-[#262626] text-[11px] font-mono text-zinc-300">
                            <pre className="whitespace-pre-wrap">{settings?.bankDetails || "Bank: Meezan Bank Ltd\nAccount: 01020304050607\nTitle: ROVE SCENTS\nRaast: 03001234567"}</pre>
                            <button
                              type="button"
                              onClick={copyBankInfo}
                              className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-[#222] hover:bg-[#333] text-[10px] text-gold-300 font-sans"
                            >
                              {copiedBank ? <Check size={11} /> : <Copy size={11} />}
                              <span>{copiedBank ? 'Copied Details!' : 'Copy Bank Details'}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Order Summary & Coupon */}
              <div className="md:col-span-5 bg-[#171717] p-4 sm:p-5 rounded-xl border border-[#252525] flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gold-400 border-b border-[#252525] pb-2 mb-3">
                    Order Summary ({cartItems.length} items)
                  </h4>

                  {/* Items mini list */}
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1 divide-y divide-[#222]">
                    {cartItems.map((item, idx) => (
                      <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 max-w-[70%]">
                          <img src={item.image} alt={item.name} className="w-9 h-10 object-cover rounded bg-[#222]" />
                          <div className="truncate">
                            <p className="font-semibold text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-zinc-400">{item.selectedSize} × {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-white">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Code Input */}
                  <div className="mt-4 pt-3 border-t border-[#252525]">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Promo Code (e.g. ROVE10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full bg-[#121212] border border-[#333] rounded-lg px-3 py-1.5 text-xs text-white uppercase placeholder:normal-case focus:outline-none focus:border-gold-500"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode}
                        className="px-3.5 py-1.5 bg-gold-500/20 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 text-xs font-bold rounded-lg transition disabled:opacity-50"
                      >
                        {isApplyingCoupon ? '...' : 'Apply'}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-[10px] text-red-400 mt-1">{couponError}</p>
                    )}

                    {appliedCoupon && (
                      <div className="mt-2 flex items-center justify-between p-2 rounded bg-gold-950/40 border border-gold-500/30 text-xs text-gold-300">
                        <span className="flex items-center gap-1 font-bold">
                          <Tag size={12} />
                          {appliedCoupon.code} Applied!
                        </span>
                        <span>-Rs. {appliedCoupon.discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="mt-4 pt-3 border-t border-[#252525] space-y-1.5 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal:</span>
                      <span className="text-white">Rs. {subtotal.toLocaleString()}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-gold-400 font-semibold">
                        <span>Discount:</span>
                        <span>-Rs. {discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-zinc-400">
                      <span>Shipping Fee:</span>
                      <span className={deliveryCharge === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                        {deliveryCharge === 0 ? 'FREE DELIVERY' : `Rs. ${deliveryCharge}`}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm pt-2 border-t border-[#2a2a2a] font-bold">
                      <span className="text-white">Total Amount:</span>
                      <span className="gold-gradient-text text-lg">Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Submit Order CTA */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-400 via-gold-500 to-amber-600 hover:brightness-110 text-black font-extrabold text-xs uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <span>CONFIRM ORDER (Rs. {grandTotal.toLocaleString()})</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-zinc-400 text-center mt-2">
                    🔒 Cash on Delivery nationwide • Free delivery on orders above Rs. {freeThreshold.toLocaleString()}
                  </p>
                </div>

              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
