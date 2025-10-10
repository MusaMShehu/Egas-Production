import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class PaymentService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_URL}/payments`,
      withCredentials: true,
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // ==================== SUBSCRIPTION PAYMENT ====================

  async initializeSubscription(paymentData) {
    try {
      const response = await this.api.post('/subscription/initialize', paymentData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifySubscription(reference) {
    try {
      const response = await this.api.get(`/subscription/verify/${reference}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSubscriptionDetails() {
    try {
      const response = await this.api.get('/subscription/details');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTransactionHistory(userId, page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/subscription/history/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== WALLET TOPUP ====================

  async initiateTopup(amount) {
    try {
      const response = await this.api.post('/wallet/topup', { amount });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyTopup(reference) {
    try {
      const response = await this.api.get('/wallet/verify', { params: { reference } });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getWalletBalance() {
    try {
      const response = await this.api.get('/wallet/balance');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPaymentHistory(page = 1, limit = 10) {
    try {
      const response = await this.api.get(`/wallet/history?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== ORDER PAYMENT ====================

  async payWithWallet(orderId) {
    try {
      const response = await this.api.put(`/order/${orderId}/wallet-pay`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async initializeOrderPayment(orderId) {
    try {
      const response = await this.api.post('/order/initialize', { orderId });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async verifyOrderPayment(reference) {
    try {
      const response = await this.api.get(`/order/verify/${reference}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ==================== UTILITY METHODS ====================

  handleError(error) {
    if (error.response?.data) {
      return new Error(error.response.data.message || 'Payment operation failed');
    }
    return new Error('Network error occurred');
  }

  // Redirect to Paystack payment page
  redirectToPaystack(authorizationUrl) {
    window.location.href = authorizationUrl;
  }
}

export default new PaymentService();