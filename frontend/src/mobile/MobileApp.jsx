import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Icon } from './components/MobileUI';
import './styles/mobile.css';

import MobileHomePage from './pages/MobileHomePage';

// Lazy load other mobile pages
const MobileProductsPage = lazy(() => import('./pages/MobileProductsPage'));
const MobileProductDetailPage = lazy(() => import('./pages/MobileProductDetailPage'));
const MobileCategoriesPage = lazy(() => import('./pages/MobileCategoriesPage'));
const MobileSearchPage = lazy(() => import('./pages/MobileSearchPage'));
const MobileCartPage = lazy(() => import('./pages/MobileCartPage'));
const MobileCheckoutPage = lazy(() => import('./pages/MobileCheckoutPage'));
const MobileProfilePage = lazy(() => import('./pages/MobileProfilePage'));
const MobileWishlistPage = lazy(() => import('./pages/MobileWishlistPage'));
const MobileOrdersPage = lazy(() => import('./pages/MobileOrdersPage'));
const MobileOrderTrackingPage = lazy(() => import('./pages/MobileOrderTrackingPage'));
const MobileAuthPage = lazy(() => import('./pages/MobileAuthPage'));
const MobileAboutPage = lazy(() => import('./pages/MobileAboutPage'));
const MobileContactPage = lazy(() => import('./pages/MobileContactPage'));

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { name: 'home', label: 'Home', path: '/' },
    { name: 'search', label: 'Search', path: '/search' },
    { name: 'storefront', label: 'Shop', path: '/products' },
    { name: 'favorite', label: 'Wishlist', path: '/wishlist' },
    { name: 'person', label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => (
        <Link 
          key={item.path} 
          to={item.path} 
          className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
        >
          <div className="nav-link-content">
            <Icon name={item.name} />
            <span className="nav-label">{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
};

const MobileApp = () => {
  const location = useLocation();
  const hideNav = location.pathname.includes('/checkout') || location.pathname.includes('/login');

  return (
    <div className="mobile-app">
      <main className="mobile-main">
        <Suspense fallback={<div className="mobile-loader">CARYQEL</div>}>
          <Routes>
            <Route path="/" element={<MobileHomePage />} />
            <Route path="/products" element={<MobileProductsPage />} />
            <Route path="/products/:slug" element={<MobileProductDetailPage />} />
            <Route path="/categories" element={<MobileCategoriesPage />} />
            <Route path="/search" element={<MobileSearchPage />} />
            <Route path="/cart" element={<MobileCartPage />} />
            <Route path="/checkout" element={<MobileCheckoutPage />} />
            <Route path="/profile" element={<MobileProfilePage />} />
            <Route path="/wishlist" element={<MobileWishlistPage />} />
            <Route path="/orders" element={<MobileOrdersPage />} />
            <Route path="/orders/:id" element={<MobileOrderTrackingPage />} />
            <Route path="/login" element={<MobileAuthPage />} />
            <Route path="/about" element={<MobileAboutPage />} />
            <Route path="/contact" element={<MobileContactPage />} />
            <Route path="*" element={<MobileHomePage />} />
          </Routes>
        </Suspense>
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default MobileApp;
