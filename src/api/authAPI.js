// export const authAPI = {
//   signUp: (userData) => {
//     return new Promise((resolve, reject) => {
//       const users = JSON.parse(localStorage.getItem("users") || "[]");
//       const existingUser = users.find((u) => u.email === userData.email);

//       if (existingUser) {
//         setTimeout(() => reject({ message: "User already exists" }), 1000);
//       } else {
//         const newUser = { id: Date.now(), ...userData, createdAt: new Date().toISOString() };
//         users.push(newUser);
//         localStorage.setItem("users", JSON.stringify(users));
//         localStorage.setItem("currentUser", JSON.stringify(newUser));
//         setTimeout(() => resolve({ data: { user: newUser } }), 1000);
//       }
//     });
//   },

//   signIn: (credentials) => {
//     return new Promise((resolve, reject) => {
//       const users = JSON.parse(localStorage.getItem("users") || "[]");
//       const user = users.find((u) => u.email === credentials.email && u.password === credentials.password);

//       if (user) {
//         localStorage.setItem("currentUser", JSON.stringify(user));
//         setTimeout(() => resolve({ data: { user } }), 1000);
//       } else {
//         setTimeout(() => reject({ message: "Invalid email or password" }), 1000);
//       }
//     });
//   },

//   requestPasswordReset: (email) => {
//     return new Promise((resolve, reject) => {
//       const users = JSON.parse(localStorage.getItem("users") || "[]");
//       const user = users.find((u) => u.email === email);

//       if (user) {
//         const resetToken = Math.random().toString(36).substring(2) + Date.now().toString(36);
//         localStorage.setItem("resetToken", resetToken);
//         localStorage.setItem("resetEmail", email);
//         setTimeout(() => resolve({ data: { message: "Reset email sent", resetToken } }), 1000);
//       } else {
//         setTimeout(() => reject({ message: "No account found" }), 1000);
//       }
//     });
//   },

//   resetPassword: (token, newPassword) => {
//     return new Promise((resolve, reject) => {
//       const storedToken = localStorage.getItem("resetToken");
//       const email = localStorage.getItem("resetEmail");

//       if (token === storedToken) {
//         const users = JSON.parse(localStorage.getItem("users") || "[]");
//         const idx = users.findIndex((u) => u.email === email);

//         if (idx !== -1) {
//           users[idx].password = newPassword;
//           localStorage.setItem("users", JSON.stringify(users));
//           localStorage.removeItem("resetToken");
//           localStorage.removeItem("resetEmail");
//           setTimeout(() => resolve({ data: { message: "Password reset successful" } }), 1000);
//         } else {
//           reject({ message: "Invalid reset token" });
//         }
//       } else {
//         reject({ message: "Invalid or expired reset token" });
//       }
//     });
//   },
// };






import apiClient from './apiClient';

export const authAPI = {
  // Admin login
  login: async (credentials) => {
    if (!credentials) throw new Error('Credentials are required');
    return apiClient.post('/auth/login', credentials);
  },

  // Admin logout
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // Verify token
  verifyToken: async () => {
    return apiClient.get('/auth/verify');
  },

  // Refresh token
  refreshToken: async () => {
    return apiClient.post('/auth/refresh');
  },

  // Change password
  changePassword: async (passwordData) => {
    if (!passwordData) throw new Error('Password data is required');
    return apiClient.post('/auth/change-password', passwordData);
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    return apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    return apiClient.post('/auth/reset-password', { token, password: newPassword });
  }
};