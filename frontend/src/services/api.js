import axios from 'axios';

const configuredBaseURL = process.env.REACT_APP_API_URL?.replace(/\/$/, '');

const defaultBaseURL = process.env.NODE_ENV === 'production'
  ? '/api/v1'
  : 'http://localhost:5000/api/v1';

const API = axios.create({
  baseURL: configuredBaseURL || defaultBaseURL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }

  return config;
});

API.interceptors.response.use(
  (response) => {
    const sessionId = response.headers['x-session-id'];
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/me'),
  updateProfile: (data) => API.patch('/auth/me', data),
  getAddresses: () => API.get('/auth/me/addresses'),
  addAddress: (data) => API.post('/auth/me/addresses', data),
  updateAddress: (id, data) => API.patch(`/auth/me/addresses/${id}`, data),
  deleteAddress: (id) => API.delete(`/auth/me/addresses/${id}`),
};

export const productAPI = {
  getProducts: (params) => API.get('/products', { params }),
  getProduct: (slug) => API.get(`/products/${slug}`),
  getFeatured: () => API.get('/products/featured'),
  getNewArrivals: () => API.get('/products/new-arrivals'),
  getFilterMeta: () => API.get('/products/meta/filters'),
  getRelated: (slug) => API.get(`/products/${slug}/related`),
  getCategories: () => API.get('/categories'),
  getCategoryProducts: (slug) => API.get(`/categories/${slug}/products`),
  getAdminProducts: (params) => API.get('/admin/products', { params }),
  updateStock: (id, stock) => API.patch(`/admin/products/${id}/stock`, { stock }),
  createProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.patch(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
};

export const cartAPI = {
  getCart: () => API.get('/cart'),
  addToCart: (data) => API.post('/cart/items', data),
  updateCartItem: (id, data) => API.patch(`/cart/items/${id}`, data),
  removeFromCart: (id) => API.delete(`/cart/items/${id}`),
  clearCart: () => API.delete('/cart'),
  applyCoupon: (code) => API.post('/cart/apply-coupon', { code }),
  removeCoupon: () => API.delete('/cart/remove-coupon'),
};

export const orderAPI = {
  createOrder: (data) => API.post('/orders', data),
  getOrders: (params) => API.get('/orders', { params }),
  getOrder: (id) => API.get(`/orders/${id}`),
  cancelOrder: (id) => API.post(`/orders/${id}/cancel`),
  requestReturn: (id, data) => API.post(`/orders/${id}/return`, data),
  getAdminOrders: (params) => API.get('/orders/admin/orders', { params }),
  updateOrderStatus: (id, data) => API.patch(`/orders/admin/orders/${id}/status`, data),
};

export const paymentAPI = {
  initiate: (data) => API.post('/payments/initiate', data),
  verify: (data) => API.post('/payments/verify', data),
  getStatus: (id) => API.get(`/payments/${id}`),
};

export const reviewAPI = {
  getProductReviews: (slug, params) => API.get(`/products/${slug}/reviews`, { params }),
  createReview: (slug, data) => API.post(`/products/${slug}/reviews`, data),
  getRatingSummary: (slug) => API.get(`/products/${slug}/rating-summary`),
  markHelpful: (id) => API.post(`/reviews/${id}/helpful`),
};

export const wishlistAPI = {
  getWishlist: () => API.get('/wishlist'),
  addToWishlist: (productId) => API.post('/wishlist', { productId }),
  removeFromWishlist: (productId) => API.delete(`/wishlist/${productId}`),
  moveToCart: (productId) => API.post('/wishlist/move-to-cart', { productId }),
};

export const couponAPI = {
  validate: (code, cartTotal) => API.post('/coupons/validate', { code, cartTotal }),
  getCoupons: () => API.get('/coupons'),
};

export const searchAPI = {
  search: (params) => API.get('/search', { params }),
  autocomplete: (q) => API.get('/search/autocomplete', { params: { q } }),
};

export const newsletterAPI = {
  subscribe: (data) => API.post('/newsletter/subscribe', data),
};

export const analyticsAPI = {
  getDashboardStats: () => API.get('/analytics/dashboard'),
  getSalesAnalytics: (params) => API.get('/analytics/sales', { params }),
  getTopProducts: () => API.get('/analytics/top-products'),
};

export default API;
