import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await cartAPI.getCart();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity) => {
    await cartAPI.addToCart({ productId, quantity });
    await fetchCart();
  };

  const updateQuantity = async (itemId, quantity) => {
    await cartAPI.updateCartItem(itemId, { quantity });
    await fetchCart();
  };

  const removeItem = async (itemId) => {
    await cartAPI.removeFromCart(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clearCart();
    setCart(null);
  };

  const applyCoupon = async (code) => {
    await cartAPI.applyCoupon(code);
    await fetchCart();
  };

  const removeCoupon = async () => {
    await cartAPI.removeCoupon();
    await fetchCart();
  };

  return (
    <CartContext.Provider value={{
      cart, loading, fetchCart, addToCart,
      updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};