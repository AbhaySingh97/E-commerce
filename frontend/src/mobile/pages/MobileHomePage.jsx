import React from 'react';
import { Link } from 'react-router-dom';
import { mockProducts } from '../../data/mockData';

const MobileHomePage = () => {
  const featuredProducts = mockProducts.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="mobile-home">
      <header className="mobile-home-header">
        <h1>Caryqel<br />Elegance.</h1>
        <p>Curated premium pieces for the modern lifestyle.</p>
      </header>

      <section className="mobile-categories">
        <div className="mobile-category-scroll">
          {['Electronics', 'Fashion', 'Home Decor', 'Accessories', 'Limited'].map((cat) => (
            <div key={cat} className="mobile-category-pill">
              {cat}
            </div>
          ))}
        </div>
      </section>

      <section className="mobile-featured">
        <div className="mobile-section-title">
          <h2>Trending Now</h2>
          <Link to="/products">View All</Link>
        </div>
        <div className="mobile-product-grid">
          {featuredProducts.map((product) => (
            <Link key={product._id} to={`/products/${product.slug}`} className="mobile-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mobile-product-image">
                <img src={product.images[0]} alt={product.name} />
              </div>
              <div className="mobile-product-info">
                <h3>{product.name}</h3>
                <p>₹{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mobile-featured" style={{ marginTop: '20px' }}>
        <div className="mobile-section-title">
          <h2>New Arrivals</h2>
        </div>
        <div className="mobile-product-grid">
          {mockProducts.slice(4, 6).map((product) => (
            <Link key={product._id} to={`/products/${product.slug}`} className="mobile-product-card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="mobile-product-image">
                <img src={product.images[0]} alt={product.name} />
              </div>
              <div className="mobile-product-info">
                <h3>{product.name}</h3>
                <p>₹{product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MobileHomePage;
