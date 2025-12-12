import React, { createContext, useContext, useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../components/Notifications/firebase';
import NotificationService from '../services/firebaseNotificationService';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId) {
      initializeNotifications();
      requestPermission();
    }
  }, [userId]);

  const initializeNotifications = async () => {
    const userNotifications = await NotificationService.getUserNotifications(userId);
    setNotifications(userNotifications);
    updateUnreadCount(userNotifications);
  };

  const updateUnreadCount = (notificationsList) => {
    const count = notificationsList.filter(notification => !notification.read).length;
    setUnreadCount(count);
  };

  const requestPermission = async () => {
    try {
      const token = await requestForToken();
      if (token && userId) {
        await NotificationService.storeDeviceToken(userId, token);
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    await NotificationService.markAsRead(notificationId);
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    );
    setNotifications(updatedNotifications);
    updateUnreadCount(updatedNotifications);
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(notification => !notification.read);
    for (const notification of unreadNotifications) {
      await NotificationService.markAsRead(notification.id);
    }
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  // Listen for foreground messages
  useEffect(() => {
    const setupForegroundListener = async () => {
      try {
        const payload = await onMessageListener();
        if (payload) {
          addNotification({
            title: payload.notification?.title,
            message: payload.notification?.body,
            type: payload.data?.type || 'info'
          });
        }
      } catch (error) {
        console.error('Error in foreground message listener:', error);
      }
    };

    setupForegroundListener();
  }, []);

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};