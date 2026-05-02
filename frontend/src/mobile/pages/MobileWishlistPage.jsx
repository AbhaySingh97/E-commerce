import React from 'react';
import { TopAppBar, ProductItem } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileWishlistPage = () => {
  const wishlistItems = mockProducts.slice(0, 3); // Mocking saved items

  return (
    <div className="mobile-page pb-32">
      <TopAppBar title="Wishlist" showBack={true} />
      
      <main className="mobile-content pt-8">
        <div className="mobile-section-header">
          <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Saved Objects</h2>
          <span className="card-label" style={{ opacity: 0.4 }}>{wishlistItems.length} items</span>  
        </div>

        {wishlistItems.length > 0 ? (
          <div className="masonry-grid">
            {wishlistItems.map((product, idx) => (
              <ProductItem 
                key={product._id} 
                product={product} 
                trans={idx % 2 !== 0}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.4 }}>
            <p>Your wishlist is empty</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileWishlistPage;
