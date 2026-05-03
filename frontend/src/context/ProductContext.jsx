import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/api';

const ProductContext = createContext(undefined);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchAll = useCallback(async (force = false) => {
    // Cache for 30 seconds during dev/seed phase
    if (!force && lastFetched && (Date.now() - lastFetched < 30000)) {
      return;
    }

    try {
      const [catRes, prodRes] = await Promise.all([
        productAPI.getCategories(),
        productAPI.getProducts()
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data.products);
      setLastFetched(Date.now());
    } catch (err) {
      console.error('Failed to pre-fetch product data', err);
    } finally {
      setLoading(false);
    }
  }, [lastFetched]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <ProductContext.Provider value={{ products, categories, loading, refresh: () => fetchAll(true) }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts must be used within ProductProvider');
  return context;
};
