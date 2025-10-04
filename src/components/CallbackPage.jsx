// src/components/CallbackPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CallbackPage = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your payment...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get reference from URL query parameters
        const urlParams = new URLSearchParams(location.search);
        const reference = urlParams.get('reference');
        const trxref = urlParams.get('trxref');

        if (!reference && !trxref) {
          setStatus('error');
          setMessage('No payment reference found in URL');
          return;
        }

        const paymentReference = reference || trxref;

        // Get user from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          setStatus('error');
          setMessage('Please log in to verify payment');
          return;
        }

        const user = JSON.parse(userData);

        // Verify payment with backend
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/payments/verify/${paymentReference}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`
            }
          }
        );

        if (response.data.success) {
          setStatus('success');
          setMessage('Payment verified successfully!');

          // Redirect to success page after 3 seconds
          setTimeout(() => {
            navigate('/payment-success', { 
              state: { 
                transaction: response.data.data,
                message: 'Your payment was successful!'
              }
            });
          }, 3000);

        } else {
          setStatus('error');
          setMessage('Payment verification failed. Please contact support.');
        }

      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message || 
          'Payment verification failed. Please contact support.'
        );
      }
    };

    verifyPayment();
  }, [location, navigate]);

  return (
    <div className="callback-container">
      <div className="callback-card">
        <div className={`status-icon ${status}`}>
          {status === 'processing' && '⏳'}
          {status === 'success' && '✅'}
          {status === 'error' && '❌'}
        </div>
        
        <h2>
          {status === 'processing' && 'Processing Payment...'}
          {status === 'success' && 'Payment Successful!'}
          {status === 'error' && 'Payment Failed'}
        </h2>
        
        <p>{message}</p>
        
        {status === 'processing' && (
          <div className="loading-spinner">Loading...</div>
        )}
        
        {status === 'error' && (
          <button 
            className="retry-btn"
            onClick={() => navigate('/subscription')}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;