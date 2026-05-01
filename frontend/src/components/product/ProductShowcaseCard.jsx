import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';

const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

const ProductShowcaseCard = ({ product, index = 0, onAddToCart }) => {
  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.article
      className="showcase-product-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
    >
      <div className="showcase-product-media">
        {discount && <span className="discount-badge">{discount}% off</span>}
        <button className="icon-float-btn" type="button" aria-label={`Save ${product.name}`}>
          <FiHeart />
        </button>
        <img
          src={product.images?.[0] || fallbackImage}
          alt={product.name}
          onError={(event) => {
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>
      <div className="showcase-product-body">
        <div>
          <p className="product-kicker">{product.brand || 'Caryqel'}</p>
          <h3>{product.name}</h3>
        </div>
        <div className="showcase-product-meta">
          <div className="price-stack">
            <strong>₹{product.price?.toLocaleString()}</strong>
            {product.originalPrice && <span>₹{product.originalPrice.toLocaleString()}</span>}
          </div>
          <button className="round-cart-btn" type="button" onClick={() => onAddToCart?.(product)}>
            <FiShoppingBag />
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductShowcaseCard;
