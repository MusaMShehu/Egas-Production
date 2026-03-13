
// // services/notification.service.js - Complete notification service
// import ApiService from './apiService';
// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// class NotificationService {
//   constructor() {
//     this.messaging = null;
//     this.notificationPermission = false;
//     this.serviceWorkerRegistration = null;
//   }

//   async initialize() {
//     const firebaseConfig = {
//       apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
//       authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
//       projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
//       storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
//       messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
//       appId: process.env.REACT_APP_FIREBASE_APP_ID,
//       measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
//     };

//     try {
//       const app = initializeApp(firebaseConfig);
//       this.messaging = getMessaging(app);
      
//       // Register service worker
//       if ('serviceWorker' in navigator) {
//         this.serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
//         console.log('Service Worker registered');
//       }

//       return true;
//     } catch (error) {
//       console.error('Firebase initialization error:', error);
//       return false;
//     }
//   }

//   async requestPermission() {
//     try {
//       const permission = await Notification.requestPermission();
//       this.notificationPermission = permission === 'granted';
      
//       if (this.notificationPermission && this.messaging) {
//         const token = await getToken(this.messaging, {
//           vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
//           serviceWorkerRegistration: this.serviceWorkerRegistration
//         });

//         // Send token to backend
//         await ApiService.post('/notifications/register-token', { token });
        
//         return token;
//       }
//     } catch (error) {
//       console.error('Error requesting notification permission:', error);
//     }
//   }

//   listenForMessages() {
//     if (!this.messaging) return;

//     onMessage(this.messaging, (payload) => {
//       console.log('Message received:', payload);
      
//       // Show browser notification
//       if (this.notificationPermission) {
//         new Notification(payload.notification.title, {
//           body: payload.notification.body,
//           icon: '/logo192.png',
//           badge: '/badge.png',
//           data: payload.data
//         });
//       }

//       // Dispatch custom event for React components
//       window.dispatchEvent(new CustomEvent('notification', { 
//         detail: payload 
//       }));
//     });
//   }

//   async markAsRead(notificationId) {
//     try {
//       await ApiService.put(`/notifications/${notificationId}/read`);
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   }

//   async markAllAsRead() {
//     try {
//       await ApiService.put('/notifications/mark-all-read');
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//     }
//   }
// }

// export default new NotificationService();



// services/notification.service.js - Complete notification service
import ApiService from './apiService';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

class NotificationService {
  constructor() {
    this.messaging = null;
    this.notificationPermission = false;
    this.serviceWorkerRegistration = null;
  }

  async initialize() {
    const firebaseConfig = {
      apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
      authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
      storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FIREBASE_APP_ID,
      measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
    };

    try {
      const app = initializeApp(firebaseConfig);
      this.messaging = getMessaging(app);
      
      // Register service worker
      if ('serviceWorker' in navigator) {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered');
      }

      return true;
    } catch (error) {
      console.error('Firebase initialization error:', error);
      return false;
    }
  }

  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      this.notificationPermission = permission === 'granted';
      
      if (this.notificationPermission && this.messaging) {
        const token = await getToken(this.messaging, {
          vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: this.serviceWorkerRegistration
        });

        // Send token to backend
        await ApiService.post('/notifications/register-token', { token });
        
        return token;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }

  /**
   * Get user notifications from backend
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters (page, limit, etc.)
   * @returns {Promise<Array>} - List of notifications
   */
  async getUserNotifications(userId, params = {}) {
    try {
      if (!userId) {
        console.error('User ID is required');
        return [];
      }

      // Build query params
      const queryParams = new URLSearchParams({
        ...params,
        userId
      }).toString();

      const response = await ApiService.get(`/notifications/user/${userId}?${queryParams}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  /**
   * Get unread notification count
   * @param {string} userId - User ID
   * @returns {Promise<number>} - Unread count
   */
  async getUnreadCount(userId) {
    try {
      const response = await ApiService.get(`/notifications/user/${userId}/unread-count`);
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  async markAsRead(notificationId) {
    try {
      await ApiService.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  /**
   * Mark all notifications as read for current user
   */
  async markAllAsRead() {
    try {
      await ApiService.put('/notifications/mark-all-read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   */
  async deleteNotification(notificationId) {
    try {
      await ApiService.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  /**
   * Listen for incoming messages
   */
  listenForMessages() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      
      // Show browser notification
      if (this.notificationPermission) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/logo192.png',
          badge: '/badge.png',
          data: payload.data
        });
      }

      // Dispatch custom event for React components
      window.dispatchEvent(new CustomEvent('notification', { 
        detail: payload 
      }));
    });
  }

  /**
   * Store device token in backend
   * @param {string} userId - User ID
   * @param {string} token - FCM token
   */
  async storeDeviceToken(userId, token) {
    try {
      await ApiService.post('/notifications/token', {
        userId,
        token
      });
    } catch (error) {
      console.error('Error storing device token:', error);
    }
  }

  /**
   * Remove device token
   * @param {string} token - FCM token to remove
   */
  async removeDeviceToken(token) {
    try {
      await ApiService.delete('/notifications/token', { data: { token } });
    } catch (error) {
      console.error('Error removing device token:', error);
    }
  }

  /**
   * Get notification settings for user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - Notification settings
   */
  async getNotificationSettings(userId) {
    try {
      const response = await ApiService.get(`/notifications/settings/${userId}`);
      return response.data || {};
    } catch (error) {
      console.error('Error getting notification settings:', error);
      return {};
    }
  }

  /**
   * Update notification settings
   * @param {string} userId - User ID
   * @param {Object} settings - Notification settings
   */
  async updateNotificationSettings(userId, settings) {
    try {
      await ApiService.put(`/notifications/settings/${userId}`, settings);
    } catch (error) {
      console.error('Error updating notification settings:', error);
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    // Add cleanup logic if needed
    this.messaging = null;
    this.notificationPermission = false;
    this.serviceWorkerRegistration = null;
  }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;

// Also export named exports for individual functions if needed
export const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  requestPermission,
  storeDeviceToken,
  removeDeviceToken,
  getNotificationSettings,
  updateNotificationSettings
} = notificationService;