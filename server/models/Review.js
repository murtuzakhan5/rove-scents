import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, default: '' },
  author: { type: String, default: 'Verified Customer' },
  name: { type: String, default: '' },
  city: { type: String, default: '' },
  rating: { type: Number, default: 5 },
  title: { type: String, default: '' },
  comment: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  verified: { type: Boolean, default: true },
  approved: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
