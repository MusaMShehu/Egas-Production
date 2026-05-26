// src/api/index.js
import apiClient from './apiClient';
import ApiService from './apiService';

export { default as apiClient } from './apiClient';
export { default as ApiService } from './apiService';

// Export individual services for convenience
export const authAPI = ApiService.auth;
export const dashboardAPI = ApiService.dashboard;
export const ordersAPI = ApiService.orders;
export const subscriptionsAPI = ApiService.subscriptions;
export const deliveryAPI = ApiService.delivery;
export const historyAPI = ApiService.history;
export const settingsAPI = ApiService.settings;
export const supportAPI = ApiService.support;
export const cartAPI = ApiService.cart;
export const productsAPI = ApiService.products;
export const paymentsAPI = ApiService.payments;
export const notificationsAPI = ApiService.notifications;

export default apiClient;