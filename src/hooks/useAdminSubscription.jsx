// hooks/useAdminSubscription.js
import { useState, useCallback } from 'react';
import adminSubscriptionService from '../services/adminSubscriptionService';

export const useAdminSubscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [statistics, setStatistics] = useState(null);

  const fetchSubscriptions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminSubscriptionService.getAdminSubscriptions(params);
      setSubscriptions(response.data || response || []);
      return { success: true, data: response.data || response };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch subscriptions';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubscription = useCallback(async (subscriptionData) => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.createAdminSubscription(subscriptionData);
      const newSubscription = response.data || response;
      setSubscriptions(prev => [...prev, newSubscription]);
      return { success: true, data: newSubscription };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create subscription';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSubscription = useCallback(async (id, subscriptionData) => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.updateAdminSubscription(id, subscriptionData);
      const updatedSubscription = response.data || response;
      setSubscriptions(prev => prev.map(sub => 
        sub._id === id ? updatedSubscription : sub
      ));
      return { success: true, data: updatedSubscription };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update subscription';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteSubscription = useCallback(async (id) => {
    try {
      setLoading(true);
      await adminSubscriptionService.deleteAdminSubscription(id);
      setSubscriptions(prev => prev.filter(sub => sub._id !== id));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete subscription';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const pauseSubscription = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.pauseAdminSubscription(id);
      const updatedSubscription = response.data || response;
      setSubscriptions(prev => prev.map(sub => 
        sub._id === id ? updatedSubscription : sub
      ));
      return { success: true, data: updatedSubscription };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to pause subscription';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const resumeSubscription = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.resumeAdminSubscription(id);
      const updatedSubscription = response.data || response;
      setSubscriptions(prev => prev.map(sub => 
        sub._id === id ? updatedSubscription : sub
      ));
      return { success: true, data: updatedSubscription };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to resume subscription';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelSubscription = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.cancelAdminSubscription(id);
      const updatedSubscription = response.data || response;
      setSubscriptions(prev => prev.map(sub => 
        sub._id === id ? updatedSubscription : sub
      ));
      return { success: true, data: updatedSubscription };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel subscription';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUpdateSubscriptions = useCallback(async (ids, updateData) => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.bulkUpdateAdminSubscriptions(ids, updateData);
      const result = response.data || response;
      setSubscriptions(prev => prev.map(sub => 
        ids.includes(sub._id) ? { ...sub, ...updateData } : sub
      ));
      return { success: true, data: result };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to bulk update subscriptions';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDeleteSubscriptions = useCallback(async (ids) => {
    try {
      setLoading(true);
      await adminSubscriptionService.bulkDeleteAdminSubscriptions(ids);
      setSubscriptions(prev => prev.filter(sub => !ids.includes(sub._id)));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to bulk delete subscriptions';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.getAdminAnalytics();
      const analyticsData = response.data || response;
      setAnalytics(analyticsData);
      return { success: true, data: analyticsData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch analytics';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatistics = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await adminSubscriptionService.getAdminStatistics(params);
      const statisticsData = response.data || response;
      setStatistics(statisticsData);
      return { success: true, data: statisticsData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch statistics';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const exportSubscriptions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const blob = await adminSubscriptionService.exportAdminSubscriptions(params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to export subscriptions';
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subscriptions,
    loading,
    error,
    analytics,
    statistics,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    bulkUpdateSubscriptions,
    bulkDeleteSubscriptions,
    fetchAnalytics,
    fetchStatistics,
    exportSubscriptions
  };
};