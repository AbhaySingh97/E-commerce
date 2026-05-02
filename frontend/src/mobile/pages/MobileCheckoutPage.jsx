import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, Icon } from '../components/MobileUI';
import { useCart } from '../../context/CartContext';

const MobileCheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();

  return (
    <div className="mobile-page pb-32 bg-background">
      <TopAppBar title="Checkout" />
      
      <main className="mobile-content pt-8">
        <nav className="flex justify-between items-center mb-12 relative px-2">
          <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: -1 }}></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center text-white ring-4 ring-black">
              <Icon name="check" style={{ fontSize: '14px' }} />
            </div>
            <span className="card-label text-white">Shipping</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center text-white ring-4 ring-black">
              <Icon name="payments" style={{ fontSize: '14px' }} />
            </div>
            <span className="card-label text-white">Payment</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/40 ring-4 ring-black">
              <Icon name="visibility" style={{ fontSize: '14px' }} />
            </div>
            <span className="card-label text-white/40">Review</span>
          </div>
        </nav>

        <section style={{ marginBottom: '48px' }}>
          <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', color: '#fff', marginBottom: '24px' }}>The Bag</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.product._id} className="glass-panel p-4 rounded-xl flex gap-4">
                <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src={item.product.images[0]} alt={item.product.name}/>
                </div>
                <div className="flex flex-col justify-between py-1 flex-grow">
                  <div>
                    <h3 className="card-title" style={{ fontSize: '18px' }}>{item.product.name}</h3>
                    <p className="card-label mt-1">{item.product.brand || 'Onyx / Violet'}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="card-price">₹{item.product.price.toLocaleString()}</span>
                    <div className="flex items-center gap-4 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                      <Icon name="remove" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }} />
                      <span className="card-label text-white">{item.quantity}</span>
                      <Icon name="add" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '48px' }}>
          <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', color: '#fff', marginBottom: '24px' }}>Payment Method</h2>
          <form className="space-y-6">
            <div className="space-y-1">
              <label className="card-label text-white/60 ml-1">Cardholder Name</label>
              <input className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-primary/40 transition-all uppercase tracking-widest" placeholder="ALEXANDER VANCE" type="text"/>
            </div>
            <div className="space-y-1">
              <label className="card-label text-white/60 ml-1">Card Number</label>
              <div className="relative" style={{ position: 'relative' }}>
                <input className="w-full h-14 bg-surface-container-low border border-white/10 rounded-xl px-4 pr-12 text-white focus:outline-none focus:border-primary/40 transition-all tracking-[0.2em]" placeholder="0000 0000 0000 0000" type="text"/>
                <Icon name="credit_card" style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
              </div>
            </div>
          </form>
        </section>

        <section className="glass-panel p-6 rounded-2xl" style={{ marginBottom: '48px' }}>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Subtotal</span>
              <span style={{ color: '#fff' }}>₹{cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span style={{ color: 'rgba(255,255,255,0.6)' }}>Shipping</span>
              <span className="card-label text-primary">COMPLIMENTARY</span>
            </div>
            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', color: '#fff' }}>Total</span>
              <span className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', color: '#fff' }}>₹{cartTotal.toLocaleString()}</span>
            </div>
          </div>
          <button onClick={() => navigate('/')} className="w-full h-16 brand-gradient rounded-xl font-bold text-white flex items-center justify-center gap-3 shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-transform">
            Complete Purchase
            <Icon name="lock" />
          </button>
        </section>
      </main>
    </div>
  );
};

export default MobileCheckoutPage;
