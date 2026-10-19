import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, default: '' },
  name: { type: String, required: true },
  rating: { type: Number, default: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  verified: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
