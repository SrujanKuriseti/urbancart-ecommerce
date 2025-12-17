import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses and errors  
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
};

// Catalog API
export const catalogAPI = {
  getAllItems: () => api.get('/catalog/items'),
  updateInventory: (itemId, quantity) =>
    api.patch(`/catalog/items/${itemId}/inventory`, { quantity }),
  getItemById: (id) => api.get(`/catalog/items/${id}`),
  filterItems: (params) => api.get('/catalog/items/filter', { params }),
  createItem: (data) => api.post('/catalog/items', data),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (itemId, quantity) => api.post('/cart/items', { itemId, quantity }),
  updateCartItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeFromCart: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

// Order API
export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getAllOrders: () => api.get('/orders'),
  getOrderById: (orderId) => api.get(`/orders/${orderId}`),
};

// Customer API
export const customerAPI = {
  getProfile: () => api.get('/customers/profile'),
  updateProfile: (profileData) => api.put('/customers/profile', profileData),
  getAllCustomers: () => api.get('/customers'),
};

// Admin API (add this before "export default api;")
export const adminAPI = {
  getAllOrders: () => api.get('/orders'),
  getAllCustomers: () => api.get('/customers'),
  updateInventory: (itemId, quantity) => api.patch(`/catalog/items/${itemId}/inventory`, { quantity }),
};

export const reviewAPI = {
  getItemReviews: (itemId) => api.get(`/reviews/item/${itemId}`),
  submitReview: (itemId, data) => api.post(`/reviews/item/${itemId}`, data),
  deleteReview: (itemId) => api.delete(`/reviews/item/${itemId}`), 
};

export default api;
