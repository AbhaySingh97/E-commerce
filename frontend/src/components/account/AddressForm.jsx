import React, { useEffect, useState } from 'react';

const emptyAddress = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  isDefault: false,
};

const AddressForm = ({
  initialValues,
  onSubmit,
  onCancel,
  onChange,
  submitLabel = 'Save address',
  busy = false,
  showActions = true,
}) => {
  const [form, setForm] = useState(emptyAddress);

  useEffect(() => {
    const nextForm = { ...emptyAddress, ...initialValues };
    setForm(nextForm);
  }, [initialValues]);

  const updateField = (key, value) => {
    setForm((current) => {
      const nextForm = { ...current, [key]: value };
      onChange?.(nextForm);
      return nextForm;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(form);
  };

  return (
    <form className="address-form" onSubmit={handleSubmit}>
      <div className="address-grid">
        <label>
          Full name
          <input value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} required />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(event) => updateField('phone', event.target.value)} required />
        </label>
        <label className="address-span-2">
          Address line 1
          <input value={form.addressLine1} onChange={(event) => updateField('addressLine1', event.target.value)} required />
        </label>
        <label className="address-span-2">
          Address line 2
          <input value={form.addressLine2} onChange={(event) => updateField('addressLine2', event.target.value)} />
        </label>
        <label>
          Landmark
          <input value={form.landmark} onChange={(event) => updateField('landmark', event.target.value)} />
        </label>
        <label>
          City
          <input value={form.city} onChange={(event) => updateField('city', event.target.value)} required />
        </label>
        <label>
          State
          <input value={form.state} onChange={(event) => updateField('state', event.target.value)} required />
        </label>
        <label>
          Pincode
          <input value={form.pincode} onChange={(event) => updateField('pincode', event.target.value)} required />
        </label>
      </div>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(event) => updateField('isDefault', event.target.checked)}
        />
        Use as default address
      </label>

      {showActions && (
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={busy}>
            {busy ? 'Saving...' : submitLabel}
          </button>
        </div>
      )}
    </form>
  );
};

export default AddressForm;
