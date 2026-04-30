import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Counter } from '../models/Counter.js';
import { calculateCartTotals } from './cartController.js';
import mongoose from 'mongoose';

const generateOrderNumber = async (session) => {
  const year = new Date().getFullYear();
  const counter = await Counter.findOneAndUpdate(
    { name: `order-${year}` },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, session }
  );
  return `ORD-${year}-${String(counter.sequence).padStart(5, '0')}`;
};

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const order = await session.withTransaction(async () => {
      const { paymentMethod = 'razorpay' } = req.body;

      const cart = await Cart.findOne({ user: req.userId })
        .session(session)
        .populate('items.product')
        .populate('coupon');

      if (!cart || cart.items.length === 0) {
        const error = new Error('Cart is empty');
        error.statusCode = 400;
        throw error;
      }

      if (!req.body.billingAddress || !req.body.shippingAddress) {
        const error = new Error('Billing and shipping addresses are required');
        error.statusCode = 400;
        throw error;
      }

      const totals = calculateCartTotals(cart.items, cart.coupon);
      const orderNumber = await generateOrderNumber(session);
      const items = cart.items.map((item) => ({
        product: item.product._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      for (const item of cart.items) {
        const result = await Product.updateOne(
          { _id: item.product._id, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session }
        );

        if (result.modifiedCount !== 1) {
          const error = new Error(`Insufficient stock for ${item.name}`);
          error.statusCode = 400;
          throw error;
        }
      }

      const [createdOrder] = await Order.create([{
        orderNumber,
        user: req.userId,
        items,
        billingAddress: req.body.billingAddress,
        shippingAddress: req.body.shippingAddress,
        subtotal: totals.totalAmount,
        taxAmount: totals.taxAmount,
        shippingAmount: totals.shippingAmount,
        discountAmount: totals.discountAmount,
        totalAmount: totals.grandTotal,
        paymentMethod,
        coupon: cart.coupon?._id,
        status: 'pending',
        statusHistory: [{ status: 'pending', timestamp: new Date() }]
      }], { session });

      if (cart.coupon?._id) {
        await Coupon.updateOne(
          { _id: cart.coupon._id },
          { $inc: { usedCount: 1 } },
          { session }
        );
      }

      await Cart.findByIdAndDelete(cart._id, { session });
      return createdOrder;
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Failed to create order' });
  } finally {
    await session.endSession();
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
