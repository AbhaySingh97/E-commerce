import React from 'react';
import { useParams } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiMapPin, FiPhone } from 'react-icons/fi';
import { MobileHeader } from '../components/MobileUI';

const MobileOrderTrackingPage = () => {
  const { id } = useParams();

  const trackingSteps = [
    { status: 'Order Placed', date: '24 May, 10:30 AM', icon: <FiPackage />, completed: true },
    { status: 'Processed', date: '24 May, 02:15 PM', icon: <FiCheckCircle />, completed: true },
    { status: 'Shipped', date: '25 May, 09:00 AM', icon: <FiTruck />, completed: true, active: true },
    { status: 'Out for Delivery', date: 'Expected today', icon: <FiPackage />, completed: false },
    { status: 'Delivered', date: 'Pending', icon: <FiCheckCircle />, completed: false },
  ];

  return (
    <div className="mobile-page">
      <MobileHeader title={`Track ${id}`} />
      
      <div className="mobile-page-content">
        <div className="tracking-hero">
          <div className="delivery-estimate">
            <span className="label">Estimated Delivery</span>
            <h2 className="date">Today, 26 May</h2>
            <p className="time">Before 08:00 PM</p>
          </div>
          <div className="hero-icon">
            <FiTruck size={40} />
          </div>
        </div>

        <div className="tracking-timeline">
          {trackingSteps.map((step, idx) => (
            <div key={idx} className={`timeline-item ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
              <div className="timeline-left">
                <div className="timeline-icon">{step.icon}</div>
                {idx < trackingSteps.length - 1 && <div className="timeline-line" />}
              </div>
              <div className="timeline-content">
                <h3 className="step-status">{step.status}</h3>
                <p className="step-date">{step.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tracking-section">
          <h2 className="section-title">Shipping Address</h2>
          <div className="address-box">
            <FiMapPin className="box-icon" />
            <div className="box-info">
              <span className="name">Rahul Sharma</span>
              <p className="address">Apt 402, Skyline Towers, Andheri West, Mumbai, MH - 400053</p>
            </div>
          </div>
        </div>

        <div className="tracking-section">
          <h2 className="section-title">Need Help?</h2>
          <div className="help-buttons">
            <button className="btn-help">
              <FiPhone size={18} /> Call Delivery Partner
            </button>
            <button className="btn-help secondary">
              Support Center
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .tracking-hero {
          background: var(--mobile-accent-gradient);
          padding: 24px;
          border-radius: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          color: #fff;
        }
        .delivery-estimate .label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
        }
        .delivery-estimate .date {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          margin: 4px 0;
          font-weight: 800;
        }
        .delivery-estimate .time {
          font-size: 0.9rem;
          margin: 0;
          opacity: 0.9;
        }
        .hero-icon {
          width: 70px;
          height: 70px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .tracking-timeline {
          margin-bottom: 40px;
          padding: 0 8px;
        }
        .timeline-item {
          display: flex;
          gap: 20px;
          min-height: 80px;
        }
        .timeline-left {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .timeline-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--mobile-surface);
          border: 1px solid var(--mobile-border);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--mobile-text-dim);
          z-index: 1;
        }
        .timeline-item.completed .timeline-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-color: #10b981;
        }
        .timeline-item.active .timeline-icon {
          background: var(--mobile-accent);
          color: #fff;
          border-color: var(--mobile-accent);
          box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
        }
        .timeline-line {
          flex: 1;
          width: 2px;
          background: var(--mobile-border);
          margin: 4px 0;
        }
        .timeline-item.completed .timeline-line {
          background: #10b981;
        }
        .timeline-content {
          padding-top: 6px;
        }
        .step-status {
          font-size: 1rem;
          font-weight: 700;
          margin: 0;
        }
        .step-date {
          font-size: 0.85rem;
          color: var(--mobile-text-dim);
          margin: 4px 0 0;
        }
        .timeline-item.active .step-status {
          color: var(--mobile-accent);
        }
        .tracking-section {
          margin-bottom: 32px;
        }
        .section-title {
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .address-box {
          display: flex;
          gap: 16px;
          background: var(--mobile-surface);
          padding: 16px;
          border-radius: 20px;
          border: 1px solid var(--mobile-border);
        }
        .box-icon {
          font-size: 1.4rem;
          color: var(--mobile-accent);
        }
        .box-info .name {
          display: block;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .box-info .address {
          font-size: 0.85rem;
          color: var(--mobile-text-dim);
          margin: 0;
          line-height: 1.4;
        }
        .help-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .btn-help {
          width: 100%;
          background: #fff;
          color: #000;
          border: none;
          padding: 16px;
          border-radius: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .btn-help.secondary {
          background: var(--mobile-surface);
          color: #fff;
          border: 1px solid var(--mobile-border);
        }
      `}} />
    </div>
  );
};

export default MobileOrderTrackingPage;
