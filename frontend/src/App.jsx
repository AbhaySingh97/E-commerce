import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Products, ProductDetail, Login, Cart, Orders, Wishlist, Checkout, Search, Footer, Categories, About, Contact, Profile, OrderTracking, AdminDashboard } from './components/index';
import HomePage from './components/HomePage';
import MagicRings from './components/MagicRings';
import Dock from './components/Dock';
import { FiHome, FiShoppingBag, FiGrid, FiUser, FiShoppingCart, FiShield } from 'react-icons/fi';
import { useAuth } from './context/AuthContext';

const WelcomeScreen = ({ onFinished }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setFadeOut(true), 2800);
    const finishTimer = setTimeout(onFinished, 3400);
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
          <span className="welcome-letter">L</span>
          <span className="welcome-letter">u</span>
          <span className="welcome-letter">x</span>
          <span className="welcome-letter">e</span>
          <span className="welcome-letter">C</span>
          <span className="welcome-letter">a</span>
          <span className="welcome-letter">r</span>
          <span className="welcome-letter">t</span>
        </div>
        <div className="welcome-divider"></div>
        <p className="welcome-tagline">Curating Elegance For You</p>
      </div>
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const dockItems = [
    { icon: <FiHome size={22} />, label: 'Home', onClick: () => navigate('/') },
    { icon: <FiShoppingBag size={22} />, label: 'Shop', onClick: () => navigate('/products') },
    { icon: <FiGrid size={22} />, label: 'Categories', onClick: () => navigate('/categories') },
    { icon: <FiShoppingCart size={22} />, label: 'Cart', onClick: () => navigate('/cart') },
    { icon: <FiUser size={22} />, label: user ? 'Profile' : 'Login', onClick: () => navigate(user ? '/profile' : '/login') },
  ];

  if (user?.role === 'admin') {
    dockItems.push({ icon: <FiShield size={22} />, label: 'Admin', onClick: () => navigate('/admin') });
  }

  if (loading) {
    return <WelcomeScreen onFinished={() => setLoading(false)} />;
  }

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<><HomePage /><Footer /></>} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/:id" element={<OrderTracking />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Dock items={dockItems} magnification={80} distance={150} />
    </div>
  );
}

export default App;