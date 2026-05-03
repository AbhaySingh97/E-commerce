import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { Icon } from './components/MobileUI';
import { ProtectedRoute } from '../components/routes/ProtectedRoute';
import './styles/mobile.css';

import MobileHomePage from './pages/MobileHomePage';
import MobileProductsPage from './pages/MobileProductsPage';
import MobileSearchPage from './pages/MobileSearchPage';
import MobileProfilePage from './pages/MobileProfilePage';

// Lazy load deeper specialized routes
const MobileProductDetailPage = lazy(() => import('./pages/MobileProductDetailPage'));
const MobileCategoriesPage = lazy(() => import('./pages/MobileCategoriesPage'));
const MobileCartPage = lazy(() => import('./pages/MobileCartPage'));
const MobileCheckoutPage = lazy(() => import('./pages/MobileCheckoutPage'));
const MobileWishlistPage = lazy(() => import('./pages/MobileWishlistPage'));
const MobileOrdersPage = lazy(() => import('./pages/MobileOrdersPage'));
const MobileOrderTrackingPage = lazy(() => import('./pages/MobileOrderTrackingPage'));
const MobileAuthPage = lazy(() => import('./pages/MobileAuthPage'));
const MobileAboutPage = lazy(() => import('./pages/MobileAboutPage'));
const MobileContactPage = lazy(() => import('./pages/MobileContactPage'));
const MobileAddressPage = lazy(() => import('./pages/MobileAddressPage'));
const MobileEditProfilePage = lazy(() => import('./pages/MobileEditProfilePage'));

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
    { name: 'favorite', label: 'Saved', path: '/wishlist' },
    { name: 'person', label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-link ${active ? 'active' : ''}`}
          >
            {active ? (
              <div className="nav-active-highlight">
                <Icon name={item.name} />
              </div>
            ) : (
              <>
                <Icon name={item.name} />
                <span className="nav-label">{item.label}</span>
              </>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

const MobileApp = () => {
  const location = useLocation();
  const hideNav = 
    location.pathname.includes('/checkout') || 
    location.pathname.includes('/login') || 
    location.pathname.includes('/profile/addresses') ||
    location.pathname.includes('/profile/edit');

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
            <Route path="/cart" element={<ProtectedRoute><MobileCartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><MobileCheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MobileProfilePage /></ProtectedRoute>} />
            <Route path="/profile/addresses" element={<ProtectedRoute><MobileAddressPage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><MobileEditProfilePage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><MobileWishlistPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><MobileOrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><MobileOrderTrackingPage /></ProtectedRoute>} />
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
