import React, { useState, useMemo } from 'react';
import { Icon, ProductItem, triggerHaptic } from '../components/MobileUI';
import { useProducts } from '../../context/ProductContext';
import { searchAPI } from '../../services/api';

const MobileSearchPage = () => {
  const { products, categories, loading: productsLoading } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');
  const [showRefine, setShowRefine] = useState(false);

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredResults = useMemo(() => {
    let results = products;

    if (activeTag !== 'All') {
      results = results.filter(p => 
        p.category?.name === activeTag || p.category === activeTag
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand?.toLowerCase().includes(query) ||
        p.category?.name?.toLowerCase().includes(query)
      );
    }

    return results.slice(0, Math.floor(results.length / 2) * 2);
  }, [products, searchQuery, activeTag]);

  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    if (query.length > 1) {
      try {
        const res = await searchAPI.autocomplete(query);
        setSuggestions(res.data.slice(0, 5));
        setShowSuggestions(true);
      } catch (err) {
        console.error('Autocomplete failed', err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s) => {
    triggerHaptic('light');
    setSearchQuery(s);
    setShowSuggestions(false);
  };

  const handleTagClick = (tag) => {
    triggerHaptic('light');
    setActiveTag(tag);
  };

  return (
    <div className="mobile-page pb-32 animate-fade-in bg-[#080808]">
      <main className="mobile-content pt-8">
        <div className="search-input-group relative">
          <Icon name="search" className="search-input-icon" />
          <input 
            type="text" 
            placeholder="Search our collection..." 
            className="stitch-search-input"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => handleSearchChange('')}>
              <Icon name="close" style={{ color: 'rgba(255,255,255,0.4)' }} />
            </button>
          )}

          {/* Autocomplete Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-[100] mt-2 bg-[#111] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
              {suggestions.map((s, i) => (
                <button 
                  key={i}
                  className="w-full text-left px-6 py-4 text-sm text-white/60 border-bottom border-white/5 active:bg-white/5 flex items-center gap-3"
                  onClick={() => selectSuggestion(s)}
                >
                  <Icon name="history" style={{ fontSize: '16px', opacity: 0.3 }} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categories Scroller */}
        <div className="horizontal-scroll-row mb-8">
          <button 
            className={`cat-pill-v3 ${activeTag === 'All' ? 'active' : ''}`}
            onClick={() => handleTagClick('All')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button 
              key={cat._id} 
              className={`cat-pill-v3 ${activeTag === cat.name ? 'active' : ''}`}
              onClick={() => handleTagClick(cat.name)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="section-title-serif" style={{ marginBottom: 0, fontSize: '20px' }}>
            {searchQuery ? `Results for "${searchQuery}"` : 'Collections'}
          </h2>
          <span className="card-label" style={{ opacity: 0.4 }}>{filteredResults.length} ITEMS</span>
        </div>

        {productsLoading ? (
          <div className="py-20 text-center opacity-30">Tracing collection...</div>
        ) : filteredResults.length > 0 ? (
          <div className="product-grid-v3">
            {filteredResults.map((product) => (
              <ProductItem 
                key={product._id} 
                product={product} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Icon name="search_off" style={{ fontSize: '48px', opacity: 0.1, marginBottom: '16px' }} />
            <p className="card-label" style={{ opacity: 0.4 }}>No matches found</p>
          </div>
        )}

        <button className="filter-sort-btn" onClick={() => setShowRefine(true)}>
          <Icon name="tune" /> Refine
        </button>

        {/* Refine Drawer */}
        <div className={`refine-drawer ${showRefine ? 'open' : ''}`}>
          <div className="refine-header">
            <h2 className="refine-title">Refine</h2>
            <button onClick={() => setShowRefine(false)}>
              <Icon name="close" style={{ color: '#fff' }} />
            </button>
          </div>
          
          <div className="mb-8">
            <p className="refine-section-label">Sort By</p>
            <div className="sort-options">
              <button className="sort-btn active">Newest</button>
              <button className="sort-btn">Price Low-High</button>
              <button className="sort-btn">Price High-Low</button>
            </div>
          </div>

          <button className="checkout-btn-premium" onClick={() => setShowRefine(false)}>
            <span>Show Results</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default MobileSearchPage;
