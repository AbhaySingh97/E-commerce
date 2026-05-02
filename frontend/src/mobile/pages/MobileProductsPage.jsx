import React, { useState } from 'react';
import { MobileHeader, MobileProductCard } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';
import { FiFilter, FiChevronDown } from 'react-icons/fi';

const MobileProductsPage = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Electronics', 'Fashion', 'Home Decor', 'Accessories'];
  const filteredProducts = activeFilter === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category.name === activeFilter);

  return (
    <div className="mobile-page">
      <MobileHeader title="Shop" showBack={false} />
      
      <div className="mobile-page-content">
        <div className="mobile-filter-bar">
          <div className="filter-scroll">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-pill ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <button className="filter-trigger">
            <FiFilter size={18} />
          </button>
        </div>

        <div className="mobile-results-header">
          <span>{filteredProducts.length} items found</span>
          <button className="sort-trigger">
            Sort by: Newest <FiChevronDown />
          </button>
        </div>

        <div className="mobile-product-grid">
          {filteredProducts.map(product => (
            <MobileProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileProductsPage;
