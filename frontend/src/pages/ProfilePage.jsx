import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AddressForm from '../components/account/AddressForm';
import { InlineLoader } from '../components/common/PageState';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';
import { authAPI } from '../services/api';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [profileForm, setProfileForm] = useState({ name: '', phone: '', gender: '', dateOfBirth: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
      dateOfBirth: user?.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : '',
    });
  }, [user]);

  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const response = await authAPI.getAddresses();
      setAddresses(response.data || []);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const updateField = (key, value) => {
    setProfileForm((current) => ({ ...current, [key]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSavingProfile(true);
    try {
      await authAPI.updateProfile(profileForm);
      await refreshProfile();
      trackEvent('profile_update');
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressSave = async (values) => {
    setSavingAddress(true);
    try {
      if (editingAddress?._id) {
        await authAPI.updateAddress(editingAddress._id, values);
      } else {
        await authAPI.addAddress(values);
      }
      trackEvent('address_save');
      toast.success('Address saved');
      setShowAddressForm(false);
      setEditingAddress(null);
      loadAddresses();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await authAPI.deleteAddress(addressId);
      trackEvent('address_delete');
      toast.success('Address deleted');
      setAddresses((current) => current.filter((address) => address._id !== addressId));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to delete address');
    }
  };

  return (
    <div className="page profile profile-page">
      <div className="page-hero compact">
        <span className="page-state-badge">My account</span>
        <h1>{user?.name}</h1>
        <p>Manage your profile, saved addresses, and checkout readiness from one place.</p>
      </div>

      <div className="profile-shell">
        <section className="surface-card">
          <h2>Profile details</h2>
          <form className="profile-form" onSubmit={handleProfileSave}>
            <label>
              Full name
              <input value={profileForm.name} onChange={(event) => updateField('name', event.target.value)} required />
            </label>
            <label>
              Email
              <input value={user?.email || ''} disabled readOnly />
            </label>
            <label>
              Phone
              <input value={profileForm.phone} onChange={(event) => updateField('phone', event.target.value)} />
            </label>
            <label>
              Gender
              <select value={profileForm.gender} onChange={(event) => updateField('gender', event.target.value)}>
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Date of birth
              <input type="date" value={profileForm.dateOfBirth} onChange={(event) => updateField('dateOfBirth', event.target.value)} />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save profile'}
              </button>
            </div>
          </form>
        </section>

        <section className="surface-card">
          <div className="section-heading">
            <div>
              <p className="section-eyebrow">Saved addresses</p>
              <h2>Delivery and billing locations</h2>
            </div>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setEditingAddress(null);
                setShowAddressForm((current) => !current);
              }}
            >
              {showAddressForm ? 'Close form' : 'Add address'}
            </button>
          </div>

          {showAddressForm && (
            <AddressForm
              initialValues={editingAddress}
              onSubmit={handleAddressSave}
              onCancel={() => {
                setShowAddressForm(false);
                setEditingAddress(null);
              }}
              busy={savingAddress}
              submitLabel={editingAddress ? 'Update address' : 'Save address'}
            />
          )}

          {loadingAddresses ? (
            <InlineLoader label="Loading addresses..." />
          ) : (
            <div className="stack-list address-list">
              {addresses.map((address) => (
                <article key={address._id} className="address-card">
                  <div>
                    <strong>{address.fullName}</strong>
                    {address.isDefault && <span className="page-state-badge">Default</span>}
                  </div>
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 ? <p>{address.addressLine2}</p> : null}
                  <p>{address.city}, {address.state} - {address.pincode}</p>
                  <p>{address.phone}</p>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        setEditingAddress(address);
                        setShowAddressForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn-secondary" onClick={() => handleDeleteAddress(address._id)}>Delete</button>
                  </div>
                </article>
              ))}
              {!addresses.length && !showAddressForm && <InlineLoader label="No saved addresses yet. Add one to speed up checkout." />}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
