import apiClient from './client';

export const deliveryAPI = {
  // Get user deliveries
  getMyDeliveries: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = `/admin/delivery/my-deliveries${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(endpoint);
  },

  // Get next delivery
  getNextDelivery: async () => {
    return apiClient.get('/admin/delivery/next-delivery');
  },

  // Get delivery by ID
  getDeliveryById: async (id) => {
    if (!id) throw new Error('Delivery ID is required');
    return apiClient.get(`/admin/delivery/${id}`);
  },

  // Confirm delivery receipt
  confirmDelivery: async (deliveryId, notes = '') => {
    if (!deliveryId) throw new Error('Delivery ID is required');
    return apiClient.put(`/admin/delivery/${deliveryId}/confirm`, { notes });
  },

  // Sync delivery with subscription
  syncDeliveryWithSubscription: async (deliveryId) => {
    if (!deliveryId) throw new Error('Delivery ID is required');
    return apiClient.post(`/delivery/${deliveryId}/sync-subscription`);
  },

  // Get remnant data
  getRemnant: async () => {
    return apiClient.get('/admin/delivery/remnant/my-remnant');
  },

  // Confirm remnant entries
  confirmRemnantEntries: async (remnantId, notes = '') => {
    if (!remnantId) throw new Error('Remnant ID is required');
    return apiClient.put(`/admin/delivery/remnant/${remnantId}/confirm`, { notes });
  },

  // Request remnant delivery
  requestRemnantDelivery: async (requestedKg, deliveryDate, notes = '') => {
    if (!requestedKg) throw new Error('Requested amount is required');
    return apiClient.post('/admin/delivery/remnant/request-delivery', { 
      requestedKg, 
      deliveryDate, 
      notes 
    });
  }
};