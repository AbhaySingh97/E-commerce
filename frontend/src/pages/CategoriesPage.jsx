import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageLoader } from '../components/common/PageState';
import { categories as fallbackCategories } from '../data/mockData';
import { getCategoryDescription, getCategoryImage, handleCategoryImageError } from '../lib/categoryVisuals';
import { productAPI } from '../services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getCategories()
      .then((response) => setCategories(response.data || []))
      .catch(() => {
        setCategories(fallbackCategories);
        toast.error('Live categories are unavailable. Showing preview categories.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <PageLoader title="Loading categories" message="Collecting the current shopping departments." />;
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
              <img src={getCategoryImage(category, index)} alt={category.name} onError={(event) => handleCategoryImageError(event, index)} />
            </div>
            <div className="category-card-copy">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{category.name}</h3>
              <p>{getCategoryDescription(category, index)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
