import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import CatalogProductCard from '../components/product/CatalogProductCard';
import EmptyState from '../components/common/EmptyState';
import { InlineLoader } from '../components/common/PageState';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { trackEvent } from '../lib/analytics';
import { formatCurrency, formatNumber } from '../lib/formatters';
import { productAPI, searchAPI, wishlistAPI } from '../services/api';

const fallbackImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80';

const ProductQuickView = ({ product, onClose, onAddToCart, onWishlist }) => {
  if (!product) return null;

  return (
    <div className="quick-view-backdrop" role="presentation" onClick={onClose}>
      <div
        className="quick-view-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="quick-view-close" type="button" onClick={onClose} aria-label="Close quick view">
          <FiX />
        </button>
        <div className="quick-view-media">
          <img src={product.images?.[0] || fallbackImage} alt={product.name} />
        </div>
        <div className="quick-view-content">
          <p className="brand">{product.brand || 'Caryqel'}</p>
          <h2 id="quick-view-title">{product.name}</h2>
          <p>{product.description}</p>
          <div className="quick-view-meta">
            <span>Rating {product.rating || 0} / 5</span>
            <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
          </div>
          <div className="quick-view-price">
            <strong>{formatCurrency(product.price)}</strong>
            {product.originalPrice ? <span>{formatCurrency(product.originalPrice)}</span> : null}
          </div>
          <div className="quick-view-actions">
            <button type="button" onClick={() => onAddToCart(product)} disabled={product.stock === 0}>Add to cart</button>
            <button type="button" onClick={() => onWishlist(product)}>Wishlist</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filterMeta, setFilterMeta] = useState({ brands: [], categories: [], price: {}, sortOptions: [] });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
  };

  useEffect(() => {
    productAPI.getFilterMeta()
      .then((response) => setFilterMeta(response.data))
      .catch(() => setFilterMeta({ brands: [], categories: [], price: {}, sortOptions: [] }));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters.q, filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: 12,
          sort: filters.sort,
          category: filters.category || undefined,
          brand: filters.brand || undefined,
          minPrice: filters.minPrice || undefined,
          maxPrice: filters.maxPrice || undefined,
        };
        const response = filters.q
          ? await searchAPI.search({ ...params, q: filters.q })
          : await productAPI.getProducts(params);
        setProducts(response.data.products || []);
        setTotalPages(response.data.pagination?.pages || 1);
        setTotalProducts(response.data.pagination?.total || 0);
        if (filters.q) {
          trackEvent('search_results_view', { query: filters.q, resultCount: response.data.pagination?.total || 0 });
        }
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, filters.q, filters.category, filters.brand, filters.minPrice, filters.maxPrice, filters.sort]);

  const updateFilter = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) nextParams.set(key, value);
    else nextParams.delete(key);
    setSearchParams(nextParams);
  };

  const resetFilters = () => {
    setSearchParams({});
    setPage(1);
  };

  const handleWishlist = async (product) => {
    if (!user) {
      toast.error('Login to save wishlist items');
      return;
    }

    try {
      await wishlistAPI.addToWishlist(product._id);
      trackEvent('wishlist_add', { productId: product._id, source: 'products_page' });
      toast.success('Added to wishlist');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update wishlist');
    }
  };

  const handleQuickAdd = async (product) => {
    try {
      await addToCart(product._id, 1);
      trackEvent('add_to_cart', { productId: product._id, source: 'products_page' });
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add to cart');
    }
  };

  const toggleCompare = (product) => {
    setCompareProducts((current) => {
      if (current.some((item) => item._id === product._id)) {
        return current.filter((item) => item._id !== product._id);
      }
      if (current.length >= 3) {
        toast.error('Compare up to 3 products');
        return current;
      }
      trackEvent('product_compare_add', { productId: product._id });
      return [...current, product];
    });
  };

  return (
    <div className="page products discovery-page">
      <section className="discovery-hero">
        <p className="section-eyebrow">Product discovery</p>
        <h1>Find premium products faster</h1>
        <p>Search, filter, compare, and preview products in one unified discovery workspace.</p>
      </section>

      <div className="discovery-shell">
        <aside className="discovery-filters">
          <div className="filter-header">
            <span><FiSliders /> Filters</span>
            <button type="button" onClick={resetFilters}>Reset</button>
          </div>
          <label>
            Search
            <div className="filter-search">
              <FiSearch />
              <input
                value={filters.q}
                onChange={(event) => updateFilter('q', event.target.value)}
                placeholder="Search products"
              />
            </div>
          </label>
          <label>
            Category
            <select value={filters.category} onChange={(event) => updateFilter('category', event.target.value)}>
              <option value="">All categories</option>
              {filterMeta.categories?.map((category) => (
                <option key={category._id || category.slug} value={category.slug}>{category.name}</option>
              ))}
            </select>
          </label>
          <label>
            Brand
            <select value={filters.brand} onChange={(event) => updateFilter('brand', event.target.value)}>
              <option value="">All brands</option>
              {filterMeta.brands?.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </label>
          <div className="price-filter-row">
            <label>
              Min price
              <input
                type="number"
                min="0"
                placeholder={String(filterMeta.price?.min || 0)}
                value={filters.minPrice}
                onChange={(event) => updateFilter('minPrice', event.target.value)}
              />
            </label>
            <label>
              Max price
              <input
                type="number"
                min="0"
                placeholder={String(filterMeta.price?.max || 500000)}
                value={filters.maxPrice}
                onChange={(event) => updateFilter('maxPrice', event.target.value)}
              />
            </label>
          </div>
        </aside>

        <section className="discovery-results">
          <div className="discovery-toolbar">
            <div>
              <span>{formatNumber(totalProducts)} products</span>
              <strong>{filters.q ? `Results for "${filters.q}"` : 'All premium products'}</strong>
            </div>
            <select value={filters.sort} onChange={(event) => updateFilter('sort', event.target.value)}>
              {filterMeta.sortOptions?.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <InlineLoader label="Loading products..." />
          ) : !products.length ? (
            <EmptyState
              eyebrow="No matches"
              title="No products found"
              description="Try removing filters, widening the price range, or searching for another product."
              action={<button type="button" className="btn-primary" onClick={resetFilters}>Clear filters</button>}
            />
          ) : (
            <div className="product-grid discovery-grid">
              {products.map((product) => (
                <CatalogProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleQuickAdd}
                  onQuickView={(nextProduct) => {
                    trackEvent('quick_view_open', { productId: nextProduct._id });
                    setQuickViewProduct(nextProduct);
                  }}
                  onWishlist={handleWishlist}
                  onCompare={toggleCompare}
                  isCompared={compareProducts.some((item) => item._id === product._id)}
                />
              ))}
            </div>
          )}

          <div className="pagination">
            <button type="button" onClick={() => setPage((current) => current - 1)} disabled={page === 1}>Prev</button>
            <span>Page {page} of {Math.max(totalPages, 1)}</span>
            <button type="button" onClick={() => setPage((current) => current + 1)} disabled={page >= totalPages}>Next</button>
          </div>
        </section>
      </div>

      {compareProducts.length > 0 && (
        <div className="compare-tray">
          <div>
            <strong>Compare products</strong>
            <span>{compareProducts.length}/3 selected</span>
          </div>
          <div className="compare-items">
            {compareProducts.map((product) => (
              <button key={product._id} type="button" onClick={() => toggleCompare(product)}>
                <img src={product.images?.[0] || fallbackImage} alt={product.name} />
                <span>{product.name}</span>
                <FiX />
              </button>
            ))}
          </div>
        </div>
      )}

      <ProductQuickView
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleQuickAdd}
        onWishlist={handleWishlist}
      />
    </div>
  );
};

export default ProductsPage;
