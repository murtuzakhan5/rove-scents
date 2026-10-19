import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, default: null },
  isCollection: { type: Boolean, default: false },
  tag: { type: String, default: '' },
  badge: { type: String, default: '' },
  title: { type: String, required: true },
  arabic: { type: String, default: '' },
  genre: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  price: { type: Number, default: 2650 },
  comparePrice: { type: Number, default: 3950 },
  bannerImage: { type: String, required: true },
  bottleImage: { type: String, default: '' },
  rating: { type: String, default: '5.0' },
  reviews: { type: String, default: 'Verified Buyers' },
  topNote: { type: String, default: '' },
  heartNote: { type: String, default: '' },
  baseNote: { type: String, default: '' },
  btnText: { type: String, default: 'BUY NOW (COD)' },
  btnLink: { type: String, default: '' },
  accentGlow: { type: String, default: 'rgba(212, 175, 55, 0.35)' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
