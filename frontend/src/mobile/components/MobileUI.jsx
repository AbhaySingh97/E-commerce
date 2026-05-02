import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiShoppingBag, FiHeart, FiPlus } from 'react-icons/fi';

export const MobileHeader = ({ title = "Caryqel", showBack = true, showCart = true }) => {
  const navigate = useNavigate();

  return (
    <header className="mobile-top-bar">
      <div className="top-bar-action">
        {showBack && (
          <button className="top-bar-action" onClick={() => navigate(-1)}>
            <FiChevronLeft size={24} />
          </button>
        )}
      </div>
      <h1 className="top-bar-title">{title}</h1>
      <div className="top-bar-action">
        {showCart && (
          <button className="top-bar-action" onClick={() => navigate('/cart')}>
            <FiShoppingBag size={24} />
          </button>
        )}
      </div>
    </header>
  );
};

export const MobileProductCard = ({ product, variant = "default" }) => {
  const navigate = useNavigate();

  return (
    <div className="stitch-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="stitch-card-media">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <div className="absolute top-3 right-3 glass-panel p-2 rounded-full">
          <FiHeart size={18} className="text-white" />
        </div>
        <div className="absolute bottom-3 right-3">
          <button className="w-10 h-10 rounded-full gradient-button flex items-center justify-center text-white shadow-lg shadow-violet-500/20 active:scale-95 transition-all">
            <FiPlus size={20} />
          </button>
        </div>
      </div>
      <div className="stitch-card-info">
        <span className="card-label">{product.brand || 'Caryqel Objects'}</span>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-price">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export const CategoryPill = ({ name, active, onClick }) => (
  <button 
    className={`cat-pill ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {name}
  </button>
);
