import apiClient from './client';

export const ordersAPI = {
  // Get all orders (with pagination)
  getAllOrders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  },

  // Get order by ID
  getOrderById: async (id) => {
    if (!id) throw new Error('Order ID is required');
    return apiClient.get(`/orders/${id}`);
  },

  // Create a new order
  createOrder: async (orderData) => {
    if (!orderData) throw new Error('Order data is required');
    return apiClient.post('/orders', orderData);
  },

  // Update order
  updateOrder: async (id, orderData) => {
    if (!id) throw new Error('Order ID is required');
    if (!orderData) throw new Error('Order data is required');
    return apiClient.put(`/orders/${id}`, orderData);
  },

  // Cancel order
  cancelOrder: async (id) => {
    if (!id) throw new Error('Order ID is required');
    return apiClient.put(`/orders/${id}/cancel`, {});
  },

  // Verify order payment
  verifyPayment: async (reference) => {
    if (!reference) throw new Error('Payment reference is required');
    return apiClient.get(`/orders/verify?reference=${reference}`);
  },

  // Get user's order history
  getUserOrderHistory: async (page = 1, limit = 10) => {
    return apiClient.get(`/orders/history?page=${page}&limit=${limit}`);
  },

  // Reorder previous order
  reorder: async (orderId) => {
    if (!orderId) throw new Error('Order ID is required');
    return apiClient.post(`/orders/${orderId}/reorder`);
  }
};