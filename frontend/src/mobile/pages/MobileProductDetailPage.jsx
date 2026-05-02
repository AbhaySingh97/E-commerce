import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopAppBar, Icon } from '../components/MobileUI';
import { mockProducts } from '../../data/mockData';

const MobileProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.slug === slug);
  const [activeImg, setActiveImg] = useState(0);

  if (!product) return <div className="mobile-loader">Product not found</div>;

  return (
    <div className="mobile-page pb-32 bg-background">
      <TopAppBar title="" />
      
      <main>
        {/* Immersive Gallery */}
        <section className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container-lowest">
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-full w-full">
            {product.images.map((img, idx) => (
              <div key={idx} className="snap-center shrink-0 w-full h-full relative">
                <img className="w-full h-full object-cover" src={img} alt={`${product.name} ${idx}`}/>
              </div>
            ))}
          </div>
          {/* Pagination Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {product.images.map((_, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full ${activeImg === idx ? 'bg-white' : 'bg-white/30'}`}></div>
            ))}
          </div>
        </section>

        <section className="px-6 pt-8">
          <div className="flex justify-between items-start mb-2">
            <span className="card-label text-primary uppercase tracking-[0.2em]">{product.category.name}</span>
            <div className="flex items-center gap-1">
              <Icon name="star" style={{ color: 'var(--secondary)', fontSize: '14px' }} />
              <span className="card-label text-white">{product.rating}</span>
            </div>
          </div>
          <h2 className="hero-title" style={{ fontSize: '32px', fontStyle: 'normal', color: '#fff', marginBottom: '16px' }}>{product.name}</h2>
          <p className="font-body-lg text-on-surface-variant leading-relaxed mb-8">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between" style={{ marginBottom: '48px' }}>
            <div className="flex flex-col">
              <span className="card-label text-on-surface-variant/60 uppercase">Price</span>
              <span className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', color: '#fff' }}>₹{product.price.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full border border-primary bg-primary/10 flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-primary"></span>
              </button>
              <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center">
                <span className="w-4 h-4 rounded-full" style={{ background: 'var(--outline-variant)' }}></span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-white/10 pb-4">
              <button className="w-full flex justify-between items-center text-left py-2 group">
                <span className="card-label text-white uppercase tracking-widest">Product Details</span>
                <Icon name="expand_more" />
              </button>
            </div>
            <div className="border-b border-white/10 pb-4">
              <button className="w-full flex justify-between items-center text-left py-2 group">
                <span className="card-label text-white uppercase tracking-widest">Shipping & Returns</span>
                <Icon name="expand_more" />
              </button>
            </div>
          </div>
        </section>

        {/* Complete the Ritual Section (Placeholder for related products) */}
        <section className="px-6" style={{ marginTop: '48px' }}>
          <h3 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal', color: '#fff', marginBottom: '24px' }}>Complete the Ritual</h3>
          <div className="grid grid-cols-2 gap-4">
            {mockProducts.slice(0, 2).map((p) => (
              <div key={p._id} className="rounded-xl bg-surface-container overflow-hidden group">
                <div className="aspect-square relative">
                  <img className="w-full h-full object-cover" src={p.images[0]} alt={p.name}/>
                </div>
                <div className="p-4">
                  <p className="card-label" style={{ color: 'var(--primary)' }}>{p.category.name}</p>
                  <p className="card-title" style={{ fontSize: '14px' }}>₹{p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="sticky-buy-bar">
        <button onClick={() => navigate('/checkout')} className="btn-secondary">Buy Now</button>
        <button className="btn-primary">Add to Cart</button>
      </footer>
    </div>
  );
};

export default MobileProductDetailPage;
