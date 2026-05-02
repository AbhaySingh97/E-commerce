import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowRight, FiGithub } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { MobileHeader } from '../components/MobileUI';

const MobileAuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      navigate('/profile');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mobile-page auth-page">
      <div className="auth-bg-overlay" />
      
      <div className="mobile-page-content auth-content">
        <div className="auth-brand">
          <h1>Caryqel</h1>
          <p>Elevate Your Lifestyle</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <FiUser className="input-icon" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
          )}
          <div className="input-group">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          {isLogin && (
            <div className="form-options">
              <button type="button" className="forgot-btn">Forgot Password?</button>
            </div>
          )}

          <button type="submit" className="btn-auth-submit">
            {isLogin ? 'Sign In' : 'Create Account'} <FiArrowRight />
          </button>
        </form>

        <div className="auth-divider">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="social-auth">
          <button className="social-btn">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" />
          </button>
          <button className="social-btn">
            <img src="https://www.svgrepo.com/show/448204/apple.svg" alt="Apple" />
          </button>
          <button className="social-btn">
            <FiGithub size={24} />
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-page {
          background: #000;
          position: relative;
          overflow: hidden;
        }
        .auth-bg-overlay {
          position: absolute;
          top: -20%;
          right: -20%;
          width: 80%;
          height: 60%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
          filter: blur(60px);
          z-index: 0;
        }
        .auth-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          padding-top: 60px;
        }
        .auth-brand {
          text-align: center;
          margin-bottom: 48px;
        }
        .auth-brand h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          margin: 0;
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .auth-brand p {
          color: var(--mobile-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.2em;
          font-size: 0.75rem;
          margin-top: 8px;
        }
        .auth-tabs {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 6px;
          border-radius: 16px;
          margin-bottom: 32px;
          border: 1px solid var(--mobile-border);
        }
        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--mobile-text-dim);
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }
        .auth-tab.active {
          background: #fff;
          color: #000;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .input-group {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          color: var(--mobile-text-dim);
          font-size: 1.2rem;
        }
        .input-group input {
          width: 100%;
          background: var(--mobile-surface);
          border: 1px solid var(--mobile-border);
          color: #fff;
          padding: 16px 16px 16px 48px;
          border-radius: 16px;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }
        .input-group input:focus {
          border-color: var(--mobile-accent);
          background: rgba(139, 92, 246, 0.05);
        }
        .form-options {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 8px;
        }
        .forgot-btn {
          background: transparent;
          border: none;
          color: var(--mobile-accent);
          font-size: 0.85rem;
          font-weight: 600;
        }
        .btn-auth-submit {
          width: 100%;
          background: var(--mobile-accent-gradient);
          color: #fff;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 12px;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }
        .auth-divider {
          text-align: center;
          margin: 40px 0 24px;
          position: relative;
        }
        .auth-divider::before, .auth-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 30%;
          height: 1px;
          background: var(--mobile-border);
        }
        .auth-divider::before { left: 0; }
        .auth-divider::after { right: 0; }
        .auth-divider span {
          font-size: 0.7rem;
          color: var(--mobile-text-dim);
          font-weight: 800;
          letter-spacing: 0.1em;
        }
        .social-auth {
          display: flex;
          justify-content: center;
          gap: 16px;
        }
        .social-btn {
          width: 64px;
          height: 64px;
          background: var(--mobile-surface);
          border: 1px solid var(--mobile-border);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        .social-btn:active {
          transform: scale(0.9);
          border-color: #fff;
        }
        .social-btn img {
          width: 24px;
          height: 24px;
        }
      `}} />
    </div>
  );
};

export default MobileAuthPage;
