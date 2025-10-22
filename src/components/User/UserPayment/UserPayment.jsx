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
  FaChevronRight,
  FaShoppingBag,
  FaSync
} from "react-icons/fa";
import "./UserPayment.css";

const Payments = () => {
  const [paymentData, setPaymentData] = useState({
    walletBalance: 0,
    totalSpent: 0,
    thisMonthSpent: 0,
    orderTotal: 0,
    subscriptionTotal: 0,
    topupTotal: 0,
    orderMonthly: 0,
    subscriptionMonthly: 0,
    topupMonthly: 0,
    recentActivities: [],
    spendingByMonth: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(5000);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // "all", "orders", "subscriptions", "wallet"
  const [paginationInfo, setPaginationInfo] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  });

  const API_BASE_URL = "https://egas-server-1.onrender.com";

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

  // Fetch dashboard data which includes all payment information
  const fetchPaymentData = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_BASE_URL}/api/v1/dashboard/overview`,
        { 
          headers: getHeaders(),
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
        throw new Error(data.message || "Failed to fetch payment data");
      }

      setPaymentData(data.data || {});
      
      // Calculate pagination for activities
      const activities = data.data.recentActivities || [];
      setPaginationInfo({
        current: 1,
        pages: Math.ceil(activities.length / 10),
        total: activities.length,
        hasNext: activities.length > 10,
        hasPrev: false,
      });

    } catch (error) {
      console.error("Error fetching payment data:", error);
      setError(error.message || "Failed to load payment data");
    }
  }, [API_BASE_URL, getAuthToken, getHeaders]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(""); // Clear previous errors
      try {
        await fetchPaymentData();
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Failed to load payment data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchPaymentData]);

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

      const response = await fetch(`${API_BASE_URL}/api/v1/payments/wallet/topup`, {
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

  // Filter activities based on search term and active tab
  const filteredActivities = paymentData.recentActivities
    ?.filter((activity) => {
      const matchesSearch = 
        activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.status?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesTab = 
        activeTab === "all" || 
        (activeTab === "orders" && activity.type === "order") ||
        (activeTab === "subscriptions" && activity.type === "subscription") ||
        (activeTab === "wallet" && activity.type === "wallet_transaction");
      
      return matchesSearch && matchesTab;
    }) || [];

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return `₦${numAmount.toLocaleString()}`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <FaShoppingBag />;
      case 'subscription':
        return <FaSync />;
      case 'wallet_transaction':
        return <FaWallet />;
      default:
        return <FaReceipt />;
    }
  };

  const getStatusColor = (status, type) => {
    if (type === 'wallet_transaction') {
      return status?.toLowerCase() === 'credit' ? 'success' : 'warning';
    }
    
    const statusLower = status?.toLowerCase();
    if (statusLower === 'completed' || statusLower === 'success' || statusLower === 'active') {
      return 'success';
    } else if (statusLower === 'pending' || statusLower === 'processing') {
      return 'pending';
    } else if (statusLower === 'failed' || statusLower === 'cancelled' || statusLower === 'expired') {
      return 'failed';
    }
    return 'pending';
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
          <div className="pay-value">{formatCurrency(paymentData.walletBalance)}</div>
        </div>

        <div className="pay-stat-card spending-card">
          <div className="pay-stat-icon">
            <FaCalendarAlt />
          </div>
          <h3>This Month Spending</h3>
          <div className="pay-value">{formatCurrency(paymentData.thisMonthSpent)}</div>
          <div className="pay-stat-breakdown">
            <span>Orders: {formatCurrency(paymentData.orderMonthly)}</span>
            <span>Subscriptions: {formatCurrency(paymentData.subscriptionMonthly)}</span>
          </div>
        </div>

        <div className="pay-stat-card spending-card">
          <div className="pay-stat-icon">
            <FaChartLine />
          </div>
          <h3>Total Spending</h3>
          <div className="pay-value">{formatCurrency(paymentData.totalSpent)}</div>
          <div className="pay-stat-breakdown">
            <span>Orders: {formatCurrency(paymentData.orderTotal)}</span>
            <span>Subscriptions: {formatCurrency(paymentData.subscriptionTotal)}</span>
          </div>
        </div>

        <div className="pay-stat-card topup-card">
          <div className="pay-stat-icon">
            <FaPlus />
          </div>
          <h3>Total Top-ups</h3>
          <div className="pay-value">{formatCurrency(paymentData.topupTotal)}</div>
          <div className="pay-stat-breakdown">
            <span>This month: {formatCurrency(paymentData.topupMonthly)}</span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="pay-content-section">
        <div className="pay-section-header">
          <h2>Payment History</h2>
          <div className="pay-tab-container">
            <button 
              className={`pay-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Transactions
            </button>
            <button 
              className={`pay-tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
            <button 
              className={`pay-tab ${activeTab === "subscriptions" ? "active" : ""}`}
              onClick={() => setActiveTab("subscriptions")}
            >
              Subscriptions
            </button>
            <button 
              className={`pay-tab ${activeTab === "wallet" ? "active" : ""}`}
              onClick={() => setActiveTab("wallet")}
            >
              Wallet
            </button>
          </div>
          <span className="pay-count-badge">{filteredActivities.length} transactions</span>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="pay-table-container">
            <div className="pay-table-responsive">
              <table className="pay-payments-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActivities.map((activity, index) => (
                    <tr key={`${activity.type}-${index}-${activity.createdAt}`}>
                      <td data-label="Type">
                        <div className="pay-activity-type">
                          {getActivityIcon(activity.type)}
                          <span className="pay-type-text">
                            {activity.type === 'order' ? 'Order' : 
                             activity.type === 'subscription' ? 'Subscription' : 
                             'Wallet Transaction'}
                          </span>
                        </div>
                      </td>
                      <td data-label="Description" className="pay-activity-title">
                        {activity.title || 'N/A'}
                      </td>
                      <td data-label="Date">{formatDate(activity.createdAt)}</td>
                      <td data-label="Amount" className="pay-amount">
                        {activity.type === 'wallet_transaction' && activity.status?.toLowerCase() === 'credit' ? '+' : ''}
                        {formatCurrency(activity.amount)}
                      </td>
                      <td data-label="Status">
                        <span className={`pay-status-badge pay-status-${getStatusColor(activity.status, activity.type)}`}>
                          {activity.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="pay-no-payments">
            <FaReceipt className="pay-no-payments-icon" />
            <p>No {activeTab !== "all" ? activeTab : ""} transactions found</p>
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