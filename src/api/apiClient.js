// import axios from 'axios';

// /**
//  * Unified API client with HTTP-only cookie support
//  * All API calls must go through this client
//  */
// class ApiClient {
//   constructor() {
//     this.client = axios.create({
//       baseURL: process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com/api/v1',
//       timeout: 30000,
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//         // 'X-Client-Version': process.env.REACT_APP_VERSION || '1.0.0'
//       }
//     });

//     this.setupInterceptors();
//     this.refreshPromise = null;
//   }

//   setupInterceptors() {
//     // Request interceptor
//     this.client.interceptors.request.use(
//       (config) => {
//         // Add request ID for tracing
//         // config.headers['X-Request-ID'] = this.generateRequestId();
        
//         // Don't set Content-Type for FormData
//         if (config.data instanceof FormData) {
//           delete config.headers['Content-Type'];
//         }
        
//         return config;
//       },
//       (error) => Promise.reject(this.normalizeError(error))
//     );

//     // Response interceptor with token refresh
//     this.client.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         const originalRequest = error.config;

//         // Handle token expiration (401 with TOKEN_EXPIRED code)
//         if (
//           error.response?.status === 401 &&
//           error.response?.data?.code === 'TOKEN_EXPIRED' &&
//           !originalRequest._retry
//         ) {
//           originalRequest._retry = true;

//           try {
//             // Prevent multiple refresh attempts
//             if (!this.refreshPromise) {
//               this.refreshPromise = this.client.post('/auth/refresh');
//             }
            
//             await this.refreshPromise;
//             this.refreshPromise = null;
            
//             return this.client(originalRequest);
//           } catch (refreshError) {
//             this.refreshPromise = null;
            
//             // Clear any stale auth state
//             window.dispatchEvent(new CustomEvent('auth:logout'));
            
//             // Redirect to login if not already there
//             if (!window.location.pathname.includes('/auth')) {
//               window.location.href = '/auth';
//             }
            
//             return Promise.reject(this.normalizeError(refreshError));
//           }
//         }

//         return Promise.reject(this.normalizeError(error));
//       }
//     );
//   }

//   generateRequestId() {
//     return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
//   }

//   normalizeError(error) {
//     if (error.response?.data) {
//       const { message, error: errorMsg, errors } = error.response.data;
      
//       // Create normalized error object
//       const normalized = new Error(message || errorMsg || 'Request failed');
//       normalized.status = error.response.status;
//       normalized.code = error.response.data.code;
//       normalized.data = error.response.data;
//       normalized.originalError = error;
      
//       // Add validation errors if present
//       if (errors) {
//         normalized.validationErrors = errors;
//       }
      
//       return normalized;
//     }
    
//     if (error.request) {
//       // Network error
//       const networkError = new Error('Network error. Please check your connection.');
//       networkError.isNetworkError = true;
//       networkError.originalError = error;
//       return networkError;
//     }
    
//     return error;
//   }

//   // HTTP methods
//   async get(url, config = {}) {
//     const response = await this.client.get(url, config);
//     return response.data;
//   }

//   async post(url, data, config = {}) {
//     const response = await this.client.post(url, data, config);
//     return response.data;
//   }

//   async put(url, data, config = {}) {
//     const response = await this.client.put(url, data, config);
//     return response.data;
//   }

//   async patch(url, data, config = {}) {
//     const response = await this.client.patch(url, data, config);
//     return response.data;
//   }

//   async delete(url, config = {}) {
//     const response = await this.client.delete(url, config);
//     return response.data;
//   }
// }

// export default new ApiClient();





// import axios from 'axios';

// /**
//  * Unified API client with HTTP-only cookie support
//  * All API calls must go through this client
//  */
// class ApiClient {
//   constructor() {
//     this.client = axios.create({
//       baseURL: process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com/api/v1',
//       timeout: 30000,
//       withCredentials: true, // CRITICAL: This enables cookies to be sent/received
//       headers: {
//         'Content-Type': 'application/json',
//       }
//     });

//     this.setupInterceptors();
//     this.refreshPromise = null;
//   }

