import apiClient from './client';

export const notificationsAPI = {
  // Get notifications
  getNotifications: async (page = 1, limit = 20) => {
    return apiClient.get(`/notifications?page=${page}&limit=${limit}`);
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    if (!notificationId) throw new Error('Notification ID is required');
    return apiClient.put(`/notifications/${notificationId}/read`, {});
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return apiClient.put('/notifications/mark-all-read', {});
  },

  // Register device token for push notifications
  registerToken: async (token) => {
    if (!token) throw new Error('Token is required');
    return apiClient.post('/notifications/register-token', { token });
  },

  // Unregister device token
  unregisterToken: async (token) => {
    if (!token) throw new Error('Token is required');
    return apiClient.delete(`/notifications/token/${token}`);
  },

  // Get notification count
  getUnreadCount: async () => {
    return apiClient.get('/notifications/unread-count');
  }
};