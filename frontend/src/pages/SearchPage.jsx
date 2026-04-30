import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const SearchPage = () => {
  const location = useLocation();
  return <Navigate to={`/products${location.search}`} replace />;
};

export default SearchPage;
