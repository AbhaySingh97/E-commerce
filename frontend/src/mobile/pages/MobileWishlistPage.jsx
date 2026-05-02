import React from 'react';
import { MobileHeader, MobileProductCard } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileWishlistPage = () => {
  const wishlistItems = mockProducts.slice(0, 3); // Mocking saved items

  return (
    <div className="mobile-page">
      <MobileHeader title="Wishlist" showBack={true} />
      
      <div className="mobile-page-content" style={{ padding: '24px' }}>
        <div className="mobile-section-header">
          <span className="card-label">{wishlistItems.length} Objects saved</span>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="stitch-grid">
            {wishlistItems.map(product => (
              <MobileProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.4 }}>
            <p>Your wishlist is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileWishlistPage;
