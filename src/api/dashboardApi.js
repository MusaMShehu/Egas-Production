// // api/dashboardApi.js
// import apiClient from './apiClient';

// export const dashboardAPI = {
//   // Get dashboard overview
//   getOverview: async () => {
//     const response = await apiClient.get('/dashboard/overview');
//     return response.data;
//   },

//   // Get spending analytics
//   getSpendingAnalytics: async (period = 'monthly') => {
//     const response = await apiClient.get(`/dashboard/spending?period=${period}`);
//     return response.data;
//   },

//   // Get recent activities
//   getRecentActivities: async (limit = 10) => {
//     const response = await apiClient.get(`/dashboard/recent-activities?limit=${limit}`);
//     return response.data;
//   },

//   // Get quick stats
//   getQuickStats: async () => {
//     const response = await apiClient.get('/dashboard/quick-stats');
//     return response.data;
//   },

//   // Get next delivery
//   getNextDelivery: async () => {
//     const response = await apiClient.get('/delivery/next-delivery');
//     return response.data;
//   },

//   // Get dashboard stats (combined endpoint)
//   getDashboardStats: async () => {
//     const response = await apiClient.get('/dashboard/overview');
//     return response.data;
//   }
// };




// // api/dashboardApi.js
// import apiClient from './apiClient';

// export const dashboardAPI = {

//   getOverview: async () => {
//     return await apiClient.get('/dashboard/overview');
//   },

//   getSpendingAnalytics: async (period = 'monthly') => {
//     return await apiClient.get(`/dashboard/spending?period=${period}`);
//   },

//   getRecentActivities: async (limit = 10) => {
//     return await apiClient.get(`/dashboard/recent-activities?limit=${limit}`);
//   },

//   getQuickStats: async () => {
//     return await apiClient.get('/dashboard/quick-stats');
//   },

//   getNextDelivery: async () => {
//     return await apiClient.get('/delivery/next-delivery');
//   },

//   getDashboardStats: async () => {
//     return await apiClient.get('/dashboard/overview');
//   }

// };




// services/dashboardApi.js
import apiClient from './apiClient';

/**
 * Dashboard API service
 */
class DashboardApi {
  /**
   * Get dashboard overview data
   * @returns {Promise<Object>} Dashboard overview
   */
  async getOverview() {
    try {
      const response = await apiClient.get('/dashboard/overview');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Get wallet balance
   * @returns {Promise<Object>} Wallet balance data
   */
  async getWalletBalance() {
    try {
      const response = await apiClient.get('/dashboard/wallet-balance');
      return response;
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      throw error;
    }
  }
}

export default new DashboardApi();