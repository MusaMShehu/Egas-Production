// components/Payments.js
import React, { useState, useEffect } from 'react';
import './UserPayment.css';

const Payments = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(5000);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = 'https://your-api-url.com/api';

  // Fetch payment data from API
  useEffect(() => {
    const fetchPaymentData = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would use your actual API endpoints
        // const [paymentsRes, walletRes, methodsRes] = await Promise.all([
        //   fetch(`${API_BASE_URL}/payments`, {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        //   }),
        //   fetch(`${API_BASE_URL}/wallet`, {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        //   }),
        //   fetch(`${API_BASE_URL}/payment-methods`, {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        //   })
        // ]);
        
        // For demonstration, we'll use a timeout to simulate API calls
        setTimeout(() => {
          // Mock data that matches typical payment schema
          const mockPaymentHistory = [
            {
              _id: '1',
              transactionId: 'TX-1001',
              date: new Date('2023-05-15'),
              description: '12kg Gas Cylinder Order',
              amount: 10500,
              method: 'wallet',
              status: 'completed',
              orderId: 'EG-1001'
            },
            {
              _id: '2',
              transactionId: 'TX-1002',
              date: new Date('2023-05-10'),
              description: 'Wallet Top-up',
              amount: 15000,
              method: 'bank_transfer',
              status: 'completed',
              reference: 'REF-123456'
            },
            {
              _id: '3',
              transactionId: 'TX-1003',
              date: new Date('2023-05-05'),
              description: 'Monthly Subscription',
              amount: 10500,
              method: 'auto_debit',
              status: 'completed',
              subscriptionId: 'SUB-001'
            }
          ];

          const mockWalletBalance = 15250;
          const mockPaymentMethods = [
            { id: 'card', name: 'Credit/Debit Card', type: 'card' },
            { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank' },
            { id: 'ussd', name: 'USSD', type: 'ussd' },
            { id: 'wallet', name: 'Wallet', type: 'wallet' }
          ];

          setPaymentHistory(mockPaymentHistory);
          setWalletBalance(mockWalletBalance);
          setPaymentMethods(mockPaymentMethods);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching payment data:', error);
        setError('Failed to load payment information. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const handleTopUp = async () => {
    setIsProcessing(true);
    try {
      // In a real app, this would initiate a payment with your payment gateway
      // const response = await fetch(`${API_BASE_URL}/wallet/topup`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     amount: topUpAmount,
      //     method: paymentMethod
      //   })
      // });
      
      // const result = await response.json();
      
      // For demo purposes, simulate payment processing
      setTimeout(() => {
        // Simulate successful payment
        const newTransaction = {
          _id: `tx-${Math.floor(Math.random() * 10000)}`,
          transactionId: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date(),
          description: 'Wallet Top-up',
          amount: topUpAmount,
          method: paymentMethod,
          status: 'completed',
          reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`
        };

        setWalletBalance(prev => prev + topUpAmount);
        setPaymentHistory(prev => [newTransaction, ...prev]);
        setShowTopUpModal(false);
        setTopUpAmount(5000);
        setIsProcessing(false);
        
        alert(`Successfully topped up ¥${topUpAmount.toLocaleString()}`);
      }, 2000);
      
      // In a real implementation, you would:
      // 1. For card payments: redirect to payment gateway or show embedded form
      // 2. For bank transfer: show bank details and wait for confirmation
      // 3. For USSD: show USSD code instructions
      
    } catch (error) {
      console.error('Error processing top-up:', error);
      setError('Failed to process top-up. Please try again.');
      setIsProcessing(false);
    }
  };

  const initiatePaymentGateway = (method) => {
    // This function would handle the redirection to external payment gateways
    // or show embedded payment forms
    
    switch(method) {
      case 'card':
        // For card payments, you might:
        // 1. Show an embedded card form (Stripe, PayPal, etc.)
        // 2. Or redirect to payment gateway
        console.log('Initiating card payment...');
        // window.location.href = `${API_BASE_URL}/payments/card?amount=${topUpAmount}`;
        break;
        
      case 'bank_transfer':
        // Show bank transfer details
        console.log('Showing bank transfer details...');
        break;
        
      case 'ussd':
        // Show USSD code instructions
        console.log('Showing USSD instructions...');
        break;
        
      default:
        console.log('Payment method not supported');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString()}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return 'status-pending';
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'ussd': return 'USSD';
      case 'wallet': return 'Wallet';
      case 'auto_debit': return 'Auto-Debit';
      default: return method;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'failed': return 'Failed';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  };

  // Calculate monthly spending
  const currentMonthSpending = paymentHistory
    .filter(payment => {
      const paymentDate = new Date(payment.date);
      const now = new Date();
      return payment.status === 'completed' && 
             paymentDate.getMonth() === now.getMonth() && 
             paymentDate.getFullYear() === now.getFullYear();
    })
    .reduce((total, payment) => total + payment.amount, 0);

  if (isLoading) {
    return <div className="payments-page loading">Loading payment information...</div>;
  }

  return (
    <div className="payments-page">
      <div className="dashboard-header">
        <h1>Payment Management</h1>
        <div className="header-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search transactions..." />
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowTopUpModal(true)}
            disabled={isProcessing}
          >
            <i className="fas fa-plus"></i> Top Up Wallet
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="stats-container">
        <div className="stat-card">
          <h3>Wallet Balance</h3>
          <div className="value">{formatCurrency(walletBalance)}</div>
          <span className="wallet-status">Active</span>
        </div>
        <div className="stat-card">
          <h3>This Month's Spending</h3>
          <div className="value">{formatCurrency(currentMonthSpending)}</div>
          <span className="spending-status">
            {currentMonthSpending > 50000 ? 'Over budget' : 'Within budget'}
          </span>
        </div>
        <div className="stat-card">
          <h3>Payment Methods</h3>
          <div className="value">{paymentMethods.length}</div>
          <span className="methods-status">Active</span>
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>Payment History</h2>
          <span className="count-badge">{paymentHistory.length}</span>
        </div>
        
        {paymentHistory.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.transactionId}</td>
                  <td>{formatDate(payment.date)}</td>
                  <td>{payment.description}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{getMethodName(payment.method)}</td>
                  <td className={getStatusClass(payment.status)}>
                    {getStatusText(payment.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-payments">
            <p>No payment history found.</p>
          </div>
        )}
      </div>

      {showTopUpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Top Up Wallet</h2>
              <button 
                className="close-btn" 
                onClick={() => !isProcessing && setShowTopUpModal(false)}
                disabled={isProcessing}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="amount">Amount (¥)</label>
                <input
                  type="number"
                  id="amount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(parseInt(e.target.value) || 0)}
                  min="1000"
                  step="500"
                  disabled={isProcessing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="method">Payment Method</label>
                <select 
                  id="method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  disabled={isProcessing}
                >
                  {paymentMethods.map(method => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {isProcessing && (
                <div className="processing-overlay">
                  <div className="processing-spinner"></div>
                  <p>Processing your payment...</p>
                  <p className="processing-note">
                    Do not refresh or close this window while processing
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowTopUpModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-primary" 
                onClick={handleTopUp}
                disabled={isProcessing || topUpAmount < 1000}
              >
                {isProcessing ? 'Processing...' : 'Confirm Top-up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;