// // api/productApi.js
// const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

// // Helper function to handle API responses
// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => null);
//     const errorMessage = errorData?.message || errorData?.error || `HTTP error! status: ${response.status}`;
//     throw new Error(errorMessage);
//   }
  
//   const contentType = response.headers.get('content-type');
//   if (contentType && contentType.includes('application/json')) {
//     return response.json();
//   } else {
//     return response.text();
//   }
// };

// // Generic API request function
// const apiRequest = async (endpoint, options = {}) => {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   // Get auth token for regular users (if needed)
//   const token = localStorage.getItem('token');
  
//   const config = {
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token && { 'Authorization': `Bearer ${token}` }),
//       ...options.headers,
//     },
//     ...options,
//   };

//   if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
//     config.body = JSON.stringify(config.body);
//   }

//   try {
//     const response = await fetch(url, config);
//     return handleResponse(response);
//   } catch (error) {
//     console.error('API request failed:', error);
//     throw error;
//   }
// };

// // Product API calls for regular users
// export const productAPI = {
//   // Get all products with advanced filtering
//   getAllProducts: async (filters = {}) => {
//     const queryParams = new URLSearchParams();
    
//     // Add filter parameters if provided
//     Object.keys(filters).forEach(key => {
//       if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
//         queryParams.append(key, filters[key]);
//       }
//     });
    
//     const queryString = queryParams.toString();
//     const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
//     return apiRequest(endpoint);
//   },

//   // Get product by ID
//   getProductById: async (id) => {
//     if (!id) throw new Error('Product ID is required');
//     return apiRequest(`/products/${id}`);
//   },

//   // Search products
//   searchProducts: async (query, filters = {}) => {
//     const queryParams = new URLSearchParams();
//     if (query) {
//       queryParams.append('search', query);
//     }
    
//     Object.keys(filters).forEach(key => {
//       if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
//         queryParams.append(key, filters[key]);
//       }
//     });
    
//     const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
//     return apiRequest(endpoint);
//   },
// };

// export default productAPI;



import apiClient from './apiClient';

export const productAPI = {
  // Get all products with filtering
  getAllProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  },

  // Get product by ID
  getProductById: async (id) => {
    if (!id) throw new Error('Product ID is required');
    return apiClient.get(`/products/${id}`);
  },

  // Search products
  searchProducts: async (query, filters = {}) => {
    if (!query) throw new Error('Search query is required');
    
    const queryParams = new URLSearchParams();
    queryParams.append('search', query);
    
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    return apiClient.get(`/products/search?${queryParams.toString()}`);
  },

  // Get product categories
  getCategories: async () => {
    return apiClient.get('/products/categories');
  },

  // Get featured products
  getFeaturedProducts: async (limit = 10) => {
    return apiClient.get(`/products/featured?limit=${limit}`);
  },

  // Get product reviews
  getProductReviews: async (productId) => {
    if (!productId) throw new Error('Product ID is required');
    return apiClient.get(`/products/${productId}/reviews`);
  },

  // Submit product review
  submitReview: async (productId, reviewData) => {
    if (!productId) throw new Error('Product ID is required');
    if (!reviewData) throw new Error('Review data is required');
    return apiClient.post(`/products/${productId}/reviews`, reviewData);
  }
};