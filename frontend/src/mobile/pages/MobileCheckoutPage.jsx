import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MobileHeader } from '../components/MobileUI';

const MobileCheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = () => {
    // Logic for placing order
    navigate('/order-tracking/ORD-12345');
  };

  return (
    <div className="mobile-page">
      <MobileHeader title="Checkout" showCart={false} showSearch={false} />
      
      <div className="mobile-page-content">
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">{step > 1 ? <FiCheckCircle /> : '1'}</span>
            <span className="step-label">Shipping</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">{step > 2 ? <FiCheckCircle /> : '2'}</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span>
            <span className="step-label">Review</span>
          </div>
        </div>

        {step === 1 && (
          <div className="checkout-section fade-in">
            <div className="section-header">
              <h2 className="section-title">Shipping Address</h2>
              <button className="text-btn">Add New</button>
            </div>
            <div className="address-list">
              {user?.addresses?.length > 0 ? (
                user.addresses.map((addr, idx) => (
                  <div key={idx} className="address-card selected">
                    <FiMapPin className="card-icon" />
                    <div className="address-info">
                      <span className="addr-label">{addr.label || 'Home'}</span>
                      <p className="addr-text">{addr.street}, {addr.city}, {addr.state} - {addr.zipCode}</p>
                    </div>
                    <FiCheckCircle className="select-icon" />
                  </div>
                ))
              ) : (
                <div className="address-card empty">
                  <p>No addresses found. Please add one to continue.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="checkout-section fade-in">
            <h2 className="section-title">Payment Method</h2>
            <div className="payment-options">
              <div className="payment-card selected">
                <div className="payment-icon razorpay" />
                <div className="payment-info">
                  <span className="pay-title">Razorpay Secure</span>
                  <p className="pay-desc">Cards, UPI, NetBanking & Wallets</p>
                </div>
                <FiCheckCircle className="select-icon" />
              </div>
              <div className="payment-card">
                <FiCreditCard className="card-icon" />
                <div className="payment-info">
                  <span className="pay-title">Cash on Delivery</span>
                  <p className="pay-desc">Pay when you receive your order</p>
                </div>
                <div className="radio-circle" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-section fade-in">
            <h2 className="section-title">Order Review</h2>
            <div className="review-summary">
              <div className="review-item">
                <div className="item-label">Shipping to</div>
                <div className="item-value">Home • {user?.addresses?.[0]?.city || 'Mumbai'}</div>
              </div>
              <div className="review-item">
                <div className="item-label">Payment via</div>
                <div className="item-value">Razorpay</div>
              </div>
              <div className="review-item">
                <div className="item-label">Total Items</div>
                <div className="item-value">{cart.items.length} items</div>
              </div>
            </div>

            <div className="compact-order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cart.subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>₹{cart.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mobile-fixed-footer">
        {step > 1 && (
          <button className="btn-secondary" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {step < 3 ? (
          <button className="btn-primary" onClick={() => setStep(step + 1)}>
            Continue <FiChevronRight />
          </button>
        ) : (
          <button className="btn-primary" onClick={handlePlaceOrder}>
            Place Order • ₹{cart.total.toLocaleString()}
          </button>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .checkout-progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 40px;
          padding: 0 10px;
        }
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 1;
        }
        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--mobile-surface);
          border: 1px solid var(--mobile-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--mobile-text-dim);
          transition: all 0.3s ease;
        }
        .progress-step.active .step-num {
          background: var(--mobile-accent);
          border-color: var(--mobile-accent);
          color: #fff;
        }
        .step-label {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--mobile-text-dim);
        }
        .progress-step.active .step-label {
          color: #fff;
        }
        .progress-line {
          flex: 1;
          height: 1px;
          background: var(--mobile-border);
          margin-bottom: 24px;
          transition: all 0.3s ease;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0;
        }
        .text-btn {
          background: transparent;
          border: none;
          color: var(--mobile-accent);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .address-card, .payment-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: var(--mobile-surface);
          padding: 16px;
          border-radius: 20px;
          border: 1px solid var(--mobile-border);
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .address-card.selected, .payment-card.selected {
          border-color: var(--mobile-accent);
          background: rgba(139, 92, 246, 0.05);
        }
        .card-icon {
          font-size: 1.5rem;
          color: var(--mobile-text-dim);
        }
        .address-info, .payment-info {
          flex: 1;
        }
        .addr-label, .pay-title {
          font-weight: 700;
          font-size: 1rem;
          display: block;
          margin-bottom: 4px;
        }
        .addr-text, .pay-desc {
          font-size: 0.85rem;
          color: var(--mobile-text-dim);
          margin: 0;
          line-height: 1.4;
        }
        .select-icon {
          color: var(--mobile-accent);
          font-size: 1.2rem;
        }
        .radio-circle {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 1px solid var(--mobile-border);
        }
        .review-summary {
          background: var(--mobile-surface);
          padding: 20px;
          border-radius: 24px;
          border: 1px solid var(--mobile-border);
          margin-bottom: 24px;
        }
        .review-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--mobile-border);
        }
        .review-item:last-child {
          border-bottom: none;
        }
        .item-label {
          font-size: 0.85rem;
          color: var(--mobile-text-dim);
        }
        .item-value {
          font-size: 0.9rem;
          font-weight: 600;
        }
        .compact-order-summary {
          padding: 0 8px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          font-size: 0.95rem;
          color: var(--mobile-text-dim);
        }
        .summary-row.total {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--mobile-border);
          color: #fff;
          font-weight: 800;
          font-size: 1.2rem;
        }
        .btn-primary {
          flex: 2;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-secondary {
          flex: 1;
          background: var(--mobile-surface);
          color: #fff;
          border: 1px solid var(--mobile-border);
          border-radius: 16px;
          font-weight: 600;
        }
        .fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default MobileCheckoutPage;
