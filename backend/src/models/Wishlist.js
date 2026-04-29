import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  addedAt: { type: Date, default: Date.now }
});

const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'My Wishlist' },
  items: { type: [wishlistItemSchema], default: [] },
  isPublic: { type: Boolean, default: false },
  shareLink: { type: String }
}, { timestamps: true });

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
