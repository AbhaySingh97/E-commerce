import React from 'react';
import { TopAppBar, Icon } from '../components/MobileUI';
import { useNavigate } from 'react-router-dom';

const MobileCategoriesPage = () => {
  const navigate = useNavigate();
  
  const categories = [
    { name: 'Electronics', count: 42, icon: '⚡', color: '#10b981' },
    { name: 'Fashion', count: 128, icon: '👗', color: '#8b5cf6' },
    { name: 'Home Decor', count: 64, icon: '🏠', color: '#f59e0b' },
    { name: 'Accessories', count: 89, icon: '🎒', color: '#ef4444' },
    { name: 'Limited', count: 12, icon: '💎', color: '#3b82f6' }
  ];

  return (
    <div className="mobile-page pb-32">
      <TopAppBar title="Categories" showBack={false} />
      
      <main className="mobile-content pt-8">
        <div className="mobile-section-header">
          <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Collections</h2>
          <span className="card-label" style={{ opacity: 0.5 }}>{categories.length} Departments</span>
        </div>

        <div className="category-list" style={{ marginTop: '24px' }}>
          {categories.map((cat) => (
            <div 
              key={cat.name} 
              className="category-row-card glass-panel" 
              onClick={() => navigate('/products')}
              style={{ 
                '--cat-color': cat.color, 
                padding: '20px', 
                borderRadius: '16px',
                marginBottom: '12px'
              }}
            >
              <div className="cat-icon" style={{ fontSize: '24px' }}>{cat.icon}</div>
              <div className="cat-info" style={{ marginLeft: '16px' }}>
                <h3 className="font-body-lg" style={{ color: '#fff', margin: 0 }}>{cat.name}</h3>
                <span className="card-label" style={{ fontSize: '10px' }}>{cat.count} Objects</span>
              </div>
              <div className="cat-arrow" style={{ marginLeft: 'auto', opacity: 0.3 }}>
                <Icon name="chevron_right" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MobileCategoriesPage;
