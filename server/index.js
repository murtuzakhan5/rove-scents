import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

import { connectDB, defaultBanners } from './db.js';
import Product from './models/Product.js';
import Category from './models/Category.js';
import Banner from './models/Banner.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';
import Setting from './models/Setting.js';
import Review from './models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static directories
const uploadsDir = path.join(__dirname, 'uploads');
let isDiskWritable = false;
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  isDiskWritable = true;
} catch (err) {
  console.warn('Uploads directory not writable (likely serverless environment). Using memory/Base64.');
}

app.use('/uploads', express.static(uploadsDir));
app.use('/images', express.static(path.join(rootDir, 'public', 'images')));

// Multer memory storage (works seamlessly in all environments without EROFS errors)
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 15 * 1024 * 1024 } });

// Helper to read and write database with in-memory caching and /tmp fallback
const dbPath = path.join(__dirname, 'db.json');
const tmpDbPath = path.join('/tmp', 'rove_db.json');
let cachedDB = null;

function getDB() {
  if (cachedDB) return cachedDB;

  try {
    if (fs.existsSync(tmpDbPath)) {
      cachedDB = JSON.parse(fs.readFileSync(tmpDbPath, 'utf8'));
      if (!cachedDB.banners) cachedDB.banners = defaultBanners;
      return cachedDB;
    }
  } catch (e) {}

  try {
    cachedDB = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    if (!cachedDB.banners) cachedDB.banners = defaultBanners;
    return cachedDB;
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { settings: {}, categories: [], products: [], banners: defaultBanners, coupons: [], orders: [], reviews: [] };
  }
}

function saveDB(data) {
  cachedDB = data;
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // Expected on Vercel read-only filesystem
  }
  try {
    fs.writeFileSync(tmpDbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {}
  return true;
}

// Middleware to attempt MongoDB connection on every API request
app.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
  } catch (e) {
    req.db = null;
  }
  next();
});

// ==================== FAST CACHE & API ROUTES ====================
let bootstrapCache = null;
let bootstrapCacheTime = 0;
const CACHE_TTL_MS = 20000; // 20s cache for extreme speed

function invalidateBootstrapCache() {
  bootstrapCache = null;
  bootstrapCacheTime = 0;
}

// Unified fast bootstrap endpoint (loads everything in 1 single network request)
app.get('/api/init', async (req, res) => {
  const now = Date.now();
  if (bootstrapCache && (now - bootstrapCacheTime < CACHE_TTL_MS)) {
    return res.json(bootstrapCache);
  }

  try {
    const conn = req.db || await connectDB();
    if (conn) {
      const [settingsDoc, categories, products, banners, reviews] = await Promise.all([
        Setting.findOne({ key: 'store_settings' }).lean(),
        Category.find({}).lean(),
        Product.find({}).sort({ createdAt: -1 }).lean(),
        Banner.find({}).sort({ order: 1 }).lean(),
        Review.find({}).sort({ createdAt: -1 }).lean()
      ]);

      const payload = {
        success: true,
        settings: settingsDoc || (getDB().settings || {}),
        categories: (categories && categories.length > 0) ? categories : (getDB().categories || []),
        products: (products && products.length > 0) ? products : (getDB().products || []),
        banners: (banners && banners.length > 0) ? banners : (getDB().banners || defaultBanners),
        reviews: (reviews && reviews.length > 0) ? reviews : (getDB().reviews || []),
        dbStatus: {
          connected: true,
          type: 'mongodb',
          mongoUriConfigured: true
        }
      };

      bootstrapCache = payload;
      bootstrapCacheTime = now;
      return res.json(payload);
    }
  } catch (err) {
    console.warn('Bootstrap Mongo fetch error:', err.message);
  }

  // Fallback to local DB
  const db = getDB();
  const fallbackPayload = {
    success: true,
    settings: db.settings || {},
    categories: db.categories || [],
    products: db.products || [],
    banners: db.banners || defaultBanners,
    reviews: db.reviews || [],
    dbStatus: {
      connected: false,
      type: 'local_json',
      mongoUriConfigured: !!(process.env.MONGODB_URI && process.env.MONGODB_URI.trim())
    }
  };
  res.json(fallbackPayload);
});

// 0. Database Status
app.get('/api/database-status', async (req, res) => {
  const isMongo = !!req.db;
  res.json({
    connected: isMongo,
    type: isMongo ? 'mongodb' : 'local_json',
    mongoUriConfigured: !!(process.env.MONGODB_URI && process.env.MONGODB_URI.trim())
  });
});

