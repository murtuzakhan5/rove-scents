import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, default: 'percentage' },
  value: { type: Number, default: 10 },
  minOrder: { type: Number, default: 2000 },
  description: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, strict: false });

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
