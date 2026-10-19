import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String },
  category: { type: String, default: 'men' },
  gender: { type: String, default: 'Men' },
  inspiredBy: { type: String, default: '' },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  stock: { type: Number, default: 50 },
  featured: { type: Boolean, default: false },
  badge: { type: String, default: '' },
  bottleSize: { type: String, default: '50ml Eau De Parfum' },
  rating: { type: Number, default: 5 },
  reviewsCount: { type: Number, default: 1 },
  image: { type: String, default: '/images/cat-all.jpg' },
  galleryImages: { type: [String], default: [] },
  shortDesc: { type: String, default: '' },
  description: { type: String, default: '' },
  topNotes: { type: String, default: '' },
  heartNotes: { type: String, default: '' },
  baseNotes: { type: String, default: '' },
  longevity: { type: String, default: '14+ Hours' },
  sillage: { type: String, default: 'Strong' },
  season: { type: String, default: 'All Season' }
}, { timestamps: true, strict: false });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
