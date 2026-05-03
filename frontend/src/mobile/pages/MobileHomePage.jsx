import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductItem, Icon, StyleConcierge, triggerHaptic } from '../components/MobileUI';
import { useProducts } from '../../context/ProductContext';
import toast from 'react-hot-toast';
import heroArmchair from '../../assets/hero_armchair.png';

const MobileHomePage = () => {
  const navigate = useNavigate();
  const { products, categories, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCategories = categories.map(cat => {
    const items = products.filter(p => p.category?._id === cat._id || p.category === cat._id);
    return {
      ...cat,
      items: items.slice(0, Math.floor(items.length / 2) * 2)
    };
  }).filter(cat => cat.items.length > 0);

  return (
    <div className="mobile-page pb-32 animate-fade-in">
      {/* Immersive Hero Section - Pixel Perfect Bottom Left */}
      <section className="editorial-hero">
        <img src={heroArmchair} alt="Hero" className="hero-img" />
        <div className="hero-overlay"></div>
        
        <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6">
          <Icon name="menu" style={{ opacity: 0 }} />
          <h1 className="text-white text-[16px] font-bold tracking-[0.4em] font-serif">CARYQEL</h1>
          <button onClick={() => navigate('/cart')}>
            <Icon name="shopping_bag" style={{ color: '#fff' }} />
          </button>
        </header>

        <div className="hero-content">
          <h1 className="hero-title-v3">
            Caryqel <br />
            Elegance
          </h1>
          <p className="hero-tagline-v3">Curated for the Extraordinary</p>
          <button className="btn-explore-v3" onClick={() => navigate('/products')}>
            Explore Now
          </button>
        </div>

        <div className="home-category-row horizontal-scroll-row">
          <button 
            className={`cat-pill-v3 ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {categories.map(cat => (
            <button 
              key={cat._id}
              className={`cat-pill-v3 ${selectedCategory === cat.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <div className="mobile-content pt-8">

      {/* Category Sections */}
      {loading ? (
        <section className="mobile-section">
          <div className="mobile-section-header">
            <div className="skeleton" style={{ width: '150px', height: '24px' }}></div>
          </div>
          <div className="product-grid-v3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="skeleton skeleton-item"></div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {(selectedCategory === 'All' ? filteredCategories : filteredCategories.filter(c => c.name === selectedCategory)).map((cat) => (
            <section key={cat._id} className="mobile-section">
              <div className="mobile-section-header">
                <h2 className="section-title-serif">{cat.name}</h2>
                <span onClick={() => navigate('/products')} className="view-all-link">VIEW ALL</span>
              </div>
              
              <div className="product-grid-v3">
                {cat.items.map((product) => (
                  <ProductItem 
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
      </div>


      {/* Newsletter Section */}
      <section className="mobile-newsletter mobile-content">
        <h3 className="newsletter-title">The Elite Circle</h3>
        <p className="newsletter-desc">Join our inner circle for early access to nocturnal drops and private events.</p>
        <div className="newsletter-form">
          <input 
            type="email" 
            placeholder="E-mail Address" 
            className="newsletter-input"
          />
          <button 
            onClick={() => { triggerHaptic('success'); toast.success('Welcome to the Circle'); }}
            className="newsletter-btn"
          >
            Join the Circle
          </button>
        </div>
      </section>

      {/* Brand Footer */}
      <footer className="mobile-footer">
        <h1 className="footer-logo">Caryqel</h1>
        <p className="footer-tagline">Curating Elegance</p>
      </footer>

      <div className="fixed bottom-[100px] right-5 flex flex-col items-end gap-3" style={{ zIndex: 11000 }}>
        {/* Proactive Floating Message */}
        <div className="bg-white/10 backdrop-blur-xl px-4 py-2 rounded-2xl rounded-br-none border border-white/20 shadow-2xl animate-fade-in">
          <p className="text-[10px] text-white font-medium">Need styling advice? <span className="text-primary font-bold">Ask me LIVE!</span></p>
        </div>
        
        <StyleConcierge />
      </div>
    </div>
  );
};

export default MobileHomePage;
