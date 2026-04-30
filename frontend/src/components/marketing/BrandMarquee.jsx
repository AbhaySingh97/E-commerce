import React from 'react';

const brands = ['Apple', 'Prada', 'Sony', 'Nike', 'Rimowa', 'Chanel', 'Canon', 'Sonos'];

const BrandMarquee = () => {
  return (
    <section className="brand-marquee" aria-label="Featured brands">
      <div className="brand-marquee-track">
        {[...brands, ...brands].map((brand, index) => (
          <span key={`${brand}-${index}`}>{brand}</span>
        ))}
      </div>
    </section>
  );
};

export default BrandMarquee;
