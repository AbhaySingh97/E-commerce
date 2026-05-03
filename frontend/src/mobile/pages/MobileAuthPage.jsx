import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const MobileAuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('Welcome back to Caryqel');
      } else {
        await register(formData);
        toast.success('Welcome to the Caryqel family');
      }
      
      const from = location.state?.from?.pathname || '/profile';
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container-v3">
      <div className="auth-header-v3">
        <h1>CARYQEL</h1>
        <p>The Height of Living</p>
      </div>

      <div className="auth-tabs-v3">
        <button 
          className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Sign In
        </button>
        <button 
          className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Join Us
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-v3">
        {!isLogin && (
          <input 
            type="text" 
            placeholder="FULL NAME" 
            className="auth-input-v3"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        )}
        <input 
          type="email" 
          placeholder="EMAIL ADDRESS" 
          className="auth-input-v3"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input 
          type="password" 
          placeholder="PASSWORD" 
          className="auth-input-v3"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        <button 
          type="submit" 
          disabled={loading}
          className="auth-submit-btn-v3"
        >
          {loading ? 'Authenticating...' : (isLogin ? 'Continue to Account' : 'Create Identity')}
        </button>
      </form>

    </div>
  );
};

export default MobileAuthPage;
