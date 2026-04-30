import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import EmptyState from '../components/common/EmptyState';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../lib/analytics';
import { formatCurrency } from '../lib/formatters';

const CartPage = () => {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponBusy(true);
    try {
      await applyCoupon(coupon.trim());
      trackEvent('coupon_apply', { code: coupon.trim() });
      toast.success('Coupon applied');
      setCoupon('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to apply coupon');
    } finally {
      setCouponBusy(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      toast.success('Coupon removed');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove coupon');
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="page cart-page">
        <EmptyState
          eyebrow="Cart empty"
          title="Your shopping bag is waiting"
          description="Browse premium products, save favorites, and return here when you are ready to check out."
          action={<Link to="/products" className="btn-primary">Start shopping</Link>}
        />
      </div>
    );
  }

  return (
    <div className="page cart cart-page">
      <div className="page-hero compact">
        <span className="page-state-badge">Cart</span>
        <h1>Review your bag before checkout</h1>
        <p>Update quantities, apply savings, and keep a clear view of charges before you place the order.</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((item) => (
            <article key={item._id} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item.product?.images?.[0] || item.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&q=80'}
                  alt={item.name}
                />
              </div>
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">{formatCurrency(item.price)} x {item.quantity}</p>
              </div>
              <div className="quantity">
                <button type="button" onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
              </div>
              <p className="cart-item-total">{formatCurrency(item.price * item.quantity)}</p>
              <button type="button" className="remove-btn" onClick={() => removeItem(item._id)}>Remove</button>
            </article>
          ))}
        </div>

        <aside className="cart-summary-panel">
          <div className="coupon">
            <input
              type="text"
              placeholder="Coupon code"
              value={coupon}
              onChange={(event) => setCoupon(event.target.value)}
            />
            <button type="button" onClick={handleApplyCoupon} disabled={couponBusy}>
              {couponBusy ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {cart.coupon && (
            <button type="button" className="link-btn coupon-remove" onClick={handleRemoveCoupon}>
              Remove current coupon
            </button>
          )}
          <div className="cart-summary">
            <p><span>Subtotal</span> <span>{formatCurrency(cart.totalAmount)}</span></p>
            <p><span>Discount</span> <span>-{formatCurrency(cart.discountAmount)}</span></p>
            <p><span>Tax</span> <span>{formatCurrency(cart.taxAmount)}</span></p>
            <p><span>Shipping</span> <span>{formatCurrency(cart.shippingAmount)}</span></p>
            <h3><span>Total</span> <span>{formatCurrency(cart.grandTotal)}</span></h3>
            <button
              type="button"
              onClick={() => {
                trackEvent('checkout_start', { total: cart.grandTotal, itemCount: cart.items.length });
                navigate('/checkout');
              }}
            >
              Proceed to checkout
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
