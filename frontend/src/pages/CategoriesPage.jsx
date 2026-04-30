import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ErrorState, PageLoader } from '../components/common/PageState';
import { productAPI } from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productAPI.getCategories()
      .then((response) => setCategories(response.data || []))
      .catch((requestError) => {
        setError(requestError.response?.data?.error || 'Failed to load categories');
        toast.error('Failed to load categories');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PageLoader title="Loading categories" message="Collecting the current shopping departments." />;
  }

  if (error) {
    return <ErrorState title="Unable to load categories" message={error} />;
  }

  return (
    <div className="page categories-page">
      <div className="page-hero">
        <span className="page-state-badge">Departments</span>
        <h1>Shop by category</h1>
        <p>Move directly into the product mix that matches your intent instead of browsing a flat catalog.</p>
      </div>

      <div className="category-grid refined">
        {categories.map((category, index) => (
          <Link key={category._id} to={`/products?category=${category.slug}`} className="category-card refined">
            <div className="category-image">
              {category.image ? (
                <img src={category.image} alt={category.name} />
              ) : (
                <div className="placeholder-img">{String(index + 1).padStart(2, '0')}</div>
              )}
            </div>
            <div className="category-card-copy">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{category.name}</h3>
              <p>{category.description || 'Explore premium products selected for this department.'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