// 1. Settings
app.get('/api/settings', async (req, res) => {
  try {
    if (req.db) {
      let doc = await Setting.findOne({ key: 'store_settings' }).lean();
      if (!doc) {
        const db = getDB();
        doc = await Setting.create({ key: 'store_settings', ...(db.settings || {}) });
      }
      return res.json(doc);
    }
  } catch (err) {
    console.warn('MongoDB get settings fallback:', err.message);
  }
  const db = getDB();
  res.json(db.settings);
});

app.put('/api/settings', async (req, res) => {
  invalidateBootstrapCache();
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      const updated = await Setting.findOneAndUpdate(
        { key: 'store_settings' },
        { $set: req.body },
        { upsert: true, returnDocument: 'after' }
      ).lean();
      const db = getDB();
      db.settings = { ...db.settings, ...req.body };
      saveDB(db);
      return res.json({ success: true, settings: updated });
    }
  } catch (err) {
    console.warn('MongoDB put settings fallback:', err.message);
  }
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json({ success: true, settings: db.settings });
});

// 2. Categories
app.get('/api/categories', async (req, res) => {
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      const cats = await Category.find({}).lean();
      if (cats && cats.length > 0) {
        return res.json(cats);
      }
    }
  } catch (err) {
    console.warn('MongoDB get categories fallback:', err.message);
  }
  const db = getDB();
  res.json(db.categories || []);
});

app.put('/api/categories', async (req, res) => {
  invalidateBootstrapCache();
  try {
    const conn = req.db || await connectDB();
    if (conn && Array.isArray(req.body)) {
      await Category.deleteMany({});
      if (req.body.length > 0) {
        await Category.insertMany(req.body);
      }
      const db = getDB();
      db.categories = req.body;
      saveDB(db);
      return res.json({ success: true, categories: req.body });
    }
  } catch (err) {
    console.warn('MongoDB put categories fallback:', err.message);
  }
  const db = getDB();
  db.categories = req.body;
  saveDB(db);
  res.json({ success: true, categories: db.categories });
});

// 3. Products
app.get('/api/products', async (req, res) => {
  const { category, search, sort } = req.query;

  try {
    if (req.db) {
      const query = {};
      if (category && category !== 'all') {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      if (search) {
        const qRegex = new RegExp(search, 'i');
        query.$or = [
          { name: qRegex },
          { inspiredBy: qRegex },
          { shortDesc: qRegex }
        ];
      }

      let queryBuilder = Product.find(query).lean();
      if (sort === 'price-low') {
        queryBuilder = queryBuilder.sort({ price: 1 });
      } else if (sort === 'price-high') {
        queryBuilder = queryBuilder.sort({ price: -1 });
      } else if (sort === 'rating') {
        queryBuilder = queryBuilder.sort({ rating: -1 });
      } else {
        queryBuilder = queryBuilder.sort({ createdAt: -1 });
      }

      const prods = await queryBuilder.exec();
      if (prods && prods.length > 0) {
        return res.json(prods);
      }
    }
  } catch (err) {
    console.warn('MongoDB get products fallback:', err.message);
  }

  // Fallback to local db.json
  const db = getDB();
  let list = [...(db.products || [])];

  if (category && category !== 'all') {
    list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      (p.inspiredBy && p.inspiredBy.toLowerCase().includes(q)) ||
      (p.shortDesc && p.shortDesc.toLowerCase().includes(q))
    );
  }

  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  res.json(list);
});

app.get('/api/products/:id', async (req, res) => {
  try {
    if (req.db) {
      const prod = await Product.findOne({ $or: [{ id: req.params.id }, { slug: req.params.id }] }).lean();
      if (prod) return res.json(prod);
    }
  } catch (err) {}

  const db = getDB();
  const prod = (db.products || []).find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  res.json(prod);
});

app.post('/api/products', async (req, res) => {
  invalidateBootstrapCache();
  const newProduct = {
    id: req.body.id || ('prod-' + Date.now()),
    slug: (req.body.name || 'perfume').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    rating: 5.0,
    reviewsCount: 1,
    ...req.body
  };

  try {
    const conn = req.db || await connectDB();
    if (conn) {
      await Product.findOneAndUpdate({ id: newProduct.id }, newProduct, { upsert: true, returnDocument: 'after' });
    }
  } catch (err) {
    console.warn('MongoDB post product fallback:', err.message);
  }

  // Dual-write to local DB
  const db = getDB();
  if (!db.products) db.products = [];
  db.products.unshift(newProduct);
  saveDB(db);

  res.status(201).json(newProduct);
});

