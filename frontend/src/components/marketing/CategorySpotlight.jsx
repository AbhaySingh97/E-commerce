import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from '../ui/SectionHeader';
import { getCategoryDescription, getCategoryImage, handleCategoryImageError } from '../../lib/categoryVisuals';

const fallbackCategories = [
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Tailored edits, statement pieces, and daily essentials.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=85&w=900'
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Premium devices and accessories for modern work.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=85&w=900'
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Designed objects, comfort upgrades, and refined spaces.',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=85&w=900'
  },
  {
    name: 'Sports & Outdoors',
    slug: 'sports-outdoors',
    description: 'Performance gear selected for active premium living.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=85&w=900'
  }
];

const CategorySpotlight = ({ categories = [] }) => {
  const visibleCategories = categories.length ? categories.slice(0, 4) : fallbackCategories;

  return (
    <section className="home-section category-spotlight-section">
      <SectionHeader
        eyebrow="Curated departments"
        title="Shop by intent, mood, and moment"
        description="Every category is presented like a campaign, helping customers move from discovery to purchase faster."
      />
      <div className="category-spotlight-grid">
        {visibleCategories.map((category, index) => (
          <motion.div
            key={category._id || category.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <Link to={`/products?category=${category.slug}`} className="category-spotlight-card">
              <img src={getCategoryImage(category, index)} alt={category.name} onError={(event) => handleCategoryImageError(event, index)} />
              <div className="category-spotlight-content">
                <span>0{index + 1}</span>
                <h3>{category.name}</h3>
                <p>{getCategoryDescription(category, index)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySpotlight;
