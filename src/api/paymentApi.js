import apiClient from './client';

export const paymentsAPI = {
  // Get wallet balance
  getWalletBalance: async () => {
    return apiClient.get('/payments/wallet/balance');
  },

  // Initiate wallet top-up
  initiateTopup: async (amount) => {
    if (!amount || amount < 1000) {
      throw new Error('Amount must be at least ₦1,000');
    }
    return apiClient.post('/payments/wallet/topup', { amount });
  },

  // Verify wallet top-up
  verifyTopup: async (reference) => {
    if (!reference) throw new Error('Payment reference is required');
    return apiClient.get(`/payments/wallet/verify?reference=${reference}`);
  },

  // Pay with wallet
  payWithWallet: async (orderId, amount) => {
    if (!orderId) throw new Error('Order ID is required');
    return apiClient.post('/payments/wallet/pay', { orderId, amount });
  },

  // Get payment history
  getPaymentHistory: async (page = 1, limit = 10) => {
    return apiClient.get(`/payments/history?page=${page}&limit=${limit}`);
  },

  // Initialize subscription payment
  initializeSubscriptionPayment: async (subscriptionData) => {
    if (!subscriptionData) throw new Error('Subscription data is required');
    return apiClient.post('/payments/subscription/initialize', subscriptionData);
  },

  // Verify subscription payment
  verifySubscriptionPayment: async (reference) => {
    if (!reference) throw new Error('Payment reference is required');
    return apiClient.get(`/payments/subscription/verify?reference=${reference}`);
  },

  // Initialize order payment
  initializeOrderPayment: async (orderId) => {
    if (!orderId) throw new Error('Order ID is required');
    return apiClient.post('/payments/order/initialize', { orderId });
  },

  // Verify order payment
  verifyOrderPayment: async (reference) => {
    if (!reference) throw new Error('Payment reference is required');
    return apiClient.get(`/payments/order/verify?reference=${reference}`);
  }
};