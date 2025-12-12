import axios from 'axios';

const API_BASE_URL = 'https://your-api-url.com/api';

class NotificationService {
  // Store device token in backend
  static async storeDeviceToken(userId, token) {
    try {
      await axios.post(`${API_BASE_URL}/notifications/token`, {
        userId,
        token
      });
    } catch (error) {
      console.error('Error storing device token:', error);
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      await axios.put(`${API_BASE_URL}/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Get user notifications
  static async getUserNotifications(userId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }
}

export default NotificationService;