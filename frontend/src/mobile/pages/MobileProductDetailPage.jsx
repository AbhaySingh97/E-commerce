import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';
import { FiHeart, FiShare2, FiStar, FiChevronDown } from 'react-icons/fi';

const MobileProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return <div className="mobile-loader">Product not found</div>;

  return (
    <div className="mobile-page product-detail-page">
      <MobileHeader title="" showBack={true} />
      
      {/* Immersive Gallery */}
      <section className="immersive-gallery">
        <div className="gallery-scroll">
          {product.images.map((img, i) => (
            <div key={i} className="gallery-item">
              <img src={img} alt={`${product.name} ${i}`} />
            </div>
          ))}
        </div>
        <div className="gallery-dots">
          {product.images.map((_, i) => (
            <div key={i} className={`dot ${activeImg === i ? 'active' : ''}`} />
          ))}
        </div>
        <div className="absolute top-6 right-6 flex flex-col gap-4">
          <button className="gallery-btn"><FiHeart /></button>
          <button className="gallery-btn"><FiShare2 /></button>
        </div>
      </section>

      {/* Product Info */}
      <section className="mobile-section" style={{ marginTop: '32px' }}>
        <div className="flex justify-between items-start mb-2">
          <span className="card-label" style={{ color: 'var(--mobile-primary)' }}>{product.category.name}</span>
          <div className="flex items-center gap-1">
            <FiStar fill="#FFD700" color="#FFD700" size={14} />
            <span className="card-label" style={{ color: '#fff', fontSize: '12px' }}>{product.rating}</span>
          </div>
        </div>
        
        <h2 className="hero-title" style={{ fontSize: '32px', marginBottom: '16px', fontStyle: 'normal' }}>{product.name}</h2>
        
        <p className="hero-tagline" style={{ fontSize: '16px', lineHeight: '1.6', color: 'var(--mobile-on-surface-variant)' }}>
          {product.description}
        </p>

        {/* Price & Variations */}
        <div className="flex items-center justify-between" style={{ margin: '48px 0' }}>
          <div className="flex flex-col">
            <span className="card-label">Price</span>
            <span className="card-price" style={{ fontSize: '24px' }}>₹{product.price.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-primary bg-primary/10 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full" style={{ background: 'var(--mobile-primary)' }}></span>
            </button>
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
              <span className="w-4 h-4 rounded-full bg-surface-container-highest"></span>
            </button>
          </div>
        </div>

        {/* Accordions */}
        <div className="menu-list">
          {['Product Details', 'Shipping & Returns', 'Size Guide'].map(item => (
            <div key={item} className="menu-row">
              <span className="card-label" style={{ color: '#fff', fontSize: '12px' }}>{item}</span>
              <FiChevronDown className="menu-icon" />
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Purchase Bar */}
      <footer className="sticky-action-bar">
        <button className="btn-buy" onClick={() => navigate('/checkout')}>Buy Now</button>
        <button className="btn-add">Add to Cart</button>
      </footer>
    </div>
  );
};

export default MobileProductDetailPage;
