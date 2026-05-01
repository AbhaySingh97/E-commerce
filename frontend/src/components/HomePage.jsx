import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { productAPI, newsletterAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../lib/formatters';
import { categories as fallbackCategories, getFeaturedProducts, getNewArrivals } from '../data/mockData';
import BrandMarquee from './marketing/BrandMarquee';
import CampaignBand from './marketing/CampaignBand';
import CategorySpotlight from './marketing/CategorySpotlight';
import EnterpriseHero from './marketing/EnterpriseHero';
import SocialProof from './marketing/SocialProof';
import TrustExperience from './marketing/TrustExperience';
import ProductShowcaseCard from './product/ProductShowcaseCard';
import SectionHeader from './ui/SectionHeader';

const HomePage = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchHomeData = async () => {
      const results = await Promise.allSettled([
        productAPI.getNewArrivals(),
        productAPI.getFeatured(),
        productAPI.getCategories()
      ]);

      const [newArrivalsRes, featuredRes, categoriesRes] = results;

      if (newArrivalsRes.status === 'fulfilled') {
        setNewArrivals(newArrivalsRes.value.data || []);
      } else {
        setNewArrivals(getNewArrivals().slice(0, 8));
      }

      if (featuredRes.status === 'fulfilled') {
        setFeatured(featuredRes.value.data || []);
      } else {
        setFeatured(getFeaturedProducts().slice(0, 8));
      }

      if (categoriesRes.status === 'fulfilled') {
        setCategories(categoriesRes.value.data || []);
      } else {
        setCategories(fallbackCategories.slice(0, 4));
      }

      if (results.every((result) => result.status === 'rejected')) {
        toast.error('Live storefront data is unavailable. Showing preview content.');
      }

      setLoading(false);
    };

    fetchHomeData();
  }, []);

  const heroProduct = useMemo(() => featured[0] || newArrivals[0], [featured, newArrivals]);
  const bestSellers = useMemo(() => {
    const source = featured.length ? featured : newArrivals;
    return [...source].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);
  }, [featured, newArrivals]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id, 1);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault();
    try {
      await newsletterAPI.subscribe({ email });
      toast.success('You are on the LuxeCart list');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Subscription failed');
    }
  };

  if (loading) {
    return (
      <div className="page storefront-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page home enterprise-home">
      <EnterpriseHero featuredProduct={heroProduct} />
      <BrandMarquee />

      <CategorySpotlight categories={categories} />

      <section className="home-section product-showcase-section">
        <SectionHeader
          eyebrow="Fresh arrivals"
          title="New products with campaign-ready presentation"
          description="A sharper product grid that keeps imagery, pricing, wishlist intent, and add-to-cart actions visible without breaking the dark premium theme."
          action={<Link to="/products" className="section-link">View all <FiArrowRight /></Link>}
        />
        <div className="showcase-product-grid">
          {newArrivals.slice(0, 8).map((product, index) => (
            <ProductShowcaseCard
              key={product._id}
              product={product}
              index={index}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>

      <CampaignBand />

      {bestSellers.length > 0 && (
        <section className="home-section best-seller-section">
          <SectionHeader
            eyebrow="Conversion shelf"
            title="Best sellers customers trust first"
            description="Use rating and demand signals to create a high-confidence product shelf above deeper browsing."
            action={<Link to="/products?sort=-rating" className="section-link">Shop best sellers <FiArrowRight /></Link>}
          />
          <div className="best-seller-layout">
            <div className="best-seller-feature">
              <img src={bestSellers[0].images?.[0]} alt={bestSellers[0].name} />
              <div>
                <span>Top pick</span>
                <h3>{bestSellers[0].name}</h3>
                <p>{bestSellers[0].description}</p>
                <strong>{formatCurrency(bestSellers[0].price)}</strong>
                <button type="button" onClick={() => handleAddToCart(bestSellers[0])}>Add to cart</button>
              </div>
            </div>
            <div className="best-seller-list">
              {bestSellers.slice(1, 4).map((product) => (
                <article key={product._id} className="best-seller-row">
                  <img src={product.images?.[0]} alt={product.name} />
                  <div>
                    <span>{product.brand}</span>
                    <h4>{product.name}</h4>
                    <p>{formatCurrency(product.price)}</p>
                  </div>
                  <button type="button" onClick={() => handleAddToCart(product)}>Add</button>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <TrustExperience />
      <SocialProof />

      <section className="home-section newsletter-section enterprise-newsletter">
        <div className="newsletter-content">
          <div className="newsletter-icon"><FiMail /></div>
          <p className="section-eyebrow">Private access</p>
          <h2>Get early campaign access and member-only offers</h2>
          <p>
            Join the premium list for launch drops, loyalty updates, personalized product edits, and limited-time offers.
          </p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <div className="input-wrapper">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </div>
          </form>
          <span className="newsletter-note">No spam. Premium drops, offers, and account-ready announcements only.</span>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
