import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required');
  }
  return process.env.JWT_SECRET;
};

export const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, getJwtSecret());
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, getJwtSecret());
      req.userId = decoded.userId;
    }
    next();
  } catch (error) {
    next();
  }
};

export const adminOnly = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify admin status' });
  }
};

export const vendorOrAdmin = async (req, res, next) => {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role !== 'admin' && user.role !== 'vendor') {
      return res.status(403).json({ error: 'Vendor or admin access required' });
    }
    
    req.userRole = user.role;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify status' });
  }
};
