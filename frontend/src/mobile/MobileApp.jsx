import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { FiHome, FiSearch, FiShoppingBag, FiUser, FiHeart } from 'react-icons/fi';
import './styles/mobile.css';

// Lazy load mobile pages
const MobileHomePage = lazy(() => import('./pages/MobileHomePage'));
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

const MobileNavbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="mobile-nav">
      <div className="mobile-nav-item" onClick={() => navigate('/')}>
        <FiHome size={24} />
        <span>Home</span>
      </div>
      <div className="mobile-nav-item" onClick={() => navigate('/search')}>
        <FiSearch size={24} />
        <span>Search</span>
      </div>
      <div className="mobile-nav-item" onClick={() => navigate('/products')}>
        <FiShoppingBag size={24} />
        <span>Shop</span>
      </div>
      <div className="mobile-nav-item" onClick={() => navigate('/wishlist')}>
        <FiHeart size={24} />
        <span>Wishlist</span>
      </div>
      <div className="mobile-nav-item" onClick={() => navigate('/profile')}>
        <FiUser size={24} />
        <span>Profile</span>
      </div>
    </nav>
  );
};

const MobileApp = () => {
  return (
    <div className="mobile-app">
      <main className="mobile-main">
        <Suspense fallback={<div className="mobile-loader">Caryqel</div>}>
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
      <MobileNavbar />
    </div>
  );
};

export default MobileApp;
