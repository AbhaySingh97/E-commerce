import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MobileHeader, MobileProductCard, CategoryPill } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileHomePage = () => {
  const navigate = useNavigate();
  const featuredProducts = mockProducts.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="mobile-page">
      <MobileHeader showBack={false} />
      
      {/* Editorial Hero */}
      <section className="editorial-hero">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800" 
          alt="Luxury Editorial" 
          className="hero-img"
        />
        <div className="hero-overlay">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Caryqel<br />Elegance
          </motion.h1>
          <p className="hero-tagline">Curated for the Extraordinary</p>
          <div style={{ marginTop: '32px' }}>
            <button 
              className="h-[56px] px-8 rounded-full gradient-button uppercase tracking-widest text-[12px]"
              onClick={() => navigate('/products')}
            >
              Explore Now
            </button>
          </div>
        </div>
      </section>

      {/* Category Scroller */}
      <section className="mobile-section" style={{ marginTop: '48px' }}>
        <div className="category-scroller">
          {['Electronics', 'Fashion', 'Limited', 'Jewelry'].map((cat, i) => (
            <CategoryPill key={cat} name={cat} active={i === 0} onClick={() => navigate('/products')} />
          ))}
        </div>
      </section>

      {/* Trending Grid */}
      <section className="mobile-section">
        <div className="mobile-section-header">
          <h2>Trending Now</h2>
          <span className="section-link" onClick={() => navigate('/products')}>View All</span>
        </div>
        <div className="stitch-grid">
          {featuredProducts.map(product => (
            <MobileProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer Branding */}
      <div style={{ padding: '80px 24px', textAlign: 'center', opacity: 0.2 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', letterSpacing: '0.2em' }}>CARYQEL</h2>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', marginTop: '10px' }}>Est. 2026 • Studio Design</p>
      </div>
    </div>
  );
};

export default MobileHomePage;