//   setupInterceptors() {
//     // Request interceptor
//     this.client.interceptors.request.use(
//       (config) => {
//         // Don't set Content-Type for FormData - let browser set it with boundary
//         if (config.data instanceof FormData) {
//           delete config.headers['Content-Type'];
//         }
        
//         // Add timestamp to prevent caching
//         if (config.method === 'get') {
//           config.params = {
//             ...config.params,
//             _t: Date.now()
//           };
//         }
        
//         return config;
//       },
//       (error) => Promise.reject(this.normalizeError(error))
//     );

//     // Response interceptor with token refresh
//     this.client.interceptors.response.use(
//       (response) => {
//         // Return the actual data from the response
//         return response.data;
//       },
//       async (error) => {
//         const originalRequest = error.config;

//         // Handle token expiration (401)
//         if (
//           error.response?.status === 401 &&
//           !originalRequest._retry &&
//           !originalRequest.url.includes('/auth/login') &&
//           !originalRequest.url.includes('/auth/register')
//         ) {
//           originalRequest._retry = true;

//           try {
//             // Prevent multiple refresh attempts
//             if (!this.refreshPromise) {
//               this.refreshPromise = this.client.post('/auth/refresh');
//             }
            
//             await this.refreshPromise;
//             this.refreshPromise = null;
            
//             // Retry the original request
//             return this.client(originalRequest);
//           } catch (refreshError) {
//             this.refreshPromise = null;
            
//             // Clear any stale auth state
//             window.dispatchEvent(new CustomEvent('auth:logout'));
            
//             // Only redirect if not already on auth page
//             if (!window.location.pathname.includes('/auth') && 
//                 !window.location.pathname.includes('/login')) {
//               window.location.href = '/auth';
//             }
            
//             return Promise.reject(this.normalizeError(refreshError));
//           }
//         }

//         return Promise.reject(this.normalizeError(error));
//       }
//     );
//   }

//   normalizeError(error) {
//     // Handle network errors
//     if (error.code === 'ECONNABORTED') {
//       const timeoutError = new Error('Request timeout. Please check your connection.');
//       timeoutError.status = 408;
//       timeoutError.isNetworkError = true;
//       return timeoutError;
//     }

//     if (error.response) {
//       // Server responded with error
//       const { data, status } = error.response;
      
//       // Create normalized error object
//       const normalizedError = new Error(
//         data?.message || 
//         data?.error || 
//         data?.msg || 
//         error.message || 
//         'Request failed'
//       );
      
//       normalizedError.status = status;
//       normalizedError.code = data?.code;
//       normalizedError.data = data;
//       normalizedError.originalError = error;
      
//       // Add validation errors if present
//       if (data?.errors) {
//         normalizedError.validationErrors = data.errors;
//       }
      
//       return normalizedError;
//     }
    
//     if (error.request) {
//       // Request made but no response (network error)
//       const networkError = new Error('Network error. Please check your connection.');
//       networkError.status = 0;
//       networkError.isNetworkError = true;
//       networkError.originalError = error;
//       return networkError;
//     }
    
//     // Something else happened
//     return error;
//   }

//   // HTTP methods
//   async get(url, config = {}) {
//     try {
//       return await this.client.get(url, config);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async post(url, data, config = {}) {
//     try {
//       return await this.client.post(url, data, config);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async put(url, data, config = {}) {
//     try {
//       return await this.client.put(url, data, config);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async patch(url, data, config = {}) {
//     try {
//       return await this.client.patch(url, data, config);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async delete(url, config = {}) {
//     try {
//       return await this.client.delete(url, config);
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// // Create and export a single instance
// const apiClient = new ApiClient();
// export default apiClient;
















// src/api/apiClient.js - COMPLETE AND FIXED
import axios from 'axios';

/**
 * Unified API client with HTTP-only cookie support
 * All API calls MUST go through this client
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.REACT_APP_API_URL,
      //  || 'https://egas-server-1.onrender.com/api/v1',
      timeout: 30000,
      withCredentials: true, // CRITICAL: This enables cookies to be sent/received
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
              window.location.href = '/auth';
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