import { useNotification } from '../contexts/FirebaseNotificationContext';
import { getNotificationMessage } from '../components/Notifications/firebaseNotificationMessages';

export const useNotificationManager = () => {
  const { addNotification } = useNotification();

  const triggerNotification = (type, data = {}) => {
    const notificationConfig = getNotificationMessage(type, data);
    
    if (notificationConfig) {
      addNotification({
        ...notificationConfig,
        data: {
          ...data,
          type
        }
      });

      // Here you would also send to your backend to trigger push notifications
      sendToBackend(notificationConfig, data);
    }
  };

  const sendToBackend = async (notificationConfig, data) => {
    try {
      // This would call your backend API to send push notifications
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notificationConfig.title,
          body: notificationConfig.message,
          type: notificationConfig.type,
          userId: data.userId,
          relatedId: data.orderId || data.subscriptionId || data.ticketId
        })
      });
    } catch (error) {
      console.error('Error sending notification to backend:', error);
    }
  };

  // Specific notification triggers
  const notifications = {
    // Account
    afterAccountCreated: (userId) => triggerNotification('ACCOUNT_CREATED', { userId }),

    // Orders
    afterOrderCreated: (orderId, userId) => triggerNotification('ORDER_CREATED', { orderId, userId }),
    orderConfirmation: (orderId, userId) => triggerNotification('ORDER_CONFIRMED', { orderId, userId }),
    orderOutForDelivery: (orderId, userId) => triggerNotification('ORDER_OUT_FOR_DELIVERY', { orderId, userId }),
    orderDelivered: (orderId, userId) => triggerNotification('ORDER_DELIVERED', { orderId, userId }),

    // Subscriptions
    subscriptionCreated: (subscriptionId, userId) => triggerNotification('SUBSCRIPTION_CREATED', { subscriptionId, userId }),
    subscriptionDeliveryReminder: (subscriptionId, userId, deliveryDate) => triggerNotification('SUBSCRIPTION_DELIVERY_REMINDER', { subscriptionId, userId, deliveryDate }),
    subscriptionFulfilled: (subscriptionId, userId) => triggerNotification('SUBSCRIPTION_FULFILLED', { subscriptionId, userId }),
    subscriptionEndingWarning: (subscriptionId, userId, days) => triggerNotification('SUBSCRIPTION_ENDING_WARNING', { subscriptionId, userId, days }),
    subscriptionPaused: (subscriptionId, userId) => triggerNotification('SUBSCRIPTION_PAUSED', { subscriptionId, userId }),
    subscriptionResumed: (subscriptionId, userId) => triggerNotification('SUBSCRIPTION_RESUMED', { subscriptionId, userId }),
    subscriptionCancelled: (subscriptionId, userId) => triggerNotification('SUBSCRIPTION_CANCELLED', { subscriptionId, userId }),

    // Wallet
    walletTopupSuccess: (amount, userId, transactionId) => triggerNotification('WALLET_TOPUP_SUCCESS', { amount, userId, transactionId }),

    // Support
    supportResolved: (ticketId, userId) => triggerNotification('SUPPORT_RESOLVED', { ticketId, userId }),

    // Promotional
    sendPromotional: (message, userId) => triggerNotification('PROMOTIONAL', { message, userId }),

    // System
    systemUpdate: (message) => triggerNotification('SYSTEM_UPDATE', { message })
  };

  return notifications;
};