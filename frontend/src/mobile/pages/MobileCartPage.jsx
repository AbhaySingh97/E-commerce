import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, TopAppBar, triggerHaptic } from '../components/MobileUI';
import { useCart } from '../../context/CartContext';
import { useProducts } from '../../context/ProductContext';

const MobileCartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, cartTotal, removeFromCart } = useCart();
  const { products } = useProducts();

  return (
    <div className="mobile-page pb-32">
      <TopAppBar title="Bag" />
      
      <main className="mobile-content pt-8">
        <div className="mobile-section-header">
          <h2 className="section-title-serif">Your Selection</h2>
          <span className="card-label" style={{ opacity: 0.4 }}>{cart?.items?.length || 0} ITEMS</span>
        </div>

        {cart?.items?.length > 0 ? (
          <>
            <div className="space-y-6 mt-8">
              {cart.items.map((item) => (
                <div key={item.product._id} className="flex gap-6 items-center p-4 bg-dark-1 rounded-[24px] border border-white/5">
                  <div className="w-24 h-32 rounded-2xl overflow-hidden bg-[#1a1a1a]">
                    <img src={item.product.images?.[0]?.includes('unsplash.com') ? `${item.product.images[0].split('?')[0]}?auto=format&fit=crop&w=300&q=80` : item.product.images?.[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{item.product.brand || 'CARYQEL'}</p>
                      <button onClick={() => removeFromCart(item.product._id)} className="text-white/20">
                        <Icon name="close" style={{ fontSize: '16px' }} />
                      </button>
                    </div>
                    <h3 className="text-white text-lg font-medium mb-1">{item.product.name}</h3>
                    <p className="text-white/60 text-sm mb-4">₹{item.product.price.toLocaleString()}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-2 border border-white/10">
                        <button 
                          className="text-white/40 active:scale-75 transition-all"
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        >
                          <Icon name="remove" style={{ fontSize: '14px' }} />
                        </button>
                        <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          className="text-white/40 active:scale-75 transition-all"
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        >
                          <Icon name="add" style={{ fontSize: '14px' }} />
                        </button>
                      </div>
                      <span className="text-white font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="mt-12 p-8 rounded-[32px] bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-white/5">
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Subtotal</span>
                  <span className="text-white font-medium">₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40 text-sm">Shipping</span>
                  <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Complimentary</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-white text-2xl font-serif">Total</span>
                  <span className="text-white text-2xl font-serif">₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full h-16 bg-gradient-to-r from-primary to-magenta rounded-2xl text-white font-bold uppercase tracking-[0.2em] text-[13px] shadow-2xl shadow-primary/20 flex items-center justify-center gap-3"
              >
                Checkout <Icon name="arrow_forward" style={{ fontSize: '18px' }} />
              </button>
            </section>
          </>
        ) : (
          <div className="py-20 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
              <Icon name="shopping_bag" style={{ fontSize: '32px', opacity: 0.2 }} />
            </div>
            <h3 className="text-white text-xl font-serif mb-3">Your Bag is Empty</h3>
            <p className="text-white/40 text-sm mb-12 px-12">Discover our latest collections and start curating your elite style.</p>
            
            <button 
              onClick={() => { triggerHaptic('medium'); navigate('/products'); }}
              className="px-12 h-14 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[11px] mb-24 active:scale-95 transition-transform"
            >
              Explore Collection
            </button>

            {/* Recommendations for Empty Cart */}
            <div className="text-left mt-12">
              <h4 className="section-title-serif mb-8 text-lg">You May Also Like</h4>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {products.slice(0, 4).map(p => (
                  <div key={p._id} className="min-w-[160px]" onClick={() => navigate(`/products/${p.slug}`)}>
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-dark-1 mb-3">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[9px] text-primary font-bold uppercase tracking-widest mb-1">{p.brand || 'CARYQEL'}</p>
                    <p className="text-white text-xs font-medium truncate">{p.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileCartPage;
