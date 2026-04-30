import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiZap } from 'react-icons/fi';
import { formatCurrency } from '../../lib/formatters';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-track">
        <div className="announcement-lead">
          <span className="announcement-badge">Live Campaign</span>
          <div>
            <strong>Midnight Luxe Drop is now open</strong>
            <p>Fresh premium arrivals, faster delivery, and a sharper first-purchase offer.</p>
          </div>
        </div>

        <div className="announcement-points">
          <span><FiZap /> New premium arrivals added tonight</span>
          <span><FiTruck /> Free express delivery over {formatCurrency(999)}</span>
          <span><FiShield /> Secure checkout with verified sellers</span>
        </div>

        <Link to="/products" className="announcement-cta">
          Shop premium arrivals <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default AnnouncementBar;
