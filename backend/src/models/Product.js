import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  SKU: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  brand: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: { type: [String], default: [] },
  status: { type: String, enum: ['draft', 'active', 'discontinued'], default: 'draft' },
  isFeatured: { type: Boolean, default: false },
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number }
  },
  images: { type: [String], default: [] },
  videoUrl: { type: String },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  stock: { type: Number, default: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  attributes: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);
