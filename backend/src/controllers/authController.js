import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Address } from '../models/Address.js';
import { mergeCart } from './cartController.js';

export const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const user = new User({ email, password, name, phone });
    await user.save();
    
    if (req.sessionId) {
      await mergeCart(user._id.toString(), req.sessionId);
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    if (req.sessionId) {
      await mergeCart(user._id.toString(), req.sessionId);
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, dateOfBirth } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, gender, dateOfBirth },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.userId });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get addresses' });
  }
};

export const addAddress = async (req, res) => {
  try {
    const addressData = { ...req.body, user: req.userId };
    
    if (addressData.isDefault) {
      await Address.updateMany(
        { user: req.userId, isDefault: true },
        { isDefault: false }
      );
    }
    
    const address = new Address(addressData);
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add address' });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.body.isDefault) {
      await Address.updateMany(
        { user: req.userId, isDefault: true },
        { isDefault: false }
      );
    }
    
    const address = await Address.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );
    
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }
    
    res.json(address);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update address' });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Address.findOneAndDelete({ _id: id, user: req.userId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
};
