import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [orderItemSchema], required: true },
  billingAddress: { type: mongoose.Schema.Types.Mixed, required: true },
  shippingAddress: { type: mongoose.Schema.Types.Mixed, required: true },
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  shippingAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'return_requested', 'returned', 'refunded'],
    default: 'pending'
  },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['razorpay', 'cod', 'wallet'], default: 'razorpay' },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  trackingNumber: { type: String },
  coupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  notes: { type: String },
  statusHistory: [{
    status: { type: String },
    note: { type: String },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
