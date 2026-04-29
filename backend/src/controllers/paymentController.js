import Razorpay from 'razorpay';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export const initiatePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findOne({ _id: orderId, user: req.userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      receipt: order.orderNumber
    });
    
    const payment = new Payment({
      order: order._id,
      user: req.userId,
      amount: order.totalAmount,
      gateway: 'razorpay',
      status: 'pending',
      gatewayOrderId: razorpayOrder.id
    });
    
    await payment.save();
    
    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Payment init error:', error);
    res.status(500).json({ error: 'Failed to initiate payment' });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const payment = await Payment.findOne({ gatewayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');
    
    if (generatedSignature !== razorpay_signature) {
      payment.status = 'failed';
      await payment.save();
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    payment.status = 'captured';
    payment.gatewayPaymentId = razorpay_payment_id;
    payment.gatewaySignature = razorpay_signature;
    await payment.save();
    
    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'paid';
      order.payment = payment._id;
      order.status = 'confirmed';
      order.statusHistory.push({ status: 'confirmed', timestamp: new Date() });
      await order.save();
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Payment verify error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const signature = req.headers['x-razorpay-signature'];
    
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (signature !== generatedSignature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const event = req.body;
    
    if (event.event === 'payment.captured') {
      const payment = await Payment.findOne({ 
        gatewayOrderId: event.payload.payment.entity.order_id 
      });
      
      if (payment) {
        payment.status = 'captured';
        payment.webhookData = event;
        await payment.save();
        
        const order = await Order.findById(payment.order);
        if (order) {
          order.paymentStatus = 'paid';
          order.status = 'confirmed';
          await order.save();
        }
      }
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get payment status' });
  }
};

export const initiateRefund = async (req, res) => {
  try {
    const { paymentId } = req.body;
    
    const payment = await Payment.findById(paymentId);
    if (!payment || payment.status !== 'captured') {
      return res.status(400).json({ error: 'Payment not eligible for refund' });
    }
    
    const refund = await razorpay.refunds.create({
      payment_id: payment.gatewayPaymentId,
      amount: Math.round(payment.amount * 100)
    });
    
    payment.status = 'refunded';
    await payment.save();
    
    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'refunded';
      await order.save();
    }
    
    res.json({ refund, payment });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ error: 'Failed to initiate refund' });
  }
};
