import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiSearch, FiShoppingCart } from 'react-icons/fi';

export const MobileHeader = ({ title, showBack = true, showSearch = true, showCart = true }) => {
  const navigate = useNavigate();

  return (
    <header className="mobile-page-header">
      <div className="header-left">
        {showBack && (
          <button className="header-action-btn" onClick={() => navigate(-1)}>
            <FiChevronLeft size={24} />
          </button>
        )}
      </div>
      <div className="header-center">
        <h1 className="header-title">{title}</h1>
      </div>
      <div className="header-right">
        {showSearch && (
          <button className="header-action-btn" onClick={() => navigate('/search')}>
            <FiSearch size={22} />
          </button>
        )}
        {showCart && (
          <button className="header-action-btn" onClick={() => navigate('/cart')}>
            <FiShoppingCart size={22} />
          </button>
        )}
      </div>
    </header>
  );
};

export const MobileProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="mobile-card product-card-v2" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="card-media">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        {product.isFeatured && <span className="card-badge">Featured</span>}
      </div>
      <div className="card-body">
        <span className="card-brand">{product.brand}</span>
        <h3 className="card-name">{product.name}</h3>
        <div className="card-footer">
          <span className="card-price">₹{product.price.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
