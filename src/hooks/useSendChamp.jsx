// src/hooks/useSendchampSMS.js
import { useState, useCallback } from 'react';
import { smsAPI } from '../services/api';

export const useSendchampSMS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendSMS = useCallback(async (type, message, customPhone = null) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await smsAPI.sendSMS({
        type,
        message,
        customPhone
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendVerificationCode = useCallback(async (phoneNumber, code) => {
    return sendSMS('verification', `Your verification code: ${code}`, phoneNumber);
  }, [sendSMS]);

  const sendOrderUpdate = useCallback(async (orderId, status, type = 'order_update') => {
    const messages = {
      order_update: `Your order #${orderId} has been updated to: ${status}`,
      order_confirmation: `Order #${orderId} confirmed! We're processing it now.`,
      order_delivery: `Your order #${orderId} is out for delivery!`
    };
    
    const message = messages[type] || `Order #${orderId} update: ${status}`;
    return sendSMS(type, message);
  }, [sendSMS]);

  const checkBalance = useCallback(async () => {
    setLoading(true);
    try {
      const response = await smsAPI.getBalance();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendSMS,
    sendVerificationCode,
    sendOrderUpdate,
    checkBalance,
    loading,
    error,
    clearError
  };
};