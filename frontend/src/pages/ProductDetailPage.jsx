import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductShowcaseCard from '../components/product/ProductShowcaseCard';
import { ErrorState, InlineLoader, PageLoader } from '../components/common/PageState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../lib/analytics';
import { formatCurrency, percentage } from '../lib/formatters';
import { productAPI, reviewAPI, wishlistAPI } from '../services/api';

const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });

  const loadProduct = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError('');
    try {
      const [productResponse, relatedResponse, summaryResponse, reviewResponse] = await Promise.all([
        productAPI.getProduct(slug),
        productAPI.getRelated(slug),
        reviewAPI.getRatingSummary(slug),
        reviewAPI.getProductReviews(slug, { limit: 6 }),
      ]);

      setProduct(productResponse.data);
      setSelectedImage(productResponse.data.images?.[0] || fallbackImage);
      setRelatedProducts(relatedResponse.data || []);
      setRatingSummary(summaryResponse.data);
      setReviews(reviewResponse.data.reviews || []);
      trackEvent('pdp_view', { slug });
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product._id, 1);
      trackEvent('add_to_cart', { productId: product._id, source: 'product_detail' });
      toast.success('Added to cart');
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Failed to add to cart');
    }
  };

  const handleWishlist = async () => {
    if (!user || !product) {
      toast.error('Login to save wishlist items');
      return;
    }

    try {
      await wishlistAPI.addToWishlist(product._id);
      trackEvent('wishlist_add', { productId: product._id, source: 'product_detail' });
      toast.success('Added to wishlist');
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Failed to update wishlist');
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!product) return;

    setSubmittingReview(true);
    try {
      await reviewAPI.createReview(slug, reviewForm);
      trackEvent('review_submit', { productId: product._id, rating: reviewForm.rating });
      toast.success('Review submitted');
      setReviewForm({ rating: 5, title: '', comment: '' });
      loadProduct();
    } catch (requestError) {
      toast.error(requestError.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const response = await reviewAPI.markHelpful(reviewId);
      setReviews((current) => current.map((review) => (review._id === reviewId ? response.data : review)));
    } catch {
      toast.error('Failed to mark review helpful');
    }
  };

  if (loading) {
    return <PageLoader title="Loading product detail" message="Gathering product, review, and recommendation data." />;
  }

  if (error || !product) {
    return <ErrorState title="Product not found" message={error || 'This product is unavailable.'} action={<Link to="/products" className="btn-primary">Back to products</Link>} />;
  }

  const reviewCount = ratingSummary?.reviewCount || 0;

  return (
    <div className="page product-detail-page">
      <div className="product-detail-layout">
        <div className="product-gallery-card">
          <img className="product-gallery-hero" src={selectedImage || fallbackImage} alt={product.name} />
          {product.images?.length > 1 && (
            <div className="product-gallery-strip">
              {product.images.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={selectedImage === image ? 'active' : ''}
                  onClick={() => setSelectedImage(image)}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail-copy">
          <span className="page-state-badge">{product.category?.name || 'Premium product'}</span>
          <h1>{product.name}</h1>
          <p className="product-detail-brand">{product.brand || 'Caryqel'}</p>
          <p className="product-detail-description">{product.description}</p>
          <div className="product-detail-price">
            <strong>{formatCurrency(product.price)}</strong>
            {product.originalPrice ? <span>{formatCurrency(product.originalPrice)}</span> : null}
          </div>
          <div className="product-detail-meta">
            <span>{product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}</span>
            <span>{product.rating || 0} / 5 from {reviewCount} reviews</span>
          </div>
          <div className="hero-actions">
            <button type="button" className="btn-primary hero-cta" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of stock' : 'Add to cart'}
            </button>
            <button type="button" className="btn-secondary" onClick={handleWishlist}>Save to wishlist</button>
          </div>
        </div>
      </div>

      <section className="surface-card rating-summary-card">
        <div>
          <span className="page-state-badge">Ratings</span>
          <h2>{ratingSummary?.rating || 0} / 5</h2>
          <p>{reviewCount} customer reviews</p>
        </div>
        <div className="rating-breakdown">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="rating-row">
              <span>{rating} star</span>
              <div className="rating-bar">
                <div style={{ width: `${percentage(ratingSummary?.[rating] || 0, reviewCount)}%` }}></div>
              </div>
              <strong>{ratingSummary?.[rating] || 0}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="reviews-section">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">Customer reviews</p>
            <h2>What buyers are saying</h2>
          </div>
        </div>

        <div className="reviews-layout">
          <div className="stack-list">
            {reviews.length ? reviews.map((review) => (
              <article key={review._id} className="surface-card review-card">
                <div className="review-card-header">
                  <div>
                    <strong>{review.user?.name || 'Customer'}</strong>
                    <span>{review.rating} / 5</span>
                  </div>
                  {review.isVerifiedPurchase && <span className="page-state-badge">Verified purchase</span>}
                </div>
                <h3>{review.title}</h3>
                <p>{review.comment}</p>
                <button type="button" className="btn-secondary review-helpful" onClick={() => handleMarkHelpful(review._id)}>
                  Helpful ({review.helpfulCount || 0})
                </button>
              </article>
            )) : <InlineLoader label="No reviews yet. Be the first to review this product." />}
          </div>

          <div className="surface-card review-form-card">
            <h2>Write a review</h2>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <label>
                  Rating
                  <select value={reviewForm.rating} onChange={(event) => setReviewForm((current) => ({ ...current, rating: Number(event.target.value) }))}>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Title
                  <input value={reviewForm.title} onChange={(event) => setReviewForm((current) => ({ ...current, title: event.target.value }))} required />
                </label>
                <label>
                  Comment
                  <textarea value={reviewForm.comment} onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))} required />
                </label>
                <button type="submit" className="btn-primary" disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit review'}
                </button>
              </form>
            ) : (
              <p>Login to share your experience with this product.</p>
            )}
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="home-section product-showcase-section">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Related products</p>
              <h2>Continue your discovery</h2>
            </div>
          </div>
          <div className="showcase-product-grid">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductShowcaseCard
                key={relatedProduct._id}
                product={relatedProduct}
                index={index}
                onAddToCart={async () => {
                  try {
                    await addToCart(relatedProduct._id, 1);
                    trackEvent('add_to_cart', { productId: relatedProduct._id, source: 'related_products' });
                    toast.success('Added to cart');
                  } catch {
                    toast.error('Failed to add to cart');
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;
