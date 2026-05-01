import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { trackEvent } from '../lib/analytics';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    trackEvent('contact_submit', { subject: form.subject });
    toast.success('Message captured. We will follow up soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page contact-page">
      <div className="page-hero">
        <span className="page-state-badge">Contact</span>
        <h1>Reach the Caryqel team</h1>
        <p>Use this page for product help, order questions, partnership requests, or premium account support.</p>
      </div>

      <div className="contact-grid refined">
        <section className="surface-card">
          <h2>Support details</h2>
          <p>support@caryqel.com</p>
          <p>1-800-LUXE-000</p>
          <p>Mon-Fri, 9 AM to 6 PM</p>
          <p>123 Luxury Lane, Mumbai, Maharashtra 400001</p>
        </section>

        <form className="surface-card contact-form-card" onSubmit={handleSubmit}>
          <h2>Send a message</h2>
          <input type="text" placeholder="Your name" value={form.name} onChange={(event) => updateField('name', event.target.value)} required />
          <input type="email" placeholder="Your email" value={form.email} onChange={(event) => updateField('email', event.target.value)} required />
          <input type="text" placeholder="Subject" value={form.subject} onChange={(event) => updateField('subject', event.target.value)} required />
          <textarea placeholder="Message" value={form.message} onChange={(event) => updateField('message', event.target.value)} required />
          <button type="submit" className="btn-primary">Send message</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
