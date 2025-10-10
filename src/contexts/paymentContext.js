import React, { createContext, useState, useContext, useCallback } from 'react';
import PaymentService from '../services/paymentService';

const PaymentContext = createContext();

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [subscription, setSubscription] = useState(null);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // ==================== SUBSCRIPTION PAYMENT ====================

  const initializeSubscription = useCallback(async (paymentData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.initializeSubscription(paymentData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifySubscription = useCallback(async (reference) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.verifySubscription(reference);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubscriptionDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.getSubscriptionDetails();
      setSubscription(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== WALLET OPERATIONS ====================

  const initiateTopup = useCallback(async (amount) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.initiateTopup(amount);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyTopup = useCallback(async (reference) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.verifyTopup(reference);
      if (result.success) {
        setWalletBalance(result.walletBalance);
      }
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWalletBalance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.getWalletBalance();
      setWalletBalance(result.balance);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPaymentHistory = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.getPaymentHistory(page, limit);
      setTransactions(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ORDER PAYMENT ====================

  const payOrderWithWallet = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.payWithWallet(orderId);
      // Update wallet balance after payment
      await fetchWalletBalance();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchWalletBalance]);

  const initializeOrderPayment = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.initializeOrderPayment(orderId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOrderPayment = useCallback(async (reference) => {
    setLoading(true);
    setError(null);
    try {
      const result = await PaymentService.verifyOrderPayment(reference);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Redirect to Paystack
  const redirectToPaystack = useCallback((authorizationUrl) => {
    PaymentService.redirectToPaystack(authorizationUrl);
  }, []);

  const value = {
    // State
    loading,
    error,
    walletBalance,
    transactions,
    subscription,
    
    // Actions
    clearError,
    
    // Subscription
    initializeSubscription,
    verifySubscription,
    fetchSubscriptionDetails,
    
    // Wallet
    initiateTopup,
    verifyTopup,
    fetchWalletBalance,
    fetchPaymentHistory,
    
    // Order Payment
    payOrderWithWallet,
    initializeOrderPayment,
    verifyOrderPayment,
    
    // Utilities
    redirectToPaystack,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};