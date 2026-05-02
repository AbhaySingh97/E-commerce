import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, Link } from 'react-router-dom';
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
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-bottom-nav">
      <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
        <Icon name="home" />
      </Link>
      <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>
        <Icon name="search" />
      </Link>
      <Link to="/products" className={`nav-link ${isActive('/products') ? 'active' : ''}`}>
        <Icon name="storefront" />
      </Link>
      <Link to="/wishlist" className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}>
        <Icon name="favorite" />
      </Link>
      <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
        <Icon name="person" />
      </Link>
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
