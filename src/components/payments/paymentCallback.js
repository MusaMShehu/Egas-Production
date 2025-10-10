import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { usePayment } from '../../contexts/paymentContext';
import './payment.css';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { type } = useParams();
  
  const { 
    verifySubscription, 
    verifyTopup, 
    verifyOrderPayment,
    loading, 
    error 
  } = usePayment();
  
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const trxref = searchParams.get('trxref');

      const paymentReference = reference || trxref;

      if (!paymentReference) {
        setStatus('error');
        setMessage('No payment reference found');
        return;
      }

      try {
        let result;

        switch (type) {
          case 'subscription':
            result = await verifySubscription(paymentReference);
            break;
          case 'topup':
            result = await verifyTopup(paymentReference);
            break;
          case 'order':
            result = await verifyOrderPayment(paymentReference);
            break;
          default:
            throw new Error('Unknown payment type');
        }

        if (result.success) {
          setStatus('success');
          setMessage('Payment completed successfully!');
        } else {
          setStatus('error');
          setMessage('Payment verification failed');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Payment verification failed');
      }
    };

    verifyPayment();
  }, [type, searchParams, verifySubscription, verifyTopup, verifyOrderPayment]);

  const handleRedirect = () => {
    switch (type) {
      case 'subscription':
        navigate('/subscription');
        break;
      case 'topup':
        navigate('/wallet');
        break;
      case 'order':
        navigate('/orders');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <div className={`payment-status ${status}`}>
          {status === 'verifying' && (
            <>
              <div className="spinner"></div>
              <h2>Verifying Payment</h2>
              <p>{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="status-icon success">✓</div>
              <h2>Payment Successful!</h2>
              <p>{message}</p>
              <button onClick={handleRedirect} className="btn btn-primary">
                Continue
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="status-icon error">✕</div>
              <h2>Payment Failed</h2>
              <p>{message}</p>
              <button onClick={handleRedirect} className="btn btn-primary">
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;