import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon, triggerHaptic } from '../components/MobileUI';
import { productAPI } from '../../services/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const MobileProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg] = useState(0); // setActiveImg removed as unused
  const [related, setRelated] = useState([]);
  const [openSection, setOpenSection] = useState('details');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getProduct(slug);
        setProduct(res.data);
        const relatedRes = await productAPI.getProducts({ category: res.data.category.slug });
        setRelated(relatedRes.data.products.filter(p => p._id !== res.data._id).slice(0, 2));
      } catch (err) {
        console.error('Failed to fetch product', err);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleAddToCart = async (direct = false) => {
    triggerHaptic(direct ? 'heavy' : 'medium');
    try {
      await addToCart(product._id, 1);
      if (direct) {
        navigate('/checkout');
      } else {
        toast.success('Added to bag');
      }
    } catch (err) {
      toast.error('Failed to add to bag');
    }
  };

  if (loading) return <div className="mobile-page flex items-center justify-center py-20 text-white/30 bg-[#080808]">Tracing essence...</div>;
  if (!product) return <div className="mobile-page flex items-center justify-center py-20 text-white/30 bg-[#080808]">Essence lost</div>;

  return (
    <div className="mobile-page pb-40 bg-[#0a0a0a]">
      <header className="detail-header-v3">
        <button onClick={() => navigate(-1)} className="header-btn">
          <Icon name="arrow_back" style={{ fontSize: '22px' }} />
        </button>
        <h1 className="header-logo">Caryqel</h1>
        <button onClick={() => navigate('/cart')} className="header-btn">
          <Icon name="shopping_bag" style={{ fontSize: '22px' }} />
        </button>
      </header>
      
      <main>
        {/* Gallery */}
        <section className="detail-gallery-v3">
          <div className="flex h-full w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar">
            {product.images.map((img, idx) => (
              <div key={idx} className="snap-center shrink-0 w-full h-full">
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="gallery-dots">
            {product.images.map((_, idx) => (
              <div key={idx} className={`dot ${activeImg === idx ? 'active' : ''}`} />
            ))}
          </div>
        </section>

        <section className="px-8 pt-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Limited Edition</span>
            <div className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-full border border-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider">{Math.floor(Math.random() * 15) + 5} viewing now</span>
            </div>
          </div>
          
          <h1 className="text-white text-[32px] font-serif font-bold leading-[1.1] mb-6">{product.name}</h1>
          
          <p className="text-white/60 leading-relaxed text-[15px] mb-12">
            {product.description || 'A masterpiece crafted for those who thrive in the shadows of the night. Infused with black violet, liquid amber, and rare digital botanicals.'}
          </p>

          <div className="flex items-end justify-between mb-12">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Price</span>
              <span className="text-white text-[32px] font-serif">₹{product.price.toLocaleString()}</span>
            </div>
            <div className="flex gap-4">
              <div className="variant-circle active"><div className="inner" style={{ background: '#a855f7' }} /></div>
              <div className="variant-circle"><div className="inner" style={{ background: '#222' }} /></div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="detail-accordion-v3">
            {[
              { id: 'details', label: 'Product Details', content: 'Top notes of frozen berry and citrus. Heart notes of nocturnal bloom and crushed velvet. Base notes of synthetic oud and cedar.' },
              { id: 'shipping', label: 'Shipping & Returns', content: 'Complimentary shipping on all orders. Returns accepted within 30 days of delivery.' },
              { id: 'size', label: 'Size Guide', content: 'Standard volume dimensions apply to all limited edition vessels.' }
            ].map(sec => (
              <div key={sec.id} className="accordion-item">
                <button onClick={() => setOpenSection(openSection === sec.id ? null : sec.id)} className="accordion-trigger">
                  <span>{sec.label}</span>
                  <Icon name={openSection === sec.id ? 'expand_less' : 'expand_more'} />
                </button>
                {openSection === sec.id && <div className="accordion-content">{sec.content}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Complete the Ritual */}
        {related.length > 0 && (
          <section className="px-8 mt-16 pb-12">
            <h3 className="text-white text-[24px] font-serif mb-8">Complete the Ritual</h3>
            <div className="grid grid-cols-2 gap-6">
              {related.map(p => (
                <div key={p._id} className="ritual-item" onClick={() => navigate(`/products/${p.slug}`)}>
                  <div className="aspect-square rounded-[24px] overflow-hidden bg-[#111] mb-4">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">{p.name}</p>
                  <p className="text-white font-medium">₹{p.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="detail-sticky-footer-v3">
        <button 
          onClick={() => handleAddToCart(true)}
          className="footer-btn-white"
        >
          Buy Now
        </button>
        <button 
          onClick={() => handleAddToCart(false)}
          className="footer-btn-purple"
        >
          Add to Cart
        </button>
      </footer>
    </div>
  );
};

export default MobileProductDetailPage;
