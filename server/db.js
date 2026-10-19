import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Product from './models/Product.js';
import Category from './models/Category.js';
import Banner from './models/Banner.js';
import Order from './models/Order.js';
import Coupon from './models/Coupon.js';
import Setting from './models/Setting.js';
import Review from './models/Review.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, 'db.json');

// Default initial banners matching AutoHeroSlider
const defaultBanners = [
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
    rating: '5.0',
    reviews: '164 Verified Buyers',
    topNote: 'Bergamot & Cardamom',
    heartNote: 'Tuscan Iris & Jasmine',
    baseNote: 'Smoked Amber & Sandalwood',
    btnText: 'BUY NOW (COD) — RS. 2,650',
    btnLink: '',
    accentGlow: 'rgba(212, 175, 55, 0.35)',
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
    rating: '5.0',
    reviews: '142 Verified Buyers',
    topNote: 'White Blossom & Mandarin',
    heartNote: 'Velvet Jasmine & Cashmere',
    baseNote: 'Dark Vanilla & Rich Amber',
    btnText: 'BUY NOW (COD) — RS. 2,650',
    btnLink: '',
    accentGlow: 'rgba(212, 175, 55, 0.4)',
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
    rating: '5.0',
    reviews: '129 Verified Buyers',
    topNote: 'Peach & Wild Berries',
    heartNote: 'Damask Rose & Magnolia',
    baseNote: 'Spun Sugar & White Musk',
    btnText: 'BUY NOW (COD) — RS. 2,650',
    btnLink: '',
    accentGlow: 'rgba(244, 114, 182, 0.35)',
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
    rating: '5.0',
    reviews: '500+ Verified Buyers',
    topNote: '4 Iconic Signatures',
    heartNote: '16+ Hours Lasting Sillage',
    baseNote: 'Free Nationwide COD Delivery',
    btnText: 'SHOP ALL PRODUCTS',
    btnLink: '',
    accentGlow: 'rgba(212, 175, 55, 0.4)',
    order: 4,
    isActive: true
  }
];

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Auto-seed MongoDB from db.json if collections are empty
export async function seedFromLocalIfEmpty() {
  try {
    let localData = null;
    if (fs.existsSync(dbJsonPath)) {
      try {
        localData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
      } catch (e) {}
    }

    // 1. Settings
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0 && localData?.settings) {
      await Setting.create({ key: 'store_settings', ...localData.settings });
      console.log('🌱 Seeded settings to MongoDB');
    }

    // 2. Categories
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0 && Array.isArray(localData?.categories) && localData.categories.length > 0) {
      await Category.insertMany(localData.categories);
      console.log(`🌱 Seeded ${localData.categories.length} categories to MongoDB`);
    }

    // 3. Products
    const productsCount = await Product.countDocuments();
    if (productsCount === 0 && Array.isArray(localData?.products) && localData.products.length > 0) {
      await Product.insertMany(localData.products);
      console.log(`🌱 Seeded ${localData.products.length} products to MongoDB`);
    }

    // 4. Banners
    const bannersCount = await Banner.countDocuments();
    if (bannersCount === 0) {
      const bannersToInsert = Array.isArray(localData?.banners) && localData.banners.length > 0
        ? localData.banners
        : defaultBanners;
      await Banner.insertMany(bannersToInsert);
      console.log(`🌱 Seeded ${bannersToInsert.length} banners to MongoDB`);
    }

    // 5. Coupons
    const couponsCount = await Coupon.countDocuments();
    if (couponsCount === 0 && Array.isArray(localData?.coupons) && localData.coupons.length > 0) {
      await Coupon.insertMany(localData.coupons);
      console.log(`🌱 Seeded ${localData.coupons.length} coupons to MongoDB`);
    }

    // 6. Reviews
    const reviewsCount = await Review.countDocuments();
    if (reviewsCount === 0 && Array.isArray(localData?.reviews) && localData.reviews.length > 0) {
      await Review.insertMany(localData.reviews);
      console.log(`🌱 Seeded ${localData.reviews.length} reviews to MongoDB`);
    }
  } catch (err) {
    console.error('Error during MongoDB auto-seeding:', err.message);
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    };

    cached.promise = mongoose.connect(uri.trim(), opts).then(async (mongooseInstance) => {
      console.log('✅ Successfully connected to MongoDB Cloud');
      await seedFromLocalIfEmpty();
      return mongooseInstance;
    }).catch(err => {
      cached.promise = null;
      console.error('❌ MongoDB Connection Error:', err.message);
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    return null;
  }
}

export { defaultBanners };
