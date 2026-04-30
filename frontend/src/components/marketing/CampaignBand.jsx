import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiGift } from 'react-icons/fi';

const CampaignBand = () => {
  return (
    <section className="home-section campaign-band">
      <div className="campaign-panel campaign-primary">
        <div>
          <p className="section-eyebrow">Live campaign</p>
          <h2>Black Diamond Edit</h2>
          <p>High-intent picks for customers who want premium design, fast delivery, and standout value in one checkout.</p>
        </div>
        <div className="campaign-meta-row">
          <span><FiClock /> Ends tonight</span>
          <span><FiGift /> Extra 15% on bundles</span>
        </div>
        <Link to="/products" className="btn-primary">
          View campaign <FiArrowRight />
        </Link>
      </div>
      <div className="campaign-panel campaign-secondary">
        <h3>Bundle intelligence</h3>
        <p>Promote complementary products, increase basket size, and keep the premium shopping flow focused.</p>
        <div className="campaign-mini-grid">
          <span>Frequently bought together</span>
          <span>Limited-time coupons</span>
          <span>Priority fulfillment</span>
        </div>
      </div>
    </section>
  );
};

export default CampaignBand;
