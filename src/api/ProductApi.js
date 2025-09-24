// api.js
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1/admin';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  return response.json();
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Product API calls
export const productAPI = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add filter parameters if provided
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        queryParams.append(key, filters[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint);
  },

  // Get product by ID
  getProductById: async (id) => {
    return apiRequest(`/products/${id}`);
  },

  // Create a new product
  createProduct: async (productData) => {
    return apiRequest('/products', {
      method: 'POST',
      body: productData,
    });
  },

  // Update a product
  updateProduct: async (id, productData) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    });
  },

  // Delete a product
  deleteProduct: async (id) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Search products
  searchProducts: async (query, category = '') => {
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    
    if (category) {
      queryParams.append('category', category);
    }
    
    return apiRequest(`/products/search?${queryParams.toString()}`);
  },
};

// Cart API calls (if needed)
export const cartAPI = {
  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: { productId, quantity },
    });
  },

  // Get cart items
  getCart: async () => {
    return apiRequest('/cart');
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    });
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Clear cart
  clearCart: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};

// Export the base API request function for custom calls
export default apiRequest;