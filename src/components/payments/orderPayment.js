// import React, { useState } from 'react';
// import { usePayment } from '../../contexts/paymentContext';
// import './payment.css';

// const OrderPayment = ({ order, onSuccess, onCancel }) => {
//   const {
//     payOrderWithWallet,
//     initializeOrderPayment,
//     verifyOrderPayment,
//     walletBalance,
//     loading,
//     error,
//     clearError,
//     redirectToPaystack
//   } = usePayment();

//   const [paymentMethod, setPaymentMethod] = useState('wallet');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [reference, setReference] = useState('');

//   const handlePaymentMethodChange = (method) => {
//     setPaymentMethod(method);
//     clearError();
//   };

//   const handleWalletPayment = async () => {
//     if (!order) return;

//     setIsProcessing(true);
//     clearError();

//     try {
//       const result = await payOrderWithWallet(order._id);
//       if (result.success && onSuccess) {
//         onSuccess(result);
//       }
//     } catch (err) {
//       console.error('Wallet payment failed:', err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handlePaystackPayment = async () => {
//     if (!order) return;

//     setIsProcessing(true);
//     clearError();

//     try {
//       const result = await initializeOrderPayment(order._id);
//       if (result.success) {
//         setReference(result.reference);
//         redirectToPaystack(result.authorization_url);
//       }
//     } catch (err) {
//       console.error('Paystack payment initialization failed:', err);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleVerifyPayment = async () => {
//     if (!reference) return;

//     try {
//       const result = await verifyOrderPayment(reference);
//       if (result.success && onSuccess) {
//         onSuccess(result);
//       }
//     } catch (err) {
//       console.error('Payment verification failed:', err);
//     }
//   };

//   const canPayWithWallet = walletBalance >= order.totalAmount;

//   return (
//     <div className="payment-container">
//       <div className="payment-card">
//         <h2>Complete Your Order</h2>
        
//         <div className="order-summary">
//           <h3>Order Summary</h3>
//           <div className="order-details">
//             <p><strong>Order ID:</strong> {order.orderNumber}</p>
//             <p><strong>Items:</strong> {order.items.length} item(s)</p>
//             <p><strong>Total Amount:</strong> ₦{order.totalAmount.toLocaleString()}</p>
//           </div>
//         </div>

//         <div className="payment-methods">
//           <h3>Select Payment Method</h3>
          
//           <div className="method-options">
//             <label className="method-option">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="wallet"
//                 checked={paymentMethod === 'wallet'}
//                 onChange={() => handlePaymentMethodChange('wallet')}
//               />
//               <div className="method-content">
//                 <span className="method-name">Wallet Balance</span>
//                 <span className="method-balance">₦{walletBalance.toLocaleString()} available</span>
//                 {!canPayWithWallet && paymentMethod === 'wallet' && (
//                   <span className="insufficient-funds">Insufficient funds</span>
//                 )}
//               </div>
//             </label>

//             <label className="method-option">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="paystack"
//                 checked={paymentMethod === 'paystack'}
//                 onChange={() => handlePaymentMethodChange('paystack')}
//               />
//               <div className="method-content">
//                 <span className="method-name">Card/Bank Transfer</span>
//                 <span className="method-description">Pay with card, bank transfer, or USSD</span>
//               </div>
//             </label>
//           </div>
//         </div>

//         {error && (
//           <div className="error-message">
//             {error}
//           </div>
//         )}

//         <div className="payment-actions">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="btn btn-secondary"
//             disabled={isProcessing || loading}
//           >
//             Cancel
//           </button>
          
//           {paymentMethod === 'wallet' ? (
//             <button
//               onClick={handleWalletPayment}
//               className="btn btn-primary"
//               disabled={isProcessing || loading || !canPayWithWallet}
//             >
//               {isProcessing || loading ? 'Processing...' : `Pay with Wallet`}
//             </button>
//           ) : (
//             <button
//               onClick={handlePaystackPayment}
//               className="btn btn-primary"
//               disabled={isProcessing || loading}
//             >
//               {isProcessing || loading ? 'Processing...' : `Pay with Card`}
//             </button>
//           )}
//         </div>

