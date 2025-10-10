import React, { useState, useEffect } from 'react';
import { usePayment } from '../../contexts/paymentContext';
import './payment.css';

const SubscriptionPayment = ({ plan, onSuccess, onCancel }) => {
  const { 
    initializeSubscription, 
    verifySubscription, 
    loading, 
    error, 
    clearError,
    redirectToPaystack 
  } = usePayment();
  
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reference, setReference] = useState('');

  useEffect(() => {
    // Get user email from auth context or localStorage
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setIsProcessing(true);

    try {
      const paymentData = {
        amount: plan.price,
        email: email,
        planId: plan.id,
        planName: plan.name,
        frequency: plan.frequency,
        size: plan.size,
        price: plan.price
      };

      const result = await initializeSubscription(paymentData);
      
      if (result.success) {
        setReference(result.reference);
        // Redirect to Paystack
        redirectToPaystack(result.authorization_url);
      }
    } catch (err) {
      console.error('Subscription initialization failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!reference) return;

    try {
      const result = await verifySubscription(reference);
      if (result.success && onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Subscribe to {plan.name}</h2>
        <p className="plan-description">{plan.description}</p>
        
        <div className="plan-details">
          <div className="price">₦{plan.price}</div>
          <div className="frequency">{plan.frequency}</div>
          {plan.features && (
            <ul className="features-list">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isProcessing || loading}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="payment-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={isProcessing || loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isProcessing || loading}
            >
              {isProcessing || loading ? 'Processing...' : `Pay ₦${plan.price}`}
            </button>
          </div>
        </form>

        {reference && (
          <div className="verification-section">
            <p>Payment initialized. If you weren't redirected, click below to verify:</p>
            <button
              onClick={handleVerifyPayment}
              className="btn btn-outline"
              disabled={loading}
            >
              Verify Payment
            </button>
          </div>
        )}

        <div className="payment-security">
          <p>🔒 Secure payment powered by Paystack</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPayment;