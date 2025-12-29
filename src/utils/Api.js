import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://egas-server-1.onrender.com",
  timeout: 30000,
  withCredentials: false, // change only if you use cookies
});

// ✅ Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Let Axios/browser decide Content-Type
    // This avoids multipart/form-data boundary bugs
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default API;
