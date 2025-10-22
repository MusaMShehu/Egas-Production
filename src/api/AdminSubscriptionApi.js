// services/subscriptionApi.js
import axios from "axios";

// ✅ Make sure this matches your backend
const API_BASE_URL = "http://localhost:5000";

// ✅ Helper: safely extract JWT from localStorage
const getToken = () => {
  try {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token ? token.replace(/^"|"$/g, "") : null;
  } catch (err) {
    console.error("❌ Error reading token from localStorage:", err);
    return null;
  }
};
     

// ✅ Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token automatically to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached:", token.substring(0, 25) + "...");
    } else {
      console.warn("⚠️ No token found — requests may fail with 401");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle global response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      console.warn("🚫 Unauthorized (401). Check if token is valid or expired.");
    } else if (response?.status === 403) {
      console.error("⛔ Forbidden! You don’t have permission for this action.");
    } else if (response?.status === 500) {
      console.error("💥 Server error:", response?.data?.message || error.message);
    }

    return Promise.reject(error);
  }
);

// ✅ Export reusable API calls
// export const SubscriptionApi = {
//   // Admin routes
//   getAdminSubscriptions: (params = {}) => api.get("/admin/subscriptions", { params }),
//   getSubscriptionById: (id) => api.get(`/admin/subscriptions/${id}`),
//   createSubscription: (data) => api.post("/admin/subscriptions", data),
//   updateSubscription: (id, data) => api.put(`/admin/subscriptions/${id}`, data),
//   deleteSubscription: (id) => api.delete(`/admin/subscriptions/${id}`),

//   // Analytics / other routes
//   getSubscriptionAnalytics: () => api.get("/subscriptions/analytics"),
// };

// ✅ Export default instance
export default api;
