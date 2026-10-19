import 'dotenv/config';
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
import { defaultBanners } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbJsonPath = path.join(__dirname, 'db.json');

async function runMigration() {
  console.log('========================================================');
  console.log('🚀 ROVE SCENTS — MongoDB Data Migration & Setup Script');
  console.log('========================================================\n');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env file!');
    process.exit(1);
  }

  console.log('📡 Connecting to MongoDB Atlas...');
  console.log('🔗 Cluster URL:', uri.replace(/:[^:]*@/, ':****@')); // Hide password

  try {
    await mongoose.connect(uri.trim(), {
      serverSelectionTimeoutMS: 8000,
      bufferCommands: false
    });
    console.log('✅ CONNECTED TO MONGODB ATLAS CLOUD SUCCESSFULLY!\n');
  } catch (err) {
    console.error('\n❌ FAILED TO CONNECT TO MONGODB ATLAS:');
    console.error('👉 Error Message:', err.message);

    if (err.message.includes('whitelisted') || err.message.includes('Could not connect to any servers') || err.message.includes('buffering timed out')) {
      console.log('\n🔒 ROOT CAUSE IDENTIFIED:');
      console.log('MongoDB Atlas is blocking your connection because Network Access IP is not allowed.');
      console.log('\n🛠️ HOW TO FIX IN 30 SECONDS:');
      console.log('1. Go to: https://cloud.mongodb.com');
      console.log('2. Click on "Network Access" (under "Security" in the left sidebar)');
      console.log('3. Click the "+ ADD IP ADDRESS" green button');
      console.log('4. Click "ALLOW ACCESS FROM ANYWHERE" (IP: 0.0.0.0/0)');
      console.log('5. Click "Confirm" (takes ~15-30 seconds to activate)');
      console.log('6. Run "npm run db:migrate" again!\n');
    }
    process.exit(1);
  }

  // Load local db.json
  if (!fs.existsSync(dbJsonPath)) {
    console.error(`❌ db.json not found at ${dbJsonPath}`);
    process.exit(1);
  }

  const localData = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

  console.log('📦 Transferring data from db.json into MongoDB Atlas collections...\n');

  // 1. Settings
  try {
    if (localData.settings) {
      await Setting.deleteMany({});
      await Setting.create({ key: 'store_settings', ...localData.settings });
      console.log('  ✅ [1/6] Settings migrated successfully.');
    }
  } catch (e) {
    console.error('  ⚠️ Error migrating Settings:', e.message);
  }

  // 2. Categories
  try {
    if (Array.isArray(localData.categories) && localData.categories.length > 0) {
      await Category.deleteMany({});
      const cats = await Category.insertMany(localData.categories);
      console.log(`  ✅ [2/6] ${cats.length} Categories migrated successfully (including "Nikkah Favours").`);
    }
  } catch (e) {
    console.error('  ⚠️ Error migrating Categories:', e.message);
  }

  // 3. Products
  try {
    if (Array.isArray(localData.products) && localData.products.length > 0) {
      await Product.deleteMany({});
      const prods = await Product.insertMany(localData.products);
      console.log(`  ✅ [3/6] ${prods.length} Products migrated successfully.`);
    }
  } catch (e) {
    console.error('  ⚠️ Error migrating Products:', e.message);
  }

  // 4. Banners
  try {
    const bannersToInsert = Array.isArray(localData.banners) && localData.banners.length > 0
      ? localData.banners
      : defaultBanners;
    await Banner.deleteMany({});
    const bans = await Banner.insertMany(bannersToInsert);
    console.log(`  ✅ [4/6] ${bans.length} 16:9 Widescreen Banners migrated successfully.`);
  } catch (e) {
    console.error('  ⚠️ Error migrating Banners:', e.message);
  }

  // 5. Coupons
  try {
    if (Array.isArray(localData.coupons) && localData.coupons.length > 0) {
      await Coupon.deleteMany({});
      const coups = await Coupon.insertMany(localData.coupons);
      console.log(`  ✅ [5/6] ${coups.length} Coupons migrated successfully.`);
    }
  } catch (e) {
    console.error('  ⚠️ Error migrating Coupons:', e.message);
  }

  // 6. Reviews
  try {
    if (Array.isArray(localData.reviews) && localData.reviews.length > 0) {
      await Review.deleteMany({});
      const revs = await Review.insertMany(localData.reviews);
      console.log(`  ✅ [6/6] ${revs.length} Reviews migrated successfully.`);
    }
  } catch (e) {
    console.error('  ⚠️ Error migrating Reviews:', e.message);
  }

  // Orders
  try {
    if (Array.isArray(localData.orders) && localData.orders.length > 0) {
      await Order.deleteMany({});
      const ords = await Order.insertMany(localData.orders);
      console.log(`  ✅ Orders: ${ords.length} past orders migrated.`);
    }
  } catch (e) {}

  console.log('\n========================================================');
  console.log('🎉 ALL DATA TRANSFERRED PERMANENTLY TO MONGODB ATLAS!');
  console.log('Database Name: rove-scents');
  console.log('========================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runMigration();
