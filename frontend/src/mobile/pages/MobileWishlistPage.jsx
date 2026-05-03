import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, TopAppBar, triggerHaptic } from '../components/MobileUI';
import { wishlistAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const MobileWishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const loadWishlist = async () => {
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (err) {
      console.error('Failed to load wishlist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await wishlistAPI.removeFromWishlist(productId);
      setWishlist(current => ({
        ...current,
        items: current.items.filter(item => item.product?._id !== productId)
      }));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await wishlistAPI.moveToCart(productId);
      await fetchCart();
      setWishlist(current => ({
        ...current,
        items: current.items.filter(item => item.product?._id !== productId)
      }));
      toast.success('Moved to bag');
    } catch (err) {
      toast.error('Failed to move to bag');
    }
  };

  return (
    <div className="mobile-page pb-32 bg-[#080808]">
      <TopAppBar title="Saved" showBack={true} />
      
      <main className="mobile-content pt-8">
        <div className="mobile-section-header">
          <h2 className="section-title-serif">The Wishlist</h2>
          <span className="card-label" style={{ opacity: 0.4 }}>{wishlist?.items?.length || 0} ITEMS</span>
        </div>

        {loading ? (
          <div className="py-20 text-center opacity-30">Curating your saved pieces...</div>
        ) : wishlist?.items?.length > 0 ? (
          <>
            <div className="flex gap-4 mb-8">
              <button 
                onClick={() => { triggerHaptic('light'); toast.success('Link copied to clipboard'); }}
                className="flex-1 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60"
              >
                <Icon name="share" style={{ fontSize: '16px' }} /> Share Collection
              </button>
            </div>

            <div className="space-y-6">
              {wishlist.items.map((item) => {
                const product = item.product;
                if (!product) return null;
                return (
                  <div key={item._id} className="flex gap-6 items-center p-4 bg-[#111] rounded-[24px] border border-white/5 relative active:scale-[0.98] transition-transform">
                    <div className="w-24 h-32 rounded-2xl overflow-hidden bg-[#1a1a1a]">
                      <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{product.brand || 'CARYQEL'}</p>
                        <span className="text-[8px] bg-white/5 text-white/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">In Stock</span>
                      </div>
                      <h3 className="text-white text-lg font-medium mb-1">{product.name}</h3>
                      <p className="text-white/60 text-sm mb-4">₹{product.price.toLocaleString()}</p>
                      
                      <div className="flex gap-3">
                        <button 
                          onClick={() => { triggerHaptic('medium'); handleMoveToCart(product._id); }}
                          className="px-6 py-2 bg-white text-black rounded-full text-[11px] font-bold uppercase tracking-widest active:scale-90 transition-transform"
                        >
                          Move to Bag
                        </button>
                        <button 
                          onClick={() => { triggerHaptic('heavy'); handleRemove(product._id); }}
                          className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/20"
                        >
                          <Icon name="delete" style={{ fontSize: '18px' }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-32 text-center animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
              <Icon name="favorite_border" style={{ fontSize: '32px', opacity: 0.2 }} />
            </div>
            <h3 className="text-white text-xl font-serif mb-3">Your Wishlist is Empty</h3>
            <p className="text-white/40 text-sm mb-12 px-12">Save your favorite pieces here to curate your ultimate luxury collection.</p>
            <button 
              onClick={() => { triggerHaptic('medium'); navigate('/products'); }}
              className="px-12 h-14 bg-white text-black rounded-full font-bold uppercase tracking-widest text-[11px] active:scale-95 transition-transform"
            >
              Browse Collection
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileWishlistPage;
