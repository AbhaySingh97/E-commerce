import React from 'react';
import { Link } from 'react-router-dom';
import { FiBarChart2, FiCheck, FiEye, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { formatCurrency } from '../../lib/formatters';

const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

const CatalogProductCard = ({
  product,
  onAddToCart,
  onWishlist,
  onQuickView,
  onCompare,
  isCompared = false,
}) => {
  return (
    <article className="product-card catalog-product-card">
      <div className="product-image-container">
        <div className="product-card-actions">
          {onQuickView && (
            <button type="button" onClick={() => onQuickView(product)} aria-label={`Quick view ${product.name}`}>
              <FiEye />
            </button>
          )}
          {onWishlist && (
            <button type="button" onClick={() => onWishlist(product)} aria-label={`Add ${product.name} to wishlist`}>
              <FiHeart />
            </button>
          )}
          {onCompare && (
            <button
              type="button"
              className={isCompared ? 'active' : ''}
              onClick={() => onCompare(product)}
              aria-label={`Compare ${product.name}`}
            >
              {isCompared ? <FiCheck /> : <FiBarChart2 />}
            </button>
          )}
        </div>
        <Link to={`/products/${product.slug}`} aria-label={product.name}>
          <img
            src={product.images?.[0] || fallbackImage}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.src = fallbackImage;
            }}
          />
        </Link>
      </div>
      <div className="product-details">
        <p className="brand">{product.brand || 'Caryqel'}</p>
        <h3>
          <Link to={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <div className="price">
          <span className="current">{formatCurrency(product.price)}</span>
          {product.originalPrice ? <span className="original">{formatCurrency(product.originalPrice)}</span> : null}
        </div>
        <div className="product-card-meta">
          <span>{product.rating || 0} / 5</span>
          <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
        </div>
        <button type="button" onClick={() => onAddToCart?.(product)} className="add-btn" disabled={product.stock === 0}>
          <FiShoppingBag />
          {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </article>
  );
};

export default CatalogProductCard;
