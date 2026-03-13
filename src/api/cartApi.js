// import axios from 'axios';

// const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

// const cartAPI = {
//   getCart: async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${API_BASE_URL}/cart`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to fetch cart');
//     }
//   },

//   addToCart: async (item) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.post(`${API_BASE_URL}/cart/add`, item, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to add to cart');
//     }
//   },

//   updateCartItem: async (itemId, quantity) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
//         `${API_BASE_URL}/cart/update`,
//         { updates: [{ productId: itemId, quantity }] }, // ✅ matches backend
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to update cart');
//     }
//   },

//   removeFromCart: async (itemId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.delete(`${API_BASE_URL}/cart/remove/${itemId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
//     }
//   },

//   clearCart: async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.delete(`${API_BASE_URL}/cart/clear`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       return response.data;
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Failed to clear cart');
//     }
//   }
// };



// export default cartAPI;




import apiClient from './apiClient';

export const cartAPI = {
  // Get cart
  getCart: async () => {
    return apiClient.get('/cart');
  },

  // Add item to cart
  addToCart: async (item) => {
    if (!item || !item.productId) {
      throw new Error('Product ID is required');
    }
    return apiClient.post('/cart/add', item);
  },

  // Update cart item quantity
  updateCartItem: async (itemId, quantity) => {
    if (!itemId) throw new Error('Item ID is required');
    if (quantity < 1) throw new Error('Quantity must be at least 1');
    
    return apiClient.put('/cart/update', { 
      updates: [{ productId: itemId, quantity }] 
    });
  },

  // Remove item from cart
  removeFromCart: async (itemId) => {
    if (!itemId) throw new Error('Item ID is required');
    return apiClient.delete(`/cart/remove/${itemId}`);
  },

  // Clear cart
  clearCart: async () => {
    return apiClient.delete('/cart/clear');
  },

  // Apply coupon
  applyCoupon: async (couponCode) => {
    if (!couponCode) throw new Error('Coupon code is required');
    return apiClient.post('/cart/apply-coupon', { code: couponCode });
  },

  // Remove coupon
  removeCoupon: async () => {
    return apiClient.delete('/cart/remove-coupon');
  }
};