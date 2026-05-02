import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Icon = ({ name, className = "" }) => (
  <span className={`icon ${className}`}>{name}</span>
);

export const TopAppBar = ({ showBack = true, title = "Caryqel" }) => {
  const navigate = useNavigate();
  return (
    <header className="mobile-top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {showBack && (
          <button 
            className="top-bar-action"
            onClick={() => navigate(-1)}
          >
            <Icon name="arrow_back" style={{ color: 'rgba(255,255,255,0.6)' }} />
          </button>
        )}
        <h1>{title}</h1>
      </div>
      <button className="top-bar-action" onClick={() => navigate('/cart')}>
        <Icon name="shopping_bag" style={{ color: '#fff' }} />
      </button>
    </header>
  );
};

export const ProductItem = ({ product, trans = false }) => {
  const navigate = useNavigate();
  return (
    <div 
      className={`product-item ${trans ? 'translate-y-8' : ''}`} 
      onClick={() => navigate(`/products/${product.slug}`)}
      style={{ cursor: 'pointer', transform: trans ? 'translateY(32px)' : 'none' }}
    >
      <div className="aspect-editorial">
        <img src={product.images[0]} alt={product.name} loading="lazy" />
        <div className="absolute top-3 right-3 glass-panel p-2 rounded-full flex items-center justify-center">
          <Icon name="favorite" style={{ fontSize: '18px', color: '#fff' }} />
        </div>
        {/* Only show add button if needed, prototype shows it in search results but not home */}
        <div className="absolute bottom-3 right-3">
          <button className="w-10 h-10 rounded-full gradient-button flex items-center justify-center text-white shadow-lg shadow-violet-500/20 active:scale-95 transition-all">
            <Icon name="add" style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>
      <div className="px-1">
        <span className="card-label block mb-1">{product.brand || 'CARYQEL OBJECTS'}</span>
        <h3 className="card-title">{product.name}</h3>
        <p className="card-price">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export const CategoryPill = ({ name, active, onClick }) => (
  <button 
    className={`pill ${active ? 'pill-active' : 'pill-ghost'}`}
    onClick={onClick}
  >
    {name}
  </button>
);
