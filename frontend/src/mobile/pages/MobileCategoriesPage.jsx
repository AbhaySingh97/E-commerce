import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopAppBar } from '../components/MobileUI';
import { productAPI } from '../../services/api';

const MobileCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await productAPI.getCategories();
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="mobile-page pb-32 animate-fade-in">
      <TopAppBar title="Collections" showBack={true} />
      
      <main className="px-6 pt-8">
        <div className="mobile-section-header">
          <h2 className="hero-title" style={{ fontSize: '24px', fontStyle: 'normal' }}>Departments</h2>
          <span className="card-label" style={{ opacity: 0.4 }}>{categories.length} Collections</span>
        </div>

        {loading ? (
          <div className="py-20 text-center opacity-30">Loading Departments...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mt-6">
            {categories.map((cat) => (
              <div 
                key={cat._id} 
                className="relative aspect-[16/9] rounded-[32px] overflow-hidden group active:scale-95 transition-all duration-300 shadow-2xl"
                onClick={() => navigate(`/products?category=${cat.slug}`)}
              >
                <img src={cat.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800'} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white text-2xl font-bold font-serif mb-1">{cat.name}</h3>
                  <p className="text-white/60 text-sm tracking-widest uppercase">{cat.description || 'Curated Selection'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MobileCategoriesPage;
