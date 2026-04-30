import React from 'react';

const AboutPage = () => {
  return (
    <div className="page about-page">
      <div className="page-hero">
        <span className="page-state-badge">About LuxeCart</span>
        <h1>Premium commerce without unnecessary friction</h1>
        <p>LuxeCart is positioned around curated discovery, trustworthy checkout, and a storefront that feels modern instead of crowded.</p>
      </div>

      <div className="two-column-story">
        <section className="surface-card">
          <h2>What we are building</h2>
          <p>We combine elevated product presentation with practical account, wishlist, and delivery flows so premium shopping still feels efficient.</p>
        </section>
        <section className="surface-card">
          <h2>Why it matters</h2>
          <p>High-value shopping requires more than a nice homepage. It requires strong trust signals, clear product data, and reliable post-purchase visibility.</p>
        </section>
      </div>

      <div className="dashboard-stat-grid">
        <div className="dashboard-stat-card"><span>Happy customers</span><strong>50K+</strong></div>
        <div className="dashboard-stat-card"><span>Premium products</span><strong>10K+</strong></div>
        <div className="dashboard-stat-card"><span>Curated brands</span><strong>100+</strong></div>
        <div className="dashboard-stat-card"><span>Average rating</span><strong>4.9 / 5</strong></div>
      </div>
    </div>
  );
};

export default AboutPage;
