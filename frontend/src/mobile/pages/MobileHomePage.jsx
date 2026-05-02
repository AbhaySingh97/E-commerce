import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopAppBar, ProductItem, CategoryPill } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileHomePage = () => {
  const navigate = useNavigate();
  const trendingProducts = mockProducts.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="mobile-page pb-32">
      <TopAppBar showBack={false} />
      
      {/* Editorial Hero Section */}
      <section className="relative w-full h-[600px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAK7dV9X9cjfQBYgSIh1-y5-iET82ko-SWlr6IMZwurIWHW3RZ2AfY9GEjpzA7OGF7R0JIah_6UaMqRPfpAx4lvAH7NSClrWjUjNfErXbCGbtQqors-wY7xZXrFmTVQh8LW8R00NRHimH1FxJUUM4RabaOTDxloIuQe9mIkTCJO45Ok4NL1JuonPTXu2-c3b9VNntxkwCUe912IXWrxp5-l_OsDIncSS0abU_rTYtEBwIkWE_mVltpkRYEFjb95bfvKQBlpj12tPmSP" 
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-end px-6 pb-12">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Caryqel Elegance
          </motion.h1>
          <p className="hero-tagline">Curated for the Extraordinary</p>
          <div className="mt-8">
            <button 
              onClick={() => navigate('/products')} 
              className="h-[56px] px-8 rounded-full gradient-button font-bold uppercase tracking-widest hover:opacity-90 transition-all active:scale-95"
              style={{ fontSize: '12px' }}
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* Category Scroller */}
      <section className="mobile-section">
        <div className="category-pills">
          <CategoryPill name="Electronics" active={true} onClick={() => navigate('/products')} />
          <CategoryPill name="Fashion" active={false} onClick={() => navigate('/products')} />
          <CategoryPill name="Limited" active={false} onClick={() => navigate('/products')} />
          <CategoryPill name="Jewelry" active={false} onClick={() => navigate('/products')} />
        </div>
      </section>

      {/* Trending Grid */}
      <section className="mobile-section" style={{ marginTop: '48px' }}>
        <div className="mobile-section-header">
          <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Trending Now</h2>
          <span className="card-label" style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => navigate('/products')}>View All</span>
        </div>
        
        <div className="masonry-grid">
          {trendingProducts.map((product, idx) => (
            <ProductItem 
              key={product._id}
              product={product}
              trans={idx % 2 !== 0}
            />
          ))}
        </div>
      </section>

      {/* Brand Footer */}
      <div style={{ padding: '80px 24px', textAlign: 'center', opacity: 0.2 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.2em' }}>CARYQEL</h2>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', marginTop: '10px' }}>Est. 2026 • Studio Design</p>
      </div>
    </div>
  );
};

export default MobileHomePage;
