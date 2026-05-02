import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUser, FiShoppingBag, FiHeart, FiMapPin, 
  FiCreditCard, FiBell, FiHelpCircle, FiLogOut, 
  FiChevronRight, FiSettings 
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { MobileHeader } from '../components/MobileUI';

const MobileProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const menuItems = [
    { icon: <FiUser />, label: 'Personal Information', path: '/profile/edit' },
    { icon: <FiShoppingBag />, label: 'My Orders', path: '/orders' },
    { icon: <FiHeart />, label: 'My Wishlist', path: '/wishlist' },
    { icon: <FiMapPin />, label: 'Shipping Addresses', path: '/profile/addresses' },
    { icon: <FiCreditCard />, label: 'Payment Methods', path: '/profile/payments' },
    { icon: <FiBell />, label: 'Notifications', path: '/profile/notifications' },
    { icon: <FiHelpCircle />, label: 'Help & Support', path: '/contact' },
  ];

  return (
    <div className="mobile-page">
      <MobileHeader title="Profile" showBack={false} />
      
      <div className="mobile-page-content">
        <div className="profile-header">
          <div className="avatar-wrapper">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="avatar-placeholder">
                {user?.name?.charAt(0) || 'C'}
              </div>
            )}
            <button className="edit-avatar-btn">
              <FiSettings size={14} />
            </button>
          </div>
          <div className="profile-info">
            <h2 className="user-name">{user?.name || 'Guest User'}</h2>
            <p className="user-email">{user?.email || 'Sign in to sync your bag'}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item" onClick={() => navigate('/orders')}>
            <span className="stat-val">12</span>
            <span className="stat-label">Orders</span>
          </div>
          <div className="stat-item" onClick={() => navigate('/wishlist')}>
            <span className="stat-val">8</span>
            <span className="stat-label">Wishlist</span>
          </div>
          <div className="stat-item">
            <span className="stat-val">3</span>
            <span className="stat-label">Coupons</span>
          </div>
        </div>

        <div className="profile-menu">
          {menuItems.map((item, idx) => (
            <div key={idx} className="menu-item" onClick={() => navigate(item.path)}>
              <div className="menu-icon">{item.icon}</div>
              <span className="menu-label">{item.label}</span>
              <FiChevronRight className="menu-arrow" />
            </div>
          ))}
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <FiLogOut /> Sign Out
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .profile-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 32px;
          margin-top: 12px;
        }
        .avatar-wrapper {
          position: relative;
          width: 100px;
          height: 100px;
          margin-bottom: 16px;
        }
        .avatar-placeholder {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--mobile-accent-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          color: #fff;
          font-family: 'Playfair Display', serif;
        }
        .avatar-wrapper img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--mobile-accent);
        }
        .edit-avatar-btn {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #fff;
          color: #000;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .user-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          margin: 0;
          font-weight: 800;
        }
        .user-email {
          color: var(--mobile-text-dim);
          font-size: 0.9rem;
          margin-top: 4px;
        }
        .profile-stats {
          display: flex;
          background: var(--mobile-surface);
          border-radius: 24px;
          border: 1px solid var(--mobile-border);
          padding: 20px;
          margin-bottom: 32px;
        }
        .stat-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          position: relative;
        }
        .stat-item:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 20%;
          bottom: 20%;
          width: 1px;
          background: var(--mobile-border);
        }
        .stat-val {
          font-size: 1.2rem;
          font-weight: 800;
        }
        .stat-label {
          font-size: 0.75rem;
          color: var(--mobile-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .profile-menu {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 40px;
        }
        .menu-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: var(--mobile-surface);
          border-radius: 16px;
          border: 1px solid var(--mobile-border);
          transition: all 0.2s ease;
        }
        .menu-item:active {
          background: rgba(255, 255, 255, 0.03);
          transform: scale(0.98);
        }
        .menu-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mobile-accent);
          font-size: 1.2rem;
        }
        .menu-label {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 600;
        }
        .menu-arrow {
          color: var(--mobile-text-dim);
        }
        .btn-logout {
          width: 100%;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 16px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
      `}} />
    </div>
  );
};

export default MobileProfilePage;
