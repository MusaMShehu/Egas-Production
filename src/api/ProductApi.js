// api/ProductApi.js
const API_BASE_URL = 'http://localhost:5000/api/v1/admin';

// Store original functions before modification
let originalApiRequest;
let originalHandleResponse;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || errorData?.error || `HTTP error! status: ${response.status}`;
    
    // Handle specific HTTP status codes
    // if (response.status === 401) {
    //   // Unauthorized - clear token and redirect to login
    //   apiUtils.removeAuthToken();
    //   window.location.href = '/admin/login';
    //   throw new Error('Authentication failed. Please login again.');
    // } else if (response.status === 403) {
    //   throw new Error('You do not have permission to perform this action.');
    // } else if (response.status === 404) {
    //   throw new Error('Resource not found.');
    // } else if (response.status >= 500) {
    //   throw new Error('Server error. Please try again later.');
    // }
    
    // throw new Error(errorMessage);
  }
  
  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
};

// Generic API request function with enhanced error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token
  const token = apiUtils.getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  // Handle FormData (for file uploads) vs JSON data
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    
    // Enhance error message for network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection.');
    }
    
    throw error;
  }
};

// FormData API request for file uploads
const apiFormDataRequest = async (endpoint, formData, method = 'POST') => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = apiUtils.getAuthToken();

  const config = {
    method,
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      // Don't set Content-Type for FormData - let browser set it with boundary
    },
    body: formData,
  };

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error('FormData API request failed:', error);
    throw error;
  }
};

// Utility functions
export const apiUtils = {
  // Set auth token
  setAuthToken: (token) => {
    localStorage.setItem('adminToken', token);
  },

  // Get auth token
  getAuthToken: () => {
    return localStorage.getItem('adminToken');
  },

  // Remove auth token
  removeAuthToken: () => {
    localStorage.removeItem('adminToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('adminToken');
  },
  
  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('authToken');
  }
};

// Store original implementations
originalApiRequest = apiRequest;
originalHandleResponse = handleResponse;

