import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileHeader } from '../components/MobileUI';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiPackage, FiHeart, FiMapPin, FiLogOut, FiChevronRight, FiCheckCircle, FiStar } from 'react-icons/fi';

const MobileProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Personal Info', icon: <FiUser />, path: '/profile' },
    { label: 'Order History', icon: <FiPackage />, path: '/orders' },
    { label: 'Address Book', icon: <FiMapPin />, path: '/profile' },
  ];

  return (
    <div className="mobile-page">
      <MobileHeader title="Caryqel" showCart={true} />
      
      <div className="mobile-page-content" style={{ padding: '32px 24px' }}>
        {/* Profile Header */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '48px' }}>
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <div style={{ width: '128px', height: '128px', borderRadius: '50%', border: '2px solid var(--mobile-prima
ry-container)', padding: '4px' }}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" 
                alt={user?.name} 
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
              />
            </div>
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderRadius: '50%
', background: 'var(--mobile-accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', border:
 '4px solid var(--mobile-bg)' }}>
              <FiCheckCircle size={16} color="#fff" />
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h2 className="hero-title" style={{ fontSize: '32px', fontStyle: 'normal', marginBottom: '8px' }}>{user?.nam
e || 'Alex Sterling'}</h2>
            <div className="cat-pill active" style={{ display: 'inline-block', fontSize: '10px', padding: '6px 16px' }}>
              Platinum Member
            </div>
          </div>
        </section>

        {/* Activity Grid */}
        <div className="profile-stats-grid" style={{ marginBottom: '48px' }}>
          <div className="stat-card">
            <span className="stat-value">12</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">24</span>
            <span className="stat-label">Wishlist</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">04</span>
            <span className="stat-label">Coupons</span>
          </div>
        </div>

        {/* Menu List */}
        <div className="menu-list">
          {menuItems.map(item => (
            <div key={item.label} className="menu-row" onClick={() => navigate(item.path)}>
              <div className="menu-row-left">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.label}</span>
              </div>
              <FiChevronRight className="menu-icon" />
            </div>
          ))}
          <div className="menu-row" onClick={logout} style={{ borderBottom: 'none' }}>
            <div className="menu-row-left">
              <FiLogOut className="menu-icon" style={{ color: 'var(--mobile-error)' }} />
              <span className="menu-text" style={{ color: 'var(--mobile-error)' }}>Logout</span>
            </div>
            <FiChevronRight className="menu-icon" style={{ color: 'var(--mobile-error)' }} />
          </div>
        </div>

        {/* Exclusive Offer Bento */}
        <section className="glass-panel" style={{ marginTop: '48px', padding: '24px', borderRadius: '20px', position:
 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="card-label" style={{ color: 'var(--mobile-primary)', marginBottom: '8px' }}>Special Access
</span>
            <h3 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', marginBottom: '16px' }}>Winter '24
 <br/>Privé Preview</h3>
            <button className="h-[40px] px-6 rounded-full" style={{ background: '#fff', color: '#000', fontSize: '11px'
, fontWeight: 700, border: 'none' }}>Request Invite</button>
          </div>
          <FiStar size={100} style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1, color: '#fff' }} />
        </section>
      </div>
    </div>
  );
};

export default MobileProfilePage;
