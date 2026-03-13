import axios from 'axios';

/**
 * Unified API client with HTTP-only cookie support
 * All API calls must go through this client
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com/api/v1',
      timeout: 30000,
      withCredentials: true, // Critical for HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        // 'X-Client-Version': process.env.REACT_APP_VERSION || '1.0.0'
      }
    });

    this.setupInterceptors();
    this.refreshPromise = null;
  }

  setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add request ID for tracing
        // config.headers['X-Request-ID'] = this.generateRequestId();
        
        // Don't set Content-Type for FormData
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        
        return config;
      },
      (error) => Promise.reject(this.normalizeError(error))
    );

    // Response interceptor with token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration (401 with TOKEN_EXPIRED code)
        if (
          error.response?.status === 401 &&
          error.response?.data?.code === 'TOKEN_EXPIRED' &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            // Prevent multiple refresh attempts
            if (!this.refreshPromise) {
              this.refreshPromise = this.client.post('/auth/refresh');
            }
            
            await this.refreshPromise;
            this.refreshPromise = null;
            
            return this.client(originalRequest);
          } catch (refreshError) {
            this.refreshPromise = null;
            
            // Clear any stale auth state
            window.dispatchEvent(new CustomEvent('auth:logout'));
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/auth')) {
              window.location.href = '/auth';
            }
            
            return Promise.reject(this.normalizeError(refreshError));
          }
        }

        return Promise.reject(this.normalizeError(error));
      }
    );
  }

  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  normalizeError(error) {
    if (error.response?.data) {
      const { message, error: errorMsg, errors } = error.response.data;
      
      // Create normalized error object
      const normalized = new Error(message || errorMsg || 'Request failed');
      normalized.status = error.response.status;
      normalized.code = error.response.data.code;
      normalized.data = error.response.data;
      normalized.originalError = error;
      
      // Add validation errors if present
      if (errors) {
        normalized.validationErrors = errors;
      }
      
      return normalized;
    }
    
    if (error.request) {
      // Network error
      const networkError = new Error('Network error. Please check your connection.');
      networkError.isNetworkError = true;
      networkError.originalError = error;
      return networkError;
    }
    
    return error;
  }

  // HTTP methods
  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch(url, data, config = {}) {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export default new ApiClient();