import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/MobileUI';
import { useCart } from '../../context/CartContext';
import { FiMinus, FiPlus, FiLock, FiShield } from 'react-icons/fi';

const MobileCartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="mobile-page pb-32 bg-background">
      <TopAppBar title="The Bag" showCart={false} />
      
      <div className="mobile-page-content" style={{ padding: '24px' }}>
        {cart.items.length > 0 ? (
          <>
            <div className="space-y-4" style={{ marginBottom: '48px' }}>
              {cart.items.map((item) => (
                <div key={item.product._id} className="glass-panel" style={{ padding: '16px', borderRadius: '12px', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '96px', height: '128px', borderRadius: '8px', overflow: 'hidden' }}>
                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#fff', margin: 0 }}>{item.product.name}</h3>
                      <p className="card-label" style={{ marginTop: '4px' }}>{item.product.brand || 'Caryqel Objects'}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="card-price">₹{item.product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-4 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                        <button className="qty-btn" onClick={() => updateQuantity(item.product._id, item.quantity - 1)}><FiMinus size={12} /></button>
                        <span className="card-label" style={{ color: '#fff' }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.product._id, item.quantity + 1)}><FiPlus size={12} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
              <div style={{ marginBottom: '24px' }}>
                <div className="flex justify-between" style={{ marginBottom: '12px' }}>
                  <span style={{ opacity: 0.6 }}>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ marginBottom: '12px' }}>
                  <span style={{ opacity: 0.6 }}>Shipping</span>
                  <span className="card-label" style={{ color: 'var(--primary)' }}>COMPLIMENTARY</span>
                </div>
                <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Total</span>
                  <span className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                className="w-full h-16 gradient-button rounded-xl font-bold flex items-center justify-center gap-3"
                onClick={() => navigate('/checkout')}
              >
                Complete Purchase <FiLock />
              </button>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '24px', opacity: 0.3 }}>
                <div className="flex items-center gap-1">
                  <FiShield size={14} />
                  <span className="card-label" style={{ fontSize: '10px' }}>PCI SECURE</span>
                </div>
                <div className="flex items-center gap-1">
                  <FiLock size={14} />
                  <span className="card-label" style={{ fontSize: '10px' }}>SSL ENCRYPTED</span>
                </div>
              </div>
            </section>
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h2 className="hero-title" style={{ fontStyle: 'normal' }}>Bag is Empty</h2>
            <button className="gradient-button px-8 py-3 rounded-full mt-6" onClick={() => navigate('/products')}>Shop Collection</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileCartPage;
