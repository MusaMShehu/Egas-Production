// services/adminSubscriptionService.js
import axios from "axios";

// =============================
// ✅ Configuration
// =============================
const API_BASE_URL = "http://localhost:5000"; // 🔧 Update if using different backend URL

// ✅ Safely get token from localStorage
const getToken = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? token.replace(/^"|"$/g, "") : null;
  } catch (err) {
    console.error("❌ Error reading token from localStorage:", err);
    return null;
  }
};

// ✅ Create shared axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached:", token.substring(0, 25) + "...");
    } else {
      console.warn("⚠️ No token found — request may fail with 401");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// // ✅ Handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      console.warn("🚫 Unauthorized (401). Token may be invalid or expired.");
    } else if (response?.status === 403) {
      console.error("⛔ Forbidden! You don’t have permission for this action.");
    } else if (response?.status === 404) {
      console.error("❓ Resource not found:", response?.data?.message || error.message);
    } else if (response?.status === 500) {
      console.error("💥 Server error:", response?.data?.message || error.message);
    }

    return Promise.reject(error);
  }
);

// =============================
// ✅ Admin Subscription Service
// =============================
const adminSubscriptionService = {
  // Get all subscriptions
  async getAdminSubscriptions(params = {}) {
    const response = await api.get("/api/v1/admin/subscriptions", { params });
    return response.data;
  },

  // Get single subscription
  async getAdminSubscription(id) {
    const response = await api.get(`/api/v1/admin/subscriptions/${id}`);
    return response.data;
  },

  // Create subscription
  async createAdminSubscription(subscriptionData) {
    const response = await api.post("/api/v1/admin/subscriptions", subscriptionData);
    return response.data;
  },

  // Update subscription
  async updateAdminSubscription(id, subscriptionData) {
    const response = await api.put(`/api/v1/admin/subscriptions/${id}`, subscriptionData);
    return response.data;
  },

  // Delete subscription
  async deleteAdminSubscription(id) {
    const response = await api.delete(`/api/v1/admin/subscriptions/${id}`);
    return response.data;
  },

  // Bulk update
  async bulkUpdateAdminSubscriptions(ids, updateData) {
    const response = await api.put("/api/v1/admin/subscriptions/bulk/update", {
      ids,
      updateData,
    });
    return response.data;
  },

  // Bulk delete
  async bulkDeleteAdminSubscriptions(ids) {
    const response = await api.delete("/api/v1/admin/subscriptions/bulk/delete", {
      data: { ids },
    });
    return response.data;
  },

  // Pause subscription
  async pauseAdminSubscription(id) {
    const response = await api.put(`/api/v1/admin/subscriptions/${id}/pause`);
    return response.data;
  },

  // Resume subscription
  async resumeAdminSubscription(id) {
    const response = await api.put(`/api/v1/admin/subscriptions/${id}/resume`);
    return response.data;
  },

  // Cancel subscription
  async cancelAdminSubscription(id) {
    const response = await api.put(`/api/v1/admin/subscriptions/${id}/cancel`);
    return response.data;
  },

  // Get analytics overview
  async getAdminAnalytics() {
    const response = await api.get("/api/v1/admin/subscriptions/analytics/overview");
    return response.data;
  },

  // Get statistics
  async getAdminStatistics(params = {}) {
    const response = await api.get("/api/v1/admin/subscriptions/statistics", { params });
    return response.data;
  },

  // Export subscriptions (for file download)
  async exportAdminSubscriptions(params = {}) {
    const response = await api.get("/api/v1/admin/subscriptions/export", {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};

export default adminSubscriptionService;
