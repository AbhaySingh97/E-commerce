import React, { useState } from 'react';
import { FiMail, FiPhone, FiMessageCircle, FiMapPin, FiSend } from 'react-icons/fi';
import { TopAppBar } from '../components/MobileUI';

const MobileContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactMethods = [
    { icon: <FiMail />, title: 'Email', value: 'hello@caryqel.com', color: '#3b82f6' },
    { icon: <FiPhone />, title: 'Phone', value: '+91 98765 43210', color: '#10b981' },
    { icon: <FiMessageCircle />, title: 'WhatsApp', value: 'Live Chat', color: '#25d366' },
  ];

  return (
    <div className="mobile-page">
      <TopAppBar title="Contact Us" />
      
      <div className="mobile-page-content">
        <div className="contact-intro">
          <h2>Get in Touch</h2>
          <p>We're here to assist you with any inquiries regarding our collections or your orders.</p>
        </div>

        <div className="contact-methods">
          {contactMethods.map((method, idx) => (
            <div key={idx} className="method-card">
              <div className="method-icon" style={{ color: method.color, background: `${method.color}15` }}>
                {method.icon}
              </div>
              <div className="method-info">
                <span className="method-title">{method.title}</span>
                <span className="method-value">{method.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form-section">
          <h3>Send a Message</h3>
          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h4>Message Sent!</h4>
              <p>Our team will get back to you within 24 hours.</p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" placeholder="Full Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="form-group">
                <select required>
                  <option value="">Select Topic</option>
                  <option value="order">Order Status</option>
                  <option value="return">Returns & Refunds</option>
                  <option value="product">Product Inquiry</option>
                  <option value="collaboration">Collaboration</option>
                </select>
              </div>
              <div className="form-group">
                <textarea placeholder="How can we help?" rows="4" required></textarea>
              </div>
              <button type="submit" className="btn-send">
                Send Message <FiSend />
              </button>
            </form>
          )}
        </div>

        <div className="contact-section">
          <h3>Visit Our Flagship</h3>
          <div className="visit-card">
            <div className="visit-image">
              <img src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=600" alt="Store" />
            </div>
            <div className="visit-details">
              <FiMapPin className="pin-icon" />
              <div className="details-text">
                <p>12th Floor, Creative Center</p>
                <p>Linking Road, Bandra West</p>
                <p>Mumbai, MH 400050</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .contact-intro {
          margin-bottom: 32px;
          margin-top: 12px;
        }
        .contact-intro h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2.2rem;
          font-weight: 800;
          margin: 0 0 12px;
        }
        .contact-intro p {
          color: var(--mobile-text-dim);
          font-size: 1.1rem;
          line-height: 1.5;
          margin: 0;
        }
        .contact-methods {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 40px;
        }
        .method-card {
          background: var(--mobile-surface);
          border: 1px solid var(--mobile-border);
          border-radius: 20px;
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .method-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 12px;
        }
        .method-title {
          font-size: 0.75rem;
          color: var(--mobile-text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }
        .method-value {
          font-size: 0.85rem;
          font-weight: 700;
          line-height: 1.2;
        }
        .contact-form-section h3, .contact-section h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 48px;
        }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%;
          background: var(--mobile-surface);
          border: 1px solid var(--mobile-border);
          color: #fff;
          padding: 16px;
          border-radius: 16px;
          font-size: 1rem;
          outline: none;
        }
        .form-group textarea { resize: none; }
        .btn-send {
          background: #fff;
          color: #000;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .success-message {
          background: rgba(16, 185, 129, 0.1);
          padding: 40px 24px;
          border-radius: 24px;
          border: 1px solid rgba(16, 185, 129, 0.2);
          text-align: center;
          margin-bottom: 48px;
        }
        .success-icon {
          width: 60px;
          height: 60px;
          background: #10b981;
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 16px;
        }
        .success-message h4 {
          font-size: 1.3rem;
          margin: 0 0 8px;
        }
        .success-message p {
          color: var(--mobile-text-dim);
          margin: 0;
        }
        .visit-card {
          background: var(--mobile-surface);
          border-radius: 24px;
          border: 1px solid var(--mobile-border);
          overflow: hidden;
          margin-bottom: 40px;
        }
        .visit-image {
          height: 180px;
        }
        .visit-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .visit-details {
          padding: 20px;
          display: flex;
          gap: 16px;
        }
        .pin-icon {
          font-size: 1.5rem;
          color: var(--mobile-accent);
          flex-shrink: 0;
        }
        .details-text p {
          margin: 0 0 4px;
          color: var(--mobile-text-dim);
          font-size: 0.95rem;
        }
      `}} />
    </div>
  );
};

export default MobileContactPage;
