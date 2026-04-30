import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Magnet from './Magnet';
import TextType from './TextType';
import RippleGrid from './RippleGrid';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { productAPI } from '../services/api';

const ProductCard = ({ product, index }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      toast.error('Please login to add to cart');
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <motion.div 
      className="product-card"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: (index % 4) * 0.1,
        ease: [0.215, 0.610, 0.355, 1.000]
      }}
    >
      <div className="product-image-container">
        <img 
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'} 
          alt={product.name} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80'; }}
        />
      </div>
      <div className="product-details">
        <p className="brand">{product.brand}</p>
        <h3>{product.name}</h3>
        <div className="price">
          <span className="current">₹{product.price?.toLocaleString()}</span>
        </div>
        <button onClick={handleAddToCart} className="add-btn">Add to Cart</button>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [productsRes, featuredRes] = await Promise.all([
          productAPI.getNewArrivals(),
          productAPI.getFeatured()
        ]);
        setProducts(productsRes.data);
        setFeatured(featuredRes.data);
      } catch (err) {
        console.error('Failed to fetch homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="page" style={{ background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-bg">
          <RippleGrid gridColor="#00d4ff" rippleIntensity={0.02} gridSize={25} gridThickness={15} mouseInteraction={true} mouseInteractionRadius={1.2} opacity={0.5} fadeDistance={0.8} />
        </div>
        <div className="hero-content">
          <Magnet padding={40} magnetStrength={8}>
            <h1>LuxeCart</h1>
          </Magnet>
          <TextType
              text={[
                'Experience Elegance in Every Click.',
                'Discover Curated Premium Collections.'
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              className="hero-subtitle"
            />
          <div className="hero-buttons">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/categories" className="btn-secondary">Browse Categories</Link>
          </div>
        </div>
      </section>

      <div className="page-divider"></div>

      <section className="home-content">
        <div className="section-header">
          <h2>New Arrivals</h2>
          <div className="line"></div>
        </div>
        <div className="product-grid">
          {products.slice(0, 6).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
        <Link to="/products" className="view-all-link">View All Products →</Link>
      </section>

      <section className="promo-section">
        <div className="promo-card promo-left">
          <h2>Summer Collection</h2>
          <p>Up to 50% off on selected items</p>
          <Link to="/products?tag=summer" className="btn-white">Shop Now</Link>
        </div>
        <div className="promo-card promo-right">
          <h2>Premium Brands</h2>
          <p>Exclusive deals on luxury brands</p>
          <Link to="/products?tag=premium" className="btn-white">Explore</Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Collection</h2>
            <div className="line"></div>
          </div>
          <div className="product-grid">
            {featured.slice(0, 6).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <section className="newsletter-section">
        <div className="newsletter-bg">
          <div className="newsletter-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <div className="newsletter-content">
          <div className="newsletter-icon">✉️</div>
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get exclusive offers, early access to new arrivals, and curated collections straight to your inbox. Join <strong>50,000+</strong> luxury shoppers.</p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); toast.success('Thank you for subscribing!'); }}>
            <div className="input-wrapper">
              <input type="email" placeholder="Enter your email address" required />
              <button type="submit">Subscribe</button>
            </div>
          </form>
          <p className="newsletter-note">By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.</p>
        </div>
      </section>

      <section className="all-products-section">
        <div className="section-header">
          <h2>All Products</h2>
          <div className="line"></div>
        </div>
        <div className="product-grid">
          {products.slice(0, 6).map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
        </div>
      </section>
    </div>
  );
};

export default HomePage;