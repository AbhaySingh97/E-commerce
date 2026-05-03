import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiShoppingBag, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/common/EmptyState';
import { ErrorState, PageLoader } from '../components/common/PageState';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../lib/analytics';
import { formatCurrency } from '../lib/formatters';
import { wishlistAPI } from '../services/api';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const loadWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await wishlistAPI.getWishlist();
      setWishlist(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to load wishlist');
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
      trackEvent('wishlist_remove', { productId });
      setWishlist((current) => ({
        ...current,
        items: current.items.filter((item) => item.product?._id !== productId),
      }));
      toast.success('Removed from wishlist');
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Failed to remove item');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await wishlistAPI.moveToCart(productId);
      await fetchCart();
      trackEvent('wishlist_move_to_cart', { productId });
      setWishlist((current) => ({
        ...current,
        items: current.items.filter((item) => item.product?._id !== productId),
      }));
      toast.success('Moved to cart');
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Failed to move item to cart');
    }
  };

  if (loading) {
    return <PageLoader title="Loading wishlist" message="Collecting the products you saved for later." />;
  }

  if (error) {
    return <ErrorState title="Unable to load wishlist" message={error} action={<button type="button" className="btn-primary" onClick={loadWishlist}>Retry</button>} />;
  }

  if (!wishlist?.items?.length) {
    return (
      <div className="page wishlist-page">
        <EmptyState
          eyebrow="Wishlist empty"
          title="Save products to compare later"
          description="Use the wishlist on product cards or product pages to build your shortlist."
        />
      </div>
    );
  }

  return (
    <div className="page wishlist-page">
      <div className="page-hero compact">
        <div className="hero-top-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <button type="button" onClick={() => navigate(-1)} className="back-btn-pill" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '42px', height: '42px', display: 'grid', placeItems: 'center', color: '#fff', cursor: 'pointer' }}>
            <FiArrowLeft size={20} />
          </button>
        </div>
        <span className="page-state-badge">Wishlist</span>
        <h1>The Saved Pieces</h1>
        <p>Curated selections waiting for their moment in your closet.</p>
      </div>

      <div className="stack-list">
        {wishlist.items.map((item) => {
          const product = item.product;

          if (!product) return null;

          return (
            <article key={item._id} className="wishlist-row">
              <img src={product.images?.[0] || 'https://via.placeholder.com/120'} alt={product.name} />
              <div className="wishlist-row-copy">
                <p>{product.brand || 'Caryqel'}</p>
                <h2>{product.name}</h2>
                <div className="wishlist-row-footer">
                  <span className="wishlist-row-price">{formatCurrency(product.price)}</span>
                  <div className="wishlist-row-actions">
                    <button type="button" className="action-pill primary" onClick={() => handleMoveToCart(product._id)}>
                      <FiShoppingBag /> Add
                    </button>
                    <button type="button" className="action-pill secondary" onClick={() => handleRemove(product._id)} aria-label="Remove item">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
