import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, triggerHaptic } from '../components/MobileUI';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, wishlistAPI } from '../../services/api';

const MobileProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ orders: 0, wishlist: 0, coupons: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [ordersRes, wishlistRes] = await Promise.all([
          orderAPI.getOrders(),
          wishlistAPI.getWishlist()
        ]);
        
        setStats({
          orders: ordersRes.data.totalCount || ordersRes.data.orders?.length || 0,
          wishlist: wishlistRes.data.items?.length || 0,
          coupons: 4 // Assuming coupons are still static or hardcoded in backend for now
        });
      } catch (err) {
        console.error('Failed to fetch profile stats', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Personal Info', icon: 'person', path: '/profile/edit' },
    { label: 'Order History', icon: 'history', path: '/orders' },
    { label: 'Address Book', icon: 'location_on', path: '/profile/addresses' },
    { label: 'Logout', icon: 'logout', action: handleLogout, isLogout: true },
  ];

  return (
    <div className="mobile-page pb-32 bg-dark-0">
      <header className="checkout-header-v3">
        <button onClick={() => navigate(-1)}>
          <Icon name="arrow_back" style={{ color: '#a855f7', fontSize: '24px' }} />
        </button>
        <h1>Caryqel</h1>
        <Icon name="shopping_bag" style={{ color: '#a855f7', fontSize: '24px' }} onClick={() => navigate('/cart')} />
      </header>
      
      <main className="mobile-content">
        <section className="profile-container">
          <div className="avatar-wrapper-v3">
            <div className="avatar-ring-v3"></div>
            <img 
              src={user?.avatar || user?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'} 
              alt="Profile" 
              className="avatar-img-v3" 
            />
            <div className="verified-badge-v3">
              <Icon name="check" style={{ fontSize: '14px' }} />
            </div>
          </div>

          <h2 className="profile-name-serif">{user?.name || 'Guest User'}</h2>
          <div className="platinum-pill-v3">{user?.role === 'admin' ? 'Elite Admin' : 'Platinum Member'}</div>

          <div className="profile-stats-v3">
            <div className="stat-box-v3" onClick={() => navigate('/orders')}>
              <span className="val">{loading ? '...' : stats.orders}</span>
              <span className="lbl">Orders</span>
            </div>
            <div className="stat-box-v3" onClick={() => navigate('/wishlist')}>
              <span className="val">{loading ? '...' : stats.wishlist}</span>
              <span className="lbl">Wishlist</span>
            </div>
            <div className="stat-box-v3">
              <span className="val">{loading ? '...' : stats.coupons}</span>
              <span className="lbl">Coupons</span>
            </div>
          </div>

          <div className="w-full px-6 mb-12">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Elite Progress</span>
              <span className="text-primary text-[10px] font-bold">75% to Diamond</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]" style={{ width: '75%' }}></div>
            </div>
          </div>

          <div className="profile-menu-v3">
            {menuItems.map((item, index) => (
              <button 
                key={index} 
                className={`menu-item-v3 ${item.isLogout ? 'logout' : ''}`}
                onClick={() => { triggerHaptic('light'); item.action ? item.action() : navigate(item.path); }}
              >
                <div className="left">
                  <Icon name={item.icon} style={{ color: item.isLogout ? '#ff5f5f' : '#a855f7' }} />
                  <span>{item.label}</span>
                </div>
                <Icon name="chevron_right" className="icon-arrow" />
              </button>
            ))}
          </div>

          <div className="special-access-card active:scale-[0.98] transition-transform" onClick={() => triggerHaptic('medium')}>
            <div className="diamond-watermark">
              <Icon name="diamond" />
            </div>
            <span className="special-label">Exclusive Benefit</span>
            <h3 className="special-title">
              Personalized <br /> 
              Style Consultation
            </h3>
            <button className="request-btn">Book Now</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MobileProfilePage;
