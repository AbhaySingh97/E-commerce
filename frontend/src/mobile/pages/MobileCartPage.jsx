import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { MobileHeader } from '../components/MobileUI';

const MobileCartPage = () => {
  const navigate = useNavigate();
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (loading && !cart) {
    return <div className="mobile-loader">CARYQEL</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mobile-page">
        <MobileHeader title="Bag" showSearch={false} />
        <div className="mobile-page-content empty-cart">
          <div className="empty-state-icon">
            <FiShoppingBag size={64} />
          </div>
          <h2>Your bag is empty</h2>
          <p>Explore our curated collection and find something extraordinary.</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Start Shopping
          </button>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .empty-cart {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding-top: 80px;
          }
          .empty-state-icon {
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            color: var(--mobile-accent);
          }
          .empty-cart h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            margin-bottom: 12px;
          }
          .empty-cart p {
            color: var(--mobile-text-dim);
            margin-bottom: 32px;
            max-width: 260px;
          }
          .btn-primary {
            background: #fff;
            color: #000;
            border: none;
            padding: 16px 40px;
            border-radius: 100px;
            font-weight: 700;
            font-size: 1rem;
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="mobile-page">
      <MobileHeader title="Bag" showSearch={false} />
      
      <div className="mobile-page-content">
        <div className="cart-items-list">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item-card">
              <div className="item-image">
                <img src={item.product.images[0]} alt={item.product.name} />
              </div>
              <div className="item-details">
                <div className="item-header">
                  <h3 className="item-name">{item.product.name}</h3>
                  <button className="remove-btn" onClick={() => removeItem(item._id)}>
                    <FiTrash2 size={18} />
                  </button>
                </div>
                <p className="item-brand">{item.product.brand}</p>
                <div className="item-footer">
                  <span className="item-price">₹{item.product.price.toLocaleString()}</span>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FiMinus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cart.subtotal.toLocaleString()}</span>
          </div>
          {cart.discount > 0 && (
            <div className="summary-row discount">
              <span>Discount</span>
              <span>-₹{cart.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{cart.shippingFee === 0 ? 'Free' : `₹${cart.shippingFee}`}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹{cart.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mobile-fixed-footer">
        <div className="footer-price-info">
          <span className="total-label">Total Amount</span>
          <span className="total-value">₹{cart.total.toLocaleString()}</span>
        </div>
        <button className="btn-checkout" onClick={() => navigate('/checkout')}>
          Checkout
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
        }
        .cart-item-card {
          display: flex;
          gap: 16px;
          background: var(--mobile-surface);
          padding: 12px;
          border-radius: 20px;
          border: 1px solid var(--mobile-border);
        }
        .item-image {
          width: 90px;
          height: 110px;
          background: #111;
          border-radius: 12px;
          overflow: hidden;
        }
        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .item-details {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .item-name {
          font-size: 0.95rem;
          font-weight: 600;
          margin: 0;
          max-width: 180px;
        }
        .remove-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          padding: 4px;
        }
        .item-brand {
          font-size: 0.75rem;
          color: var(--mobile-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 4px 0 auto;
        }
        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
        }
        .item-price {
          font-weight: 700;
          font-size: 1.1rem;
        }
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 12px;
          border-radius: 100px;
          border: 1px solid var(--mobile-border);
        }
        .quantity-controls button {
          background: transparent;
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quantity-controls button:disabled {
          opacity: 0.3;
        }
        .quantity-controls span {
          font-size: 0.9rem;
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }
        .cart-summary {
          background: var(--mobile-surface);
          padding: 20px;
          border-radius: 24px;
          border: 1px solid var(--mobile-border);
        }
        .summary-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          color: var(--mobile-text-dim);
          font-size: 0.95rem;
        }
        .summary-row.discount {
          color: #10b981;
        }
        .summary-row.total {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--mobile-border);
          color: #fff;
          font-weight: 800;
          font-size: 1.2rem;
        }
        .footer-price-info {
          display: flex;
          flex-direction: column;
        }
        .total-label {
          font-size: 0.75rem;
          color: var(--mobile-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .total-value {
          font-size: 1.3rem;
          font-weight: 800;
        }
        .btn-checkout {
          flex: 1;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.05rem;
          margin-left: 12px;
        }
      `}} />
    </div>
  );
};

export default MobileCartPage;
