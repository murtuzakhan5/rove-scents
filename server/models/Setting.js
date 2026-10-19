import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
  key: { type: String, default: 'store_settings', unique: true },
  storeName: { type: String, default: 'ROVE SCENTS' },
  storeSlogan: { type: String, default: 'SCENT YOUR STORY' },
  whatsappNumber: { type: String, default: '923001234567' },
  whatsappDisplay: { type: String, default: '+92 300 1234567' },
  contactEmail: { type: String, default: 'support@rovescents.pk' },
  announcementText: { type: String, default: '✨ FREE NATIONWIDE SHIPPING ON ORDERS OVER RS. 2,500 | CASH ON DELIVERY (COD) AVAILABLE ✨' },
  heroBadge: { type: String, default: 'HAUTE PARFUMERIE COLLECTION' },
  heroTitle: { type: String, default: 'SCENT YOUR UNFORGETTABLE STORY' },
  heroSubtitle: { type: String, default: 'Masterpiece French-grade impressions crafted with 35% pure oil concentration. Exquisite sillage that lingers 14+ hours on skin and fabrics.' },
  heroBtnText: { type: String, default: 'SHOP BEST SELLERS' },
  heroSecondaryBtnText: { type: String, default: 'EXPLORE RUKH (رخ)' },
  heroImageUrl: { type: String, default: '/images/rove-rukh-banner.jpg' },
  deliveryCharge: { type: Number, default: 200 },
  freeDeliveryThreshold: { type: Number, default: 2500 },
  bankDetails: { type: String, default: '' }
}, { timestamps: true, strict: false });

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
