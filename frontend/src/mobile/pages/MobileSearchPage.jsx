import React, { useState } from 'react';
import { TopAppBar, ProductItem, Icon } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = (val) => {
    setQuery(val);
    if (val.length > 2) {
      const filtered = mockProducts.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase()) || 
        p.brand?.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="mobile-page pb-32 bg-background">
      <TopAppBar title="Search" />
      
      <main className="mobile-content pt-4">
        <section style={{ marginBottom: '32px' }}>
          <div className="search-input-group">
            <Icon name="search" className="search-input-icon" style={{ fontSize: '20px' }} />
            <input 
              className="stitch-search-input" 
              placeholder="Search the collection..." 
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          </div>
          
          {query.length === 0 && (
            <div className="mt-8">
              <p className="card-label mb-4" style={{ opacity: 0.5 }}>Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Oversized Blazers', 'Tech Kits', 'Minimalist Watches'].map(tag => (
                  <button 
                    key={tag} 
                    className="pill pill-ghost"
                    style={{ fontSize: '11px', padding: '10px 20px' }}
                    onClick={() => handleSearch(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
        
        {results.length > 0 && (
          <div className="mobile-section-header" style={{ marginBottom: '24px' }}>
            <span className="card-label" style={{ opacity: 0.5 }}>{results.length} Objects Found</span>
          </div>
        )}

        <section className="masonry-grid">
          {results.map((product, idx) => (
            <ProductItem 
              key={product._id} 
              product={product} 
              trans={idx % 2 !== 0}
            />
          ))}
        </section>

        {query.length > 2 && results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <Icon name="search_off" style={{ fontSize: '48px', marginBottom: '16px' }} />
            <p className="font-body-md">No results found for "{query}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileSearchPage;
