import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>caryqel</h2>
          <p>Premium storefront design backed by modern commerce workflows.</p>
        </div>
        <div className="footer-social-middle">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram">
            <FiInstagram size={24} />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter">
            <FiTwitter size={24} />
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook">
            <FiFacebook size={24} />
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FiLinkedin size={24} />
          </a>
        </div>
        <div className="footer-links">
          <div>
            <h3>Explore</h3>
            <Link to="/products">Products</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About</Link>
          </div>
          <div>
            <h3>Account</h3>
            <Link to="/profile">Profile</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <div>
            <h3>Support</h3>
            <Link to="/contact">Contact</Link>
            <p>support@caryqel.com</p>
            <p>1-800-LUXE-000</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 caryqel. Premium commerce, shipped with clarity.</p>
      </div>
    </footer>
  );
};

export default Footer;
