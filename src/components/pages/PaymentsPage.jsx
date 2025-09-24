// components/pages/PaymentsPage.js
import React, { useState, useEffect } from 'react';
import { formatDate, getStatusClass } from '../../utils/helpers';
import '../../styles/PaymentsPage.css';

const PaymentsPage = ({ user, setUser }) => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch transactions from backend API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/transactions?page=${currentPage}&limit=10`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTransactions(data.transactions);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transaction history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentPage, user.id]);

  // Calculate stats from transactions
  const totalSpent = transactions
    .filter(tx => tx.type === 'debit')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const pendingPayments = transactions
    .filter(tx => tx.status === 'pending')
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setShowPaymentMethods(true);
  };

  const handleCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      setSelectedAmount(amount);
      setShowPaymentMethods(true);
    } else {
      alert('Please enter a valid amount');
    }
  };

  const handlePayment = async () => {
    if (window.confirm(`Confirm payment of ₦${selectedAmount.toLocaleString()} via ${paymentMethod}?`)) {
      try {
        const response = await fetch('/api/payments/topup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            amount: selectedAmount,
            paymentMethod: paymentMethod
          }),
        });

        if (!response.ok) {
          throw new Error(`Payment failed with status: ${response.status}`);
        }

        const paymentData = await response.json();
        
        // Update user wallet balance
        const updatedUser = { ...user };
        updatedUser.walletBalance = paymentData.newBalance;
        
        // Add transaction to local state
        setTransactions(prev => [paymentData.transaction, ...prev]);
        
        setUser(updatedUser);
        alert('Payment successful! Your wallet has been topped up.');
        
        // Reset form
        setSelectedAmount(0);
        setCustomAmount('');
        setShowPaymentMethods(false);
      } catch (error) {
        console.error('Payment error:', error);
        alert('Failed to process payment. Please try again.');
      }
    }
  };

  const showReceipt = async (txId) => {
    try {
      const response = await fetch(`/api/transactions/${txId}/receipt`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch receipt: ${response.status}`);
      }
      
      // Assuming the API returns a PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `receipt-${txId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const handleRefreshBalance = async () => {
    try {
      const response = await fetch(`/api/users/${user.id}/wallet`);
      
      if (!response.ok) {
        throw new Error(`Failed to refresh balance: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update user wallet balance
      const updatedUser = { ...user };
      updatedUser.walletBalance = data.balance;
      setUser(updatedUser);
      
      alert('Wallet balance refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing balance:', error);
      alert('Failed to refresh wallet balance. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="payments-page">
        <div className="payments-container">
          <div className="loading-spinner">Loading transaction history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payments-page">
        <div className="payments-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <div className="payments-container">
        <h2 className="text-xl font-bold mb-6">Payments</h2>
        
        <div className="stats-grid">
          <div className="stat-card wallet-stat">
            <h3 className="font-medium mb-2">Wallet Balance</h3>
            <p className="stat-value">₦{user.walletBalance.toLocaleString()}</p>
            <button className="stat-action" onClick={handleRefreshBalance}>
              <i className="fas fa-sync-alt mr-1"></i> Refresh
            </button>
          </div>
          
          <div className="stat-card spent-stat">
            <h3 className="font-medium mb-2">Total Spent</h3>
            <p className="stat-value">₦{totalSpent.toLocaleString()}</p>
            <p className="text-sm mt-1">Last 12 months</p>
          </div>
          
          <div className="stat-card pending-stat">
            <h3 className="font-medium mb-2">Pending Payments</h3>
            <p className="stat-value">₦{pendingPayments.toLocaleString()}</p>
            <button className="stat-action">
              View Details
            </button>
          </div>
        </div>
        
        <div className="topup-section">
          <h3 className="font-semibold mb-3">Top Up Wallet</h3>
          <div className="amount-buttons">
            <button 
              className={`amount-button ${selectedAmount === 5000 ? 'selected' : ''}`}
              onClick={() => handleAmountSelect(5000)}
            >
              ₦5,000
            </button>
            <button 
              className={`amount-button ${selectedAmount === 10000 ? 'selected' : ''}`}
              onClick={() => handleAmountSelect(10000)}
            >
              ₦10,000
            </button>
            <button 
              className={`amount-button ${selectedAmount === 20000 ? 'selected' : ''}`}
              onClick={() => handleAmountSelect(20000)}
            >
              ₦20,000
            </button>
            <button 
              className={`amount-button ${selectedAmount === 50000 ? 'selected' : ''}`}
              onClick={() => handleAmountSelect(50000)}
            >
              ₦50,000
            </button>
            <div className="custom-amount-container">
              <span className="mr-2">or</span>
              <input 
                type="number" 
                placeholder="Custom amount" 
                className="custom-amount-input"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
              <button 
                className="add-amount-button" 
                onClick={handleCustomAmount}
              >
                Add
              </button>
            </div>
          </div>
          
          {showPaymentMethods && (
            <div className="payment-methods">
              <h4 className="font-medium mb-2">Payment Method</h4>
              <div className="methods-grid">
                <div 
                  className={`method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <i className="method-icon fas fa-credit-card text-blue-600"></i>
                  <span>Credit/Debit Card</span>
                </div>
                <div 
                  className={`method-card ${paymentMethod === 'transfer' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('transfer')}
                >
                  <i className="method-icon fas fa-university text-green-600"></i>
                  <span>Bank Transfer</span>
                </div>
                <div 
                  className={`method-card ${paymentMethod === 'ussd' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('ussd')}
                >
                  <i className="method-icon fas fa-mobile-alt text-purple-600"></i>
                  <span>USSD</span>
                </div>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="card-details">
                  <div className="space-y-3">
                    <div>
                      <label className="form-label">Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="form-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">Expiry Date</label>
                        <input type="text" placeholder="MM/YY" className="form-input" />
                      </div>
                      <div>
                        <label className="form-label">CVV</label>
                        <input type="text" placeholder="123" className="form-input" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <button 
                className="confirm-payment" 
                onClick={handlePayment}
              >
                Pay ₦{selectedAmount.toLocaleString()}
              </button>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td>{formatDate(transaction.date)}</td>
                      <td>{transaction.id}</td>
                      <td>{transaction.description}</td>
                      <td className={transaction.type === 'credit' ? 'credit-amount' : 'debit-amount'}>
                        {transaction.type === 'credit' ? '+' : '-'}₦{Math.abs(transaction.amount).toLocaleString()}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(transaction.status)}`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="action-link" 
                          onClick={() => showReceipt(transaction.id)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-transactions">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {transactions.length > 0 && (
            <div className="transactions-footer">
              <div className="orders-count">
                Showing {transactions.length} of {totalPages * 10} transactions
              </div>
              <div className="pagination">
                <button 
                  className="page-button" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button 
                      key={pageNum}
                      className={`page-button ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && <span className="page-ellipsis">...</span>}
                
                <button 
                  className="page-button" 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;