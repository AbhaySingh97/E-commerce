import React, { useState } from 'react';
import { MobileHeader, MobileProductCard } from '../components/MobileUI';
import { FiSearch, FiX } from 'react-icons/fi';
import { mockProducts } from '../../data/mockData';

const MobileSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (val) => {
    setQuery(val);
    if (val.length > 2) {
      const filtered = mockProducts.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase()) || 
        p.brand.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="mobile-page">
      <div className="mobile-search-header">
        <div className="search-input-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search products, brands..." 
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
          {query && <FiX className="clear-icon" onClick={() => handleSearch('')} />}
        </div>
        <button className="cancel-btn" onClick={() => window.history.back()}>Cancel</button>
      </div>

      <div className="mobile-page-content">
        {query.length > 0 ? (
          results.length > 0 ? (
            <div className="mobile-product-grid">
              {results.map(product => (
                <MobileProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-results">
              <p>No results found for "{query}"</p>
            </div>
          )
        ) : (
          <div className="search-suggestions">
            <h3>Popular Searches</h3>
            <div className="suggestion-tags">
              {['Headphones', 'MacBook', 'Analog', 'Lamps'].map(tag => (
                <span key={tag} onClick={() => handleSearch(tag)}>{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchPage;
