import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import mongoose from 'mongoose';

const SORT_OPTIONS = new Set(['createdAt', '-createdAt', 'price', '-price', 'name', '-name', 'rating', '-rating']);

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get category' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { 
      category, brand, minPrice, maxPrice, 
      sort = '-createdAt', page = 1, limit = 12 
    } = req.query;
    
    const query = { status: 'active' };
    
    const categoryFilter = req.params.slug || category;
    if (categoryFilter) {
      if (mongoose.Types.ObjectId.isValid(categoryFilter)) {
        query.category = categoryFilter;
      } else {
        const categoryDoc = await Category.findOne({ slug: categoryFilter, isActive: true });
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
    res.status(500).json({ error: 'Failed to get products' });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get product' });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active', isFeatured: true })
      .limit(10)
      .populate('category', 'name slug');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get featured products' });
  }
};

export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ status: 'active' })
      .sort('-createdAt')
      .limit(10)
      .populate('category', 'name slug');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get new arrivals' });
  }
};

export const getProductFilterMeta = async (req, res) => {
  try {
    const [brands, priceStats, categories] = await Promise.all([
      Product.distinct('brand', { status: 'active', brand: { $nin: [null, ''] } }),
      Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ]),
      Category.find({ isActive: true }).sort({ order: 1 }).select('name slug')
    ]);

    res.json({
      brands: brands.sort(),
      categories,
      price: {
        min: priceStats[0]?.minPrice || 0,
        max: priceStats[0]?.maxPrice || 0
      },
      sortOptions: [
        { value: '-createdAt', label: 'Newest first' },
        { value: 'price', label: 'Price: low to high' },
        { value: '-price', label: 'Price: high to low' },
        { value: '-rating', label: 'Top rated' },
        { value: 'name', label: 'Name: A to Z' }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get filter metadata' });
  }
};

export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const products = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      status: 'active'
    }).limit(5).populate('category', 'name slug');
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get related products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { status: 'discontinued' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

export const getAllProductsForAdmin = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};
    
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query)
      .sort('-createdAt')
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
    res.status(500).json({ error: 'Failed to get products' });
  }
};

export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { stock }, 
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock' });
  }
};
