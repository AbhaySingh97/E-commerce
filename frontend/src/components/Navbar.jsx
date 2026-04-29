import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiSearch } from 'react-icons/fi';
import { mockProducts } from '../data/mockData';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const cartItemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const suggestions = searchQuery.trim()
    ? mockProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (slug) => {
    navigate(`/products/${slug}`);
    setSearchQuery('');
    setShowSuggestions(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <form className="nav-search-bar" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions">
              {suggestions.map(p => (
                <div
                  key={p._id}
                  className="search-suggestion"
                  onClick={() => handleSuggestionClick(p.slug)}
                >
                  <img src={p.images[0]} alt={p.name} />
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          )}
        </form>

        <div className="nav-links">
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
              )}
              <Link to="/cart" className="cart-link">
                Cart <span className="cart-count">{cartItemCount}</span>
              </Link>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="login-btn">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;