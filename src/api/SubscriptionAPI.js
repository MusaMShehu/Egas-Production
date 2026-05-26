// import axios from 'axios';

// const API_BASE_URL =
//   process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com/api/v1';

// // Helper to get the token safely
// const getToken = () => {
//   try {
//     const user = JSON.parse(localStorage.getItem('user'));
//     return user?.token || user?.accessToken || null;
//   } catch {
//     return null;
//   }
// };

// // Pause a subscription
// export const pauseSubscription = async (id) => {
//   const token = getToken();
//   if (!token) throw new Error('No authentication token found. Please log in.');

//   try {
//     const res = await axios.put(
//       `${API_BASE_URL}/subscriptions/${id}/pause`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     console.error('Error pausing subscription:', err.response?.data || err.message);
//     throw err.response?.data || err;
//   }
// };

// // Resume a subscription
// export const resumeSubscription = async (id) => {
//   const token = getToken();
//   if (!token) throw new Error('No authentication token found. Please log in.');

//   try {
//     const res = await axios.put(
//       `${API_BASE_URL}/subscriptions/${id}/resume`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     console.error('Error resuming subscription:', err.response?.data || err.message);
//     throw err.response?.data || err;
//   }
// };



// import apiClient from './client';

// export const subscriptionsAPI = {
//   // Get all subscriptions for current user
//   getMySubscriptions: async (params = {}) => {
//     const queryParams = new URLSearchParams();
    
//     Object.keys(params).forEach(key => {
//       if (params[key] !== undefined && params[key] !== '') {
//         queryParams.append(key, params[key]);
//       }
//     });
    
//     const queryString = queryParams.toString();
//     const endpoint = `/subscriptions/my-subscriptions${queryString ? `?${queryString}` : ''}`;
    
//     return apiClient.get(endpoint);
//   },

//   // Get subscription by ID
//   getSubscriptionById: async (id) => {
//     if (!id) throw new Error('Subscription ID is required');
//     return apiClient.get(`/subscriptions/${id}`);
//   },

//   // Create a new subscription
//   createSubscription: async (subscriptionData) => {
//     if (!subscriptionData) throw new Error('Subscription data is required');
//     return apiClient.post('/subscriptions', subscriptionData);
//   },

//   // Pause subscription
//   pauseSubscription: async (id) => {
//     if (!id) throw new Error('Subscription ID is required');
//     return apiClient.put(`/subscriptions/${id}/pause`, {});
//   },

//   // Resume subscription
//   resumeSubscription: async (id) => {
//     if (!id) throw new Error('Subscription ID is required');
//     return apiClient.put(`/subscriptions/${id}/resume`, {});
//   },

//   // Cancel subscription
//   cancelSubscription: async (id) => {
//     if (!id) throw new Error('Subscription ID is required');
//     return apiClient.put(`/subscriptions/${id}/cancel-my`, {});
//   },

//   // Verify subscription payment
//   verifyPayment: async (reference) => {
//     if (!reference) throw new Error('Payment reference is required');
//     return apiClient.get(`/subscriptions/verify?reference=${reference}`);
//   },

//   // Get subscription plans
//   getSubscriptionPlans: async () => {
//     return apiClient.get('/subscription-plans');
//   },

//   // Get plan by ID
//   getPlanById: async (id) => {
//     if (!id) throw new Error('Plan ID is required');
//     return apiClient.get(`/subscription-plans/${id}`);
//   }
// };





// services/subscriptionApi.js
import apiClient from './apiClient';

class SubscriptionApi {
  
  async getMySubscriptions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const endpoint = `/subscriptions/my-subscriptions${queryString ? `?${queryString}` : ''}`;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  }

  /**
   * Get subscription by ID
   * @param {string} id - Subscription ID
   * @returns {Promise<Object>} Subscription data
   */
  async getSubscriptionById(id) {
    if (!id) throw new Error('Subscription ID is required');
    try {
      const response = await apiClient.get(`/subscriptions/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching subscription ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new subscription
   * @param {Object} subscriptionData - Subscription data
   * @returns {Promise<Object>} Created subscription
   */
  async createSubscription(subscriptionData) {
    if (!subscriptionData) throw new Error('Subscription data is required');
    try {
      const response = await apiClient.post('/subscriptions', subscriptionData);
      return response;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  /**
   * Pause a subscription
   * @param {string} id - Subscription ID
   * @returns {Promise<Object>} Updated subscription
   */
  async pauseSubscription(id) {
    if (!id) throw new Error('Subscription ID is required');
    try {
      const response = await apiClient.put(`/subscriptions/${id}/pause`, {});
      return response;
    } catch (error) {
      console.error(`Error pausing subscription ${id}:`, error);
      throw error;
    }
  }

  /**
   * Resume a subscription
   * @param {string} id - Subscription ID
   * @returns {Promise<Object>} Updated subscription
   */
  async resumeSubscription(id) {
    if (!id) throw new Error('Subscription ID is required');
    try {
      const response = await apiClient.put(`/subscriptions/${id}/resume`, {});
      return response;
    } catch (error) {
      console.error(`Error resuming subscription ${id}:`, error);
      throw error;
    }
  }

  /**
   * Cancel a subscription
   * @param {string} id - Subscription ID
   * @returns {Promise<Object>} Updated subscription
   */
  async cancelSubscription(id) {
    if (!id) throw new Error('Subscription ID is required');
    try {
      const response = await apiClient.put(`/subscriptions/${id}/cancel-my`, {});
      return response;
    } catch (error) {
      console.error(`Error cancelling subscription ${id}:`, error);
      throw error;
    }
  }

  /**
   * Verify subscription payment
   * @param {string} reference - Payment reference
   * @returns {Promise<Object>} Verification result
   */
  async verifyPayment(reference) {
    if (!reference) throw new Error('Payment reference is required');
    try {
      const response = await apiClient.get(`/subscriptions/verify?reference=${reference}`);
      return response;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Get all subscription plans
   * @returns {Promise<Object>} Subscription plans
   */
  async getSubscriptionPlans() {
    try {
      const response = await apiClient.get('/subscription-plans');
      return response;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }

  /**
   * Get subscription plan by ID
   * @param {string} id - Plan ID
   * @returns {Promise<Object>} Plan data
   */
  async getPlanById(id) {
    if (!id) throw new Error('Plan ID is required');
    try {
      const response = await apiClient.get(`/subscription-plans/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching plan ${id}:`, error);
      throw error;
    }
  }

  /**
   * Calculate next delivery date based on frequency
   * @param {Object} subscription - Subscription object
   * @returns {string|null} Next delivery date ISO string or null
   */
  calculateNextDeliveryDate(subscription) {
    if (!subscription.lastDeliveryDate || subscription.status !== 'active') {
      return subscription.nextDeliveryDate || null;
    }
    
    const lastDelivery = new Date(subscription.lastDeliveryDate);
    const frequency = subscription.frequency;
    
    switch (frequency) {
      case 'Weekly':
        lastDelivery.setDate(lastDelivery.getDate() + 7);
        break;
      case 'Bi-Weekly':
        lastDelivery.setDate(lastDelivery.getDate() + 14);
        break;
      case 'Monthly':
        lastDelivery.setMonth(lastDelivery.getMonth() + 1);
        break;
      default:
        return subscription.nextDeliveryDate || null;
    }
    
    return lastDelivery.toISOString();
  }
}

// Create and export a single instance
const subscriptionApi = new SubscriptionApi();
export default subscriptionApi;