// Product API calls - Updated to match backend endpoints
export const productAPI = {
  // Get all products with advanced filtering
  getAllProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filter parameters if provided
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get product by ID
  getProductById: async (id) => {
    if (!id) throw new Error('Product ID is required');
    return apiRequest(`/products/${id}`);
  },

  // Create a new product
  createProduct: async (productData) => {
    if (!productData) throw new Error('Product data is required');
    return apiRequest('/products', {
      method: 'POST',
      body: productData,
    });
  },

  // Update a product
  updateProduct: async (id, productData) => {
    if (!id) throw new Error('Product ID is required');
    if (!productData) throw new Error('Product data is required');
    
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  // Delete a product
  deleteProduct: async (id) => {
    if (!id) throw new Error('Product ID is required');
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Bulk delete products
  bulkDeleteProducts: async (productIds) => {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new Error('Product IDs array is required');
    }
    return apiRequest('/products/bulk-delete', {
      method: 'DELETE',
      body: { productIds },
    });
  },

  // Toggle product status
  toggleProductStatus: async (id) => {
    if (!id) throw new Error('Product ID is required');
    return apiRequest(`/products/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  // Update product stock
  updateProductStock: async (id, stockData) => {
    if (!id) throw new Error('Product ID is required');
    if (!stockData) throw new Error('Stock data is required');
    
    return apiRequest(`/products/${id}/stock`, {
      method: 'PATCH',
      body: stockData,
    });
  },

  // Upload product photo
  uploadProductPhoto: async (id, formData) => {
    if (!id) throw new Error('Product ID is required');
    if (!formData || !(formData instanceof FormData)) {
      throw new Error('FormData is required for file upload');
    }
    return apiFormDataRequest(`/products/${id}/photo`, formData, 'PUT');
  },

  // Get product analytics
  getProductAnalytics: async () => {
    return apiRequest('/products/analytics/overview');
  },

  // Search products with advanced filters
  searchProducts: async (query, filters = {}) => {
    if (!query) throw new Error('Search query is required');
    
    const queryParams = new URLSearchParams();
    queryParams.append('search', query);
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    return apiRequest(`/products/search?${queryParams.toString()}`);
  },
};

// Subscription Plan API calls
export const subscriptionPlanAPI = {
  // Get all subscription plans
  getAllPlans: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/subscription-plans${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get plan by ID
  getPlanById: async (id) => {
    if (!id) throw new Error('Plan ID is required');
    return apiRequest(`/subscription-plans/${id}`);
  },

  // Create a new subscription plan
  createPlan: async (planData) => {
    if (!planData) throw new Error('Plan data is required');
    return apiRequest('/subscription-plans', {
      method: 'POST',
      body: planData,
    });
  },

  // Update a subscription plan
  updatePlan: async (id, planData) => {
    if (!id) throw new Error('Plan ID is required');
    if (!planData) throw new Error('Plan data is required');
    
    return apiRequest(`/subscription-plans/${id}`, {
      method: 'PUT',
      body: planData,
    });
  },

  // Delete a subscription plan
  deletePlan: async (id) => {
    if (!id) throw new Error('Plan ID is required');
    return apiRequest(`/subscription-plans/${id}`, {
      method: 'DELETE',
    });
  },

  // Toggle plan status
  togglePlanStatus: async (id) => {
    if (!id) throw new Error('Plan ID is required');
    return apiRequest(`/subscription-plans/${id}/toggle-status`, {
      method: 'PATCH',
    });
  },

  // Toggle plan popularity
  togglePlanPopular: async (id) => {
    if (!id) throw new Error('Plan ID is required');
    return apiRequest(`/subscription-plans/${id}/toggle-popular`, {
      method: 'PATCH',
    });
  },

  // Update display order
  updateDisplayOrder: async (id, displayOrder) => {
    if (!id) throw new Error('Plan ID is required');
    if (displayOrder === undefined || displayOrder === null) {
      throw new Error('Display order is required');
    }
    
    return apiRequest(`/subscription-plans/${id}/display-order`, {
      method: 'PATCH',
      body: { displayOrder },
    });
  },

  // Bulk update display orders
  bulkUpdateDisplayOrders: async (orders) => {
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      throw new Error('Orders array is required');
    }
    
    return apiRequest('/subscription-plans/bulk-display-order', {
      method: 'PATCH',
      body: { orders },
    });
  },

  // Calculate price for a plan
  calculatePrice: async (id, calculationData) => {
    if (!id) throw new Error('Plan ID is required');
    if (!calculationData) throw new Error('Calculation data is required');
    
    return apiRequest(`/subscription-plans/${id}/calculate-price`, {
      method: 'POST',
      body: calculationData,
    });
  },

  // Get plan analytics
  getPlanAnalytics: async () => {
    return apiRequest('/subscription-plans/analytics/overview');
  },

  // Duplicate plan
  duplicatePlan: async (id) => {
    if (!id) throw new Error('Plan ID is required');
    return apiRequest(`/subscription-plans/${id}/duplicate`, {
      method: 'POST',
    });
  },
};

// Analytics API calls
export const analyticsAPI = {
  // Get dashboard overview
  getDashboardOverview: async () => {
    return apiRequest('/analytics/dashboard');
  },

  // Get sales analytics
  getSalesAnalytics: async (period = 'monthly') => {
    return apiRequest(`/analytics/sales?period=${period}`);
  },

  // Get product performance
  getProductPerformance: async () => {
    return apiRequest('/analytics/products/performance');
  },

  // Get subscription analytics
  getSubscriptionAnalytics: async () => {
    return apiRequest('/analytics/subscriptions');
  },
};

// User Management API calls
export const userAPI = {
  // Get all users
  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/users${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get user by ID
  getUserById: async (id) => {
    if (!id) throw new Error('User ID is required');
    return apiRequest(`/users/${id}`);
  },

  // Update user
  updateUser: async (id, userData) => {
    if (!id) throw new Error('User ID is required');
    if (!userData) throw new Error('User data is required');
    
    return apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: userData,
    });
  },

  // Delete user
  deleteUser: async (id) => {
    if (!id) throw new Error('User ID is required');
    return apiRequest(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Auth API calls
export const authAPI = {
  // Admin login
  login: async (credentials) => {
    if (!credentials) throw new Error('Credentials are required');
    
    return apiRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  // Admin logout
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  // Verify token
  verifyToken: async () => {
    return apiRequest('/auth/verify');
  },

  // Refresh token
  refreshToken: async () => {
    return apiRequest('/auth/refresh');
  },

  // Change password
  changePassword: async (passwordData) => {
    if (!passwordData) throw new Error('Password data is required');
    
    return apiRequest('/auth/change-password', {
      method: 'POST',
      body: passwordData,
    });
  },
};

// Request interceptor wrapper
const createApiWithInterceptors = () => {
  return async (endpoint, options = {}) => {
    const token = apiUtils.getAuthToken();
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    };

    return originalApiRequest(endpoint, config);
  };
};

// Create intercepted version
const interceptedApiRequest = createApiWithInterceptors();

// Export the intercepted version as default
export default interceptedApiRequest;

// Export all API modules
export const API = {
  product: productAPI,
  subscription: subscriptionPlanAPI,
  analytics: analyticsAPI,
  user: userAPI,
  auth: authAPI,
  utils: apiUtils,
};

// Add global error handler for uncaught API errors
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && event.reason.message.includes('API')) {
    console.error('Unhandled API error:', event.reason);
    // You could send this to an error reporting service
  }
});