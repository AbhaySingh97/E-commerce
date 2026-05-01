import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiTruck, FiZap } from 'react-icons/fi';
import RippleGrid from '../RippleGrid';
import StatPill from '../ui/StatPill';
import TextType from '../TextType';

const heroProductImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=85&w=1100';

const EnterpriseHero = ({ featuredProduct }) => {
  const heroImage = featuredProduct?.images?.[0] || heroProductImage;

  return (
    <section className="enterprise-hero">
      <div className="enterprise-hero-bg" aria-hidden="true">
        <RippleGrid
          gridColor="#00d4ff"
          rippleIntensity={0.018}
          gridSize={28}
          gridThickness={14}
          mouseInteraction
          mouseInteractionRadius={1.25}
          opacity={0.45}
          fadeDistance={0.85}
        />
      </div>
      <div className="enterprise-hero-inner">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <TextType
            as="h1"
            text={["Luxury shopping, built to convert.", "Caryqel: The future of commerce.", "Elegance in every single detail."]}
            typingSpeed={100}
            deletingSpeed={50}
            pauseDuration={5000}
            loop={true}
            className="hero-title-animated"
          />
          <div className="hero-actions">
            <Link to="/products" className="btn-primary hero-cta">
              Shop the collection <FiArrowRight />
            </Link>
            <Link to="/categories" className="btn-secondary">Explore categories</Link>
          </div>
          <div className="hero-trust-row">
            <span><FiShield /> Verified marketplace</span>
            <span><FiTruck /> Express delivery</span>
            <span><FiZap /> Live campaigns</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-product-stage"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.15 }}
        >
          <div className="hero-product-frame">
            <img src={heroImage} alt={featuredProduct?.name || 'Premium featured product'} />
            <div className="hero-product-info">
              <span>Featured drop</span>
              <strong>{featuredProduct?.name || 'Signature Luxe Collection'}</strong>
              <p>₹{featuredProduct?.price?.toLocaleString() || '24,999'}</p>
            </div>
          </div>
          <div className="hero-floating-panel panel-top">
            <strong>4.9/5</strong>
            <span>customer rating</span>
          </div>
          <div className="hero-floating-panel panel-bottom">
            <strong>2 hr</strong>
            <span>priority dispatch</span>
          </div>
        </motion.div>
      </div>

      <div className="hero-stat-strip">
        <StatPill value="50K+" label="happy customers" />
        <StatPill value="10K+" label="premium products" />
        <StatPill value="100+" label="curated brands" />
        <StatPill value="24/7" label="support desk" />
      </div>
    </section>
  );
};

export default EnterpriseHero;
