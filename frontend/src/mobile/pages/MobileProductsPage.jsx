import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, ProductItem, CategoryPill } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileProductsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const categories = ['All', 'Electronics', 'Fashion', 'Home Decor', 'Accessories'];
  const filteredProducts = activeFilter === 'All' 
    ? mockProducts 
    : mockProducts.filter(p => p.category.name === activeFilter);

  return (
    <div className="mobile-page pb-32">
      <TopAppBar title="Shop" />
      
      <main className="mobile-content pt-8">
        <section className="category-pills" style={{ marginTop: 0 }}>
          {categories.map(cat => (
            <CategoryPill 
              key={cat} 
              name={cat} 
              active={activeFilter === cat}
              onClick={() => setActiveFilter(cat)}
            />
          ))}
        </section>

        <section style={{ marginTop: '48px' }}>
          <div className="mobile-section-header">
            <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>{activeFilter} Collections</h2>
            <span className="card-label" style={{ opacity: 0.4 }}>{filteredProducts.length} items</span>
          </div>
          
          <div className="masonry-grid">
            {filteredProducts.map((product, idx) => (
              <ProductItem 
                key={product._id}
                product={product}
                trans={idx % 2 !== 0}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MobileProductsPage;
