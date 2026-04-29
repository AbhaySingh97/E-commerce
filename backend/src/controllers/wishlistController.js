import { Wishlist } from '../models/Wishlist.js';
import { Product } from '../models/Product.js';
import { Cart } from '../models/Cart.js';

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId })
      .populate('items.product');
    
    if (!wishlist) {
      const newWishlist = new Wishlist({ user: req.userId, items: [] });
      await newWishlist.save();
      return res.json(newWishlist);
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get wishlist' });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let wishlist = await Wishlist.findOne({ user: req.userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, items: [] });
    }
    
    const exists = wishlist.items.find(
      (item) => item.product.toString() === productId
    );
    
    if (!exists) {
      wishlist.items.push({ product: productId, addedAt: new Date() });
      await wishlist.save();
    }
    
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.userId });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );
    
    await wishlist.save();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
};

export const moveToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const wishlist = await Wishlist.findOne({ user: req.userId });
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] });
    }
    
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity: 1
      });
    }
    
    await cart.save();
    
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );
    await wishlist.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to move to cart' });
  }
};

export const createWishlist = async (req, res) => {
  try {
    const { name } = req.body;
    
    const wishlist = new Wishlist({
      user: req.userId,
      name: name || 'My Wishlist',
      items: []
    });
    
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
};
