import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Tag, 
  Settings, 
  Star, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Upload, 
  Check, 
  Search, 
  Printer, 
  MessageCircle, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  X,
  AlertCircle,
  LogOut,
  KeyRound,
  Sliders,
  Image as ImageIcon,
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard({
  onClose,
  products,
  orders,
  coupons,
  reviews,
  settings,
  categories,
  banners,
  dbStatus,
  onRefreshData,
  onOpenInvoice,
  onProductSaved,
  onProductDeleted,
  onCategoriesUpdated,
  onBannersUpdated
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, categories, banners, orders, coupons, settings, reviews

  // Product Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'men',
    gender: 'Men',
    inspiredBy: '',
    price: 2450,
    comparePrice: 3500,
    stock: 50,
    featured: true,
    badge: 'BEST SELLER',
    bottleSize: '50ml Extrait De Parfum',
    image: '',
    galleryImages: [],
    shortDesc: '',
    description: '',
    topNotes: '',
    heartNotes: '',
    baseNotes: '',
    longevity: '14+ Hours',
    sillage: 'Strong',
    season: 'All Season'
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Category Editor State
  const [categoriesList, setCategoriesList] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem('rove_custom_categories') || '[]');
      if (Array.isArray(local) && local.length > 0) return local;
    } catch (e) {}
    return categories || [];
  });

  // Keep categoriesList synced directly with categories prop
  React.useEffect(() => {
    if (categories && Array.isArray(categories) && categories.length > 0) {
      setCategoriesList(categories);
    }
  }, [categories]);

  const [newCategory, setNewCategory] = useState({ id: '', name: '', image: '/images/cat-all.jpg' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategories, setSavingCategories] = useState(false);

  // Hero Banners State
  const defaultInitialBanners = [
    {
      id: 'slide-rukh',
      productId: 'prod-rukh',
      isCollection: false,
      tag: 'HAUTE PARFUMERIE • 2026 FLAGSHIP RELEASE',
      badge: 'TOP SELLER',
      title: 'ROVE RUKH',
      arabic: 'رُخ',
      genre: 'EAU DE PARFUM FOR MEN • 50 ML',
      subtitle: 'The pinnacle of masculine refinement. Captured amid imperial dark stone and golden water reflections, blending Italian Bergamot, Tuscan Iris, and Smoked Golden Amber.',
      price: 2650,
      comparePrice: 3950,
      bannerImage: '/images/rove-rukh-banner.jpg',
      bottleImage: '/images/bottle-rukh.jpg',
      btnText: 'BUY NOW (COD) — RS. 2,650',
      order: 1,
      isActive: true
    },
    {
      id: 'slide-raaz',
      productId: 'prod-raaz',
      isCollection: false,
      tag: 'DARK GOLD LUXURY • WOMAN SIGNATURE',
      badge: 'MYSTERIOUS SEDUCTION',
      title: 'ROVE RAAZ',
      arabic: 'راز',
      genre: 'EAU DE PARFUM FOR WOMEN • 50 ML',
      subtitle: 'An enigmatic elixir of dark marble elegance. Radiant white blossoms and golden honeyed nectar dissolving into creamy cashmere and smoky black vanilla.',
      price: 2650,
      comparePrice: 3950,
      bannerImage: '/images/rove-raaz-banner.jpg',
      bottleImage: '/images/bottle-raaz.jpg',
      btnText: 'BUY NOW (COD) — RS. 2,650',
      order: 2,
      isActive: true
    },
    {
      id: 'slide-afsana',
      productId: 'prod-afsana',
      isCollection: false,
      tag: 'GOLDEN HOUR FLORAL POETRY',
      badge: 'ROMANTIC ESSENCE',
      title: 'ROVE AFSANA',
      arabic: 'افسانہ',
      genre: 'EAU DE PARFUM FOR WOMEN • 50 ML',
      subtitle: 'A tale of irresistible beauty. Sun-ripened golden peaches, wild forest berries, and Damask pink roses suspended in golden sunset amber.',
      price: 2650,
      comparePrice: 3950,
      bannerImage: '/images/rove-afsana-banner.jpg',
      bottleImage: '/images/bottle-afsana.jpg',
      btnText: 'BUY NOW (COD) — RS. 2,650',
      order: 3,
      isActive: true
    },
    {
      id: 'slide-all-collection',
      productId: null,
      isCollection: true,
      tag: 'THE SIGNATURE ANTHOLOGY • 4 MASTERPIECES',
      badge: 'A FRAGRANCE FOR EVERY STORY',
      title: 'ROVE SCENTS',
      arabic: 'مجموعہ',
      genre: 'NAZ • AFSANA • RAAZ • RUKH',
      subtitle: 'From golden sunsets to mysterious midnight whispers. Discover the complete luxury collection crafted with 35% pure French fragrance oils for 16+ hours of prestige.',
      price: 2490,
      comparePrice: 3800,
      bannerImage: '/images/rove-all-collection-banner.jpg',
      bottleImage: '/images/bottle-rukh.jpg',
      btnText: 'SHOP ALL PRODUCTS',
      order: 4,
      isActive: true
    }
  ];

  const [bannersList, setBannersList] = useState(() => {
    if (banners && Array.isArray(banners) && banners.length > 0) return banners;
    try {
      const local = JSON.parse(localStorage.getItem('rove_custom_banners') || '[]');
      if (Array.isArray(local) && local.length > 0) return local;
    } catch (e) {}
    return defaultInitialBanners;
  });

  React.useEffect(() => {
    if (banners && Array.isArray(banners) && banners.length > 0) {
      setBannersList(banners);
    }
  }, [banners]);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isMongoModalOpen, setIsMongoModalOpen] = useState(false);
  const [uploadingBannerImage, setUploadingBannerImage] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);

  const [bannerForm, setBannerForm] = useState({
    id: '',
    title: '',
    arabic: '',
    genre: '',
    tag: '',
    badge: 'NEW ARRIVAL',
    subtitle: '',
    price: 2650,
    comparePrice: 3950,
    bannerImage: '/images/rove-rukh-banner.jpg',
    bottleImage: '',
    btnText: 'BUY NOW (COD)',
    productId: '',
    isCollection: false,
    btnLink: '',
    accentGlow: 'rgba(212, 175, 55, 0.35)',
    order: 1,
    isActive: true
  });

  const openAddBannerModal = () => {
    setEditingBanner(null);
    setBannerForm({
      id: '',
      title: '',
      arabic: '',
      genre: 'EAU DE PARFUM • 50 ML',
      tag: 'HAUTE PARFUMERIE COLLECTION',
      badge: 'TOP SELLER',
      subtitle: '',
      price: 2650,
      comparePrice: 3950,
      bannerImage: '/images/rove-rukh-banner.jpg',
      bottleImage: '/images/bottle-rukh.jpg',
      btnText: 'BUY NOW (COD)',
      productId: (products && products[0]?.id) || '',
      isCollection: false,
      btnLink: '',
      accentGlow: 'rgba(212, 175, 55, 0.35)',
      order: (bannersList?.length || 0) + 1,
      isActive: true
    });
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      id: banner.id || '',
      title: banner.title || '',
      arabic: banner.arabic || '',
      genre: banner.genre || '',
      tag: banner.tag || '',
      badge: banner.badge || '',
      subtitle: banner.subtitle || '',
      price: banner.price || 2650,
      comparePrice: banner.comparePrice || 3950,
      bannerImage: banner.bannerImage || '',
      bottleImage: banner.bottleImage || '',
      btnText: banner.btnText || 'BUY NOW (COD)',
      productId: banner.productId || '',
      isCollection: banner.isCollection || false,
      btnLink: banner.btnLink || '',
      accentGlow: banner.accentGlow || 'rgba(212, 175, 55, 0.35)',
      order: banner.order || 1,
      isActive: banner.isActive !== false
    });
    setIsBannerModalOpen(true);
  };

  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBannerImage(true);
    try {
      const dataUrl = await fileToDataUrl(file, 1600, 900, 0.8);
      if (dataUrl) {
        setBannerForm(prev => ({ ...prev, bannerImage: dataUrl }));
      }
    } catch (err) {
      console.error('Banner image upload error:', err);
    } finally {
      setUploadingBannerImage(false);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    setSavingBanner(true);
    const updatedBanner = editingBanner
      ? { ...editingBanner, ...bannerForm }
      : {
          id: bannerForm.id || ('slide-' + Date.now()),
          ...bannerForm
        };

    const nextList = editingBanner
      ? bannersList.map(b => b.id === updatedBanner.id ? updatedBanner : b)
      : [...bannersList, updatedBanner];

    setBannersList(nextList);
    try {
      localStorage.setItem('rove_custom_banners', JSON.stringify(nextList));
    } catch (err) {}

    if (onBannersUpdated) onBannersUpdated(nextList);
    setIsBannerModalOpen(false);

    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBanner)
      });
    } catch (err) {
      console.warn('API banner sync warning:', err);
    } finally {
      setSavingBanner(false);
    }
  };

  const handleDeleteBanner = async (id, title) => {
    if (!window.confirm(`Delete banner "${title}"?`)) return;
    const nextList = bannersList.filter(b => b.id !== id);
    setBannersList(nextList);
    try {
      localStorage.setItem('rove_custom_banners', JSON.stringify(nextList));
    } catch (err) {}
    if (onBannersUpdated) onBannersUpdated(nextList);

    try {
      await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    } catch (err) {}
  };

  const handleToggleBannerStatus = async (banner) => {
    const updated = { ...banner, isActive: !banner.isActive };
    const nextList = bannersList.map(b => b.id === banner.id ? updated : b);
    setBannersList(nextList);
    try {
      localStorage.setItem('rove_custom_banners', JSON.stringify(nextList));
    } catch (err) {}
    if (onBannersUpdated) onBannersUpdated(nextList);

    try {
      await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {}
  };

  // Orders Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Coupon Form State
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountType: 'percentage',
    value: 10,
    minOrder: 2000,
    description: ''
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({ ...(settings || {}) });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Admin Password Change State
  const [passwordChange, setPasswordChange] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordChangeMsg, setPasswordChangeMsg] = useState({ type: '', text: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Stats
  const totalSales = (orders || []).reduce((acc, o) => acc + (o.total || 0), 0);
  const totalOrdersCount = (orders || []).length;
  const pendingOrdersCount = (orders || []).filter(o => o.status === 'Pending').length;
  const confirmedOrdersCount = (orders || []).filter(o => o.status === 'Confirmed' || o.status === 'Shipped').length;

  // Compress and read image file to high-efficiency Base64 Data URL (30-50KB)
  const fileToDataUrl = (file, maxWidth = 800, maxHeight = 800, quality = 0.75) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // Safe file uploader: generates ultra-compact Data URL that works everywhere without 404s or storage limits
  const uploadOrFallback = async (file) => {
    try {
      const dataUrl = await fileToDataUrl(file, 800, 800, 0.75);
      if (dataUrl) return dataUrl;
    } catch (err) {
      console.warn('Image compression fallback error:', err);
    }
    return '';
  };

  // Handle password update
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordChange.newPassword !== passwordChange.confirmPassword) {
      setPasswordChangeMsg({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordChange.newPassword.length < 6) {
      setPasswordChangeMsg({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    setUpdatingPassword(true);
    setPasswordChangeMsg({ type: '', text: '' });
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordChange.currentPassword,
          newPassword: passwordChange.newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordChangeMsg({ type: 'success', text: 'Admin password updated successfully!' });
        setPasswordChange({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPasswordChangeMsg({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (err) {
      setPasswordChangeMsg({ type: 'error', text: 'Server connection error' });
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Handle Image File Upload to Express with zero-fail fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadOrFallback(file);
      if (url) {
        setProductForm(prev => ({ ...prev, image: url }));
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Multi-file Gallery Upload with zero-fail fallback
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(f => uploadOrFallback(f)));
      const validUrls = urls.filter(Boolean);
      if (validUrls.length > 0) {
        setProductForm(prev => ({
          ...prev,
          galleryImages: [...(prev.galleryImages || []), ...validUrls]
        }));
      }
    } catch (err) {
      console.error('Gallery upload error:', err);
    } finally {
      setUploadingGallery(false);
    }
  };

  // Save Categories to backend
  const handleSaveCategories = async (updatedList) => {
    setSavingCategories(true);
    setCategoriesList(updatedList);
    try {
      localStorage.setItem('rove_custom_categories', JSON.stringify(updatedList));
      if (onCategoriesUpdated) {
        onCategoriesUpdated(updatedList);
      }
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList)
      });
    } catch (err) {
      console.warn('Saved categories error:', err);
    } finally {
      setCategoriesList(updatedList);
      if (onCategoriesUpdated) {
        onCategoriesUpdated(updatedList);
      }
      onRefreshData();
      setSavingCategories(false);
    }
  };

  // Open Edit Product Modal
  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({ 
      ...prod,
      galleryImages: Array.isArray(prod.galleryImages) ? prod.galleryImages : [prod.image]
    });
    setIsProductModalOpen(true);
  };

  // Open Add Product Modal
  const openAddModal = (presetCategory = null) => {
    setEditingProduct(null);
    const availableCats = (categoriesList && categoriesList.length > 0)
      ? categoriesList
      : ((categories && categories.length > 0) ? categories : []);
    const defaultCat = presetCategory || (availableCats.find(c => c.id !== 'all')?.id) || 'men';
    setProductForm({
      name: '',
      category: defaultCat,
      gender: 'Men',
      inspiredBy: '',
      price: 2450,
      comparePrice: 3500,
      stock: 50,
      featured: true,
      badge: 'NEW ARRIVAL',
      bottleSize: '50ml Extrait De Parfum',
      image: '/images/bottle-rukh.jpg',
      galleryImages: ['/images/bottle-rukh.jpg'],
      shortDesc: '',
      description: '',
      topNotes: '',
      heartNotes: '',
      baseNotes: '',
      longevity: '14+ Hours',
      sillage: 'Heavy & Magnetic',
      season: 'All Season'
    });
    setIsProductModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    
    const updatedProd = editingProduct 
      ? { ...editingProduct, ...productForm } 
      : { 
          id: 'prod-' + Date.now(), 
          slug: (productForm.name || 'perfume').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          rating: 5.0,
          reviewsCount: 1,
          ...productForm 
        };

    // 1. Instantly dual-write to localStorage for permanent Vercel persistence
    try {
      const localProds = JSON.parse(localStorage.getItem('rove_custom_products') || '[]');
      const idx = localProds.findIndex(p => p.id === updatedProd.id);
      if (idx > -1) {
        localProds[idx] = updatedProd;
      } else {
        localProds.unshift(updatedProd);
      }
      localStorage.setItem('rove_custom_products', JSON.stringify(localProds));
    } catch (err) {
      console.warn('localStorage sync warning:', err);
    }

    // 2. Immediately close modal & notify parent App.jsx so storefront/homepage shows image with ZERO delay
    setIsProductModalOpen(false);
    if (onProductSaved) {
      onProductSaved(updatedProd);
    } else {
      onRefreshData();
    }

    // 3. Sync to Express API in background
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProd)
      });
    } catch (err) {
      console.warn('Backend API background sync warning:', err);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      try {
        const localProds = JSON.parse(localStorage.getItem('rove_custom_products') || '[]');
        const filtered = localProds.filter(p => p.id !== id);
        localStorage.setItem('rove_custom_products', JSON.stringify(filtered));
      } catch (err) {
        console.warn('localStorage delete error', err);
      }

      if (onProductDeleted) {
        onProductDeleted(id);
      } else {
        onRefreshData();
      }

      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Delete product sync warning:', err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      alert('Error updating order');
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Delete order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      alert('Error deleting order');
    }
  };

  // Add Coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code) return;
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(couponForm)
      });
      if (res.ok) {
        setCouponForm({ code: '', discountType: 'percentage', value: 10, minOrder: 2000, description: '' });
        onRefreshData();
      }
    } catch (err) {
      alert('Error creating coupon');
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (code) => {
    try {
      const res = await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      if (res.ok) {
        onRefreshData();
      }
    } catch (err) {
      alert('Error deleting coupon');
    }
  };

  // Save Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm)
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 2500);
        onRefreshData();
      }
    } catch (err) {
      alert('Error saving settings');
    }
  };

  // Filtered Products
  const filteredProducts = (products || []).filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.inspiredBy && p.inspiredBy.toLowerCase().includes(productSearch.toLowerCase()))
  );

  // Filtered Orders
  const filteredOrders = (orders || []).filter(o => {
    if (orderStatusFilter === 'all') return true;
    return o.status?.toLowerCase() === orderStatusFilter.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] text-white flex flex-col overflow-hidden">
      
      {/* Admin Top Header */}
      <div className="bg-[#141414] border-b border-[#242424] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-gold-500/40 p-0.5 overflow-hidden">
            <img src="/images/rove-logo.jpg" alt="ROVE" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h1 className="text-base font-bold gold-gradient-text font-serif tracking-wider uppercase">
              ROVE SCENTS • WordPress & E-Commerce Admin Panel
            </h1>
            <p className="text-[11px] text-zinc-400">
              Live Store Manager • Store: <span className="text-emerald-400 font-semibold">Active & Online</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Database Connection Indicator */}
          <button
            onClick={() => setIsMongoModalOpen(true)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition ${
              dbStatus?.connected
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
            }`}
            title="Database Connection Status & Lifetime Cloud Setup"
          >
            <Database size={13} />
            <span className="hidden sm:inline">
              {dbStatus?.connected ? 'MongoDB Cloud Active' : 'Connect MongoDB'}
            </span>
            <span className={`w-2 h-2 rounded-full ${dbStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
          </button>

          <button
            onClick={() => {
              sessionStorage.removeItem('rove_admin_token');
              sessionStorage.removeItem('rove_admin_expiry');
              onClose();
            }}
            className="px-3.5 py-2 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-500/30 text-red-300 font-semibold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
            title="Log out of admin session"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow"
          >
            <span>Live Store</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Main Admin Body: Sidebar + Content */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* Left Sidebar Menu */}
        <aside className="w-64 bg-[#111] border-r border-[#222] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-3 py-2">
              Management
            </div>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'overview'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>Dashboard Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'products'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={16} />
                <span>Perfumes Catalog</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#222] text-zinc-300">
                {products?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'categories'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag size={16} />
                <span>Category Circles & Thumbs</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#222] text-zinc-300">
                {categoriesList?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'banners'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sliders size={16} />
                <span>Hero Banners</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#222] text-zinc-300">
                {bannersList?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'orders'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} />
                <span>Customer Orders</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-black font-bold animate-pulse">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'coupons'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <Tag size={16} />
              <span>Coupons & Promos</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'reviews'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <Star size={16} />
              <span>Customer Reviews</span>
            </button>

            <div className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 px-3 py-2 pt-4">
              Configuration
            </div>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition ${
                activeTab === 'settings'
                  ? 'bg-gold-500/20 text-gold-300 border-l-4 border-gold-400 font-bold'
                  : 'text-zinc-400 hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <Settings size={16} />
              <span>Store & Banner Customizer</span>
            </button>
          </div>

          <div className="p-3 bg-[#181818] rounded-xl border border-[#262626] text-[11px] text-zinc-400">
            <span className="font-bold text-white block mb-0.5">Admin Session:</span>
            <span>Logged in as <strong>admin</strong></span>
            <div className="text-[10px] text-gold-400 mt-1">Changes are saved instantly!</div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-[#0a0a0a]">
          
          {/* ================= 1. TAB: OVERVIEW ================= */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Dashboard Overview</h2>
                <p className="text-xs text-zinc-400 mt-1">Real-time performance summary of your perfume store</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-xl bg-[#141414] border border-[#222] shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
                    <DollarSign size={18} className="text-gold-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif gold-gradient-text">
                    Rs. {totalSales.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp size={12} />
                    <span>Calculated from {totalOrdersCount} orders</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#141414] border border-[#222] shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag size={18} className="text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    {totalOrdersCount}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    {confirmedOrdersCount} Confirmed & Shipped
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#141414] border border-[#222] shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
                    <Clock size={18} className="text-red-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-amber-400">
                    {pendingOrdersCount}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Awaiting dispatch confirmation
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-[#141414] border border-[#222] shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Perfumes In Stock</span>
                    <Package size={18} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-serif text-white">
                    {products?.length || 0}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1">
                    Active online catalogue items
                  </div>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div className="bg-[#141414] border border-[#222] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#222]">
                  <h3 className="font-serif text-base font-bold text-white">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-gold-400 hover:text-gold-300 font-semibold"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-400 border-b border-[#222]">
                        <th className="pb-3 font-semibold">Order ID</th>
                        <th className="pb-3 font-semibold">Customer</th>
                        <th className="pb-3 font-semibold">City</th>
                        <th className="pb-3 font-semibold">Amount</th>
                        <th className="pb-3 font-semibold">Payment</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e]">
                      {(orders || []).slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-[#181818]/60">
                          <td className="py-3 font-mono font-bold text-gold-300">{o.id}</td>
                          <td className="py-3 font-medium text-white">{o.customerName}</td>
                          <td className="py-3 text-zinc-400">{o.city}</td>
                          <td className="py-3 font-bold text-white">Rs. {o.total?.toLocaleString()}</td>
                          <td className="py-3 text-zinc-400">{o.paymentMethod}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              o.status === 'Delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' :
                              o.status === 'Shipped' ? 'bg-blue-950 text-blue-400 border border-blue-500/30' :
                              o.status === 'Confirmed' ? 'bg-gold-950 text-gold-300 border border-gold-500/30' :
                              'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => onOpenInvoice(o)}
                              className="p-1 text-zinc-400 hover:text-gold-400"
                              title="Print Invoice"
                            >
                              <Printer size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2. TAB: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">Perfumes & Catalogue</h2>
                  <p className="text-xs text-zinc-400 mt-1">Manage perfumes, prices, notes, stock, and descriptions</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-zinc-500" size={14} />
                    <input
                      type="text"
                      placeholder="Search catalogue..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="bg-[#161616] border border-[#282828] text-xs text-white pl-8 pr-3 py-2 rounded-lg focus:outline-none focus:border-gold-500 w-48 sm:w-64"
                    />
                  </div>

                  <button
                    onClick={openAddModal}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow"
                  >
                    <Plus size={15} />
                    <span>Add New Perfume</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#181818] text-zinc-400 border-b border-[#242424]">
                        <th className="py-3 px-4 font-semibold">Perfume</th>
                        <th className="py-3 px-4 font-semibold">Category</th>
                        <th className="py-3 px-4 font-semibold">Price (PKR)</th>
                        <th className="py-3 px-4 font-semibold">Stock</th>
                        <th className="py-3 px-4 font-semibold">Longevity</th>
                        <th className="py-3 px-4 font-semibold">Badge</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e]">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-[#181818]/60 transition">
                          <td className="py-3 px-4 flex items-center gap-3">
                            <img src={prod.image} alt={prod.name} className="w-10 h-12 object-cover rounded bg-[#222]" />
                            <div>
                              <p className="font-bold text-white font-serif">{prod.name}</p>
                              <p className="text-[10px] text-zinc-400">Impression of {prod.inspiredBy}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4 capitalize text-zinc-300">{prod.category}</td>
                          <td className="py-3 px-4 font-bold text-gold-300">
                            Rs. {prod.price?.toLocaleString()}
                            {prod.comparePrice && (
                              <span className="text-[10px] text-zinc-500 line-through ml-1.5">
                                Rs. {prod.comparePrice?.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.stock > 10 ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400 animate-pulse'
                            }`}>
                              {prod.stock} Units
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">{prod.longevity || '14+ Hours'}</td>
                          <td className="py-3 px-4">
                            {prod.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                                {prod.badge}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(prod)}
                              className="p-1.5 rounded bg-[#202020] hover:bg-gold-500 hover:text-black text-zinc-300 transition"
                              title="Edit Perfume"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.name)}
                              className="p-1.5 rounded bg-[#202020] hover:bg-red-500 hover:text-white text-zinc-400 transition"
                              title="Delete Perfume"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 2.5 TAB: CATEGORY CIRCLES & THUMBNAILS ================= */}
          {activeTab === 'categories' && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">Homepage Category Circles & Thumbs</h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage circular thumbnail collections displayed on the homepage. Upload images directly from your PC or paste URL.
                  </p>
                </div>
              </div>

              {/* Add / Edit Category Box */}
              <div className="p-5 rounded-xl bg-[#161616] border border-gold-500/30 space-y-4">
                <h3 className="text-sm font-bold text-gold-300 uppercase tracking-wider">
                  Add New Category Circle
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Display Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Nikkah Favours"
                      value={newCategory.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewCategory(prev => ({
                          ...prev,
                          name: val,
                          id: prev.id && prev.id !== prev.name?.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
                            ? prev.id 
                            : val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
                        }));
                      }}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Category Slug/ID (Auto-Generated) *</label>
                    <input
                      type="text"
                      placeholder="e.g. nikkah-favours"
                      value={newCategory.id}
                      onChange={(e) => setNewCategory({ ...newCategory, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Circle Image (Upload from PC)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="/images/..."
                        value={newCategory.image}
                        onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                      <label className="px-3 py-2 rounded bg-gold-500/20 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 text-xs font-bold cursor-pointer transition shrink-0">
                        <Upload size={14} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const url = await uploadOrFallback(file);
                            if (url) setNewCategory(prev => ({ ...prev, image: url }));
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newCategory.name || !newCategory.name.trim()) {
                        alert('Please enter Category Display Name (e.g. Nikkah Favours)');
                        return;
                      }
                      const catId = newCategory.id || newCategory.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                      if (!catId) {
                        alert('Please enter a valid Category ID');
                        return;
                      }
                      const catToAdd = {
                        ...newCategory,
                        id: catId,
                        name: newCategory.name.trim(),
                        image: newCategory.image || '/images/cat-all.jpg'
                      };
                      const updated = [...categoriesList, catToAdd];
                      handleSaveCategories(updated);
                      setNewCategory({ id: '', name: '', image: '/images/cat-all.jpg' });
                    }}
                    className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition"
                  >
                    Add Category
                  </button>
                </div>
              </div>

              {/* Existing Categories Table */}
              <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#181818] text-zinc-400 border-b border-[#242424]">
                      <th className="py-3 px-4 font-semibold">Thumbnail</th>
                      <th className="py-3 px-4 font-semibold">Category Name</th>
                      <th className="py-3 px-4 font-semibold">ID / Key</th>
                      <th className="py-3 px-4 font-semibold">Associated Products</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e1e]">
                    {categoriesList.map((cat, idx) => {
                      const count = cat.id === 'all' 
                        ? products.length 
                        : products.filter(p => p.category?.toLowerCase() === cat.id.toLowerCase()).length;
                      return (
                        <tr key={cat.id} className="hover:bg-[#181818]/60">
                          <td className="py-3 px-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold-500/40 p-0.5 bg-black">
                              <img src={cat.image || '/images/cat-all.jpg'} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                            </div>
                          </td>
                          <td className="py-3 px-4 font-bold text-white font-serif">{cat.name}</td>
                          <td className="py-3 px-4 font-mono text-gold-300">{cat.id}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              count > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                            }`}>
                              {count > 0 ? `${count} Perfumes` : 'Coming Soon'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingCategory({ ...cat })}
                                className="p-1.5 rounded bg-[#202020] hover:bg-gold-500 hover:text-black text-zinc-300 transition"
                                title="Edit Category & Thumbnail"
                              >
                                <Edit3 size={14} />
                              </button>
                              {cat.id !== 'all' && (
                                <button
                                  onClick={() => {
                                    if (window.confirm(`Delete category "${cat.name}"?`)) {
                                      const filtered = categoriesList.filter(c => c.id !== cat.id);
                                      handleSaveCategories(filtered);
                                    }
                                  }}
                                  className="p-1.5 rounded bg-[#202020] hover:bg-red-500 hover:text-white text-zinc-400 transition"
                                  title="Delete Category"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Edit Category Modal */}
              {editingCategory && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="relative bg-[#141414] border border-gold-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
                    <button
                      onClick={() => setEditingCategory(null)}
                      className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
                    >
                      <X size={20} />
                    </button>

                    <h3 className="font-serif text-lg font-bold text-white mb-4">
                      Edit Category: <span className="text-gold-300">{editingCategory.name}</span>
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-zinc-300 font-semibold mb-1">Display Name *</label>
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-300 font-semibold mb-1">Circle Thumbnail Image</label>
                        <div className="flex gap-3 items-center">
                          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gold-500/50 p-0.5 bg-black shrink-0">
                            <img src={editingCategory.image || '/images/cat-all.jpg'} alt="Preview" className="w-full h-full object-cover rounded-full" />
                          </div>
                          <div className="flex-grow space-y-2">
                            <input
                              type="text"
                              value={editingCategory.image}
                              onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                              placeholder="/images/... or upload from computer"
                              className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                            />
                            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gold-500/20 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 text-xs font-bold cursor-pointer transition">
                              <Upload size={13} />
                              <span>Browse & Upload from PC</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  if (!file) return;
                                  const url = await uploadOrFallback(file);
                                  if (url) setEditingCategory(prev => ({ ...prev, image: url }));
                                }}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t border-[#222]">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="px-4 py-2 rounded-lg bg-[#222] text-zinc-400 text-xs hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!editingCategory.name) return;
                            const updated = categoriesList.map(c => c.id === editingCategory.id ? editingCategory : c);
                            handleSaveCategories(updated);
                            setEditingCategory(null);
                          }}
                          className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition"
                        >
                          Save Category
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB: HERO BANNERS (16:9 SLIDER) ================= */}
          {activeTab === 'banners' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2.5">
                    <span>Hero Banners & Slider Manager</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-sans font-bold border border-gold-500/30">
                      16:9 Widescreen
                    </span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Customise the luxury homepage slider. Edit background images, pricing, headlines, and call-to-action buttons in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={openAddBannerModal}
                    className="px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow"
                  >
                    <Plus size={15} />
                    <span>Add New Banner</span>
                  </button>
                </div>
              </div>

              {/* Banners Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(bannersList || []).map((banner, idx) => {
                  const linkedProd = banner.productId ? products?.find(p => p.id === banner.productId) : null;
                  return (
                    <div 
                      key={banner.id || idx}
                      className="bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden flex flex-col group hover:border-gold-500/40 transition shadow-lg"
                    >
                      {/* Banner 16:9 Preview */}
                      <div className="relative w-full aspect-[16/9] bg-black overflow-hidden border-b border-[#222]">
                        <img 
                          src={banner.bannerImage || '/images/rove-rukh-banner.jpg'} 
                          alt={banner.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-black/90 via-black/50 to-transparent pointer-events-none" />
                        
                        {/* Status Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            banner.isActive !== false ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          }`}>
                            {banner.isActive !== false ? 'Active on Home' : 'Hidden / Draft'}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-black/80 text-gold-300 border border-gold-500/30 text-[10px] font-mono">
                            Order #{banner.order || idx + 1}
                          </span>
                        </div>

                        {/* Top-Right Badge Preview */}
                        {banner.badge && (
                          <div className="absolute top-3 right-3">
                            <span className="px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm border border-gold-500/40 text-gold-300 text-[10px] font-bold uppercase tracking-wider">
                              {banner.badge}
                            </span>
                          </div>
                        )}

                        {/* Overlaid Title & Pricing Preview */}
                        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                              {banner.tag || 'LUXURY IMPRESSION'}
                            </div>
                            <h3 className="text-lg sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                              <span>{banner.title}</span>
                              {banner.arabic && <span className="text-gold-300 font-serif">{banner.arabic}</span>}
                            </h3>
                          </div>
                          <div className="text-right">
                            <div className="text-base sm:text-lg font-bold text-gold-300 font-serif">
                              Rs. {Number(banner.price || 0).toLocaleString()}
                            </div>
                            {banner.comparePrice && (
                              <div className="text-[11px] text-zinc-400 line-through">
                                Rs. {Number(banner.comparePrice).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                            {banner.subtitle || 'No description provided.'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
                            <span>Button: <strong className="text-zinc-200">{banner.btnText || 'BUY NOW'}</strong></span>
                            <span>•</span>
                            <span>Target: <strong className="text-gold-300">{linkedProd ? linkedProd.name : 'All Perfumes'}</strong></span>
                          </div>
                        </div>

                        {/* Actions Toolbar */}
                        <div className="flex items-center justify-between pt-3 border-t border-[#222]">
                          <button
                            type="button"
                            onClick={() => handleToggleBannerStatus(banner)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                              banner.isActive !== false
                                ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30'
                            }`}
                          >
                            {banner.isActive !== false ? <EyeOff size={13} /> : <Eye size={13} />}
                            <span>{banner.isActive !== false ? 'Hide' : 'Show on Home'}</span>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditBannerModal(banner)}
                              className="px-3.5 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 font-bold text-xs flex items-center gap-1.5 transition"
                            >
                              <Edit3 size={13} />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBanner(banner.id, banner.title)}
                              className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-500/30 transition"
                              title="Delete Banner"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {(bannersList || []).length === 0 && (
                <div className="text-center py-16 bg-[#141414] border border-[#222] rounded-2xl p-8 space-y-4">
                  <Sliders size={36} className="text-gold-400 mx-auto" />
                  <h3 className="text-lg font-bold text-white font-serif">No Custom Banners Yet</h3>
                  <p className="text-xs text-zinc-400 max-w-md mx-auto">
                    The homepage is currently displaying the default cinematic slides. Create a custom banner to show your custom products and offers.
                  </p>
                  <button
                    onClick={openAddBannerModal}
                    className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider"
                  >
                    + Create First Banner
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 3. TAB: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white">Customer Orders Management</h2>
                  <p className="text-xs text-zinc-400 mt-1">Update fulfillment status, print packing slips, or contact buyer via WhatsApp</p>
                </div>

                <div className="flex items-center gap-2">
                  {['all', 'Pending', 'Confirmed', 'Shipped', 'Delivered'].map(status => (
                    <button
                      key={status}
                      onClick={() => setOrderStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition ${
                        orderStatusFilter === status
                          ? 'bg-gold-500 text-black font-bold'
                          : 'bg-[#181818] text-zinc-400 hover:bg-[#222]'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#181818] text-zinc-400 border-b border-[#242424]">
                        <th className="py-3 px-4 font-semibold">Order ID & Date</th>
                        <th className="py-3 px-4 font-semibold">Customer & City</th>
                        <th className="py-3 px-4 font-semibold">Address</th>
                        <th className="py-3 px-4 font-semibold">Items & Total</th>
                        <th className="py-3 px-4 font-semibold">Status</th>
                        <th className="py-3 px-4 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e]">
                      {filteredOrders.map(o => (
                        <tr key={o.id} className="hover:bg-[#181818]/60 transition">
                          <td className="py-3.5 px-4">
                            <span className="font-mono font-bold text-gold-300 block">{o.id}</span>
                            <span className="text-[10px] text-zinc-500">
                              {o.date ? new Date(o.date).toLocaleDateString() : 'Recent'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-white block">{o.customerName}</span>
                            <span className="text-[11px] font-mono text-zinc-400 block">{o.phone}</span>
                            <span className="text-[10px] text-zinc-500">{o.city}</span>
                          </td>
                          <td className="py-3.5 px-4 text-zinc-300 max-w-xs truncate" title={o.address}>
                            {o.address}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-[11px] text-zinc-300 font-medium max-w-xs truncate">
                              {o.items?.map(i => `${i.name} (${i.size || '50ml'}) x${i.quantity}`).join(', ')}
                            </div>
                            <div className="font-bold text-gold-300 mt-1">
                              Rs. {o.total?.toLocaleString()}{' '}
                              <span className="text-[10px] text-zinc-500 font-normal">({o.paymentMethod})</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className={`bg-[#1c1c1c] border text-[11px] font-bold rounded px-2.5 py-1 focus:outline-none ${
                                o.status === 'Delivered' ? 'border-emerald-500/40 text-emerald-400' :
                                o.status === 'Shipped' ? 'border-blue-500/40 text-blue-400' :
                                o.status === 'Confirmed' ? 'border-gold-500/40 text-gold-300' :
                                'border-amber-500/40 text-amber-300'
                              }`}
                            >
                              <option value="Pending" className="bg-[#1c1c1c] text-white">Pending</option>
                              <option value="Confirmed" className="bg-[#1c1c1c] text-white">Confirmed</option>
                              <option value="Shipped" className="bg-[#1c1c1c] text-white">Shipped</option>
                              <option value="Delivered" className="bg-[#1c1c1c] text-white">Delivered</option>
                              <option value="Cancelled" className="bg-[#1c1c1c] text-white">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            {/* WhatsApp Direct Chat with Buyer */}
                            <a
                              href={`https://wa.me/${o.phone?.replace(/[^0-9]/g, '')}?text=Assalam-o-Alaikum%20${encodeURIComponent(o.customerName)},%20this%20is%20ROVE%20Scents%20regarding%20your%20Order%20${o.id}.%20Your%20order%20status%20is:%20${o.status}.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex p-1.5 rounded bg-[#1e2d20] text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                              title="Chat with Customer on WhatsApp"
                            >
                              <MessageCircle size={14} />
                            </a>

                            {/* Print Packing Slip */}
                            <button
                              onClick={() => onOpenInvoice(o)}
                              className="p-1.5 rounded bg-[#222] hover:bg-gold-500 hover:text-black text-zinc-300 transition"
                              title="Print Invoice / Packing Slip"
                            >
                              <Printer size={14} />
                            </button>

                            {/* Delete Order */}
                            <button
                              onClick={() => handleDeleteOrder(o.id)}
                              className="p-1.5 rounded bg-[#222] hover:bg-red-500 hover:text-white text-zinc-400 transition"
                              title="Delete Order"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. TAB: COUPONS ================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Coupons & Promo Codes</h2>
                <p className="text-xs text-zinc-400 mt-1">Create marketing discount codes for campaigns</p>
              </div>

              {/* Create Coupon Form */}
              <form onSubmit={handleAddCoupon} className="p-5 rounded-xl bg-[#141414] border border-[#222] space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-400">Add New Coupon Code</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Coupon Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FLASH20"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Discount Type</label>
                    <select
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed PKR (Rs.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Discount Value *</label>
                    <input
                      type="number"
                      required
                      value={couponForm.value}
                      onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 mb-1">Min Order (Rs.)</label>
                    <input
                      type="number"
                      value={couponForm.minOrder}
                      onChange={(e) => setCouponForm({ ...couponForm, minOrder: Number(e.target.value) })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition"
                  >
                    Save Coupon
                  </button>
                </div>
              </form>

              {/* Coupons List */}
              <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#181818] text-zinc-400 border-b border-[#242424]">
                      <th className="py-3 px-4 font-semibold">Code</th>
                      <th className="py-3 px-4 font-semibold">Discount</th>
                      <th className="py-3 px-4 font-semibold">Min Order</th>
                      <th className="py-3 px-4 font-semibold">Status</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e1e]">
                    {(coupons || []).map(c => (
                      <tr key={c.code} className="hover:bg-[#181818]/60">
                        <td className="py-3 px-4 font-mono font-bold text-gold-300">{c.code}</td>
                        <td className="py-3 px-4 text-white">
                          {c.discountType === 'percentage' ? `${c.value}% OFF` : `Rs. ${c.value} OFF`}
                        </td>
                        <td className="py-3 px-4 text-zinc-400">Rs. {c.minOrder?.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 font-semibold">
                            Active
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCoupon(c.code)}
                            className="p-1 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= 5. TAB: STORE CUSTOMIZER & SETTINGS ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Store Customizer & Settings</h2>
                <p className="text-xs text-zinc-400 mt-1">Control your brand, announcement banners, delivery fees, and WhatsApp numbers</p>
              </div>

              {settingsSaved && (
                <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <Check size={16} />
                  <span>Store settings updated successfully! Live storefront is synced.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-5 bg-[#141414] border border-[#222] p-6 rounded-xl">
                
                {/* Store Name & Slogan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={settingsForm.storeName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Store Slogan / Tagline
                    </label>
                    <input
                      type="text"
                      value={settingsForm.storeSlogan || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, storeSlogan: e.target.value })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                {/* Announcement Bar */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Top Announcement Bar Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.announcementText || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* WhatsApp & Contact Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      WhatsApp Support Number (Pakistan format)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappNumber || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                      placeholder="923001234567"
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Support Email
                    </label>
                    <input
                      type="email"
                      value={settingsForm.contactEmail || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                {/* Delivery Fee & Free Delivery Threshold */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Standard Delivery Fee (PKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.deliveryCharge || 200}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryCharge: Number(e.target.value) })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Free Delivery Threshold (PKR)
                    </label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold || 2500}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                {/* Hero Banner Title & Subtitle */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Homepage Hero Title
                  </label>
                  <input
                    type="text"
                    value={settingsForm.heroTitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Homepage Hero Subtitle
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtitle || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                  />
                </div>

                {/* Bank / Raast Details */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                    Bank Transfer / Raast / Sadapay Information
                  </label>
                  <textarea
                    rows={3}
                    value={settingsForm.bankDetails || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, bankDetails: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* Meta (Facebook) Pixel Configuration for Ads Tracking */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#181818] border border-[#2b2b2b] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1877F2]/20 border border-[#1877F2]/50 flex items-center justify-center text-[#1877F2] font-black text-base shadow">
                        f
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <span>Meta (Facebook) Pixel Integration</span>
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                            settingsForm.facebookPixelId?.trim() 
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {settingsForm.facebookPixelId?.trim() ? '● ACTIVE & TRACKING' : 'INACTIVE'}
                          </span>
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          Automatically tracks Facebook & Instagram Ads conversions: PageView, ViewContent, AddToCart, InitiateCheckout & Purchase (with PKR revenue).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                      Meta Pixel ID (15-16 Digits)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 182736452910384"
                      value={settingsForm.facebookPixelId || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, facebookPixelId: e.target.value.trim() })}
                      className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold-500 placeholder-zinc-600"
                    />
                    <p className="text-[10.5px] text-zinc-500 mt-1">
                      Find your Pixel ID in <span className="text-gold-300 font-semibold">Meta Events Manager → Data Sources</span>. Once saved, ads will optimize for website purchases in Pakistan.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 text-black font-bold text-xs uppercase tracking-wider transition shadow"
                  >
                    Save All Settings
                  </button>
                </div>

              </form>

              {/* Admin Security & Password Update Section */}
              <div className="p-6 rounded-xl bg-[#141414] border border-gold-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <KeyRound size={18} className="text-gold-400" />
                  <h3 className="font-serif text-base font-bold text-white">Administrator Security & Password</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Update your staff portal login password. Protect your store from unauthorized modifications.
                </p>

                {passwordChangeMsg.text && (
                  <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                    passwordChangeMsg.type === 'success' 
                      ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' 
                      : 'bg-red-950/80 border border-red-500/40 text-red-200'
                  }`}>
                    {passwordChangeMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                    <span>{passwordChangeMsg.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                        Current Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={passwordChange.currentPassword}
                        onChange={(e) => setPasswordChange({ ...passwordChange, currentPassword: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                        New Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="At least 6 chars"
                        value={passwordChange.newPassword}
                        onChange={(e) => setPasswordChange({ ...passwordChange, newPassword: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-300 mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Repeat new password"
                        value={passwordChange.confirmPassword}
                        onChange={(e) => setPasswordChange({ ...passwordChange, confirmPassword: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition disabled:opacity-50"
                    >
                      {updatingPassword ? 'Updating Password...' : 'Update Admin Password'}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* ================= 6. TAB: REVIEWS ================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-2xl font-serif font-bold text-white">Customer Reviews Moderation</h2>
                <p className="text-xs text-zinc-400 mt-1">Approve, reject, or manage verified customer feedback</p>
              </div>

              <div className="bg-[#141414] border border-[#222] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#181818] text-zinc-400 border-b border-[#242424]">
                      <th className="py-3 px-4 font-semibold">Author & City</th>
                      <th className="py-3 px-4 font-semibold">Rating</th>
                      <th className="py-3 px-4 font-semibold">Title & Review</th>
                      <th className="py-3 px-4 font-semibold">Verified</th>
                      <th className="py-3 px-4 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e1e]">
                    {(reviews || []).map(r => (
                      <tr key={r.id} className="hover:bg-[#181818]/60">
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">{r.author}</span>
                          <span className="text-[10px] text-zinc-500">{r.city}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center text-amber-400">
                            {[...Array(r.rating || 5)].map((_, i) => (
                              <Star key={i} size={12} className="fill-amber-400" />
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-md">
                          {r.title && <div className="font-bold text-white mb-0.5">"{r.title}"</div>}
                          <div className="text-zinc-300 text-[11px] leading-relaxed line-clamp-2">{r.comment}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 font-semibold">
                            Verified Buyer
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete review?')) {
                                await fetch(`/api/reviews/${r.id}`, { method: 'DELETE' });
                                onRefreshData();
                              }
                            }}
                            className="p-1 text-zinc-500 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: ADD / EDIT PERFUME ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#141414] border border-gold-500/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setIsProductModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="font-serif text-xl font-bold text-white mb-4">
              {editingProduct ? 'Edit Perfume Details' : 'Add New Perfume to Store'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Perfume Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. ROVE Royal Oud"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Impression Of / Inspired By *</label>
                  <input
                    type="text"
                    required
                    value={productForm.inspiredBy}
                    onChange={(e) => setProductForm({ ...productForm, inspiredBy: e.target.value })}
                    placeholder="e.g. Creed Aventus / Tom Ford"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] text-zinc-300 font-semibold">Category *</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProductModalOpen(false);
                        setActiveTab('categories');
                      }}
                      className="text-[10px] text-gold-400 hover:text-gold-300 underline font-medium"
                      title="Manage and create categories"
                    >
                      + Manage
                    </button>
                  </div>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      if (e.target.value === '__add_new__') {
                        const name = prompt('Enter new category display name (e.g. Nikkah Favours):');
                        if (name && name.trim()) {
                          const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
                          const newCatObj = { id: slug, name: name.trim(), image: '/images/cat-all.jpg' };
                          const updated = [...categoriesList, newCatObj];
                          handleSaveCategories(updated);
                          setProductForm(prev => ({ ...prev, category: slug }));
                        }
                        return;
                      }
                      setProductForm({ ...productForm, category: e.target.value });
                    }}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    {(() => {
                      const allCatsMap = new Map();
                      (categoriesList || []).forEach(c => {
                        if (c?.id && c.id !== 'all') allCatsMap.set(c.id.toLowerCase().trim(), c);
                      });
                      (categories || []).forEach(c => {
                        if (c?.id && c.id !== 'all' && !allCatsMap.has(c.id.toLowerCase().trim())) {
                          allCatsMap.set(c.id.toLowerCase().trim(), c);
                        }
                      });
                      try {
                        const local = JSON.parse(localStorage.getItem('rove_custom_categories') || '[]');
                        if (Array.isArray(local)) {
                          local.forEach(c => {
                            if (c?.id && c.id !== 'all' && !allCatsMap.has(c.id.toLowerCase().trim())) {
                              allCatsMap.set(c.id.toLowerCase().trim(), c);
                            }
                          });
                        }
                      } catch (e) {}

                      const options = Array.from(allCatsMap.values()).map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#181818] text-white">
                          {cat.name}
                        </option>
                      ));

                      if (productForm.category && !allCatsMap.has(productForm.category.toLowerCase().trim())) {
                        options.unshift(
                          <option key={productForm.category} value={productForm.category} className="bg-[#181818] text-white">
                            {productForm.category}
                          </option>
                        );
                      }

                      return options;
                    })()}
                    <option value="__add_new__" className="bg-[#222] text-gold-300 font-bold">
                      + Create New Category...
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Compare Price (Crossed)</label>
                  <input
                    type="number"
                    value={productForm.comparePrice || ''}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Main Image Input + Direct Upload Button */}
              <div>
                <label className="block text-[11px] text-zinc-300 font-semibold mb-1">
                  Primary Bottle Image (Shows on Product Card & Main View)
                </label>
                <div className="flex gap-2 items-center">
                  {productForm.image && (
                    <img src={productForm.image} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-gold-500/40 bg-black shrink-0" />
                  )}
                  <input
                    type="text"
                    required
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="/images/... or upload from computer"
                    className="flex-grow bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                  <label className="px-3.5 py-2 rounded bg-gold-500/20 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shrink-0">
                    <Upload size={14} />
                    <span>{uploadingImage ? 'Uploading...' : 'Browse PC'}</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Gallery Images (Multiple Angles & Views) */}
              <div className="p-3 rounded-xl bg-[#181818] border border-[#262626] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] text-zinc-200 font-bold uppercase tracking-wider">
                      Product Gallery Angles (Multi-Image Showcase)
                    </label>
                    <p className="text-[10px] text-zinc-400">
                      Upload multiple angles, packaging photos, or aesthetic shots for the full product page.
                    </p>
                  </div>
                  <label className="px-3 py-1.5 rounded-lg bg-[#252525] hover:bg-gold-500 hover:text-black border border-zinc-600 text-zinc-300 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shrink-0">
                    <Plus size={13} />
                    <span>{uploadingGallery ? 'Uploading...' : '+ Add Gallery Shots'}</span>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  </label>
                </div>

                {/* Previews List */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {(productForm.galleryImages || []).map((imgUrl, i) => (
                    <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-gold-500/30 bg-black">
                      <img src={imgUrl} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setProductForm(prev => ({
                            ...prev,
                            galleryImages: prev.galleryImages.filter((_, idx) => idx !== i)
                          }));
                        }}
                        className="absolute top-0.5 right-0.5 p-1 rounded-full bg-black/80 text-red-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                        title="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(!productForm.galleryImages || productForm.galleryImages.length === 0) && (
                    <p className="text-[11px] text-zinc-500 italic py-1">No additional gallery images added yet.</p>
                  )}
                </div>
              </div>

              {/* Fragrance Notes Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Top Notes</label>
                  <input
                    type="text"
                    value={productForm.topNotes}
                    onChange={(e) => setProductForm({ ...productForm, topNotes: e.target.value })}
                    placeholder="e.g. Cardamom, Bergamot"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Heart / Middle Notes</label>
                  <input
                    type="text"
                    value={productForm.heartNotes}
                    onChange={(e) => setProductForm({ ...productForm, heartNotes: e.target.value })}
                    placeholder="e.g. Oud, Sandalwood"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Base Notes</label>
                  <input
                    type="text"
                    value={productForm.baseNotes}
                    onChange={(e) => setProductForm({ ...productForm, baseNotes: e.target.value })}
                    placeholder="e.g. Amber, Vanilla"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Longevity</label>
                  <input
                    type="text"
                    value={productForm.longevity}
                    onChange={(e) => setProductForm({ ...productForm, longevity: e.target.value })}
                    placeholder="e.g. 14+ Hours"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Promotional Badge</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    placeholder="e.g. BEST SELLER"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe the scent profile, aura, and ingredients..."
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded bg-[#222] text-zinc-400 text-xs hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 text-black font-bold text-xs uppercase tracking-wider transition shadow"
                >
                  {editingProduct ? 'Save Changes' : 'Create Perfume'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================= HERO BANNER CREATE / EDIT MODAL ================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#141414] border border-gold-500/40 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <button
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#222] transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">
                  {editingBanner ? `Edit Banner: ${editingBanner.title}` : 'Create New 16:9 Hero Banner'}
                </h3>
                <p className="text-xs text-zinc-400">
                  Configure real-time title, pricing, call-to-action, and high-resolution background imagery.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Banner Background Image (16:9 Preview & Uploader) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-200 mb-1">
                  16:9 Widescreen Banner Image *
                </label>
                <div className="space-y-2">
                  <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-[#333] bg-black">
                    <img 
                      src={bannerForm.bannerImage || '/images/rove-rukh-banner.jpg'} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] text-zinc-300 font-mono">
                      16:9 Live Preview
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={bannerForm.bannerImage}
                      onChange={(e) => setBannerForm({ ...bannerForm, bannerImage: e.target.value })}
                      placeholder="/images/rove-rukh-banner.jpg or https://..."
                      className="flex-grow bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                    />
                    <label className="px-4 py-2 rounded bg-gold-500/20 hover:bg-gold-500 hover:text-black border border-gold-500/40 text-gold-300 text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shrink-0">
                      <Upload size={14} />
                      <span>{uploadingBannerImage ? 'Uploading...' : 'Upload PC'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Title & Arabic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="e.g. ROVE RUKH"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Arabic Calligraphy / Name</label>
                  <input
                    type="text"
                    value={bannerForm.arabic}
                    onChange={(e) => setBannerForm({ ...bannerForm, arabic: e.target.value })}
                    placeholder="e.g. رُخ"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 font-serif"
                  />
                </div>
              </div>

              {/* Tag & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Tagline / Header Line</label>
                  <input
                    type="text"
                    value={bannerForm.tag}
                    onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                    placeholder="e.g. HAUTE PARFUMERIE • 2026 FLAGSHIP RELEASE"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Badge (Top Left / Right)</label>
                  <input
                    type="text"
                    value={bannerForm.badge}
                    onChange={(e) => setBannerForm({ ...bannerForm, badge: e.target.value })}
                    placeholder="e.g. TOP SELLER / 40% OFF"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Price & Compare Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Selling Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    value={bannerForm.price}
                    onChange={(e) => setBannerForm({ ...bannerForm, price: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Crossed / Old Price (PKR)</label>
                  <input
                    type="number"
                    value={bannerForm.comparePrice}
                    onChange={(e) => setBannerForm({ ...bannerForm, comparePrice: Number(e.target.value) })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Subtitle / Marketing Pitch */}
              <div>
                <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Marketing Description / Subtitle *</label>
                <textarea
                  rows={2}
                  required
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="The pinnacle of masculine refinement. Capturing Italian Bergamot and golden smoked amber..."
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              {/* Button Text & Linked Product */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.btnText}
                    onChange={(e) => setBannerForm({ ...bannerForm, btnText: e.target.value })}
                    placeholder="e.g. BUY NOW (COD) — RS. 2,650"
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-300 font-semibold mb-1">Link to Perfume Product</label>
                  <select
                    value={bannerForm.productId || ''}
                    onChange={(e) => setBannerForm({ ...bannerForm, productId: e.target.value, isCollection: !e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    <option value="" className="bg-[#181818] text-white">None (Opens All Fragrances Catalog)</option>
                    {(products || []).map(p => (
                      <option key={p.id} value={p.id} className="bg-[#181818] text-white">
                        {p.name} (Rs. {p.price})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Order & Active Status */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-zinc-300 font-semibold">Slider Order:</label>
                  <input
                    type="number"
                    min="1"
                    value={bannerForm.order}
                    onChange={(e) => setBannerForm({ ...bannerForm, order: Number(e.target.value) })}
                    className="w-16 bg-[#1c1c1c] border border-[#333] rounded px-2 py-1 text-xs text-white text-center focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-200">
                  <input
                    type="checkbox"
                    checked={bannerForm.isActive}
                    onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 bg-[#1c1c1c] border-[#333]"
                  />
                  <span>Active & Visible on Homepage Slider</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-[#222]">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#222] text-zinc-400 text-xs hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBanner}
                  className="px-6 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5"
                >
                  {savingBanner ? (
                    <span>Saving Banner...</span>
                  ) : (
                    <span>{editingBanner ? 'Save Changes' : 'Create Banner'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MONGODB CLOUD DATABASE SETUP MODAL ================= */}
      {isMongoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-[#141414] border border-gold-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 my-8">
            <button
              onClick={() => setIsMongoModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#222] transition"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl border ${
                dbStatus?.connected ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' : 'bg-amber-950/80 border-amber-500/40 text-amber-400'
              }`}>
                <Database size={24} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <span>MongoDB Cloud Storage</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    dbStatus?.connected ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}>
                    {dbStatus?.connected ? 'Active & Preserved' : 'Setup Required'}
                  </span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Lifetime Cloud Persistence for Products, Banners, Categories & Orders
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
              dbStatus?.connected
                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {dbStatus?.connected ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
                <span>
                  {dbStatus?.connected ? 'MongoDB Cloud is Active!' : 'Running in Local Storage / In-Memory Fallback'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-300">
                {dbStatus?.connected
                  ? 'Your store is connected to MongoDB Cloud. Every single product, banner, order, and review you add or edit is stored permanently for lifetime preservation across all devices.'
                  : 'Currently data is saving to your browser and local file. When refreshing on Vercel or visiting from other devices, connect free MongoDB Atlas below so your changes are 100% permanent forever.'}
              </p>
            </div>

            {/* Quick 2-Minute Setup Steps */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gold-300 uppercase tracking-wider">
                How to Connect Free MongoDB Atlas (2 Minutes)
              </h4>

              <div className="space-y-2 text-xs text-zinc-300">
                <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold shrink-0 text-[11px]">1</span>
                  <div>
                    <strong className="text-white">Create a Free MongoDB Atlas Account:</strong>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Go to <a href="https://www.mongodb.com/atlas" target="_blank" rel="noreferrer" className="text-gold-400 underline font-semibold">mongodb.com/atlas</a> and create a free Shared Cluster (M0 Free Tier - completely free forever).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold shrink-0 text-[11px]">2</span>
                  <div>
                    <strong className="text-white">Copy your Connection String:</strong>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Click <strong>Connect</strong> &gt; <strong>Drivers</strong> &gt; Copy URI:
                      <code className="block mt-1 p-1.5 rounded bg-black text-[10px] font-mono text-emerald-400 overflow-x-auto select-all">
                        mongodb+srv://username:password@cluster0.xxxx.mongodb.net/rove-scents?retryWrites=true&w=majority
                      </code>
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#1a1a1a] border border-[#262626] flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-bold shrink-0 text-[11px]">3</span>
                  <div>
                    <strong className="text-white">Add MONGODB_URI in Vercel or .env:</strong>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      In Vercel: Project &gt; <strong>Settings</strong> &gt; <strong>Environment Variables</strong> &gt; Name: <code className="text-gold-300">MONGODB_URI</code> &gt; Value: your URI.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222]">
              <button
                type="button"
                onClick={() => {
                  onRefreshData();
                  setIsMongoModalOpen(false);
                }}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-400 text-black font-bold text-xs uppercase tracking-wider transition shadow"
              >
                Close & Check Status
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
