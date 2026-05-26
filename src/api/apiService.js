// src/api/apiService.js
import apiClient from './apiClient';

class ApiService {
  // ==================== AUTH ENDPOINTS ====================
  static auth = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    logout: () => apiClient.post('/auth/logout'),
    getMe: () => apiClient.get('/auth/me'),
    register: (formData) => apiClient.post('/auth/register', formData),
    updatePassword: (data) => apiClient.put('/auth/updatepassword', data),
    forgotPassword: (email) => apiClient.post('/auth/forgotpassword', { email }),
    resetPassword: (token, password) => apiClient.put(`/auth/resetpassword/${token}`, { password }),
    updateProfile: (data) => apiClient.put('/auth/profile', data),
    updatePreferences: (userId, preferences) => apiClient.put(`/auth/profile/preferences/${userId}`, preferences),
    refreshToken: () => apiClient.post('/auth/refresh'),
    verifyEmail: (token, userId) => apiClient.get(`/auth/verifyemail/${token}?userId=${userId}`),
    resendVerification: () => apiClient.post('/auth/verifyemail'),
  };

  // ==================== DASHBOARD ENDPOINTS ====================
  static dashboard = {
    getOverview: () => apiClient.get('/dashboard/overview'),
    getNextDelivery: () => apiClient.get('/delivery/next-delivery'),
    getSpendingAnalytics: (period = 'monthly') => apiClient.get(`/dashboard/spending?period=${period}`),
    getRecentActivities: (limit = 10) => apiClient.get(`/dashboard/recent-activities?limit=${limit}`),
    getQuickStats: () => apiClient.get('/dashboard/quick-stats'),
    getWalletBalance: () => apiClient.get('/dashboard/wallet-balance'),
  };

  // ==================== ORDERS ENDPOINTS ====================
  static orders = {
    getAll: (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      const queryString = queryParams.toString();
      return apiClient.get(`/orders${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiClient.get(`/orders/${id}`),
    create: (orderData) => apiClient.post('/orders', orderData),
    update: (id, orderData) => apiClient.put(`/orders/${id}`, orderData),
    cancel: (id) => apiClient.delete(`/orders/${id}`),
    getHistory: (page = 1, limit = 10) => apiClient.get(`/orders/history?page=${page}&limit=${limit}`),
    reorder: (orderId) => apiClient.post(`/orders/${orderId}/reorder`),
    verifyPayment: (reference) => apiClient.get(`/orders/verify?reference=${reference}`),
  };

  // ==================== SUBSCRIPTIONS ENDPOINTS ====================
  static subscriptions = {
    getMySubscriptions: (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      const queryString = queryParams.toString();
      return apiClient.get(`/subscriptions/my-subscriptions${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiClient.get(`/subscriptions/${id}`),
    create: (subscriptionData) => apiClient.post('/subscriptions', subscriptionData),
    pause: (id) => apiClient.put(`/subscriptions/${id}/pause`, {}),
    resume: (id) => apiClient.put(`/subscriptions/${id}/resume`, {}),
    cancel: (id) => apiClient.put(`/subscriptions/${id}/cancel-my`, {}),
    verifyPayment: (reference) => apiClient.get(`/subscriptions/verify?reference=${reference}`),
    getPlans: () => apiClient.get('/subscription-plans'),
    getPlanById: (id) => apiClient.get(`/subscription-plans/${id}`),
  };

  // ==================== DELIVERY ENDPOINTS ====================
  static delivery = {
    getMyDeliveries: (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      const queryString = queryParams.toString();
      return apiClient.get(`/delivery/my-deliveries${queryString ? `?${queryString}` : ''}`);
    },
    getNextDelivery: () => apiClient.get('/delivery/next-delivery'),
    getById: (id) => apiClient.get(`/delivery/${id}`),
    confirmDelivery: (id, notes) => apiClient.put(`/delivery/${id}/confirm`, { notes }),
    syncWithSubscription: (id) => apiClient.post(`/delivery/${id}/sync-subscription`),
    getMyRemnant: () => apiClient.get('/delivery/remnant/my-remnant'),
    confirmRemnant: (remnantId, notes) => apiClient.put(`/delivery/remnant/${remnantId}/confirm`, { notes }),
    requestRemnantDelivery: (data) => apiClient.post('/delivery/remnant/request-delivery', data),
  };

  // ==================== CART ENDPOINTS ====================
  static cart = {
    get: () => apiClient.get('/cart'),
    add: (item) => apiClient.post('/cart/add', item),
    update: (updates) => apiClient.put('/cart/update', { updates }),
    remove: (itemId) => apiClient.delete(`/cart/remove/${itemId}`),
    clear: () => apiClient.delete('/cart/clear'),
    applyCoupon: (code) => apiClient.post('/cart/apply-coupon', { code }),
    removeCoupon: () => apiClient.delete('/cart/remove-coupon'),
  };

  // ==================== PRODUCTS ENDPOINTS ====================
  static products = {
    getAll: (filters = {}) => {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
          queryParams.append(key, filters[key]);
        }
      });
      const queryString = queryParams.toString();
      return apiClient.get(`/products${queryString ? `?${queryString}` : ''}`);
    },
    getById: (id) => apiClient.get(`/products/${id}`),
    search: (query, filters = {}) => {
      const queryParams = new URLSearchParams();
      queryParams.append('search', query);
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      return apiClient.get(`/products/search?${queryParams.toString()}`);
    },
    getCategories: () => apiClient.get('/products/categories'),
    getFeatured: (limit = 10) => apiClient.get(`/products/featured?limit=${limit}`),
    getReviews: (productId) => apiClient.get(`/products/${productId}/reviews`),
    submitReview: (productId, reviewData) => apiClient.post(`/products/${productId}/reviews`, reviewData),
  };

  // ==================== HISTORY ENDPOINTS ====================
  static history = {
    getOrders: (page, limit, status, search) => {
      const params = new URLSearchParams({ page, limit });
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('q', search);
      return apiClient.get(`/user/history/orders?${params}`);
    },
    getSubscriptions: (page, limit, status, search) => {
      const params = new URLSearchParams({ page, limit });
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('q', search);
      return apiClient.get(`/user/history/subscriptions?${params}`);
    },
    getPayments: (page, limit, status, search) => {
      const params = new URLSearchParams({ page, limit });
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('q', search);
      return apiClient.get(`/user/history/payments?${params}`);
    },
  };

  // ==================== PAYMENTS ENDPOINTS ====================
  static payments = {
    getWalletBalance: () => apiClient.get('/payments/wallet/balance'),
    initiateTopup: (amount) => apiClient.post('/payments/wallet/topup', { amount }),
    verifyTopup: (reference) => apiClient.get(`/payments/wallet/verify?reference=${reference}`),
    payWithWallet: (orderId, amount) => apiClient.post('/payments/wallet/pay', { orderId, amount }),
    getHistory: (page = 1, limit = 10) => apiClient.get(`/payments/history?page=${page}&limit=${limit}`),
    initializeSubscriptionPayment: (subscriptionData) => apiClient.post('/payments/subscription/initialize', subscriptionData),
    verifySubscriptionPayment: (reference) => apiClient.get(`/payments/subscription/verify?reference=${reference}`),
    initializeOrderPayment: (orderId) => apiClient.post('/payments/order/initialize', { orderId }),
    verifyOrderPayment: (reference) => apiClient.get(`/payments/order/verify?reference=${reference}`),
  };

  // ==================== NOTIFICATIONS ENDPOINTS ====================
  static notifications = {
    getAll: (page = 1, limit = 20) => apiClient.get(`/notifications?page=${page}&limit=${limit}`),
    markAsRead: (notificationId) => apiClient.put(`/notifications/${notificationId}/read`, {}),
    markAllAsRead: () => apiClient.put('/notifications/mark-all-read', {}),
    registerToken: (token) => apiClient.post('/notifications/register-token', { token }),
    unregisterToken: (token) => apiClient.delete(`/notifications/token/${token}`),
    getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  };

  // ==================== SUPPORT ENDPOINTS ====================
  static support = {
    getAll: () => apiClient.get('/support'),
    getById: (id) => apiClient.get(`/support/${id}`),
    create: (formData) => apiClient.post('/support', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    }),
    addResponse: (id, formData) => apiClient.put(`/support/${id}/response`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    close: (id) => apiClient.put(`/support/${id}/close`, {}),
    getCategories: () => apiClient.get('/support/categories'),
  };

  // ==================== SETTINGS ENDPOINTS ====================
  static settings = {
    get: () => apiClient.get('/settings'),
    update: (settings) => apiClient.put('/settings', settings),
    exportData: () => apiClient.get('/settings/export-data', { responseType: 'blob' }),
    deleteAccount: () => apiClient.delete('/users/me'),
    updateEmail: (email) => apiClient.put('/users/email', { email }),
    changePassword: (passwordData) => apiClient.put('/users/password', passwordData),
  };
}

export default ApiService;