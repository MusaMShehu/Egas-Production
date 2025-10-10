import React, { useState, useEffect, useCallback } from "react";
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
  const [paginationInfo, setPaginationInfo] = useState({ // Renamed from pagination
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const API_BASE_URL = "https://egas-server-1.onrender.com/api/v1";

  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      return null;
    }
    return token;
  }, []);

  const getHeaders = useCallback(() => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }, [getAuthToken]);

  // Fetch payment history with useCallback
  const fetchPaymentHistory = useCallback(async (page = 1, limit = 10) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/payments/history?page=${page}&limit=${limit}`,
        { 
          headers: getHeaders(),
          credentials: 'include'
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch payment history");
      }

      setPaymentHistory(data.data || []);
      setPaginationInfo(data.pagination || {
        current: 1,
        pages: 1,
        total: 0,
        hasNext: false,
        hasPrev: false,
      });

      // Calculate spending from transactions
      if (data.data && Array.isArray(data.data)) {
        let total = 0;
        let monthly = 0;
        const now = new Date();
        
        data.data.forEach((tx) => {
          if (tx.type === "debit" || tx.status === "success") {
            const amount = parseFloat(tx.amount) || 0;
            total += amount;
            
            if (tx.createdAt) {
              const txDate = new Date(tx.createdAt);
              if (
                txDate.getMonth() === now.getMonth() &&
                txDate.getFullYear() === now.getFullYear()
              ) {
                monthly += amount;
              }
            }
          }
        });
        
        setTotalSpending(total);
        setMonthlySpending(monthly);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
      setError(error.message || "Failed to load payment history");
    }
  }, [API_BASE_URL, getAuthToken, getHeaders]); // Added dependencies

  // Fetch wallet balance with useCallback
  const fetchWalletBalance = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_BASE_URL}/payments/wallet/balance`, {
        headers: getHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch wallet balance");
      }

      setWalletBalance(parseFloat(data.balance) || 0);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      setError(error.message || "Failed to load wallet balance");
    }
  }, [API_BASE_URL, getAuthToken, getHeaders]); // Added dependencies

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(""); // Clear previous errors
      try {
        await Promise.all([fetchPaymentHistory(1), fetchWalletBalance()]);
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load payment data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchPaymentHistory, fetchWalletBalance]); // Dependencies are now stable

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > paginationInfo.pages) return;
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
      const token = getAuthToken();
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/payments/wallet/topup`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ amount: topUpAmount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Top-up failed: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Top-up failed");
      }

      if (result.authorization_url) {
        // Redirect to Paystack
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

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return `₦${numAmount.toLocaleString()}`;
  };

  // Generate pagination numbers correctly
  const generatePaginationNumbers = () => {
    const totalPages = paginationInfo.pages || 1;
    const currentPage = paginationInfo.current || 1;
    const pages = [];
    
    if (totalPages <= 5) {
      // Show all pages if total pages is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) pages.push(i);
        if (totalPages > 5) pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push('ellipsis');
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
          <span>{error}</span>
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
          <span className="pay-count-badge">{paginationInfo.total || 0} transactions</span>
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
                      <td data-label="Reference">{payment.reference || 'N/A'}</td>
                      <td data-label="Date">{formatDate(payment.createdAt)}</td>
                      <td data-label="Type">
                        <span className={`pay-type-badge pay-type-${payment.type}`}>
                          {payment.type || 'unknown'}
                        </span>
                      </td>
                      <td data-label="Amount" className="pay-amount">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td data-label="Status">
                        <span className={`pay-status-badge pay-status-${payment.status}`}>
                          {payment.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paginationInfo.pages > 1 && (
              <div className="pay-pagination">
                <button
                  className="pay-pagination-btn"
                  disabled={!paginationInfo.hasPrev}
                  onClick={() => handlePageChange(paginationInfo.current - 1)}
                >
                  <FaChevronLeft />
                  Prev
                </button>

                <div className="pay-pagination-numbers">
                  {generatePaginationNumbers().map((pageNum, index) => 
                    pageNum === 'ellipsis' ? (
                      <span key={`ellipsis-${index}`} className="pay-pagination-ellipsis">...</span>
                    ) : (
                      <button
                        key={pageNum}
                        className={`pay-pagination-btn ${paginationInfo.current === pageNum ? "active" : ""}`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  className="pay-pagination-btn"
                  disabled={!paginationInfo.hasNext}
                  onClick={() => handlePageChange(paginationInfo.current + 1)}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            )}
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
                    setTopUpAmount(Math.max(0, parseInt(e.target.value) || 0))
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