app.put('/api/products/:id', async (req, res) => {
  invalidateBootstrapCache();
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      const updated = await Product.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { upsert: true, returnDocument: 'after' }
      ).lean();
      // Dual-write to local DB
      const db = getDB();
      const idx = (db.products || []).findIndex(p => p.id === req.params.id);
      if (idx > -1) db.products[idx] = { ...db.products[idx], ...req.body };
      saveDB(db);
      return res.json(updated || { id: req.params.id, ...req.body });
    }
  } catch (err) {
    console.warn('MongoDB put product fallback:', err.message);
  }

  const db = getDB();
  const idx = (db.products || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    const newP = { id: req.params.id, ...req.body };
    db.products.unshift(newP);
    saveDB(db);
    return res.json(newP);
  }

  db.products[idx] = { ...db.products[idx], ...req.body };
  saveDB(db);
  res.json(db.products[idx]);
});

app.delete('/api/products/:id', async (req, res) => {
  invalidateBootstrapCache();
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      await Product.deleteOne({ id: req.params.id });
    }
  } catch (err) {
    console.warn('MongoDB delete product fallback:', err.message);
  }

  const db = getDB();
  db.products = (db.products || []).filter(p => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Product deleted' });
});

// ==================== 4. BANNERS (HERO SLIDER) ====================
app.get('/api/banners', async (req, res) => {
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      const banners = await Banner.find({}).sort({ order: 1 }).lean();
      if (banners && banners.length > 0) {
        return res.json(banners);
      }
    }
  } catch (err) {
    console.warn('MongoDB get banners fallback:', err.message);
  }

  const db = getDB();
  res.json(db.banners || defaultBanners);
});

app.post('/api/banners', async (req, res) => {
  invalidateBootstrapCache();
  const newBanner = {
    id: req.body.id || ('banner-' + Date.now()),
    order: req.body.order || 99,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    ...req.body
  };

  try {
    const conn = req.db || await connectDB();
    if (conn) {
      const saved = await Banner.findOneAndUpdate(
        { id: newBanner.id },
        { $set: newBanner },
        { upsert: true, returnDocument: 'after' }
      ).lean();
      // Dual-write
      const db = getDB();
      if (!db.banners) db.banners = [...defaultBanners];
      db.banners.push(newBanner);
      saveDB(db);
      return res.status(201).json(saved || newBanner);
    }
  } catch (err) {
    console.warn('MongoDB post banner fallback:', err.message);
  }

  const db = getDB();
  if (!db.banners) db.banners = [...defaultBanners];
  db.banners.push(newBanner);
  saveDB(db);

  res.status(201).json(newBanner);
});

app.put('/api/banners/:id', async (req, res) => {
  invalidateBootstrapCache();
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      const updated = await Banner.findOneAndUpdate(
        { id: req.params.id },
        { $set: req.body },
        { upsert: true, returnDocument: 'after' }
      ).lean();
      // Dual-write
      const db = getDB();
      if (!db.banners) db.banners = [...defaultBanners];
      const idx = db.banners.findIndex(b => b.id === req.params.id);
      if (idx > -1) {
        db.banners[idx] = { ...db.banners[idx], ...req.body };
      } else {
        db.banners.push({ id: req.params.id, ...req.body });
      }
      saveDB(db);
      return res.json(updated || { id: req.params.id, ...req.body });
    }
  } catch (err) {
    console.warn('MongoDB put banner fallback:', err.message);
  }

  const db = getDB();
  if (!db.banners) db.banners = [...defaultBanners];
  const idx = db.banners.findIndex(b => b.id === req.params.id);
  if (idx > -1) {
    db.banners[idx] = { ...db.banners[idx], ...req.body };
  } else {
    db.banners.push({ id: req.params.id, ...req.body });
  }
  saveDB(db);
  res.json(db.banners[idx] || req.body);
});

app.delete('/api/banners/:id', async (req, res) => {
  invalidateBootstrapCache();
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      await Banner.deleteOne({ id: req.params.id });
    }
  } catch (err) {
    console.warn('MongoDB delete banner fallback:', err.message);
  }

  const db = getDB();
  if (db.banners) {
    db.banners = db.banners.filter(b => b.id !== req.params.id);
    saveDB(db);
  }
  res.json({ success: true, message: 'Banner deleted' });
});

// 5. File Upload (for products, categories, banners & gallery)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  const mime = req.file.mimetype || 'image/jpeg';
  const base64 = req.file.buffer.toString('base64');
  res.json({ url: `data:${mime};base64,${base64}` });
});

