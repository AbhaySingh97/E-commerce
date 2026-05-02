import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, Icon } from '../components/MobileUI';
import { useAuth } from '../../context/AuthContext';

const MobileProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mobile-page pb-32 bg-background min-h-screen">
      <TopAppBar showBack={true} />
      
      <main className="mobile-content py-8">
        <section className="flex flex-col items-center mb-section-gap">
          <div className="relative mb-6" style={{ position: 'relative' }}>
            <div className="w-32 h-32 rounded-full border-2 border-primary-container p-1">
              <img 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full" 
                src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBy7mFAYL5dhJUndGjbTRQ1Y8gQn9GgtJHWpUg7T0l9uMbmqfmoiR_ltjG7f1jVHs_IOucZSiWZAlDzRtvhYt57hqjcuKh__f9BQrBCG3zSW4WgCnitxL7whTmsmq-aSBnayGv-0trlc0y6hsahOfH5N0WEgLorwwvt0OYSH4RwfD4w4hOeWKXXxT0vXlzHTe-02i_9TKcL68LlbVDDxi-FWpONGKaG8pAMP5hn66EvaRPnhHat9WdH1OyHKvWgtweyBygYTRVYkfSA"}
              />
            </div>
            <div 
              className="absolute bottom-0 right-0 brand-gradient w-8 h-8 rounded-full flex items-center justify-center border-4 border-surface shadow-lg"
              style={{ position: 'absolute', bottom: 0, right: 0 }}
            >
              <Icon name="verified" style={{ fontSize: '16px', color: '#fff' }} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="hero-title" style={{ fontSize: '32px', fontStyle: 'normal', color: '#fff' }}>{user?.name || 'Alex Sterling'}</h2>
            <div className="inline-flex px-4 py-1.5 rounded-full brand-gradient shadow-lg shadow-violet-500/20 mt-2">
              <span className="card-label" style={{ color: '#fff', fontSize: '10px' }}>Platinum Member</span>
            </div>
          </div>
        </section>

        <section className="profile-stats mb-section-gap">
          <div className="glass-card stat-item">
            <span className="stat-num">12</span>
            <span className="card-label" style={{ fontSize: '10px' }}>Orders</span>
          </div>
          <div className="glass-card stat-item">
            <span className="stat-num">24</span>
            <span className="card-label" style={{ fontSize: '10px' }}>Wishlist</span>
          </div>
          <div className="glass-card stat-item">
            <span className="stat-num">04</span>
            <span className="card-label" style={{ fontSize: '10px' }}>Coupons</span>
          </div>
        </section>

        <section className="menu-list" style={{ marginTop: '48px' }}>
          {[
            { icon: 'person', label: 'Personal Info', path: '/profile' },
            { icon: 'history', label: 'Order History', path: '/orders' },
            { icon: 'location_on', label: 'Address Book', path: '/profile' },
            { icon: 'logout', label: 'Logout', error: true, action: logout },
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="menu-row" 
              onClick={() => item.action ? item.action() : navigate(item.path)}
              style={{ cursor: 'pointer' }}
            >
              <div className="menu-row-left">
                <Icon name={item.icon} className={item.error ? 'text-error' : 'menu-icon'} style={{ color: item.error ? '#ffb4ab' : 'rgba(255,255,255,0.4)' }} />
                <span className="menu-text" style={{ color: item.error ? '#ffb4ab' : 'rgba(255,255,255,0.8)' }}>{item.label}</span>
              </div>
              <Icon name="chevron_right" style={{ color: 'rgba(255,255,255,0.2)' }} />
            </div>
          ))}
        </section>

        <section className="mt-12 glass-card rounded-[20px] p-6 relative overflow-hidden" style={{ position: 'relative', overflow: 'hidden', marginTop: '48px' }}>
          <div className="relative z-10" style={{ position: 'relative', zIndex: 10 }}>
            <span className="card-label text-primary text-[10px] mb-2 block" style={{ color: 'var(--primary)' }}>Special Access</span>
            <h3 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', color: '#fff', marginBottom: '16px' }}>Winter '24 <br/>Privé Preview</h3>
            <button className="px-6 py-3 rounded-full bg-white text-black card-label text-[11px] hover:opacity-90 transition-opacity border-none">Request Invite</button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20" style={{ position: 'absolute', right: '-16px', bottom: '-16px' }}>
            <Icon name="diamond" style={{ fontSize: '120px', color: 'rgba(255,255,255,0.5)' }} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default MobileProfilePage;
