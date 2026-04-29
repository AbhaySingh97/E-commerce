import { Coupon } from '../models/Coupon.js';
import { Order } from '../models/Order.js';

export const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) {
      return res.status(400).json({ valid: false, error: 'Invalid coupon code' });
    }
    
    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
      return res.status(400).json({ valid: false, error: 'Coupon has expired' });
    }
    
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, error: 'Coupon usage limit reached' });
    }
    
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return res.status(400).json({ 
        valid: false, 
        error: `Minimum order value is ₹${coupon.minOrderValue}` 
      });
    }
    
    let discount = 0;
    if (coupon.type === 'flat') {
      discount = coupon.value;
    } else if (coupon.type === 'percent') {
      discount = (cartTotal * coupon.value) / 100;
      if (coupon.maxDiscountCap && discount > coupon.maxDiscountCap) {
        discount = coupon.maxDiscountCap;
      }
    }
    
    res.json({ valid: true, discount, type: coupon.type, value: coupon.value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to validate coupon' });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true, validUntil: { $gt: new Date() } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get coupons' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create coupon' });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update coupon' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndUpdate(req.params.id, { isActive: false });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
};

export const getCouponUsage = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    
    const orders = await Order.find({ coupon: coupon._id });
    
    res.json({
      usedCount: coupon.usedCount,
      orders
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get coupon usage' });
  }
};
