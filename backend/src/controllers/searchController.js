import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import mongoose from 'mongoose';

const SORT_OPTIONS = new Set(['createdAt', '-createdAt', 'price', '-price', 'name', '-name', 'rating', '-rating']);

export const searchProducts = async (req, res) => {
  try {
    const { q, category, brand, minPrice, maxPrice, sort = '-createdAt', page = 1, limit = 12 } = req.query;
    
    const query = { status: 'active' };
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const categoryDoc = await Category.findOne({ slug: category, isActive: true });
        if (!categoryDoc) {
          return res.json({ products: [], pagination: { total: 0, page: Number(page), pages: 0 } });
        }
        query.category = categoryDoc._id;
      }
    }
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(query)
      .sort(SORT_OPTIONS.has(sort) ? sort : '-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('category', 'name slug');
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search products' });
  }
};

export const autocomplete = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const products = await Product.find({
      status: 'active',
      name: { $regex: q, $options: 'i' }
    })
      .select('name slug images')
      .limit(5);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
};

export const getTrendingSearches = async (req, res) => {
  const trending = ['Phone', 'Laptop', 'Headphones', 'Camera', 'Watch', 'Shoes', 'Clothing'];
  res.json(trending);
}
