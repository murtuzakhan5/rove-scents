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
  KeyRound
} from 'lucide-react';

export default function AdminDashboard({
  onClose,
  products,
  orders,
  coupons,
  reviews,
  settings,
  categories,
  onRefreshData,
  onOpenInvoice,
  onProductSaved,
  onProductDeleted,
  onCategoriesUpdated
}) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, products, categories, orders, coupons, settings, reviews

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

  // Keep categoriesList synced when categories prop updates without losing custom additions
  React.useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoriesList(prev => {
        const map = new Map();
        (categories || []).forEach(c => map.set(c.id, c));
        (prev || []).forEach(c => map.set(c.id, c));
        return Array.from(map.values());
      });
    }
  }, [categories]);

  const [newCategory, setNewCategory] = useState({ id: '', name: '', image: '/images/cat-all.jpg' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategories, setSavingCategories] = useState(false);

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
  const openAddModal = () => {
    setEditingProduct(null);
    let currentCats = [...(categoriesList || [])];
    try {
      const local = JSON.parse(localStorage.getItem('rove_custom_categories') || '[]');
      if (Array.isArray(local) && local.length > 0) {
        const map = new Map();
        (categories || []).forEach(c => map.set(c.id, c));
        currentCats.forEach(c => map.set(c.id, c));
        local.forEach(c => map.set(c.id, c));
        currentCats = Array.from(map.values());
        setCategoriesList(currentCats);
      }
    } catch (e) {}
    const defaultCat = (currentCats.find(c => c.id !== 'all')?.id) || 'men';
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
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 capitalize"
                  >
                    {(() => {
                      const allCatsMap = new Map();
                      // Base/prop categories
                      (categories || []).forEach(c => c?.id && allCatsMap.set(c.id.toLowerCase().trim(), c));
                      // localStorage categories
                      try {
                        const local = JSON.parse(localStorage.getItem('rove_custom_categories') || '[]');
                        if (Array.isArray(local)) local.forEach(c => c?.id && allCatsMap.set(c.id.toLowerCase().trim(), c));
                      } catch (e) {}
                      // State categories
                      (categoriesList || []).forEach(c => c?.id && allCatsMap.set(c.id.toLowerCase().trim(), c));

                      return Array.from(allCatsMap.values())
                        .filter(c => c.id !== 'all')
                        .map(cat => (
                          <option key={cat.id} value={cat.id} className="bg-[#181818] text-white">
                            {cat.name} ({cat.id})
                          </option>
                        ));
                    })()}
                    {/* Fallback if product has a custom or newly added category */}
                    {productForm.category && (
                      <option value={productForm.category} className="bg-[#181818] text-white">
                        {productForm.category}
                      </option>
                    )}
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

    </div>
  );
}