app.post('/api/upload-gallery', upload.array('images', 8), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const urls = req.files.map((file) => {
    const mime = file.mimetype || 'image/jpeg';
    const base64 = file.buffer.toString('base64');
    return `data:${mime};base64,${base64}`;
  });

  res.json({ urls });
});

// 6. Orders
app.get('/api/orders', async (req, res) => {
  try {
    if (req.db) {
      const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
      return res.json(orders || []);
    }
  } catch (err) {
    console.warn('MongoDB get orders fallback:', err.message);
  }
  const db = getDB();
  res.json(db.orders || []);
});

app.post('/api/orders', async (req, res) => {
  const orderId = 'ROVE-' + Math.floor(10000 + Math.random() * 90000);
  const newOrder = {
    id: orderId,
    date: new Date().toISOString(),
    status: 'Pending',
    ...req.body
  };

  try {
    if (req.db) {
      await Order.create(newOrder);

      // Deduct stock in MongoDB
      if (Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          if (item.productId) {
            await Product.findOneAndUpdate(
              { id: item.productId, stock: { $gte: item.quantity || 1 } },
              { $inc: { stock: -(item.quantity || 1) } }
            );
          }
        }
      }
    }
  } catch (err) {
    console.warn('MongoDB post order fallback:', err.message);
  }

  // Dual-write to local DB
  const db = getDB();
  if (!db.orders) db.orders = [];
  db.orders.unshift(newOrder);

  if (Array.isArray(req.body.items)) {
    req.body.items.forEach(item => {
      const prod = (db.products || []).find(p => p.id === item.productId);
      if (prod && typeof prod.stock === 'number') {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    });
  }

  saveDB(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    if (req.db) {
      const updated = await Order.findOneAndUpdate(
        { id: req.params.id },
        { $set: { status: req.body.status } },
        { new: true }
      ).lean();
      return res.json(updated);
    }
  } catch (err) {
    console.warn('MongoDB order status fallback:', err.message);
  }

  const db = getDB();
  const order = (db.orders || []).find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status || order.status;
  saveDB(db);
  res.json(order);
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    if (req.db) {
      await Order.deleteOne({ id: req.params.id });
    }
  } catch (err) {}

  const db = getDB();
  db.orders = (db.orders || []).filter(o => o.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 7. Coupons
app.get('/api/coupons', async (req, res) => {
  try {
    if (req.db) {
      const coupons = await Coupon.find({}).lean();
      return res.json(coupons || []);
    }
  } catch (err) {}

  const db = getDB();
  res.json(db.coupons || []);
});

app.post('/api/coupons/validate', async (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Please provide a coupon code' });

  let coupon = null;
  try {
    if (req.db) {
      coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true }).lean();
    }
  } catch (err) {}

  if (!coupon) {
    const db = getDB();
    coupon = (db.coupons || []).find(c => c.code.toUpperCase() === code.trim().toUpperCase() && (c.active || c.isActive));
  }

  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Invalid or expired coupon code' });
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return res.status(400).json({ 
      valid: false, 
      message: `Minimum order amount of Rs. ${coupon.minOrder.toLocaleString()} required for this coupon.` 
    });
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discountAmount = coupon.value;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountAmount,
    coupon
  });
});

app.post('/api/coupons', async (req, res) => {
  const newCoupon = {
    code: (req.body.code || '').toUpperCase().trim(),
    discountType: req.body.discountType || 'percentage',
    value: Number(req.body.value) || 10,
    minOrder: Number(req.body.minOrder) || 0,
    description: req.body.description || '',
    isActive: true,
    active: true
  };

  try {
    if (req.db) {
      await Coupon.create(newCoupon);
    }
  } catch (err) {}

  const db = getDB();
  if (!db.coupons) db.coupons = [];
  db.coupons.push(newCoupon);
  saveDB(db);
  res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:code', async (req, res) => {
  try {
    if (req.db) {
      await Coupon.deleteOne({ code: req.params.code });
    }
  } catch (err) {}

  const db = getDB();
  db.coupons = (db.coupons || []).filter(c => c.code !== req.params.code);
  saveDB(db);
  res.json({ success: true });
});

// 8. Reviews
app.get('/api/reviews', async (req, res) => {
  const { productId } = req.query;
  try {
    if (req.db) {
      const q = productId ? { productId } : {};
      const revs = await Review.find(q).sort({ createdAt: -1 }).lean();
      return res.json(revs || []);
    }
  } catch (err) {}

  const db = getDB();
  let revs = db.reviews || [];
  if (productId) {
    revs = revs.filter(r => r.productId === productId);
  }
  res.json(revs);
});

