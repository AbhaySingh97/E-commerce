import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';

const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const updateField = (key, value) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);

    try {
      if (isRegister) {
        await register(formData);
        trackEvent('register_success', { email: formData.email });
      } else {
        await login(formData.email, formData.password);
        trackEvent('login_success', { email: formData.email });
      }

      navigate(location.state?.from || '/profile', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Authentication failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page auth auth-page">
      <div className="auth-layout">
        <div className="auth-copy">
          <span className="page-state-badge">Account access</span>
          <h1>{isRegister ? 'Create your LuxeCart account' : 'Welcome back to LuxeCart'}</h1>
          <p>Save addresses, track orders, manage your wishlist, and complete checkout faster.</p>
          <ul className="auth-benefits">
            <li>Order history and delivery tracking</li>
            <li>Saved shipping and billing addresses</li>
            <li>Wishlist, reviews, and premium offers</li>
          </ul>
        </div>

        <form className="auth-form-card" onSubmit={handleSubmit}>
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(event) => updateField('phone', event.target.value)}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(event) => updateField('password', event.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Working...' : isRegister ? 'Create account' : 'Login'}
          </button>
          <button type="button" className="link-btn" onClick={() => setIsRegister((current) => !current)}>
            {isRegister ? 'Already have an account? Login' : 'New here? Create an account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
