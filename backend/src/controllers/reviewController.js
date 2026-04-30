import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

export const getProductReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10, rating } = req.query;
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const query = { product: product._id, status: 'approved' };
    if (rating) query.rating = rating;
    
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    const total = await Review.countDocuments(query);
    
    const stats = await Review.aggregate([
      { $match: { product: product._id, status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);
    
    res.json({ reviews, stats, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reviews' });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment, images } = req.body;
    
    const product = productId
      ? await Product.findById(productId)
      : await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const resolvedProductId = product._id;
    
    const hasOrdered = await Order.findOne({
      user: req.userId,
      'items.product': resolvedProductId,
      paymentStatus: 'paid',
      status: { $in: ['delivered', 'confirmed', 'processing', 'shipped'] }
    });
    
    const isVerifiedPurchase = !!hasOrdered;
    
    const review = new Review({
      product: resolvedProductId,
      user: req.userId,
      rating,
      title,
      comment,
      images,
      isVerifiedPurchase,
      status: 'approved'
    });
    
    await review.save();
    
    const reviews = await Review.find({ product: resolvedProductId, status: 'approved' });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = totalRating / reviews.length;
    product.reviewCount = reviews.length;
    await product.save();
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
};

export const deleteReview = async (req, res) => {
  try {
    await Review.findOneAndDelete({ _id: req.params.id, user: req.userId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

export const markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpfulCount: 1 } },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark helpful' });
  }
};

export const getRatingSummary = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const stats = await Review.aggregate([
      { $match: { product: product._id, status: 'approved' } },
      { $group: { _id: '$rating', count: { $sum: 1 } } }
    ]);
    
    const summary = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats.forEach((s) => { summary[s._id] = s.count; });
    
    res.json({ rating: product.rating, reviewCount: product.reviewCount, ...summary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get rating summary' });
  }
};