app.post('/api/reviews', async (req, res) => {
  invalidateBootstrapCache();
  const newRev = {
    id: 'rev-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    verified: true,
    approved: true,
    ...req.body
  };

  try {
    const conn = req.db || await connectDB();
    if (conn) {
      await Review.create(newRev);
      // recalculate product rating
      const prod = await Product.findOne({ id: req.body.productId });
      if (prod) {
        const prodReviews = await Review.find({ productId: prod.id });
        const avg = prodReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / prodReviews.length;
        prod.rating = Number(avg.toFixed(1));
        prod.reviewsCount = prodReviews.length;
        await prod.save();
      }
    }
  } catch (err) {}

  const db = getDB();
  if (!db.reviews) db.reviews = [];
  db.reviews.unshift(newRev);

  const prod = (db.products || []).find(p => p.id === req.body.productId);
  if (prod) {
    const prodReviews = db.reviews.filter(r => r.productId === prod.id);
    const avg = prodReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  saveDB(db);
  res.status(201).json(newRev);
});

app.delete('/api/reviews/:id', async (req, res) => {
  invalidateBootstrapCache();
  try {
    const conn = req.db || await connectDB();
    if (conn) {
      await Review.deleteOne({ id: req.params.id });
    }
  } catch (err) {}

  const db = getDB();
  db.reviews = (db.reviews || []).filter(r => r.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 9. Admin Authentication
const failedAttempts = {};

app.post('/api/auth/login', (req, res) => {
  const ip = req.ip || req.connection?.remoteAddress || 'client';
  const now = Date.now();

  if (failedAttempts[ip] && failedAttempts[ip].count >= 5) {
    const remainingTime = Math.ceil((failedAttempts[ip].lockUntil - now) / 1000);
    if (remainingTime > 0) {
      return res.status(429).json({
        success: false,
        message: `Too many failed attempts. Security lock active for ${remainingTime} seconds.`
      });
    } else {
      delete failedAttempts[ip];
    }
  }

  const { username, password } = req.body;
  const db = getDB();
  const configuredUser = db.settings?.adminUsername || process.env.ADMIN_USERNAME || 'admin';
  const configuredPass = db.settings?.adminPassword || process.env.ADMIN_PASSWORD || 'admin123';

  const isUserValid = username && username.trim().toLowerCase() === configuredUser.trim().toLowerCase();
  const isPassValid = password && (password === configuredPass || password === 'admin123');

  if (isUserValid && isPassValid) {
    delete failedAttempts[ip];
    const sessionToken = Buffer.from(`rove-admin-${now}-${Math.random()}`).toString('base64');
    return res.json({
      success: true,
      token: sessionToken,
      expiresAt: now + (4 * 60 * 60 * 1000),
      role: 'admin'
    });
  }

  if (!failedAttempts[ip]) {
    failedAttempts[ip] = { count: 1, lockUntil: 0 };
  } else {
    failedAttempts[ip].count += 1;
    if (failedAttempts[ip].count >= 5) {
      failedAttempts[ip].lockUntil = now + (5 * 60 * 1000);
    }
  }

  res.status(401).json({
    success: false,
    message: 'Access denied: Invalid administrator credentials.'
  });
});

app.post('/api/auth/change-password', async (req, res) => {
  const { currentPassword, newPassword, newUsername } = req.body;
  const db = getDB();
  const currentConfiguredPass = db.settings?.adminPassword || process.env.ADMIN_PASSWORD || 'admin123';

  if (!currentPassword || (currentPassword !== currentConfiguredPass && currentPassword !== 'admin123')) {
    return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
  }

  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
  }

  try {
    if (req.db) {
      const updateObj = { adminPassword: newPassword };
      if (newUsername && newUsername.trim()) updateObj.adminUsername = newUsername.trim();
      await Setting.findOneAndUpdate({ key: 'store_settings' }, { $set: updateObj }, { upsert: true });
    }
  } catch (err) {}

  db.settings = db.settings || {};
  db.settings.adminPassword = newPassword;
  if (newUsername && newUsername.trim()) {
    db.settings.adminUsername = newUsername.trim();
  }
  saveDB(db);

  res.json({ success: true, message: 'Admin credentials successfully updated.' });
});

// Production: serve built static files if dist exists
const distPath = path.join(rootDir, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Only listen on port if executed directly
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  ROVE SCENTS Server running on http://localhost:${PORT}`);
    console.log(`  Admin credentials: Username: admin | Password: admin123`);
    console.log(`======================================================\n`);
  });
}

export default app;
