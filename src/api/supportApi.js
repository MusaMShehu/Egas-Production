import apiClient from './client';

export const supportAPI = {
  // Get all support tickets
  getTickets: async () => {
    return apiClient.get('/support');
  },

  // Get ticket by ID
  getTicketById: async (id) => {
    if (!id) throw new Error('Ticket ID is required');
    return apiClient.get(`/support/${id}`);
  },

  // Create new ticket
  createTicket: async (ticketData) => {
    if (!ticketData) throw new Error('Ticket data is required');
    
    // Handle FormData for file uploads
    if (ticketData instanceof FormData) {
      const response = await apiClient.post('/support', ticketData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response;
    }
    
    return apiClient.post('/support', ticketData);
  },

  // Add response to ticket
  addResponse: async (ticketId, message, attachments = []) => {
    if (!ticketId) throw new Error('Ticket ID is required');
    
    const formData = new FormData();
    formData.append('message', message);
    
    if (attachments.length > 0) {
      attachments.forEach(file => {
        formData.append('attachments', file);
      });
    }
    
    return apiClient.put(`/support/${ticketId}/response`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Close ticket
  closeTicket: async (ticketId) => {
    if (!ticketId) throw new Error('Ticket ID is required');
    return apiClient.put(`/support/${ticketId}/close`, {});
  },

  // Get ticket categories
  getCategories: async () => {
    return apiClient.get('/support/categories');
  }
};