import React, { useState } from 'react';
import { MobileHeader, MobileProductCard, CategoryPill } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';
import { FiFilter } from 'react-icons/fi';

const MobileProductsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Electronics', 'Fashion', 'Home Decor', 'Accessories'];
  const filteredProducts = activeFilter === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category.name === activeFilter);

  return (
    <div className="mobile-page">
      <MobileHeader title="Shop" showBack={true} />
      
      <div className="mobile-page-content" style={{ padding: '24px' }}>
        <div className="category-scroller" style={{ marginBottom: '32px' }}>
          {categories.map(cat => (
            <CategoryPill 
              key={cat} 
              name={cat} 
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
            />
          ))}
        </div>

        <div className="mobile-section-header">
          <span className="card-label">{filteredProducts.length} Objects found</span>
          <button className="top-bar-action" style={{ padding: 0 }}>
            <FiFilter size={20} />
          </button>
        </div>

        <div className="stitch-grid">
          {filteredProducts.map(product => (
            <MobileProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileProductsPage;
