import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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

// Helper to read and write database
const dbPath = path.join(__dirname, 'db.json');

function getDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { settings: {}, categories: [], products: [], coupons: [], orders: [], reviews: [] };
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving db.json:', err);
    return false;
  }
}

// ==================== API ROUTES ====================

// 1. Settings
app.get('/api/settings', (req, res) => {
  const db = getDB();
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json({ success: true, settings: db.settings });
});

// 2. Categories
app.get('/api/categories', (req, res) => {
  const db = getDB();
  res.json(db.categories);
});

// 3. Products
app.get('/api/products', (req, res) => {
  const db = getDB();
  const { category, search, sort } = req.query;
  let list = [...db.products];

  if (category && category !== 'all') {
    list = list.filter(p => p.category?.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
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

app.get('/api/products/:id', (req, res) => {
  const db = getDB();
  const prod = db.products.find(p => p.id === req.params.id || p.slug === req.params.id);
  if (!prod) return res.status(404).json({ error: 'Product not found' });
  res.json(prod);
});

app.post('/api/products', (req, res) => {
  const db = getDB();
  const newProduct = {
    id: 'prod-' + Date.now(),
    slug: (req.body.name || 'perfume').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    rating: 5.0,
    reviewsCount: 1,
    ...req.body
  };
  db.products.unshift(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const db = getDB();
  const idx = db.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found' });

  db.products[idx] = { ...db.products[idx], ...req.body };
  saveDB(db);
  res.json(db.products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  const db = getDB();
  const initialLen = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  if (db.products.length === initialLen) return res.status(404).json({ error: 'Product not found' });
  saveDB(db);
  res.json({ success: true, message: 'Product deleted' });
});

// 4. File Upload (for products, categories & gallery)
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  try {
    if (isDiskWritable) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      const filename = `perfume-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      return res.json({ url: `/uploads/${filename}` });
    }
  } catch (err) {
    console.warn('Failed writing to disk, falling back to base64 Data URL:', err);
  }

  // Fallback to Base64 Data URL (100% works on Vercel & serverless)
  const mime = req.file.mimetype || 'image/jpeg';
  const base64 = req.file.buffer.toString('base64');
  res.json({ url: `data:${mime};base64,${base64}` });
});

app.post('/api/upload-gallery', upload.array('images', 8), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const urls = req.files.map((file) => {
    try {
      if (isDiskWritable) {
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `perfume-${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, file.buffer);
        return `/uploads/${filename}`;
      }
    } catch (e) {
      // fallback
    }
    const mime = file.mimetype || 'image/jpeg';
    return `data:${mime};base64,${file.buffer.toString('base64')}`;
  });

  res.json({ urls });
});

// Categories update (including thumbnail and active list)
app.put('/api/categories', (req, res) => {
  const db = getDB();
  db.categories = req.body;
  saveDB(db);
  res.json({ success: true, categories: db.categories });
});

// 5. Orders
app.get('/api/orders', (req, res) => {
  const db = getDB();
  res.json(db.orders || []);
});

app.post('/api/orders', (req, res) => {
  const db = getDB();
  const orderId = 'ROVE-' + Math.floor(10000 + Math.random() * 90000);
  const newOrder = {
    id: orderId,
    date: new Date().toISOString(),
    status: 'Pending',
    ...req.body
  };
  if (!db.orders) db.orders = [];
  db.orders.unshift(newOrder);

  // Update product stock levels
  if (Array.isArray(req.body.items)) {
    req.body.items.forEach(item => {
      const prod = db.products.find(p => p.id === item.productId);
      if (prod && typeof prod.stock === 'number') {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    });
  }

  saveDB(db);
  res.status(201).json(newOrder);
});

app.put('/api/orders/:id/status', (req, res) => {
  const db = getDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.status = req.body.status || order.status;
  saveDB(db);
  res.json(order);
});

app.delete('/api/orders/:id', (req, res) => {
  const db = getDB();
  db.orders = db.orders.filter(o => o.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 6. Coupons
app.get('/api/coupons', (req, res) => {
  const db = getDB();
  res.json(db.coupons || []);
});

app.post('/api/coupons/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Please provide a coupon code' });

  const db = getDB();
  const coupon = (db.coupons || []).find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);

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

app.post('/api/coupons', (req, res) => {
  const db = getDB();
  const newCoupon = {
    code: (req.body.code || '').toUpperCase().trim(),
    discountType: req.body.discountType || 'percentage',
    value: Number(req.body.value) || 10,
    minOrder: Number(req.body.minOrder) || 0,
    description: req.body.description || '',
    active: true
  };
  if (!db.coupons) db.coupons = [];
  db.coupons.push(newCoupon);
  saveDB(db);
  res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:code', (req, res) => {
  const db = getDB();
  db.coupons = (db.coupons || []).filter(c => c.code !== req.params.code);
  saveDB(db);
  res.json({ success: true });
});

// 7. Reviews
app.get('/api/reviews', (req, res) => {
  const db = getDB();
  const { productId } = req.query;
  let revs = db.reviews || [];
  if (productId) {
    revs = revs.filter(r => r.productId === productId);
  }
  res.json(revs);
});

app.post('/api/reviews', (req, res) => {
  const db = getDB();
  const newRev = {
    id: 'rev-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    verified: true,
    approved: true,
    ...req.body
  };
  if (!db.reviews) db.reviews = [];
  db.reviews.unshift(newRev);

  // recalculate product rating
  const prod = db.products.find(p => p.id === req.body.productId);
  if (prod) {
    const prodReviews = db.reviews.filter(r => r.productId === prod.id);
    const avg = prodReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / prodReviews.length;
    prod.rating = Number(avg.toFixed(1));
    prod.reviewsCount = prodReviews.length;
  }

  saveDB(db);
  res.status(201).json(newRev);
});

app.delete('/api/reviews/:id', (req, res) => {
  const db = getDB();
  db.reviews = (db.reviews || []).filter(r => r.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// 8. Simple Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    return res.json({ success: true, token: 'rove-admin-session-' + Date.now(), role: 'admin' });
  }
  res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

// Production: serve built static files if dist exists (for local or traditional hosting)
const distPath = path.join(rootDir, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Only listen on port if executed directly (not when imported by Vercel serverless functions)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  ROVE SCENTS Server running on http://localhost:${PORT}`);
    console.log(`  Admin credentials: Username: admin | Password: admin123`);
    console.log(`======================================================\n`);
  });
}

export default app;
