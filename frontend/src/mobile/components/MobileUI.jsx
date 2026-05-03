import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

// Haptic Feedback Helper
export const triggerHaptic = (type = 'medium') => {
  if (!window.navigator.vibrate) return;
  const patterns = {
    light: [10],
    medium: [20],
    heavy: [40],
    success: [20, 50, 20],
    error: [50, 50, 50]
  };
  window.navigator.vibrate(patterns[type] || patterns.medium);
};

export const Icon = ({ name, style, className }) => {
  return (
    <span className={`material-symbols-rounded ${className || ''}`} style={{ verticalAlign: 'middle', userSelect: 'none', ...style }}>
      {name}
    </span>
  );
};

export const TopAppBar = ({ showBack = true, title = "Caryqel" }) => {
  const navigate = useNavigate();
  return (
    <header className="mobile-top-header" style={{ position: 'relative' }}>
      {showBack && (
        <button 
          className="top-bar-btn"
          onClick={() => navigate(-1)}
          style={{ position: 'absolute', left: '24px', zIndex: 10 }}
        >
          <Icon name="arrow_back" style={{ fontSize: '22px' }} />
        </button>
      )}
      
      <div style={{ width: '100%', textAlign: 'center' }}>
        <h1 className="top-bar-title">{title}</h1>
      </div>

      <button 
        className="top-bar-btn bag-btn" 
        onClick={() => navigate('/cart')}
        style={{ position: 'absolute', right: '24px', zIndex: 10 }}
      >
        <Icon name="shopping_bag" style={{ fontSize: '22px' }} />
      </button>
    </header>
  );
};

export const ProductItem = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    triggerHaptic('success');
    try {
      await addToCart(product._id, 1);
      toast.success('Added to bag');
    } catch (err) {
      toast.error('Failed to add');
    }
  };

  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1594913785162-e67856769f41?auto=format&fit=crop&w=800&q=80';

  return (
    <div 
      className="product-card-v3" 
      onClick={() => { triggerHaptic('light'); navigate(`/products/${product.slug}`); }}
    >
      <div className="product-media-v3">
        <img 
          src={imageUrl.includes('unsplash.com') && !imageUrl.includes('auto=format') 
            ? `${imageUrl}?auto=format&fit=crop&w=400&q=80` 
            : imageUrl
          } 
          alt={product.name} 
          loading="lazy" 
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1594913785162-e67856769f41?auto=format&fit=crop&w=800&q=80';
          }}
        />
        
        {/* Heart Icon Top-Right */}
        <div className="card-top-action">
          <Icon name="favorite" style={{ fontSize: '15px' }} />
        </div>
        
        {/* Plus Icon Bottom-Right */}
        <button 
          className="card-bottom-action"
          onClick={handleQuickAdd}
        >
          <Icon name="add" style={{ fontSize: '18px' }} />
        </button>
      </div>
      <div className="product-info-v3">
        <p className="product-brand-v3">{product.brand || 'CARYQEL'}</p>
        <h3 className="product-title-v3">{product.name}</h3>
        <p className="product-price-v3">₹{product.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export const CategoryPill = ({ name, active, onClick }) => (
  <button 
    className={`pill ${active ? 'pill-active' : 'pill-ghost'}`}
    onClick={onClick}
  >
    {name}
  </button>
);

export const StyleConcierge = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState([
    { role: 'ai', text: 'Hello. I am your Caryqel Concierge. How may I refine your style today?' }
  ]);

  const handleSend = () => {
    if (!msg.trim()) return;
    triggerHaptic('medium');
    const newChat = [...chat, { role: 'user', text: msg }];
    setChat(newChat);
    setMsg('');
    
    // Simple mock AI response
    setTimeout(() => {
      setChat(prev => [...prev, { role: 'ai', text: 'An excellent choice. That would pair perfectly with our new leather collection.' }]);
      triggerHaptic('success');
    }, 1000);
  };

  return (
    <>
      <button className="concierge-fab" onClick={() => { triggerHaptic('light'); setOpen(true); }}>
        <div className="absolute -top-1 -right-1 bg-primary text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-black shadow-lg animate-pulse flex items-center gap-1">
          <span className="w-1 h-1 bg-white rounded-full"></span>
          LIVE
        </div>
        <Icon name="auto_awesome" style={{ fontSize: '28px' }} />
      </button>

      {open && (
        <div className="concierge-drawer">
          <div className="concierge-overlay" onClick={() => setOpen(false)} />
          <div className="concierge-panel animate-slide-up">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="section-title-serif mb-1" style={{ fontSize: '24px' }}>Concierge</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">AI Style Assistant</p>
              </div>
              <button onClick={() => setOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                <Icon name="close" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {chat.map((c, i) => (
                <div key={i} className={`chat-msg ${c.role === 'ai' ? 'msg-ai' : 'msg-user'}`}>
                  {c.text}
                </div>
              ))}
            </div>

            <div className="chat-input-area">
              <input 
                type="text" 
                className="chat-input" 
                placeholder="Ask your stylist..."
                value={msg}
                onChange={e => setMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
              />
              <button 
                className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center active:scale-95 transition-transform"
                onClick={handleSend}
              >
                <Icon name="send" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
