import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, Icon } from '../components/MobileUI';
import { useCart } from '../../context/CartContext';

const MobileCartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="mobile-page pb-32 bg-background">
      <TopAppBar title="The Bag" showCart={false} />
      
      <main className="mobile-content pt-8">
        {cart.items.length > 0 ? (
          <>
            <div className="mobile-section-header">
              <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Your Selection</h2>
              <span className="card-label" style={{ opacity: 0.5 }}>{cart.items.length} Items</span>
            </div>

            <div className="space-y-4" style={{ marginBottom: '48px', marginTop: '24px' }}>
              {cart.items.map((item) => (
                <div key={item.product._id} className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '100px', height: '130px', borderRadius: '12px', overflow: 'hidden', background: 'var(--surface-container-low)' }}>
                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 0' }}>
                    <div>
                      <h3 className="font-body-md" style={{ color: '#fff', margin: 0, fontWeight: 600 }}>{item.product.name}</h3>
                      <p className="card-label" style={{ marginTop: '4px', fontSize: '10px' }}>{item.product.brand || 'CARYQEL OBJECTS'}</p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="card-price">₹{item.product.price.toLocaleString()}</span>
                      <div className="flex items-center gap-4 bg-white/5 rounded-full px-3 py-1.5 border border-white/10">
                        <button className="qty-btn" style={{ opacity: 0.6 }} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}><Icon name="remove" style={{ fontSize: '12px' }} /></button>
                        <span className="card-label" style={{ color: '#fff', fontSize: '12px' }}>{item.quantity}</span>
                        <button className="qty-btn" style={{ opacity: 0.6 }} onClick={() => updateQuantity(item.product._id, item.quantity + 1)}><Icon name="add" style={{ fontSize: '12px' }} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="glass-panel" style={{ padding: '32px 24px', borderRadius: '24px', borderStyle: 'dashed' }}>
              <div style={{ marginBottom: '32px' }}>
                <div className="flex justify-between" style={{ marginBottom: '16px' }}>
                  <span className="card-label" style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontSize: '14px' }}>Subtotal</span>
                  <span className="font-body-md" style={{ color: '#fff' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ marginBottom: '16px' }}>
                  <span className="card-label" style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'none', fontSize: '14px' }}>Shipping</span>
                  <span className="card-label" style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>COMPLIMENTARY</span>
                </div>
                <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
                  <span className="hero-title" style={{ fontSize: '28px', fontStyle: 'normal' }}>Total</span>
                  <span className="hero-title" style={{ fontSize: '28px', fontStyle: 'normal' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                className="w-full h-16 gradient-button rounded-xl font-bold flex items-center justify-center gap-3 uppercase tracking-widest text-[13px]"
                onClick={() => navigate('/checkout')}
              >
                Complete Purchase <Icon name="lock" style={{ fontSize: '18px' }} />
              </button>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '20px', opacity: 0.3 }}>
                <div className="flex items-center gap-2">
                  <Icon name="verified_user" style={{ fontSize: '16px' }} />
                  <span className="card-label" style={{ fontSize: '9px' }}>PCI SECURE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="shield" style={{ fontSize: '16px' }} />
                  <span className="card-label" style={{ fontSize: '9px' }}>SSL ENCRYPTED</span>
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
      </main>
    </div>
  );
};

export default MobileCartPage;
