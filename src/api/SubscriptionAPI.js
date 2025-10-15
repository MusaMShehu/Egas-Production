import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com/api/v1';

// Helper to get the token safely
const getToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token || user?.accessToken || null;
  } catch {
    return null;
  }
};

// Pause a subscription
export const pauseSubscription = async (id) => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found. Please log in.');

  try {
    const res = await axios.put(
      `${API_BASE_URL}/subscriptions/${id}/pause`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error('Error pausing subscription:', err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// Resume a subscription
export const resumeSubscription = async (id) => {
  const token = getToken();
  if (!token) throw new Error('No authentication token found. Please log in.');

  try {
    const res = await axios.put(
      `${API_BASE_URL}/subscriptions/${id}/resume`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error('Error resuming subscription:', err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
