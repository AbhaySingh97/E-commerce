import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import mongoose from 'mongoose';

const calculateCartTotals = (items, coupon) => {
  let totalAmount = 0;
  let discountAmount = 0;
  
  items.forEach(item => {
    totalAmount += item.price * item.quantity;
  });
  
  if (coupon) {
    if (coupon.type === 'flat') {
      discountAmount = coupon.value;
    } else if (coupon.type === 'percent') {
      discountAmount = (totalAmount * coupon.value) / 100;
      if (coupon.maxDiscountCap && discountAmount > coupon.maxDiscountCap) {
        discountAmount = coupon.maxDiscountCap;
      }
    }
  }
  
  const taxRate = 0.18;
  const taxAmount = Math.round((totalAmount - discountAmount) * taxRate);
  const shippingAmount = totalAmount > 500 ? 0 : 50;
  const grandTotal = totalAmount - discountAmount + taxAmount + shippingAmount;
  
  return {
    totalAmount,
    discountAmount,
    taxAmount,
    shippingAmount,
    grandTotal: Math.max(0, grandTotal)
  };
};

export const getCart = async (req, res) => {
  try {
    let cart = null;
    
    if (req.userId) {
      cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    } else if (req.sessionId) {
      cart = await Cart.findOne({ sessionId: req.sessionId }).populate('items.product');
    }
    
    if (!cart) {
      return res.json({ items: [], totalAmount: 0, grandTotal: 0 });
    }
    
    if (cart.coupon) {
      cart = await cart.populate('coupon');
    }
    
    const totals = calculateCartTotals(cart.items, cart.coupon);
    res.json({ ...cart.toObject(), ...totals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cart' });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    let cart = null;
    const userId = req.userId ? new mongoose.Types.ObjectId(req.userId) : null;
    const sessionId = req.sessionId || `guest_${Date.now()}`;
    
    if (req.userId) {
      cart = await Cart.findOne({ user: req.userId });
    } else {
      cart = await Cart.findOne({ sessionId });
    }
    
    if (!cart) {
      cart = new Cart({
        user: userId,
        sessionId: req.userId ? undefined : sessionId,
        items: []
      });
    }
    
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.images[0] || '',
        price: product.price,
        quantity
      });
    }
    
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { quantity } = req.body;
    
    let cart = null;
    
    if (req.userId) {
      cart = await Cart.findOne({ user: req.userId });
    } else if (req.sessionId) {
      cart = await Cart.findOne({ sessionId: req.sessionId });
    }
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const item = cart.items.id(variantId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const product = await Product.findById(item.product);
    if (product && product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { variantId } = req.params;
    
    let cart = null;
    
    if (req.userId) {
      cart = await Cart.findOne({ user: req.userId });
    } else if (req.sessionId) {
      cart = await Cart.findOne({ sessionId: req.sessionId });
    }
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(
      (item) => item._id.toString() !== variantId
    );
    
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

export const clearCart = async (req, res) => {
  try {
    if (req.userId) {
      await Cart.findOneAndDelete({ user: req.userId });
    } else if (req.sessionId) {
      await Cart.findOneAndDelete({ sessionId: req.sessionId });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(400).json({ error: 'Invalid coupon' });
    }
    
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ error: 'Coupon expired' });
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    
    let cart = null;
    
    if (req.userId) {
      cart = await Cart.findOne({ user: req.userId });
    } else if (req.sessionId) {
      cart = await Cart.findOne({ sessionId: req.sessionId });
    }
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    const totals = calculateCartTotals(cart.items, coupon);
    if (coupon.minOrderValue && totals.totalAmount < coupon.minOrderValue) {
      return res.status(400).json({ error: `Minimum order value is ₹${coupon.minOrderValue}` });
    }
    
    cart.coupon = coupon._id;
    await cart.save();
    res.json({ ...cart.toObject(), coupon });
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply coupon' });
  }
};

export const removeCoupon = async (req, res) => {
  try {
    let cart = null;
    
    if (req.userId) {
      cart = await Cart.findOne({ user: req.userId });
    } else if (req.sessionId) {
      cart = await Cart.findOne({ sessionId: req.sessionId });
    }
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    cart.coupon = undefined;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove coupon' });
  }
};

export const mergeCart = async (userId, sessionId) => {
  try {
    const guestCart = await Cart.findOne({ sessionId });
    if (!guestCart || guestCart.items.length === 0) return;

    let userCart = await Cart.findOne({ user: userId });
    if (!userCart) {
      userCart = new Cart({ user: userId, items: [] });
    }

    guestCart.items.forEach((guestItem) => {
      const existingItem = userCart.items.find(
        (item) => item.product.toString() === guestItem.product.toString()
      );

      if (existingItem) {
        existingItem.quantity += guestItem.quantity;
      } else {
        userCart.items.push(guestItem);
      }
    });

    await userCart.save();
    await Cart.findOneAndDelete({ sessionId });
  } catch (error) {
    console.error('Failed to merge cart:', error);
  }
};
