import React from 'react';
import SectionHeader from '../ui/SectionHeader';

const quotes = [
  {
    quote: 'The storefront feels premium from the first scroll, but checkout is still direct and fast.',
    name: 'Aarav Mehta',
    role: 'Verified customer'
  },
  {
    quote: 'I found the product, checked trust signals, and placed the order without leaving the flow.',
    name: 'Naina Kapoor',
    role: 'Luxe member'
  },
  {
    quote: 'The dark interface makes high-value products feel curated instead of crowded.',
    name: 'Rohan Iyer',
    role: 'Repeat buyer'
  }
];

const SocialProof = () => {
  return (
    <section className="home-section social-proof-section">
      <SectionHeader
        eyebrow="Customer signal"
        title="Built to convert attention into loyalty"
        description="Social proof, benefit framing, and product discovery sections work together without leaving the dark Caryqel tone."
        align="center"
      />
      <div className="testimonial-grid">
        {quotes.map((item) => (
          <article className="testimonial-card" key={item.name}>
            <p>"{item.quote}"</p>
            <div>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SocialProof;
