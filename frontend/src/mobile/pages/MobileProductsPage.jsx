import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TopAppBar, ProductItem, CategoryPill } from '../components/MobileUI';
import { useProducts } from '../../context/ProductContext';

const MobileProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products: allProducts, categories, loading: contextLoading } = useProducts();
  const initialCategory = searchParams.get('category') || 'All';
  
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    let result = allProducts;
    if (activeFilter !== 'All') {
      result = allProducts.filter(p => 
        p.category?.name === activeFilter || 
        p.category === activeFilter ||
        p.category?.slug === activeFilter
      );
    }
    setFilteredProducts(result.slice(0, Math.floor(result.length / 2) * 2));
    setSearchParams({ category: activeFilter });
  }, [activeFilter, allProducts, setSearchParams]);

  const loading = contextLoading;
  const products = filteredProducts;

  return (
    <div className="mobile-page pb-32 bg-dark-0">
      <TopAppBar title="Collections" />
      
      <main className="mobile-content pt-8">
        <section className="horizontal-scroll-row mb-8">
          <CategoryPill 
            name="All" 
            active={activeFilter === 'All'}
            onClick={() => setActiveFilter('All')}
          />
          {categories.map(cat => (
            <CategoryPill 
              key={cat._id} 
              name={cat.name} 
              active={activeFilter === cat.name}
              onClick={() => setActiveFilter(cat.name)}
            />
          ))}
        </section>

        <section style={{ marginTop: '32px' }}>
          <div className="flex justify-between items-end mb-8">
            <h2 className="section-title-serif" style={{ fontSize: '24px', marginBottom: 0 }}>
              {activeFilter === 'All' ? 'The Collection' : activeFilter}
            </h2>
            <span className="card-label opacity-40">{products.length} Pieces</span>
          </div>
          
          {loading ? (
            <div className="product-grid-v3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton skeleton-item"></div>
              ))}
            </div>
          ) : (
            <div className="product-grid-v3">
              {products.map((product) => (
                <ProductItem 
                  key={product._id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MobileProductsPage;
