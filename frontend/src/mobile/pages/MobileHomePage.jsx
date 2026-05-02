import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiBell, FiArrowRight, FiZap, FiPackage, FiAward, FiArrowUpRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { mockProducts } from '../../data/mockData';
import { MobileProductCard } from '../components/MobileUI';

const MobileHomePage = () => {
  const navigate = useNavigate();
  const featuredProducts = mockProducts.filter(p => p.isFeatured);
  const trendingProducts = mockProducts.slice(0, 5);
  const newArrivals = mockProducts.slice(4, 10);

  const categories = [
    { name: 'Latest', icon: '✨', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200' },
    { name: 'Tech', icon: '⚡', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200' },
    { name: 'Style', icon: '👔', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200' },
    { name: 'Home', icon: '🏠', img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=200' },
    { name: 'Deals', icon: '🏷️', img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=200' },
    { name: 'Gifts', icon: '🎁', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=200' },
  ];

  return (
    <div className="mobile-home">
      {/* App-Style Top Bar */}
      <header className="mobile-app-header" style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', st
icky: 'top', top: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)', zIndex: 1000, margin: '0 -20px' }}>
        <h2 style={{ fontSize: '1.4rem', fontFamily: 'Playfair Display', margin: 0, fontWeight: 900 }}>C.</h2>
        <div className="header-search-input" onClick={() => navigate('/search')}>
          <FiSearch size={16} />
          <span>Search products...</span>
        </div>
        <button style={{ background: 'transparent', border: 'none', color: '#fff', padding: 0 }}>
          <FiBell size={22} />
        </button>
      </header>

      {/* Stories / Categories */}
      <section className="mobile-stories-container">
        {categories.map((cat, i) => (
          <motion.div 
            key={cat.name} 
            className="story-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="story-ring">
              <div className="story-inner">
                <img src={cat.img} alt={cat.name} />
              </div>
            </div>
            <span className="story-label">{cat.name}</span>
          </motion.div>
        ))}
      </section>

      {/* Hero Banner */}
      <motion.section 
        className="mobile-promo-banner"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800" 
          alt="Summer Campaign" 
          className="banner-img"
        />
        <div className="banner-content">
          <span className="banner-label">New Season</span>
          <h2 className="banner-title">The Art of<br />Minimalism</h2>
          <button style={{ width: 'fit-content', background: '#fff', color: '#000', border: 'none', padding: '8px 20px'
, borderRadius: '100px', fontWeight: 700, marginTop: '16px', fontSize: '0.9rem' }}>
            Explore Edits
          </button>
        </div>
      </motion.section>

      {/* Horizontal Scroller: Trending */}
      <section>
        <div className="mobile-section-title">
          <h2>Trending Now</h2>
          <Link to="/products">See all</Link>
        </div>
        <div className="mobile-horizontal-scroll">
          {trendingProducts.map((product) => (
            <div key={product._id} className="scroll-item">
              <MobileProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Bento Grid Discover */}
      <section>
        <div className="mobile-section-title">
          <h2>Discover</h2>
        </div>
        <div className="mobile-bento-grid">
          <div className="bento-item bento-item-large" style={{ background: 'linear-gradient(45deg, #1e1b4b, #312e81)'
 }}>
            <FiAward className="bento-bg-icon" />
            <span style={{ fontSize: '10px', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase' }}>Collectio
n</span>
            <h4>Luxe<br />Essential</h4>
            <FiArrowUpRight style={{ position: 'absolute', top: 16, right: 16 }} />
          </div>
          <div className="bento-item" style={{ background: '#111' }}>
            <FiZap className="bento-bg-icon" style={{ color: '#fbbf24' }} />
            <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 700 }}>Ends in 2h</span>
            <h4 style={{ fontSize: '1rem' }}>Flash<br />Sales</h4>
          </div>
          <div className="bento-item" style={{ background: '#111' }}>
            <FiPackage className="bento-bg-icon" style={{ color: '#10b981' }} />
            <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>Caryqel Go</span>
            <h4 style={{ fontSize: '1rem' }}>Express<br />Shipping</h4>
          </div>
        </div>
      </section>

      {/* Main Feed: New Arrivals */}
      <section>
        <div className="mobile-section-title">
          <h2>New Arrivals</h2>
        </div>
        <div className="mobile-product-grid">
          {newArrivals.map((product) => (
            <MobileProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* App Style Footer Quote */}
      <div style={{ padding: '40px 20px', textAlign: 'center', opacity: 0.3 }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Caryqel Studio / 2026</p>
      </div>
    </div>
  );
};

export default MobileHomePage;
