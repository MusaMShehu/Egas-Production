// In api.js - Cart API calls
export const cartAPI = {
  // Get cart items
  getCart: async () => {
    return apiRequest('/cart');
  },

  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    return apiRequest('/cart', {
      method: 'POST',
      body: { productId, quantity },
    });
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    });
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    return apiRequest(`/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Clear cart
  clearCart: async () => {
    return apiRequest('/cart', {
      method: 'DELETE',
    });
  },
};