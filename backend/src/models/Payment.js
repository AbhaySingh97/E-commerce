import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gateway: { type: String, enum: ['razorpay', 'stripe'], default: 'razorpay' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'captured', 'failed', 'refunded'], default: 'pending' },
  gatewayPaymentId: { type: String },
  gatewayOrderId: { type: String },
  gatewaySignature: { type: String },
  webhookData: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export const Payment = mongoose.model('Payment', paymentSchema);
