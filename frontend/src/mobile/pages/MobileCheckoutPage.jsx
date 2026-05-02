import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileUI';
import { FiCheck, FiCreditCard, FiEye, FiLock, FiChevronRight } from 'react-icons/fi';

const MobileCheckoutPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const steps = [
    { id: 1, label: 'Shipping', icon: <FiCheck /> },
    { id: 2, label: 'Payment', icon: <FiCreditCard /> },
    { id: 3, label: 'Review', icon: <FiEye /> }
  ];

  return (
    <div className="mobile-page">
      <MobileHeader title="Checkout" />
      
      <div className="mobile-page-content" style={{ padding: '24px' }}>
        {/* Progress Stepper */}
        <nav className="flex justify-between items-center" style={{ marginBottom: '48px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: 0, width: '100%', h: '1px', background: 'rgba(255,255
,255,0.1)', zIndex: -1 }} />
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ring-4 ring-black ${step >= s.id ? 'gradient-button' : 'glass-panel text-white/40'}`}
              >
                {step > s.id ? <FiCheck /> : s.icon}
              </div>
              <span className="card-label" style={{ color: step >= s.id ? '#fff' : 'rgba(255,255,255,0.4)' }}>{s.label}</span>
            </div>
          ))}
        </nav>

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Shipping Details</h2>
            <form className="space-y-6">
              <div className="auth-input-group">
                <label>Full Name</label>
                <input type="text" placeholder="ALEXANDER VANCE" style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }} />
              </div>
              <div className="auth-input-group">
                <label>Shipping Address</label>
                <input type="text" placeholder="STREET, APARTMENT, ETC." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="auth-input-group">
                  <label>City</label>
                  <input type="text" placeholder="NEW YORK" />
                </div>
                <div className="auth-input-group">
                  <label>Postal Code</label>
                  <input type="text" placeholder="10001" />
                </div>
              </div>
              <button 
                type="button" 
                className="w-full h-14 gradient-button rounded-xl font-bold flex items-center justify-center gap-2"
                onClick={() => setStep(2)}
              >
                Continue to Payment <FiChevronRight />
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Payment Method</h2>
            <form className="space-y-6">
              <div className="auth-input-group">
                <label>Cardholder Name</label>
                <input type="text" placeholder="ALEXANDER VANCE" style={{ textTransform: 'uppercase' }} />
              </div>
              <div className="auth-input-group">
                <label>Card Number</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" placeholder="0000 0000 0000 0000" style={{ letterSpacing: '0.2em' }} />
                  <FiCreditCard style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="auth-input-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM/YY" />
                </div>
                <div className="auth-input-group">
                  <label>CVV</label>
                  <input type="text" placeholder="000" />
                </div>
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', gap: '12px'
, alignItems: 'center' }}>
                <input type="checkbox" id="save-card" style={{ width: '20px', height: '20px' }} />
                <label htmlFor="save-card" style={{ fontSize: '14px', opacity: 0.6 }}>Save details for future purchase
s</label>
              </div>
              <button 
                type="button" 
                className="w-full h-16 gradient-button rounded-xl font-bold flex items-center justify-center gap-3"
                onClick={() => navigate('/')}
              >
                Complete Purchase <FiLock />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCheckoutPage;
