import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  date: { type: String, default: () => new Date().toISOString() },
  status: { type: String, default: 'Pending' },
  customer: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    province: String,
    postalCode: String,
    email: String,
    notes: String
  },
  items: { type: Array, default: [] },
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 200 },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  total: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'COD' }
}, { timestamps: true, strict: false });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
