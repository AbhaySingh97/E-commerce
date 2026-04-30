import React from 'react';
import { FiCreditCard, FiHeadphones, FiPackage, FiRefreshCw, FiShield, FiTruck } from 'react-icons/fi';
import SectionHeader from '../ui/SectionHeader';

const items = [
  { icon: <FiShield />, title: 'Verified sellers', text: 'Every premium listing is reviewed before customers see it.' },
  { icon: <FiCreditCard />, title: 'Secure checkout', text: 'Payment flows are designed for confidence and clarity.' },
  { icon: <FiTruck />, title: 'Express fulfillment', text: 'Delivery expectations stay visible from cart to order tracking.' },
  { icon: <FiRefreshCw />, title: 'Easy returns', text: 'Return-first policies reduce hesitation on premium purchases.' },
  { icon: <FiPackage />, title: 'Protected packaging', text: 'High-value products receive careful handling and dispatch.' },
  { icon: <FiHeadphones />, title: 'Concierge support', text: 'Support-ready surfaces for account, order, and payment help.' }
];

const TrustExperience = () => {
  return (
    <section className="home-section trust-experience-section">
      <SectionHeader
        eyebrow="Enterprise trust layer"
        title="Confidence signals across the full journey"
        description="A premium storefront needs more than beautiful products. These sections make the customer feel protected before they pay."
      />
      <div className="trust-grid">
        {items.map((item) => (
          <div className="trust-card" key={item.title}>
            <div className="trust-icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustExperience;
