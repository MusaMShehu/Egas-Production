import React, { useState, useEffect } from 'react';
import { usePayment } from '../../contexts/paymentContext';
import './payment.css';

const WalletTopup = ({ onSuccess, onCancel }) => {
  const {
    initiateTopup,
    verifyTopup,
    fetchWalletBalance,
    walletBalance,
    loading,
    error,
    clearError,
    redirectToPaystack
  } = usePayment();

  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [reference, setReference] = useState('');
  const [quickAmounts] = useState([500, 1000, 2000, 5000, 10000]);

  useEffect(() => {
    fetchWalletBalance();
  }, [fetchWalletBalance]);

  const handleQuickSelect = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    const topupAmount = parseFloat(amount);
    if (!topupAmount || topupAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await initiateTopup(topupAmount);
      
      if (result.success) {
        setReference(result.reference);
        redirectToPaystack(result.authorization_url);
      }
    } catch (err) {
      console.error('Topup initialization failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!reference) return;

    try {
      const result = await verifyTopup(reference);
      if (result.success) {
        await fetchWalletBalance();
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (err) {
      console.error('Topup verification failed:', err);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h2>Top Up Wallet</h2>
        
        <div className="wallet-balance">
          <h3>Current Balance</h3>
          <div className="balance-amount">₦{walletBalance.toLocaleString()}</div>
        </div>

        <form onSubmit={handleSubmit} className="payment-form">
          <div className="form-group">
            <label htmlFor="amount">Amount to Top Up (₦)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
              step="100"
              required
              disabled={isProcessing || loading}
              placeholder="Enter amount"
            />
          </div>

          <div className="quick-amounts">
            <p>Quick Select:</p>
            <div className="amount-buttons">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  className={`amount-btn ${amount === quickAmount.toString() ? 'active' : ''}`}
                  onClick={() => handleQuickSelect(quickAmount)}
                >
                  ₦{quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
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
              disabled={isProcessing || loading || !amount}
            >
              {isProcessing || loading ? 'Processing...' : `Top Up ₦${amount || 0}`}
            </button>
          </div>
        </form>

        {reference && (
          <div className="verification-section">
            <p>Topup initialized. If you weren't redirected, click below to verify:</p>
            <button
              onClick={handleVerifyPayment}
              className="btn btn-outline"
              disabled={loading}
            >
              Verify Topup
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

export default WalletTopup;