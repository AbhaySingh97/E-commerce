import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';
import { FiHeart, FiShare2, FiShoppingCart, FiStar } from 'react-icons/fi';

const MobileProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.slug === slug);

  if (!product) return <div className="mobile-loader">Product not found</div>;

  return (
    <div className="mobile-page product-detail-page">
      <MobileHeader title="" showSearch={false} />
      
      <div className="mobile-product-gallery">
        <img src={product.images[0]} alt={product.name} />
        <div className="gallery-actions">
          <button className="gallery-btn"><FiHeart /></button>
          <button className="gallery-btn"><FiShare2 /></button>
        </div>
      </div>

      <div className="mobile-product-details">
        <div className="details-header">
          <span className="details-brand">{product.brand}</span>
          <h1 className="details-title">{product.name}</h1>
          <div className="details-price-row">
            <span className="details-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice > product.price && (
              <span className="details-original-price">₹{product.originalPrice.toLocaleString()}</span>
            )}
          </div>
          <div className="details-rating">
            <FiStar fill="#FFD700" color="#FFD700" />
            <span className="rating-val">{product.rating}</span>
            <span className="rating-count">({product.reviewCount} reviews)</span>
          </div>
        </div>

        <div className="details-description">
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>

        <div className="details-specs">
          <div className="spec-item">
            <span>Availability</span>
            <span className={product.stock > 0 ? 'stock-in' : 'stock-out'}>
              {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="spec-item">
            <span>SKU</span>
            <span>{product.SKU}</span>
          </div>
        </div>
      </div>

      <div className="mobile-fixed-footer">
        <button className="btn-buy-now">Buy Now</button>
        <button className="btn-add-cart">
          <FiShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MobileProductDetailPage;
