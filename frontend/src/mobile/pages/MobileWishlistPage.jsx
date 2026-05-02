import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiX } from 'react-icons/fi';
import { mockProducts } from '../../data/mockData';
import { MobileHeader } from '../components/MobileUI';

const MobileWishlistPage = () => {
  const navigate = useNavigate();
  // Using mock data for wishlist since no context exists yet
  const [wishlist, setWishlist] = useState(mockProducts.slice(0, 4));

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item._id !== id));
  };

  if (wishlist.length === 0) {
    return (
      <div className="mobile-page">
        <MobileHeader title="Wishlist" />
        <div className="mobile-page-content empty-wishlist">
          <div className="empty-state-icon">
            <FiHeart size={64} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to find them easily later.</p>
          <button className="btn-primary" onClick={() => navigate('/products')}>
            Start Exploring
          </button>
        </div>
        <style dangerouslySetInnerHTML={{ __html: `
          .empty-wishlist {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding-top: 80px;
          }
          .empty-state-icon {
            width: 120px;
            height: 120px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            color: #ef4444;
          }
          .empty-wishlist h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.8rem;
            margin-bottom: 12px;
          }
          .empty-wishlist p {
            color: var(--mobile-text-dim);
            margin-bottom: 32px;
            max-width: 260px;
          }
          .btn-primary {
            background: #fff;
            color: #000;
            border: none;
            padding: 16px 40px;
            border-radius: 100px;
            font-weight: 700;
            font-size: 1rem;
          }
        `}} />
      </div>
    );
  }

  return (
    <div className="mobile-page">
      <MobileHeader title="Wishlist" />
      
      <div className="mobile-page-content">
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-card">
              <div className="card-media" onClick={() => navigate(`/products/${product.slug}`)}>
                <img src={product.images[0]} alt={product.name} />
                <button 
                  className="remove-btn" 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product._id);
                  }}
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="card-body">
                <span className="card-brand">{product.brand}</span>
                <h3 className="card-name">{product.name}</h3>
                <div className="card-footer">
                  <span className="card-price">₹{product.price.toLocaleString()}</span>
                </div>
                <button className="btn-add-to-bag">
                  <FiShoppingBag size={16} /> Add to Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .wishlist-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .wishlist-card {
          background: var(--mobile-surface);
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--mobile-border);
          display: flex;
          flex-direction: column;
        }
        .card-media {
          aspect-ratio: 1;
          position: relative;
          background: #111;
        }
        .card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .card-body {
          padding: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .card-brand {
          font-size: 0.7rem;
          color: var(--mobile-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .card-name {
          font-size: 0.9rem;
          font-weight: 600;
          margin: 4px 0 8px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .card-price {
          font-weight: 700;
          font-size: 1rem;
          display: block;
          margin-bottom: 12px;
        }
        .btn-add-to-bag {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid var(--mobile-border);
          padding: 8px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: auto;
        }
        .btn-add-to-bag:active {
          background: #fff;
          color: #000;
        }
      `}} />
    </div>
  );
};

export default MobileWishlistPage;
