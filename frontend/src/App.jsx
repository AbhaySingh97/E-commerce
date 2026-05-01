import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiHome, FiShield, FiShoppingBag, FiShoppingCart, FiUser } from 'react-icons/fi';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MagicRings from './components/MagicRings';
import Dock from './components/Dock';
import TargetCursor from './components/TargetCursor';
import Footer from './components/layout/Footer';
import { AdminRoute, ProtectedRoute } from './components/routes/ProtectedRoute';
import { PageLoader } from './components/common/PageState';
import { useAuth } from './context/AuthContext';
import { trackPageView } from './lib/analytics';

const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const OrderTrackingPage = lazy(() => import('./pages/OrderTrackingPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));

const WelcomeScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Letters animate in at 0.1s–0.7s delays + 0.5s duration = last letter visible at ~1.3s
    // Keep screen visible for 4.5s so user can enjoy the full animation
    const showTimer = setTimeout(() => setFadeOut(true), 4500);
    // Give 800ms for the fade-out animation to complete before unmounting
    const finishTimer = setTimeout(onFinished, 5300);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  return (
    <div className={`welcome-screen ${fadeOut ? 'welcome-screen-animate' : ''}`}>
      <div className="welcome-magic-rings">
        <MagicRings
          color="#667eea"
          colorTwo="#f093fb"
          ringCount={5}
          speed={1.2}
          attenuation={12}
          lineThickness={2}
          baseRadius={0.25}
          radiusStep={0.12}
          scaleRate={0.15}
          opacity={0.8}
          rotation={15}
          ringGap={1.8}
          fadeIn={0.6}
          fadeOut={0.6}
          followMouse={true}
          mouseInfluence={0.15}
          hoverScale={1.1}
          parallax={0.03}
          clickBurst={true}
        />
      </div>
      <div className="welcome-content">
        <div className="welcome-logo-wrapper">
          {['c', 'a', 'r', 'y', 'q', 'e', 'l'].map((letter, index) => (
            <span key={`${letter}-${index}`} className="welcome-letter">{letter}</span>
          ))}
        </div>
        <div className="welcome-divider"></div>
        <p className="welcome-tagline">Curating elegance for you</p>
      </div>
    </div>
  );
};

function App() {
  // Show welcome screen only once per session
  const [showWelcome, setShowWelcome] = useState(() => !sessionStorage.getItem('caryqel_visited'));
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();

  const handleWelcomeFinished = () => {
    sessionStorage.setItem('caryqel_visited', 'true');
    setShowWelcome(false);
  };

  useEffect(() => {
    trackPageView(location.pathname, { search: location.search });
  }, [location.pathname, location.search]);

  const dockItems = useMemo(() => {
    const items = [
      { icon: <FiHome size={22} />, label: 'Home', onClick: () => navigate('/') },
      { icon: <FiShoppingBag size={22} />, label: 'Shop', onClick: () => navigate('/products') },
      { icon: <FiGrid size={22} />, label: 'Categories', onClick: () => navigate('/categories') },
      { icon: <FiShoppingCart size={22} />, label: 'Cart', onClick: () => navigate('/cart') },
      { icon: <FiUser size={22} />, label: user ? 'Profile' : 'Login', onClick: () => navigate(user ? '/profile' : '/login') },
    ];

    if (user?.role === 'admin') {
      items.push({ icon: <FiShield size={22} />, label: 'Admin', onClick: () => navigate('/admin') });
    }

    return items;
  }, [navigate, user]);

  if (showWelcome || loading) {
    return <WelcomeScreen onFinished={handleWelcomeFinished} />;
  }

  const hideDock = location.pathname.startsWith('/admin') || location.pathname === '/login' || location.pathname === '/checkout';
  const hideFooter = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Suspense fallback={<PageLoader title="Loading page" message="Preparing the next view." />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute><OrderTrackingPage /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          </Routes>
        </Suspense>
      </main>
      {!hideFooter && <Footer />}
      {!hideDock && <Dock items={dockItems} magnification={80} distance={150} />}
    </div>
  );
}

export default App;
