// src/components/PaymentSuccess.js
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction, message } = location.state || {};

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">🎉</div>
        <h1>Payment Successful!</h1>
        <p>{message || 'Thank you for your purchase!'}</p>
        
        {transaction && (
          <div className="transaction-details">
            <h3>Transaction Details</h3>
            <p><strong>Reference:</strong> {transaction.reference}</p>
            <p><strong>Amount:</strong> ₦{(transaction.amount || 0).toLocaleString()}</p>
            <p><strong>Date:</strong> {new Date(transaction.transactionDate).toLocaleString()}</p>
            <p><strong>Status:</strong> <span className="status-success">Completed</span></p>
          </div>
        )}

        <div className="success-actions">
          <Link to="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
          <button 
            onClick={() => navigate('/subscription')}
            className="btn-secondary"
          >
            Buy Another Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;