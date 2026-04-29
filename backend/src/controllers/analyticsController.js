import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';

export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    const dateLimit = new Date();
    
    if (period === '7d') dateLimit.setDate(dateLimit.getDate() - 7);
    else if (period === '30d') dateLimit.setDate(dateLimit.getDate() - 30);
    else if (period === '1y') dateLimit.setFullYear(dateLimit.getFullYear() - 1);

    const salesData = await Order.aggregate([
      { $match: { createdAt: { $gte: dateLimit }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get sales analytics' });
  }
};

export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.total" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    res.json(topProducts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get top products' });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments({ paymentStatus: 'paid' });
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalUsers,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
};
