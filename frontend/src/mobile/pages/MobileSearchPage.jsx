import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiChevronLeft, FiX } from 'react-icons/fi';
import { MobileProductCard } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileSearchPage = () => {
  const navigate = useNavigate();
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
      {/* Custom Search Header */}
      <header className="mobile-top-bar" style={{ height: '80px' }}>
        <button className="top-bar-action" onClick={() => navigate(-1)}>
          <FiChevronLeft size={24} />
        </button>
        <div className="search-input-group" style={{ flex: 1, margin: '0 12px' }}>
          <FiSearch className="search-input-icon" size={20} />
          <input 
            className="stitch-search-input" 
            placeholder="Search the collection..." 
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
          {query && <FiX style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} onClick={() => handleSearch('')} />}
        </div>
      </header>

      <div className="mobile-page-content" style={{ padding: '24px' }}>
        {query.length === 0 ? (
          <div>
            <p className="card-label" style={{ marginBottom: '16px' }}>Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Oversized Blazers', 'Tech Kits', 'Minimalist Watches'].map(tag => (
                <span key={tag} className="cat-pill" onClick={() => handleSearch(tag)}>{tag}</span>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {results.length > 0 ? (
              <div className="stitch-grid">
                {results.map(product => (
                  <MobileProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.4 }}>
                <p>No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSearchPage;
