import React, { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaPlus, 
  FaTimes, 
  FaExclamationCircle, 
  FaWallet, 
  FaCalendarAlt, 
  FaChartLine, 
  FaReceipt,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import "./UserPayment.css";

const Payments = () => {
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalSpending, setTotalSpending] = useState(0);
  const [monthlySpending, setMonthlySpending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(5000);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const API_BASE_URL = "https://egas-server.onrender.com/api/v1";

  const getAuthToken = () => localStorage.getItem("token");

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // Fetch payment history
  const fetchPaymentHistory = async (page = 1, limit = 10) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/payments/history?page=${page}&limit=${limit}`,
        { headers: getHeaders() }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setPaymentHistory(data.data || []);
      setPagination(data.pagination || {});

      // Calculate spending from transactions
      if (data.data) {
        let total = 0;
        let monthly = 0;
        const now = new Date();
        data.data.forEach((tx) => {
          if (tx.type === "debit" || tx.status === "success") {
            total += tx.amount;
            const txDate = new Date(tx.createdAt);
            if (
              txDate.getMonth() === now.getMonth() &&
              txDate.getFullYear() === now.getFullYear()
            ) {
              monthly += tx.amount;
            }
          }
        });
        setTotalSpending(total);
        setMonthlySpending(monthly);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setError("Failed to load payment history");
    }
  };

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/wallet/balance`, {
        headers: getHeaders(),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setWalletBalance(data.balance || 0);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setError("Failed to load wallet balance");
    }
  };

  useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchPaymentHistory(1), fetchWalletBalance()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  loadData();
}, [fetchPaymentHistory, fetchWalletBalance]); // ✅ Added missing dependencies


  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchPaymentHistory(newPage);
  };

  // Handle Paystack Top-up
  const handleTopUp = async () => {
    if (topUpAmount < 1000) {
      setError("Minimum top-up amount is ₦1,000");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/payments/wallet/topup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ amount: topUpAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Top-up failed");
      }

      const result = await response.json();

      if (result.authorization_url) {
        window.location.href = result.authorization_url;
      } else {
        throw new Error("Paystack authorization URL not received");
      }
    } catch (error) {
      console.error("Error processing top-up:", error);
      setError(error.message || "Failed to process top-up.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Filter payments client-side
  const filteredPayments = paymentHistory.filter(
    (payment) =>
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatCurrency = (amount) => `₦${amount?.toLocaleString() || "0"}`;

  if (isLoading) {
    return (
      <div className="pay-payments-page loading">
        <div className="pay-loading-spinner"></div>
        <p>Loading payment information...</p>
      </div>
    );
  }

  return (
    <div className="pay-payments-page">
      <div className="pay-dashboard-header">
        <h1>Payment Management</h1>
        <div className="pay-header-actions">
          <div className="pay-search-bar">
            <FaSearch className="pay-search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="pay-btn-primary"
            onClick={() => setShowTopUpModal(true)}
            disabled={isProcessing}
          >
            <FaPlus className="pay-btn-icon" />
            Top Up Wallet
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="pay-error-message">
          <FaExclamationCircle className="pay-error-icon" />
          {error}
          <button onClick={() => setError("")} className="pay-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="pay-stats-container">
        <div className="pay-stat-card balance-card">
          <div className="pay-stat-icon">
            <FaWallet />
          </div>
          <h3>Wallet Balance</h3>
          <div className="pay-value">{formatCurrency(walletBalance)}</div>
        </div>

        <div className="pay-stat-card spending-card">
          <div className="pay-stat-icon">
            <FaCalendarAlt />
          </div>
          <h3>This Month Spending</h3>
          <div className="pay-value">{formatCurrency(monthlySpending)}</div>
        </div>

        <div className="pay-stat-card spending-card">
          <div className="pay-stat-icon">
            <FaChartLine />
          </div>
          <h3>Total Spending</h3>
          <div className="pay-value">{formatCurrency(totalSpending)}</div>
        </div>
      </div>

      {/* Payment History */}
      <div className="pay-content-section">
        <div className="pay-section-header">
          <h2>Payment History</h2>
          <span className="pay-count-badge">{pagination.total} transactions</span>
        </div>

        {filteredPayments.length > 0 ? (
          <div className="pay-table-container">
            <div className="pay-table-responsive">
              <table className="pay-payments-table">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment._id || payment.reference}>
                      <td data-label="Reference">{payment.reference}</td>
                      <td data-label="Date">{formatDate(payment.createdAt)}</td>
                      <td data-label="Type">
                        <span className={`pay-type-badge pay-type-${payment.type}`}>
                          {payment.type}
                        </span>
                      </td>
                      <td data-label="Amount" className="pay-amount">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td data-label="Status">
                        <span className={`pay-status-badge pay-status-${payment.status}`}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pay-pagination">
              <button
                className="pay-pagination-btn"
                disabled={!pagination.hasPrev}
                onClick={() => handlePageChange(pagination.current - 1)}
              >
                <FaChevronLeft />
                Prev
              </button>

              <div className="pay-pagination-numbers">
                {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`pay-pagination-btn ${pagination.current === pageNum ? "active" : ""}`}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {pagination.pages > 5 && <span className="pay-pagination-ellipsis">...</span>}
              </div>

              <button
                className="pay-pagination-btn"
                disabled={!pagination.hasNext}
                onClick={() => handlePageChange(pagination.current + 1)}
              >
                Next
                <FaChevronRight />
              </button>
            </div>
          </div>
        ) : (
          <div className="pay-no-payments">
            <FaReceipt className="pay-no-payments-icon" />
            <p>No payment history found</p>
            {searchTerm && (
              <button 
                className="pay-clear-search"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Top-up Modal */}
      {showTopUpModal && (
        <div className="pay-payment-modal-overlay">
          <div className="pay-payment-modal-content">
            <div className="pay-payment-modal-header">
              <h2>Top Up Wallet</h2>
              <button
                className="pay-close-btn"
                onClick={() => !isProcessing && setShowTopUpModal(false)}
                disabled={isProcessing}
              >
                <FaTimes />
              </button>
            </div>
            <div className="pay-payment-modal-body">
              <div className="pay-form-group">
                <label htmlFor="amount">Amount (₦)</label>
                <input
                  type="number"
                  id="amount"
                  value={topUpAmount}
                  onChange={(e) =>
                    setTopUpAmount(parseInt(e.target.value) || 0)
                  }
                  min="1000"
                  step="500"
                  disabled={isProcessing}
                />
                <small>Minimum amount: ₦1,000</small>
              </div>
              {isProcessing && (
                <div className="pay-payment-processing-overlay">
                  <div className="pay-payment-processing-spinner"></div>
                  <p>Redirecting to Paystack...</p>
                </div>
              )}
            </div>
            <div className="pay-payment-modal-footer">
              <button
                type="button"
                className="pay-btn-secondary"
                onClick={() => setShowTopUpModal(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="pay-btn-primary"
                onClick={handleTopUp}
                disabled={isProcessing || topUpAmount < 1000}
              >
                {isProcessing
                  ? "Processing..."
                  : `Top Up ${formatCurrency(topUpAmount)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;