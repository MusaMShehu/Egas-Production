export const NotificationService = {
  // Account Related
  ACCOUNT_CREATED: {
    title: 'Welcome to eGas! 🎉',
    message: 'Your account has been created successfully. Start exploring our gas services!',
    type: 'success'
  },

  // Order Related
  ORDER_CREATED: {
    title: 'Order Placed Successfully! ✅',
    message: 'Your gas order has been received and is being processed.',
    type: 'success'
  },

  ORDER_CONFIRMED: {
    title: 'Order Confirmed! 🔥',
    message: 'Your gas order has been confirmed and will be delivered soon.',
    type: 'success'
  },

  ORDER_OUT_FOR_DELIVERY: {
    title: 'Order Out for Delivery! 🚚',
    message: 'Your gas refill is on the way. Expected delivery within 2 hours.',
    type: 'info'
  },

  ORDER_DELIVERED: {
    title: 'Order Delivered! 🎊',
    message: 'Your gas cylinder has been successfully delivered. Thank you for choosing eGas!',
    type: 'success'
  },

  // Subscription Related
  SUBSCRIPTION_CREATED: {
    title: 'Subscription Activated! 🔄',
    message: 'Your gas subscription has been created successfully.',
    type: 'success'
  },

  SUBSCRIPTION_DELIVERY_REMINDER: {
    title: 'Delivery Tomorrow! 📅',
    message: 'Your scheduled gas delivery is tomorrow. Please ensure someone is available.',
    type: 'info'
  },

  SUBSCRIPTION_FULFILLED: {
    title: 'Subscription Delivery Complete! ✅',
    message: 'Your scheduled gas delivery has been completed successfully.',
    type: 'success'
  },

  SUBSCRIPTION_ENDING_WARNING: {
    title: 'Subscription Ending Soon! ⚠️',
    message: 'Your gas subscription will end in {days} days. Renew to continue uninterrupted service.',
    type: 'warning'
  },

  SUBSCRIPTION_PAUSED: {
    title: 'Subscription Paused ⏸️',
    message: 'Your gas subscription has been paused. No deliveries will be made until resumed.',
    type: 'info'
  },

  SUBSCRIPTION_RESUMED: {
    title: 'Subscription Resumed! ▶️',
    message: 'Your gas subscription has been resumed. Deliveries will continue as scheduled.',
    type: 'success'
  },

  SUBSCRIPTION_CANCELLED: {
    title: 'Subscription Cancelled ❌',
    message: 'Your gas subscription has been cancelled. We hope to serve you again soon!',
    type: 'warning'
  },

  // Wallet Related
  WALLET_TOPUP_SUCCESS: {
    title: 'Wallet Top-up Successful! 💰',
    message: 'Your eGas wallet has been credited with ₹{amount}.',
    type: 'success'
  },

  // Support Related
  SUPPORT_RESOLVED: {
    title: 'Support Ticket Resolved! ✅',
    message: 'Your support request has been resolved. Thank you for contacting us!',
    type: 'success'
  },

  // Promotional
  PROMOTIONAL: {
    title: 'Special Offer! 🎁',
    message: '{message}',
    type: 'promo'
  },

  // System Notifications
  SYSTEM_UPDATE: {
    title: 'System Update 🔄',
    message: '{message}',
    type: 'info'
  }
};

export const getNotificationMessage = (type, data = {}) => {
  const template = NotificationService[type];
  if (!template) return null;

  let message = template.message;
  
  // Replace placeholders with actual data
  Object.keys(data).forEach(key => {
    message = message.replace(`{${key}}`, data[key]);
  });

  return {
    ...template,
    message
  };
};