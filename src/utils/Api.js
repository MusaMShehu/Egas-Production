import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com",
  timeout: 15000, // a little higher for file uploads
});

// ✅ Request Interceptor - add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ⚠️ Dynamically set correct Content-Type
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    } else {
      delete config.headers["Content-Type"]; // Let browser set multipart boundaries
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor - handle unauthorized
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
