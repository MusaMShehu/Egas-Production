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



import apiClient from './client';

export const subscriptionsAPI = {
  // Get all subscriptions for current user
  getMySubscriptions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/subscriptions/my-subscriptions${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  },

  // Get subscription by ID
  getSubscriptionById: async (id) => {
    if (!id) throw new Error('Subscription ID is required');
    return apiClient.get(`/subscriptions/${id}`);
  },

  // Create a new subscription
  createSubscription: async (subscriptionData) => {
    if (!subscriptionData) throw new Error('Subscription data is required');
    return apiClient.post('/subscriptions', subscriptionData);
  },

  // Pause subscription
  pauseSubscription: async (id) => {
    if (!id) throw new Error('Subscription ID is required');
    return apiClient.put(`/subscriptions/${id}/pause`, {});
  },

  // Resume subscription
  resumeSubscription: async (id) => {
    if (!id) throw new Error('Subscription ID is required');
    return apiClient.put(`/subscriptions/${id}/resume`, {});
  },

  // Cancel subscription
  cancelSubscription: async (id) => {
    if (!id) throw new Error('Subscription ID is required');
    return apiClient.put(`/subscriptions/${id}/cancel-my`, {});
  },

  // Verify subscription payment
  verifyPayment: async (reference) => {
    if (!reference) throw new Error('Payment reference is required');
    return apiClient.get(`/subscriptions/verify?reference=${reference}`);
  },

  // Get subscription plans
  getSubscriptionPlans: async () => {
    return apiClient.get('/subscription-plans');
  },

  // Get plan by ID
  getPlanById: async (id) => {
    if (!id) throw new Error('Plan ID is required');
    return apiClient.get(`/subscription-plans/${id}`);
  }
};