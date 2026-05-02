import React from 'react';
import { MobileHeader } from '../components/MobileUI';

const MobileAboutPage = () => {
  return (
    <div className="mobile-page">
      <MobileHeader title="About Caryqel" />
      
      <div className="mobile-page-content">
        <section className="about-hero">
          <div className="hero-tag">OUR STORY</div>
          <h1 className="hero-title">Redefining Modern Elegance.</h1>
          <p className="hero-desc">
            Founded in 2024, Caryqel was born out of a desire to bring 
            exceptional quality and sophisticated design to the modern lifestyle.
          </p>
        </section>

        <div className="about-image-strip">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800" alt="Boutique" />
        </div>

        <section className="about-values">
          <div className="value-card">
            <span className="value-num">01</span>
            <h3 className="value-title">Uncompromising Quality</h3>
            <p className="value-text">We source only the finest materials, ensuring every piece meets our rigorous standards of excellence.</p>
          </div>
          <div className="value-card">
            <span className="value-num">02</span>
            <h3 className="value-title">Ethical Sourcing</h3>
            <p className="value-text">Sustainability is at our core. We partner with artisans who share our commitment to the planet.</p>
          </div>
          <div className="value-card">
            <span className="value-num">03</span>
            <h3 className="value-title">Timeless Design</h3>
            <p className="value-text">Our collections transcend trends, offering pieces that remain elegant for a lifetime.</p>
          </div>
        </section>

        <section className="about-mission">
          <div className="mission-content">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              "To empower individuals to express their unique identity through 
              curated, high-end pieces that blend art with utility."
            </p>
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .about-hero {
          margin-bottom: 40px;
          margin-top: 12px;
        }
        .hero-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--mobile-accent);
          letter-spacing: 0.2em;
          margin-bottom: 12px;
        }
        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: 2.8rem;
          line-height: 1.1;
          margin: 0 0 20px;
          font-weight: 800;
        }
        .hero-desc {
          font-size: 1.1rem;
          color: var(--mobile-text-dim);
          line-height: 1.6;
        }
        .about-image-strip {
          width: calc(100% + 40px);
          margin: 0 -20px 48px;
          height: 240px;
          overflow: hidden;
        }
        .about-image-strip img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .about-values {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 48px;
        }
        .value-card {
          background: var(--mobile-surface);
          padding: 24px;
          border-radius: 24px;
          border: 1px solid var(--mobile-border);
        }
        .value-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: var(--mobile-accent);
          font-weight: 800;
          display: block;
          margin-bottom: 12px;
        }
        .value-title {
          font-size: 1.2rem;
          font-weight: 700;
          margin: 0 0 8px;
        }
        .value-text {
          color: var(--mobile-text-dim);
          line-height: 1.5;
          margin: 0;
          font-size: 0.95rem;
        }
        .about-mission {
          background: var(--mobile-accent-gradient);
          padding: 40px 24px;
          border-radius: 32px;
          text-align: center;
          margin-bottom: 40px;
        }
        .mission-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #fff;
          margin: 0 0 16px;
        }
        .mission-text {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.6;
          font-style: italic;
          margin: 0;
        }
      `}} />
    </div>
  );
};

export default MobileAboutPage;
