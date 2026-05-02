import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, ProductItem, Icon } from '../components/MobileUI';
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
        p.brand?.toLowerCase().includes(val.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="mobile-page pb-32">
      <TopAppBar title="Search" />
      
      <main className="mobile-content pt-8">
        <section style={{ marginBottom: '48px' }}>
          <div className="relative group" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', insetY: 0, left: '16px', display: 'flex', alignItems: 'center', poi
nterEvents: 'none', height: '100%' }}>
              <Icon name="search" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </div>
            <input 
              className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white focus:outline-none focus:border-primary/40 focus:bg-white/10 transition-all" 
              placeholder="Search the collection..." 
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
          </div>
          
          {query.length === 0 && (
            <div className="mt-6">
              <p className="card-label mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Oversized Blazers', 'Tech Kits', 'Minimalist Watches'].map(tag => (
                  <span 
                    key={tag} 
                    className="px-4 py-2 rounded-full glass-panel text-[12px] font-semibold text-white/80 hover:border-primary/40 cursor-pointer transition-colors"
                    onClick={() => handleSearch(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
        
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
          <div style={{ textAlign: 'center', marginTop: '80px', opacity: 0.4 }}>
            <p>No results found for "{query}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileSearchPage;