//         {reference && paymentMethod === 'paystack' && (
//           <div className="verification-section">
//             <p>Payment initialized. If you weren't redirected, click below to verify:</p>
//             <button
//               onClick={handleVerifyPayment}
//               className="btn btn-outline"
//               disabled={loading}
//             >
//               Verify Payment
//             </button>
//           </div>
//         )}

//         <div className="payment-security">
//           <p>🔒 Secure payment powered by Paystack</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderPayment;




















// src/components/orderPayment.js
import React, { useState } from 'react';
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { successToast, errorToast, infoToast } from "../../utils/toast";
import './payment.css';

const OrderPayment = ({ order, onSuccess, onCancel }) => {
  const { isAuthenticated } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);

  // Fetch wallet balance
  React.useEffect(() => {
    const fetchBalance = async () => {
      if (isAuthenticated) {
        try {
          const response = await ApiService.payments.getWalletBalance();
          if (response.success) {
            setWalletBalance(response.balance || 0);
          }
        } catch (err) {
          console.error('Failed to fetch wallet balance:', err);
        }
      }
    };
    fetchBalance();
  }, [isAuthenticated]);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setError('');
  };

  const handleWalletPayment = async () => {
    if (!order) return;

    setIsProcessing(true);
    setError('');
    infoToast("Processing wallet payment...");

    try {
      const result = await ApiService.payments.payWithWallet(order._id, order.totalAmount);
      if (result.success) {
        successToast('Payment successful!');
        if (onSuccess) onSuccess(result);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (err) {
      console.error('Wallet payment failed:', err);
      setError(err.message || 'Wallet payment failed. Please try again.');
      errorToast(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaystackPayment = async () => {
    if (!order) return;

    setIsProcessing(true);
    setError('');
    infoToast("Initializing Paystack payment...");

    try {
      const result = await ApiService.payments.initializeOrderPayment(order._id);
      if (result.success && result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        throw new Error(result.message || 'Payment initialization failed');
      }
    } catch (err) {
      console.error('Paystack payment initialization failed:', err);
      setError(err.message || 'Failed to initialize payment. Please try again.');
      errorToast(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const canPayWithWallet = walletBalance >= (order?.totalAmount || 0);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Complete Your Order</h2>
        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="order-details">
            <p><strong>Order ID:</strong> {order?.orderNumber || order?._id}</p>
            <p><strong>Items:</strong> {order?.items?.length || 0} item(s)</p>
            <p><strong>Total Amount:</strong> ₦{(order?.totalAmount || 0).toLocaleString()}</p>
          </div>
        </div>

        <div className="payment-methods">
          <h3>Select Payment Method</h3>
          
          <div className="method-options">
            <label className={`method-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" value="wallet" checked={paymentMethod === 'wallet'} onChange={() => handlePaymentMethodChange('wallet')} />
              <div className="method-content">
                <span className="method-name">Wallet Balance</span>
                <span className="method-balance">₦{walletBalance.toLocaleString()} available</span>
                {!canPayWithWallet && paymentMethod === 'wallet' && (<span className="insufficient-funds">Insufficient funds</span>)}
              </div>
            </label>

            <label className={`method-option ${paymentMethod === 'paystack' ? 'selected' : ''}`}>
              <input type="radio" name="paymentMethod" value="paystack" checked={paymentMethod === 'paystack'} onChange={() => handlePaymentMethodChange('paystack')} />
              <div className="method-content">
                <span className="method-name">Card/Bank Transfer</span>
                <span className="method-description">Pay with card, bank transfer, or USSD</span>
              </div>
            </label>
          </div>
        </div>

        {error && (<div className="error-message">{error}</div>)}

        <div className="payment-actions">
          <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isProcessing}>Cancel</button>
          
          {paymentMethod === 'wallet' ? (
            <button onClick={handleWalletPayment} className="btn btn-primary" disabled={isProcessing || !canPayWithWallet}>
              {isProcessing ? 'Processing...' : `Pay with Wallet`}
            </button>
          ) : (
            <button onClick={handlePaystackPayment} className="btn btn-primary" disabled={isProcessing}>
              {isProcessing ? 'Processing...' : `Pay with Card`}
            </button>
          )}
        </div>

        <div className="payment-security"><p>🔒 Secure payment powered by Paystack</p></div>
      </div>
    </div>
  );
};

export default OrderPayment;