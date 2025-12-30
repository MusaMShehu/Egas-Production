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
  FaSync,
  FaFilter,
  FaEllipsisH,
  FaArrowUp,
  FaArrowDown
} from "react-icons/fa";
import "./MobileUserPayment.css";
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

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
  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState("date");

  const API_BASE_URL = "https://egas-server-1.onrender.com";

  const getAuthToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      warningToast("Please log in to access payment features");
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

  const fetchPaymentData = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      infoToast("Loading your payment information...");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/dashboard/overview`,
        { 
          headers: getHeaders(),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const errorMsg = "Session expired. Please log in again.";
          setError(errorMsg);
          warningToast(errorMsg);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch payment data");
      }

      setPaymentData(data.data || {});
      
      successToast("Payment data loaded successfully!");
      
    } catch (error) {
      console.error("Error fetching payment data:", error);
      const errorMsg = error.message || "Failed to load payment data";
      setError(errorMsg);
      errorToast(errorMsg);
    }
  }, [API_BASE_URL, getAuthToken, getHeaders]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");
      try {
        await fetchPaymentData();
      } catch (error) {
        console.error("Error loading data:", error);
        const errorMsg = "Failed to load payment data";
        setError(errorMsg);
        errorToast(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchPaymentData]);

  const handleTopUp = async () => {
    if (topUpAmount < 1000) {
      const errorMsg = "Minimum top-up amount is ₦1,000";
      setError(errorMsg);
      warningToast(errorMsg);
      return;
    }

    setIsProcessing(true);
    setError("");
    infoToast(`Processing wallet top-up of ₦${topUpAmount.toLocaleString()}...`);

    try {
      const token = getAuthToken();
      if (!token) {
        const errorMsg = "Authentication required";
        setError(errorMsg);
        warningToast("Please log in to top up your wallet");
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
        successToast("Redirecting to Paystack for payment...");
        setTimeout(() => {
          window.location.href = result.authorization_url;
        }, 1500);
      } else {
        throw new Error("Paystack authorization URL not received");
      }
    } catch (error) {
      console.error("Error processing top-up:", error);
      const errorMsg = error.message || "Failed to process top-up.";
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

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

  const sortedActivities = [...filteredActivities].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "amount":
        return (b.amount || 0) - (a.amount || 0);
      case "type":
        return a.type.localeCompare(b.type);
      default:
        return 0;
    }
  });

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

  const formatDateShort = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
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

  const handleOpenTopUpModal = () => {
    setShowTopUpModal(true);
    infoToast("Opening wallet top-up form...");
  };

  const handleCloseTopUpModal = () => {
    if (!isProcessing) {
      setShowTopUpModal(false);
      infoToast("Top-up cancelled");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    infoToast(`Showing ${tab === "all" ? "all transactions" : tab + " transactions"}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value) {
      infoToast(`Searching for "${e.target.value}"...`);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    successToast("Search cleared");
    setShowSearch(false);
  };

  const handleAmountChange = (e) => {
    const value = Math.max(0, parseInt(e.target.value) || 0);
    setTopUpAmount(value);
    
    if (value > 0 && value < 1000) {
      warningToast("Minimum top-up amount is ₦1,000");
    }
  };

  const handleCancelTopUp = () => {
    setShowTopUpModal(false);
    infoToast("Top-up cancelled");
  };

  if (isLoading) {
    return (
      <div className="mobpay-payments-page mobpay-loading">
        <div className="mobpay-loading-spinner"></div>
        <p>Loading payment information...</p>
      </div>
    );
  }

  return (
    <div className="mobpay-payments-page">
      {/* Mobile Header */}
      <div className="mobpay-mobile-header">
        <div className="mobpay-mobile-header-top">
          <h1>Payments</h1>
          <div className="mobpay-mobile-header-actions">
            <button 
              className="mobpay-mobile-search-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <FaSearch />
            </button>
            <button 
              className="mobpay-mobile-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="mobpay-mobile-search">
            <div className="mobpay-mobile-search-input-wrapper">
              <FaSearch className="mobpay-search-icon" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
              />
              {searchTerm && (
                <button 
                  className="mobpay-mobile-clear-search"
                  onClick={handleClearSearch}
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Quick Stats */}
        <div className="mobpay-mobile-quick-stats">
          <div className="mobpay-mobile-stat">
            <div className="mobpay-mobile-stat-icon">
              <FaWallet />
            </div>
            <div className="mobpay-mobile-stat-info">
              <div className="mobpay-mobile-stat-label">Wallet</div>
              <div className="mobpay-mobile-stat-value">{formatCurrency(paymentData.walletBalance)}</div>
            </div>
          </div>
          <button 
            className="mobpay-mobile-topup-btn"
            onClick={handleOpenTopUpModal}
            disabled={isProcessing}
          >
            <FaPlus /> Top Up
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="mobpay-desktop-header">
        <h1>Payment Management</h1>
        <div className="mobpay-desktop-header-actions">
          <div className="mobpay-desktop-search-bar">
            <FaSearch className="mobpay-search-icon" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button 
                className="mobpay-desktop-clear-search"
                onClick={handleClearSearch}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            className="mobpay-desktop-btn-primary"
            onClick={handleOpenTopUpModal}
            disabled={isProcessing}
          >
            <FaPlus className="mobpay-btn-icon" />
            Top Up Wallet
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mobpay-error-message">
          <FaExclamationCircle className="mobpay-error-icon" />
          <span>{error}</span>
          <button onClick={() => setError("")} className="mobpay-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Mobile Stats Cards */}
      <div className="mobpay-mobile-stats">
        <div className="mobpay-mobile-stat-card">
          <div className="mobpay-mobile-stat-card-icon mobpay-spending">
            <FaCalendarAlt />
          </div>
          <div className="mobpay-mobile-stat-card-content">
            <div className="mobpay-mobile-stat-card-label">This Month</div>
            <div className="mobpay-mobile-stat-card-value">{formatCurrency(paymentData.thisMonthSpent)}</div>
            <div className="mobpay-mobile-stat-card-breakdown">
              <span>Orders: {formatCurrency(paymentData.orderMonthly)}</span>
              <span>Subs: {formatCurrency(paymentData.subscriptionMonthly)}</span>
            </div>
          </div>
        </div>

        <div className="mobpay-mobile-stat-card">
          <div className="mobpay-mobile-stat-card-icon mobpay-total">
            <FaChartLine />
          </div>
          <div className="mobpay-mobile-stat-card-content">
            <div className="mobpay-mobile-stat-card-label">Total Spent</div>
            <div className="mobpay-mobile-stat-card-value">{formatCurrency(paymentData.totalSpent)}</div>
            <div className="mobpay-mobile-stat-card-breakdown">
              <span>Orders: {formatCurrency(paymentData.orderTotal)}</span>
              <span>Subs: {formatCurrency(paymentData.subscriptionTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Stats Container */}
      <div className="mobpay-desktop-stats-container">
        <div className="mobpay-desktop-stat-card mobpay-balance-card">
          <div className="mobpay-desktop-stat-icon">
            <FaWallet />
          </div>
          <h3>Wallet Balance</h3>
          <div className="mobpay-desktop-value">{formatCurrency(paymentData.walletBalance)}</div>
          <div className="mobpay-desktop-stat-note">Available for purchases</div>
        </div>

        <div className="mobpay-desktop-stat-card mobpay-spending-card">
          <div className="mobpay-desktop-stat-icon">
            <FaCalendarAlt />
          </div>
          <h3>This Month Spending</h3>
          <div className="mobpay-desktop-value">{formatCurrency(paymentData.thisMonthSpent)}</div>
          <div className="mobpay-desktop-stat-breakdown">
            <span>Orders: {formatCurrency(paymentData.orderMonthly)}</span>
            <span>Subscriptions: {formatCurrency(paymentData.subscriptionMonthly)}</span>
          </div>
        </div>

        <div className="mobpay-desktop-stat-card mobpay-spending-card">
          <div className="mobpay-desktop-stat-icon">
            <FaChartLine />
          </div>
          <h3>Total Spending</h3>
          <div className="mobpay-desktop-value">{formatCurrency(paymentData.totalSpent)}</div>
          <div className="mobpay-desktop-stat-breakdown">
            <span>Orders: {formatCurrency(paymentData.orderTotal)}</span>
            <span>Subscriptions: {formatCurrency(paymentData.subscriptionTotal)}</span>
          </div>
        </div>

        <div className="mobpay-desktop-stat-card mobpay-topup-card">
          <div className="mobpay-desktop-stat-icon">
            <FaPlus />
          </div>
          <h3>Total Top-ups</h3>
          <div className="mobpay-desktop-value">{formatCurrency(paymentData.topupTotal)}</div>
          <div className="mobpay-desktop-stat-breakdown">
            <span>This month: {formatCurrency(paymentData.topupMonthly)}</span>
          </div>
        </div>
      </div>

      {/* Mobile Tabs */}
      <div className="mobpay-mobile-tabs">
        <button 
          className={`mobpay-mobile-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All
        </button>
        <button 
          className={`mobpay-mobile-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => handleTabChange("orders")}
        >
          Orders
        </button>
        <button 
          className={`mobpay-mobile-tab ${activeTab === "subscriptions" ? "active" : ""}`}
          onClick={() => handleTabChange("subscriptions")}
        >
          Subs
        </button>
        <button 
          className={`mobpay-mobile-tab ${activeTab === "wallet" ? "active" : ""}`}
          onClick={() => handleTabChange("wallet")}
        >
          Wallet
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="mobpay-mobile-filter-panel">
          <div className="mobpay-filter-panel-header">
            <h3>Filter & Sort</h3>
            <button onClick={() => setShowFilters(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="mobpay-filter-panel-content">
            <div className="mobpay-mobile-sort-options">
              <h4>Sort By</h4>
              <div className="mobpay-mobile-sort-buttons">
                <button 
                  className={`mobpay-mobile-sort-btn ${sortBy === 'date' ? 'active' : ''}`}
                  onClick={() => setSortBy('date')}
                >
                  Date
                </button>
                <button 
                  className={`mobpay-mobile-sort-btn ${sortBy === 'amount' ? 'active' : ''}`}
                  onClick={() => setSortBy('amount')}
                >
                  Amount
                </button>
                <button 
                  className={`mobpay-mobile-sort-btn ${sortBy === 'type' ? 'active' : ''}`}
                  onClick={() => setSortBy('type')}
                >
                  Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mobpay-content-section">
        {/* Desktop Section Header */}
        <div className="mobpay-desktop-section-header">
          <h2>Payment History</h2>
          <div className="mobpay-desktop-tab-container">
            <button 
              className={`mobpay-desktop-tab ${activeTab === "all" ? "active" : ""}`}
              onClick={() => handleTabChange("all")}
            >
              All Transactions
            </button>
            <button 
              className={`mobpay-desktop-tab ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => handleTabChange("orders")}
            >
              Orders
            </button>
            <button 
              className={`mobpay-desktop-tab ${activeTab === "subscriptions" ? "active" : ""}`}
              onClick={() => handleTabChange("subscriptions")}
            >
              Subscriptions
            </button>
            <button 
              className={`mobpay-desktop-tab ${activeTab === "wallet" ? "active" : ""}`}
              onClick={() => handleTabChange("wallet")}
            >
              Wallet
            </button>
          </div>
          <span className="mobpay-desktop-count-badge">{sortedActivities.length} transactions</span>
        </div>

        {/* Mobile Section Header */}
        <div className="mobpay-mobile-section-header">
          <div className="mobpay-mobile-section-title">
            <h2>Transactions</h2>
            <span className="mobpay-mobile-count">{sortedActivities.length} items</span>
          </div>
          <button 
            className="mobpay-mobile-sort-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Sort
          </button>
        </div>

        {sortedActivities.length > 0 ? (
          <>
            {/* Mobile List View */}
            <div className="mobpay-mobile-list">
              {sortedActivities.map((activity, index) => (
                <div key={`${activity.type}-${index}-${activity.createdAt}`} className="mobpay-mobile-card">
                  <div className="mobpay-mobile-card-header">
                    <div className="mobpay-mobile-card-left">
                      <div className="mobpay-mobile-activity-type">
                        {getActivityIcon(activity.type)}
                        <span className="mobpay-mobile-type-text">
                          {activity.type === 'order' ? 'Order' : 
                           activity.type === 'subscription' ? 'Subscription' : 
                           'Wallet'}
                        </span>
                      </div>
                      <div className="mobpay-mobile-activity-date">
                        {formatDateShort(activity.createdAt)}
                      </div>
                    </div>
                    <div className="mobpay-mobile-card-right">
                      <div className={`mobpay-mobile-status-badge mobpay-mobile-status-${getStatusColor(activity.status, activity.type)}`}>
                        {activity.status || 'pending'}
                      </div>
                    </div>
                  </div>

                  <div className="mobpay-mobile-card-body">
                    <div className="mobpay-mobile-activity-title">
                      {activity.title?.length > 40 ? activity.title.substring(0, 40) + '...' : activity.title || 'N/A'}
                    </div>
                    <div className="mobpay-mobile-card-footer">
                      <div className={`mobpay-mobile-amount ${activity.type === 'wallet_transaction' && activity.status?.toLowerCase() === 'credit' ? 'credit' : ''}`}>
                        {activity.type === 'wallet_transaction' && activity.status?.toLowerCase() === 'credit' ? '+' : ''}
                        {formatCurrency(activity.amount)}
                      </div>
                      <button className="mobpay-mobile-more-btn">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="mobpay-desktop-table-container">
              <div className="mobpay-desktop-table-responsive">
                <table className="mobpay-desktop-payments-table">
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
                    {sortedActivities.map((activity, index) => (
                      <tr key={`${activity.type}-${index}-${activity.createdAt}`}>
                        <td data-label="Type">
                          <div className="mobpay-desktop-activity-type">
                            {getActivityIcon(activity.type)}
                            <span className="mobpay-desktop-type-text">
                              {activity.type === 'order' ? 'Order' : 
                               activity.type === 'subscription' ? 'Subscription' : 
                               'Wallet Transaction'}
                            </span>
                          </div>
                        </td>
                        <td data-label="Description" className="mobpay-desktop-activity-title">
                          {activity.title || 'N/A'}
                        </td>
                        <td data-label="Date">{formatDate(activity.createdAt)}</td>
                        <td data-label="Amount" className="mobpay-desktop-amount">
                          {activity.type === 'wallet_transaction' && activity.status?.toLowerCase() === 'credit' ? '+' : ''}
                          {formatCurrency(activity.amount)}
                        </td>
                        <td data-label="Status">
                          <span className={`mobpay-desktop-status-badge mobpay-desktop-status-${getStatusColor(activity.status, activity.type)}`}>
                            {activity.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="mobpay-no-payments">
            <FaReceipt className="mobpay-no-payments-icon" />
            <p>No {activeTab !== "all" ? activeTab : ""} transactions found</p>
            {searchTerm && (
              <button 
                className="mobpay-clear-search"
                onClick={handleClearSearch}
              >
                Clear search
              </button>
            )}
            {!searchTerm && activeTab !== "all" && (
              <button 
                className="mobpay-show-all"
                onClick={() => handleTabChange("all")}
              >
                Show all transactions
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Top-up Modal */}
      {showTopUpModal && (
        <div className="mobpay-mobile-modal-overlay">
          <div className="mobpay-mobile-modal-content">
            <div className="mobpay-mobile-modal-header">
              <h2>Top Up Wallet</h2>
              <button
                className="mobpay-mobile-close-btn"
                onClick={handleCloseTopUpModal}
                disabled={isProcessing}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mobpay-mobile-modal-body">
              <div className="mobpay-mobile-form-group">
                <label htmlFor="amount">Amount (₦)</label>
                <input
                  type="number"
                  id="amount"
                  value={topUpAmount}
                  onChange={handleAmountChange}
                  min="1000"
                  step="500"
                  disabled={isProcessing}
                  placeholder="Enter amount"
                />
                <small>Minimum amount: ₦1,000</small>
                {topUpAmount >= 1000 && (
                  <div className="mobpay-mobile-amount-preview">
                    You are topping up: <strong>{formatCurrency(topUpAmount)}</strong>
                  </div>
                )}
              </div>
              {isProcessing && (
                <div className="mobpay-mobile-processing-overlay">
                  <div className="mobpay-mobile-processing-spinner"></div>
                  <p>Redirecting to Paystack...</p>
                </div>
              )}
            </div>
            <div className="mobpay-mobile-modal-footer">
              <button
                type="button"
                className="mobpay-mobile-btn-secondary"
                onClick={handleCancelTopUp}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mobpay-mobile-btn-primary"
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

      {/* Desktop Top-up Modal */}
      {showTopUpModal && (
        <div className="mobpay-desktop-modal-overlay">
          <div className="mobpay-desktop-modal-content">
            <div className="mobpay-desktop-modal-header">
              <h2>Top Up Wallet</h2>
              <button
                className="mobpay-desktop-close-btn"
                onClick={handleCloseTopUpModal}
                disabled={isProcessing}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mobpay-desktop-modal-body">
              <div className="mobpay-desktop-form-group">
                <label htmlFor="amount">Amount (₦)</label>
                <input
                  type="number"
                  id="amount"
                  value={topUpAmount}
                  onChange={handleAmountChange}
                  min="1000"
                  step="500"
                  disabled={isProcessing}
                  placeholder="Enter amount"
                />
                <small>Minimum amount: ₦1,000</small>
                {topUpAmount >= 1000 && (
                  <div className="mobpay-desktop-amount-preview">
                    You are topping up: <strong>{formatCurrency(topUpAmount)}</strong>
                  </div>
                )}
              </div>
              {isProcessing && (
                <div className="mobpay-desktop-processing-overlay">
                  <div className="mobpay-desktop-processing-spinner"></div>
                  <p>Redirecting to Paystack...</p>
                </div>
              )}
            </div>
            <div className="mobpay-desktop-modal-footer">
              <button
                type="button"
                className="mobpay-desktop-btn-secondary"
                onClick={handleCancelTopUp}
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="mobpay-desktop-btn-primary"
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