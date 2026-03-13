// import React, { createContext, useState, useContext, useCallback } from 'react';
// import PaymentService from '../services/paymentService';

// const PaymentContext = createContext();

// export const usePayment = () => {
//   const context = useContext(PaymentContext);
//   if (!context) {
//     throw new Error('usePayment must be used within a PaymentProvider');
//   }
//   return context;
// };

// export const PaymentProvider = ({ children }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [transactions, setTransactions] = useState([]);
//   const [subscription, setSubscription] = useState(null);

//   // Clear error
//   const clearError = useCallback(() => setError(null), []);

//   // ==================== SUBSCRIPTION PAYMENT ====================

//   const initializeSubscription = useCallback(async (paymentData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.initializeSubscription(paymentData);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const verifySubscription = useCallback(async (reference) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.verifySubscription(reference);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchSubscriptionDetails = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.getSubscriptionDetails();
//       setSubscription(result.data);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ==================== WALLET OPERATIONS ====================

//   const initiateTopup = useCallback(async (amount) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.initiateTopup(amount);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const verifyTopup = useCallback(async (reference) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.verifyTopup(reference);
//       if (result.success) {
//         setWalletBalance(result.walletBalance);
//       }
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchWalletBalance = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.getWalletBalance();
//       setWalletBalance(result.balance);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const fetchPaymentHistory = useCallback(async (page = 1, limit = 10) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.getPaymentHistory(page, limit);
//       setTransactions(result.data);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // ==================== ORDER PAYMENT ====================

//   const payOrderWithWallet = useCallback(async (orderId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.payWithWallet(orderId);
//       // Update wallet balance after payment
//       await fetchWalletBalance();
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, [fetchWalletBalance]);

//   const initializeOrderPayment = useCallback(async (orderId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.initializeOrderPayment(orderId);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const verifyOrderPayment = useCallback(async (reference) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await PaymentService.verifyOrderPayment(reference);
//       return result;
//     } catch (err) {
//       setError(err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Redirect to Paystack
//   const redirectToPaystack = useCallback((authorizationUrl) => {
//     PaymentService.redirectToPaystack(authorizationUrl);
//   }, []);

//   const value = {
//     // State
//     loading,
//     error,
//     walletBalance,
//     transactions,
//     subscription,
    
//     // Actions
//     clearError,
    
//     // Subscription
//     initializeSubscription,
//     verifySubscription,
//     fetchSubscriptionDetails,
    
//     // Wallet
//     initiateTopup,
//     verifyTopup,
//     fetchWalletBalance,
//     fetchPaymentHistory,
    
//     // Order Payment
//     payOrderWithWallet,
//     initializeOrderPayment,
//     verifyOrderPayment,
    
//     // Utilities
//     redirectToPaystack,
//   };

//   return (
//     <PaymentContext.Provider value={value}>
//       {children}
//     </PaymentContext.Provider>
//   );
// };




import React, { createContext, useContext, useState, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const PaymentContext = createContext(null);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within PaymentProvider');
  }
  return context;
};

export const PaymentProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const { isAuthenticated } = useAuth();

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const response = await apiClient.get('/payments/wallet/balance');
      setWalletBalance(response.data.balance);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      throw error;
    }
  }, [isAuthenticated]);

  // Fetch transaction history
  const fetchTransactions = useCallback(async (page = 1, limit = 10) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await apiClient.get('/payments/history', {
        params: { page, limit }
      });
      
      setTransactions(response.data.data);
      setPagination(response.data.pagination);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      toast.error('Failed to load transaction history');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Initialize wallet top-up
  const initiateTopup = useCallback(async (amount) => {
    if (!isAuthenticated) {
      toast.error('Please log in to top up your wallet');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/payments/wallet/topup', { amount });
      
      if (response.authorization_url) {
        // Redirect to Paystack
        window.location.href = response.authorization_url;
      }
      
      return response;
    } catch (error) {
      toast.error(error.message || 'Failed to initiate top-up');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Verify top-up (called from callback page)
  const verifyTopup = useCallback(async (reference) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/payments/wallet/verify`, {
        params: { reference }
      });
      
      if (response.success) {
        await fetchWalletBalance();
        toast.success('Wallet top-up successful!');
      }
      
      return response;
    } catch (error) {
      toast.error(error.message || 'Payment verification failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchWalletBalance]);

  // Pay with wallet
  const payWithWallet = useCallback(async (orderId, amount) => {
    if (!isAuthenticated) {
      toast.error('Please log in to complete payment');
      return;
    }

    if (walletBalance < amount) {
      toast.error('Insufficient wallet balance');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/payments/wallet/pay', {
        orderId,
        amount
      });
      
      // Update balance after payment
      await fetchWalletBalance();
      
      toast.success('Payment successful!');
      return response;
    } catch (error) {
      toast.error(error.message || 'Payment failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, walletBalance, fetchWalletBalance]);

  // Initialize Paystack payment
  const initializePayment = useCallback(async (data) => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/payments/initialize', data);
      
      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
      
      return response;
    } catch (error) {
      toast.error(error.message || 'Payment initialization failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const value = {
    loading,
    walletBalance,
    transactions,
    pagination,
    fetchWalletBalance,
    fetchTransactions,
    initiateTopup,
    verifyTopup,
    payWithWallet,
    initializePayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};