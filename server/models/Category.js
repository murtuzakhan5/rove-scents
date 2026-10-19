import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, default: '/images/cat-all.jpg' }
}, { timestamps: true, strict: false });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
