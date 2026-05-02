import React from 'react';
import { MobileHeader } from '../components/MobileUI';
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
    <div className="mobile-page">
      <MobileHeader title="Categories" showBack={false} />
      
      <div className="mobile-page-content">
        <div className="category-list">
          {categories.map((cat) => (
            <div 
              key={cat.name} 
              className="category-row-card" 
              onClick={() => navigate('/products')}
              style={{ '--cat-color': cat.color }}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-info">
                <h3>{cat.name}</h3>
                <span>{cat.count} Items</span>
              </div>
              <div className="cat-arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileCategoriesPage;
