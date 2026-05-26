// import React, { useEffect, useState } from 'react';
// import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
// import { usePayment } from '../../contexts/paymentContext';
// import './payment.css';

// const PaymentCallback = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const { type } = useParams();
  
//   const { 
//     verifySubscription, 
//     verifyTopup, 
//     verifyOrderPayment,
//     loading, 
//     error 
//   } = usePayment();
  
//   const [status, setStatus] = useState('verifying');
//   const [message, setMessage] = useState('Verifying your payment...');

//   useEffect(() => {
//     const verifyPayment = async () => {
//       const reference = searchParams.get('reference');
//       const trxref = searchParams.get('trxref');

//       const paymentReference = reference || trxref;

//       if (!paymentReference) {
//         setStatus('error');
//         setMessage('No payment reference found');
//         return;
//       }

//       try {
//         let result;

//         switch (type) {
//           case 'subscription':
//             result = await verifySubscription(paymentReference);
//             break;
//           case 'topup':
//             result = await verifyTopup(paymentReference);
//             break;
//           case 'order':
//             result = await verifyOrderPayment(paymentReference);
//             break;
//           default:
//             throw new Error('Unknown payment type');
//         }

//         if (result.success) {
//           setStatus('success');
//           setMessage('Payment completed successfully!');
//         } else {
//           setStatus('error');
//           setMessage('Payment verification failed');
//         }
//       } catch (err) {
//         setStatus('error');
//         setMessage(err.message || 'Payment verification failed');
//       }
//     };

//     verifyPayment();
//   }, [type, searchParams, verifySubscription, verifyTopup, verifyOrderPayment]);

//   const handleRedirect = () => {
//     switch (type) {
//       case 'subscription':
//         navigate('/subscription');
//         break;
//       case 'topup':
//         navigate('/wallet');
//         break;
//       case 'order':
//         navigate('/orders');
//         break;
//       default:
//         navigate('/dashboard');
//     }
//   };

//   return (
//     <div className="payment-container">
//       <div className="payment-card">
//         <div className={`payment-status ${status}`}>
//           {status === 'verifying' && (
//             <>
//               <div className="spinner"></div>
//               <h2>Verifying Payment</h2>
//               <p>{message}</p>
//             </>
//           )}
          
//           {status === 'success' && (
//             <>
//               <div className="status-icon success">✓</div>
//               <h2>Payment Successful!</h2>
//               <p>{message}</p>
//               <button onClick={handleRedirect} className="btn btn-primary">
//                 Continue
//               </button>
//             </>
//           )}
          
//           {status === 'error' && (
//             <>
//               <div className="status-icon error">✕</div>
//               <h2>Payment Failed</h2>
//               <p>{message}</p>
//               <button onClick={handleRedirect} className="btn btn-primary">
//                 Try Again
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentCallback;






















// src/pages/paymentCallback.js
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import ApiService from '../../api/apiService';
import { useAuth } from '../../contexts/AuthContext';
import { successToast, errorToast, infoToast } from "../../utils/toast";
import './payment.css';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { type } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference') || searchParams.get('trxref');

      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found');
        return;
      }

      if (!isAuthenticated) {
        setStatus('error');
        setMessage('Please log in to verify payment');
        setTimeout(() => navigate('/login'), 3000);
        return;
      }

      infoToast("Verifying payment...");

      try {
        let result;

        switch (type) {
          case 'subscription':
            result = await ApiService.subscriptions.verifyPayment(reference);
            break;
          case 'topup':
            result = await ApiService.payments.verifyTopup(reference);
            break;
          case 'order':
            result = await ApiService.orders.verifyPayment(reference);
            break;
          default:
            throw new Error('Unknown payment type');
        }

        if (result?.success) {
          setStatus('success');
          setMessage('Payment completed successfully!');
          successToast('Payment verified successfully!');
          setTimeout(() => {
            switch (type) {
              case 'subscription': navigate('/dashboard/subscriptions'); break;
              case 'topup': navigate('/dashboard/payments'); break;
              case 'order': navigate('/dashboard/orders'); break;
              default: navigate('/dashboard');
            }
          }, 3000);
        } else {
          setStatus('error');
          setMessage(result?.message || 'Payment verification failed');
          errorToast(result?.message || 'Payment verification failed');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Payment verification failed');
        errorToast(err.message);
      }
    };

    verifyPayment();
  }, [type, searchParams, isAuthenticated, navigate]);

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className={`payment-status ${status}`}>
          {status === 'verifying' && (<><div className="spinner"></div><h2>Verifying Payment</h2><p>{message}</p></>)}
          {status === 'success' && (<><div className="status-icon success">✓</div><h2>Payment Successful!</h2><p>{message}</p></>)}
          {status === 'error' && (<><div className="status-icon error">✕</div><h2>Payment Failed</h2><p>{message}</p><button onClick={() => navigate('/dashboard')} className="btn btn-primary">Try Again</button></>)}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;