import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHeart, FiMenu, FiSearch, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { searchAPI } from '../services/api';
import { trackEvent } from '../lib/analytics';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 32);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  React.useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      setSuggestions([]);
      return undefined;
    }

    const timeout = setTimeout(() => {
      searchAPI.autocomplete(query)
        .then((res) => setSuggestions(res.data || []))
        .catch(() => setSuggestions([]));
    }, 220);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();

    if (!query) return;

    trackEvent('search_submit', { query, source: 'navbar' });
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (product) => {
    trackEvent('search_autocomplete_select', { slug: product.slug, name: product.name });
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/products/${product.slug}`);
  };

  const handleLogout = () => {
    trackEvent('logout');
    logout();
    navigate('/');
  };

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-brand">LuxeCart</Link>

        <div className={`nav-panel ${mobileOpen ? 'open' : ''}`}>
          <form className="nav-search-bar" onSubmit={handleSearch} role="search">
            <FiSearch className="search-icon" />
            <input
              type="search"
              placeholder="Search products, brands, categories"
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              aria-label="Search products"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions" role="listbox" aria-label="Product suggestions">
                {suggestions.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    className="search-suggestion"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <img src={product.images?.[0] || 'https://via.placeholder.com/40'} alt="" />
                    <span>{product.name}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="nav-actions">
            {user ? (
              <>
                <button type="button" className="nav-chip" onClick={() => navigate('/wishlist')}>
                  <FiHeart />
                  Wishlist
                </button>
                <button type="button" className="nav-chip" onClick={() => navigate('/cart')}>
                  Cart <span className="cart-count">{cartItemCount}</span>
                </button>
                <button type="button" className="nav-chip" onClick={() => navigate('/profile')}>
                  {user.name?.split(' ')[0] || 'Profile'}
                </button>
                {user.role === 'admin' && (
                  <button type="button" className="nav-chip" onClick={() => navigate('/admin')}>
                    Admin
                  </button>
                )}
                <button type="button" onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <Link to="/login" className="login-btn">Login</Link>
            )}
          </div>
        </div>

        <button
          type="button"
          className="mobile-menu-btn"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {mobileOpen && <button type="button" className="nav-backdrop" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
    </nav>
  );
};

export default Navbar;
