// services/subscriptionService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com';

/**
 * Pause a subscription
 * @param {string} subscriptionId - The ID of the subscription to pause
 * @returns {Promise<Object>} - Result of the pause operation
 */
export const pauseSubscription = async (subscriptionId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/pause`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Subscription paused successfully'
    };
  } catch (error) {
    console.error('Error in pauseSubscription:', error);
    return {
      success: false,
      message: error.message || 'Failed to pause subscription'
    };
  }
};

/**
 * Resume a paused subscription
 * @param {string} subscriptionId - The ID of the subscription to resume
 * @returns {Promise<Object>} - Result of the resume operation
 */
export const resumeSubscription = async (subscriptionId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/resume`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Subscription resumed successfully'
    };
  } catch (error) {
    console.error('Error in resumeSubscription:', error);
    return {
      success: false,
      message: error.message || 'Failed to resume subscription'
    };
  }
};

/**
 * Get subscription details by ID
 * @param {string} subscriptionId - The ID of the subscription
 * @returns {Promise<Object>} - Subscription details
 */
export const getSubscriptionDetails = async (subscriptionId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      data: result.data,
      message: result.message || 'Subscription details fetched successfully'
    };
  } catch (error) {
    console.error('Error in getSubscriptionDetails:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch subscription details'
    };
  }
};