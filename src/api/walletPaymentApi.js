import axios from 'axios';

const API = axios.create({
  baseURL: 'https://egas-server.onrender.com/api/v1/payments',
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const payWithWallet = async (orderId, amount) => {
  const { data } = await API.post('/wallet', { orderId, amount });
  return data;
};
