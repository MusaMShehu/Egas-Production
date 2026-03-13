// services/api.service.js - Unified API service
import axios from 'axios';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'https://api.egas.com.ng',
      timeout: 30000,
      withCredentials: true, // Critical for cookies!
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Don't set Content-Type for FormData
        if (config.data instanceof FormData) {
          delete config.headers['Content-Type'];
        }
        
        // Add request ID for tracing
        config.headers['X-Request-ID'] = this.generateRequestId();
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && 
            error.response?.data?.code === 'TOKEN_EXPIRED' &&
            !originalRequest._retry) {
          
          originalRequest._retry = true;

          try {
            // Attempt to refresh token
            await this.refreshToken();
            return this.api(originalRequest);
          } catch (refreshError) {
            // Refresh failed - redirect to login
            window.location.href = '/auth';
            return Promise.reject(refreshError);
          }
        }

        // Format error message
        const message = this.extractErrorMessage(error);
        return Promise.reject(new Error(message));
      }
    );
  }

  async refreshToken() {
    try {
      await this.api.post('/auth/refresh');
    } catch (error) {
      throw new Error('Session expired. Please login again.');
    }
  }

  extractErrorMessage(error) {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  generateRequestId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // HTTP methods
  get(url, config = {}) {
    return this.api.get(url, config);
  }

  post(url, data, config = {}) {
    return this.api.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.api.put(url, data, config);
  }

  patch(url, data, config = {}) {
    return this.api.patch(url, data, config);
  }

  delete(url, config = {}) {
    return this.api.delete(url, config);
  }
}

export default new ApiService();