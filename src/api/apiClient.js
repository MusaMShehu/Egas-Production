import axios from 'axios';

/**
 * Unified API client with HTTP-only cookie support
 * All API calls MUST go through this client
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.setupInterceptors();
    this.refreshPromise = null;
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Don't set Content-Type for FormData - let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        
        // Add timestamp to prevent caching for GET requests
        if (config.method === 'get') {
          config.params = {
            ...config.params,
            _t: Date.now()
          };
        }
        
        return config;
      },
      (error) => Promise.reject(this.normalizeError(error))
    );

    // Response interceptor with token refresh
    this.client.interceptors.response.use(
      (response) => {
        // Return the actual data from the response
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration (401)
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          !originalRequest.url?.includes('/auth/login') &&
          !originalRequest.url?.includes('/auth/register') &&
          !originalRequest.url?.includes('/auth/refresh')
        ) {
          originalRequest._retry = true;

          try {
            // Prevent multiple refresh attempts
            if (!this.refreshPromise) {
              this.refreshPromise = this.client.post('/auth/refresh');
            }
            
            await this.refreshPromise;
            this.refreshPromise = null;
            
            // Retry the original request
            return this.client(originalRequest);
          } catch (refreshError) {
            this.refreshPromise = null;
            
            // Clear any stale auth state
            window.dispatchEvent(new CustomEvent('auth:logout'));
            
            // Only redirect if not already on auth page
            if (!window.location.pathname.includes('/auth') && 
                !window.location.pathname.includes('/login') &&
                !window.location.pathname.includes('/register')) {
              // window.location.href = '/auth';
            }
            
            return Promise.reject(this.normalizeError(refreshError));
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  normalizeError(error) {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      const timeoutError = new Error('Request timeout. Please check your connection.');
      timeoutError.status = 408;
      timeoutError.isNetworkError = true;
      return timeoutError;
    }

    if (error.response) {
      // Server responded with error
      const { data, status } = error.response;
      
      // Create normalized error object
      const normalizedError = new Error(
        data?.message || 
        data?.error || 
        data?.msg || 
        error.message || 
        'Request failed'
      );
      
      normalizedError.status = status;
      normalizedError.code = data?.code;
      normalizedError.data = data;
      normalizedError.originalError = error;
      
      // Add validation errors if present
      if (data?.errors) {
        normalizedError.validationErrors = data.errors;
      }
      
      return normalizedError;
    }
    
    if (error.request) {
      // Request made but no response (network error)
      const networkError = new Error('Network error. Please check your connection.');
      networkError.status = 0;
      networkError.isNetworkError = true;
      networkError.originalError = error;
      return networkError;
    }
    
    // Something else happened
    return error;
  }

  // HTTP methods - all return the parsed response data
  async get(url, config = {}) {
    try {
      return await this.client.get(url, config);
    } catch (error) {
      throw error;
    }
  }

  async post(url, data, config = {}) {
    try {
      return await this.client.post(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  async put(url, data, config = {}) {
    try {
      return await this.client.put(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  async patch(url, data, config = {}) {
    try {
      return await this.client.patch(url, data, config);
    } catch (error) {
      throw error;
    }
  }

  async delete(url, config = {}) {
    try {
      return await this.client.delete(url, config);
    } catch (error) {
      throw error;
    }
  }
}

// Create and export a single instance
const apiClient = new ApiClient();
export default apiClient;