import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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
        <span className="page-state-badge">Wishlist</span>
        <h1>Your saved product shortlist</h1>
        <p>Keep high-intent products in one place, then move them into your cart when you are ready.</p>
      </div>

      <div className="stack-list">
        {wishlist.items.map((item) => {
          const product = item.product;

          if (!product) return null;

          return (
            <article key={item._id} className="surface-card wishlist-row">
              <img src={product.images?.[0] || 'https://via.placeholder.com/120'} alt={product.name} />
              <div className="wishlist-row-copy">
                <p>{product.brand || 'LuxeCart'}</p>
                <h2>{product.name}</h2>
                <span>{formatCurrency(product.price)}</span>
              </div>
              <div className="row-actions">
                <button type="button" className="btn-primary" onClick={() => handleMoveToCart(product._id)}>Move to cart</button>
                <button type="button" className="btn-secondary" onClick={() => handleRemove(product._id)}>Remove</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
