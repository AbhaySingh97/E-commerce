import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Payment } from '../models/Payment.js';
import mongoose from 'mongoose';

const generateOrderNumber = async () => {
  const count = await Order.countDocuments();
  const orderNum = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  return orderNum;
};

export const createOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod = 'razorpay' } = req.body;
    
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    
    const orderNumber = await generateOrderNumber();
    
    let subtotal = 0;
    const items = cart.items.map((item) => {
      const total = item.price * item.quantity;
      subtotal += total;
      return {
        product: item.product._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        total
      };
    });
    
    const discountAmount = cart.discountAmount || 0;
    const taxAmount = Math.round((subtotal - discountAmount) * 0.18);
    const shippingAmount = subtotal > 500 ? 0 : 50;
    const totalAmount = subtotal - discountAmount + taxAmount + shippingAmount;
    
    const order = new Order({
      orderNumber,
      user: req.userId,
      items,
      billingAddress: req.body.billingAddress,
      shippingAddress: req.body.shippingAddress,
      subtotal,
      taxAmount,
      shippingAmount,
      discountAmount,
      totalAmount,
      paymentMethod,
      status: 'pending',
      statusHistory: [{ status: 'pending', timestamp: new Date() }]
    });
    
    await order.save();
    
    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }
    
    await Cart.findByIdAndDelete(cart._id);
    
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { user: req.userId };
    if (status) query.status = status;
    
    const orders = await Order.find(query)
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get order' });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }
    
    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', timestamp: new Date() });
    await order.save();
    
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel order' });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'Only delivered orders can be returned' });
    }
    
    order.status = 'return_requested';
    order.statusHistory.push({ 
      status: 'return_requested', 
      note: req.body.reason,
      timestamp: new Date() 
    });
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to request return' });
  }
};

export const adminGetOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get orders' });
  }
};

export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    order.status = status;
    order.statusHistory.push({ status, note, timestamp: new Date() });
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
