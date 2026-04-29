import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  type: { type: String, enum: ['flat', 'percent', 'free_shipping', 'buy_x_get_y'], required: true },
  value: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscountCap: { type: Number },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  perUserLimit: { type: Number, default: 1 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  applicableProducts: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] },
  applicableCategories: { type: [mongoose.Schema.Types.ObjectId], ref: 'Category', default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const Coupon = mongoose.model('Coupon', couponSchema);
