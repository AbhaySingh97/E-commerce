import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar, Icon, triggerHaptic } from '../components/MobileUI';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const MobileAddressPage = () => {
  // navigate is not used here
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await authAPI.getAddresses();
      setAddresses(res.data);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
      toast.error('Could not load addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const [showDrawer, setShowDrawer] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    triggerHaptic('medium');
    try {
      await authAPI.addAddress(formData);
      toast.success('Address saved securely');
      setShowDrawer(false);
      setFormData({ type: 'Home', street: '', city: '', state: '', zipCode: '', isDefault: false });
      fetchAddresses();
    } catch (err) {
      toast.error('Could not save address');
    }
  };

  const handleDelete = async (id) => {
    triggerHaptic('heavy');
    try {
      await authAPI.deleteAddress(id);
      toast.success('Address removed');
      fetchAddresses();
    } catch (err) {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div className="mobile-page pb-32 bg-[#080808]">
      <TopAppBar title="Address Book" showBack={true} />
      
      <main className="mobile-content px-6 pt-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="section-title-serif" style={{ fontSize: '24px', marginBottom: 0 }}>Saved Locations</h2>
          <span className="card-label opacity-40">{addresses.length} Addresses</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-white/20">Accessing archives...</div>
        ) : addresses.length > 0 ? (
          <div className="space-y-6">
            {addresses.map((addr) => (
              <div key={addr._id} className="p-6 rounded-[24px] bg-[#111] border border-white/5 relative active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Icon name={addr.type === 'Work' ? 'business' : 'home'} style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{addr.type || 'Home'}</h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">{addr.isDefault ? 'Primary' : ''}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(addr._id)} className="text-white/20 p-2">
                    <Icon name="delete" style={{ fontSize: '18px' }} />
                  </button>
                </div>
                
                <p className="text-white/60 text-sm leading-relaxed mb-1">
                  {addr.street}, {addr.city}
                </p>
                <p className="text-white/40 text-[12px]">
                  {addr.state}, {addr.zipCode}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Icon name="location_off" style={{ fontSize: '48px', opacity: 0.1, marginBottom: '24px' }} />
            <p className="card-label opacity-40">No saved addresses</p>
          </div>
        )}

        <button 
          className="fixed bottom-24 left-6 right-6 h-16 bg-white text-black rounded-[24px] font-bold uppercase tracking-widest text-[13px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-transform"
          onClick={() => { triggerHaptic('light'); setShowDrawer(true); }}
        >
          <Icon name="add" /> Add New Address
        </button>

        {/* Address Drawer Overlay */}
        {showDrawer && (
          <div className="fixed inset-0 z-[2000] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDrawer(false)} />
            <div className="relative bg-[#0f0f0f] border-t border-white/10 rounded-t-[40px] px-8 pt-10 pb-12 animate-slide-up">
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-10" />
              <h2 className="section-title-serif mb-8 text-2xl text-white">Add Location</h2>
              
              <form onSubmit={handleAddAddress} className="space-y-6">
                <div className="flex gap-3 mb-4">
                  {['Home', 'Work', 'Other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                        formData.type === type ? 'bg-primary text-white shadow-lg' : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    required
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm outline-none focus:border-primary/50 transition-colors"
                    value={formData.street}
                    onChange={e => setFormData({...formData, street: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      className="h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm outline-none focus:border-primary/50 transition-colors"
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      className="h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm outline-none focus:border-primary/50 transition-colors"
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="ZIP Code"
                    required
                    className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-white text-sm outline-none focus:border-primary/50 transition-colors"
                    value={formData.zipCode}
                    onChange={e => setFormData({...formData, zipCode: e.target.value})}
                  />
                </div>

                <div className="flex items-center gap-3 pt-4 pb-8">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    className="w-5 h-5 accent-primary" 
                    checked={formData.isDefault}
                    onChange={e => setFormData({...formData, isDefault: e.target.checked})}
                  />
                  <label htmlFor="isDefault" className="text-white/40 text-sm">Set as primary address</label>
                </div>

                <button 
                  type="submit"
                  className="w-full h-16 bg-primary text-white rounded-[24px] font-bold uppercase tracking-widest text-[13px] shadow-xl active:scale-95 transition-transform"
                >
                  Confirm & Save
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileAddressPage;
