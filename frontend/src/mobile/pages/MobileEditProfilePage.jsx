import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/MobileUI';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MobileEditProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await authAPI.updateProfile(formData);
      // We don't have a direct "update user in context" method other than login
      // but usually the backend returns the updated user.
      // If AuthContext doesn't support refresh, we might need to handle it.
      toast.success('Identity updated');
      navigate('/profile');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mobile-page pb-32 bg-[#080808]">
      <TopAppBar title="Edit Identity" showBack={true} />
      
      <main className="mobile-content px-8 pt-12">
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 rounded-full bg-[#111] border border-white/5 flex items-center justify-center mb-4 overflow-hidden">
            <img 
              src={user?.avatar || user?.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="text-primary text-[10px] font-bold uppercase tracking-[0.2em]">Change Portrait</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-4">Full Name</label>
            <input 
              type="text" 
              className="auth-input-v3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Alex Sterling"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-4">Email Address</label>
            <input 
              type="email" 
              className="auth-input-v3"
              value={formData.email}
              disabled
              style={{ opacity: 0.5 }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold ml-4">Phone Number</label>
            <input 
              type="tel" 
              className="auth-input-v3"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="auth-submit-btn-v3"
            style={{ marginTop: '40px' }}
          >
            {loading ? 'Securing...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default MobileEditProfilePage;
