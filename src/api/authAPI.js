import apiClient from './apiClient';

export const authAPI = {
  // Login
  login: async (credentials) => {
    if (!credentials) throw new Error('Credentials are required');
    return apiClient.post('/auth/login', credentials);
  },

  // Logout
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // Get current user
  getMe: async () => {
    return apiClient.get('/auth/me');
  },

  // Refresh token
  refreshToken: async () => {
    return apiClient.post('/auth/refresh');
  },

  // Register
  register: async (formData) => {
    return apiClient.post('/auth/register', formData);
  },

  // Update password
  updatePassword: async (passwordData) => {
    return apiClient.put('/auth/updatepassword', passwordData);
  },

  // Forgot password
  forgotPassword: async (email) => {
    return apiClient.post('/auth/forgotpassword', { email });
  },

  // Reset password
  resetPassword: async (token, newPassword) => {
    return apiClient.put(`/auth/resetpassword/${token}`, { password: newPassword });
  },

  // Update profile
  updateProfile: async (profileData) => {
    return apiClient.put('/auth/profile', profileData);
  },

  // Update preferences
  updatePreferences: async (userId, preferences) => {
    return apiClient.put(`/auth/profile/preferences/${userId}`, preferences);
  }
};