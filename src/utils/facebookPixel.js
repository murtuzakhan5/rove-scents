// ========================================================
// ROVE SCENTS — Official Meta (Facebook) Pixel Integration
// Optimized for Facebook & Instagram Purchase & Ads Tracking
// ========================================================

let isInitialized = false;
let currentPixelId = null;

/**
 * Initialize Meta Pixel dynamically from Store Settings
 * @param {string} pixelId 15-16 digit Meta Pixel ID
 */
export function initFacebookPixel(pixelId) {
  if (!pixelId || typeof pixelId !== 'string') return;
  const cleanId = pixelId.trim();
  if (!cleanId || (isInitialized && currentPixelId === cleanId)) return;

  currentPixelId = cleanId;

  // Standard Meta Pixel Base Code
  /* eslint-disable */
  if (!window.fbq) {
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  }
  /* eslint-enable */

  try {
    window.fbq('init', cleanId);
    window.fbq('track', 'PageView');
    isInitialized = true;
    console.log(`🎯 Meta (Facebook) Pixel initialized with ID: ${cleanId}`);
  } catch (err) {
    console.warn('Meta Pixel init error:', err);
  }
}

/**
 * Track PageView
 */
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

/**
 * Track ViewContent when customer opens a product detail page
 */
export function trackViewContent(product) {
  if (!product || typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq('track', 'ViewContent', {
      content_name: product.name,
      content_category: product.category,
      content_ids: [product.id],
      content_type: 'product',
      value: Number(product.price) || 0,
      currency: 'PKR'
    });
  } catch (e) {}
}

/**
 * Track AddToCart when customer adds perfume to cart
 */
export function trackAddToCart(item) {
  if (!item || typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq('track', 'AddToCart', {
      content_name: item.name,
      content_ids: [item.id || item.productId],
      content_type: 'product',
      value: Number(item.price) || 0,
      currency: 'PKR'
    });
  } catch (e) {}
}

/**
 * Track InitiateCheckout when customer opens the checkout modal
 */
export function trackInitiateCheckout(cartItems = [], grandTotal = 0) {
  if (typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq('track', 'InitiateCheckout', {
      num_items: cartItems.length,
      value: Number(grandTotal) || 0,
      currency: 'PKR',
      content_ids: cartItems.map(i => i.id || i.productId)
    });
  } catch (e) {}
}

/**
 * Track Purchase — The most critical event for Meta Ads ROAS!
 */
export function trackPurchase(order, cartItems = [], grandTotal = 0) {
  if (!order || typeof window === 'undefined' || !window.fbq) return;
  try {
    window.fbq('track', 'Purchase', {
      value: Number(grandTotal || order.total) || 0,
      currency: 'PKR',
      content_type: 'product',
      contents: (cartItems || []).map(item => ({
        id: item.id || item.productId,
        quantity: item.quantity || 1,
        item_price: Number(item.price) || 0
      })),
      order_id: order.id
    });
    console.log(`🎯 Meta Pixel: Purchase event tracked for Order ${order.id} (Rs. ${grandTotal || order.total})`);
  } catch (e) {
    console.warn('Meta Pixel purchase track error:', e);
  }
}
