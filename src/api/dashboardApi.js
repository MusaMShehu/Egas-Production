// api/dashboardApi.js
import apiClient from './apiClient';

export const dashboardAPI = {
  // Get dashboard overview
  getOverview: async () => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  },

  // Get spending analytics
  getSpendingAnalytics: async (period = 'monthly') => {
    const response = await apiClient.get(`/dashboard/spending?period=${period}`);
    return response.data;
  },

  // Get recent activities
  getRecentActivities: async (limit = 10) => {
    const response = await apiClient.get(`/dashboard/recent-activities?limit=${limit}`);
    return response.data;
  },

  // Get quick stats
  getQuickStats: async () => {
    const response = await apiClient.get('/dashboard/quick-stats');
    return response.data;
  },

  // Get next delivery
  getNextDelivery: async () => {
    const response = await apiClient.get('/delivery/next-delivery');
    return response.data;
  },

  // Get dashboard stats (combined endpoint)
  getDashboardStats: async () => {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  }
};