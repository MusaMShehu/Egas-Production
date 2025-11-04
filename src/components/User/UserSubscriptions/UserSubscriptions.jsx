// components/Subscriptions.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSubscriptions.css';
import { FaPlus, FaSearch, FaTimes, FaEllipsisV, FaWallet, FaCreditCard } from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [paymentData, setPaymentData] = useState({});
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com';

  const getAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Authentication token not found. Please log in again.");
      warningToast("Please log in to access subscriptions");
      return null;
    }
    return token;
  };

  const getHeaders = () => {
    const token = getAuthToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  // ✅ Fetch all user data including subscriptions and wallet balance from dashboard
  const fetchUserData = async () => {
    setIsLoading(true);
    infoToast('Loading your subscriptions...');
    
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Fetch dashboard data (same as Payments page)
      const dashboardResponse = await fetch(`${API_BASE_URL}/api/v1/dashboard/overview`, {
        headers: getHeaders(),
      });

      if (!dashboardResponse.ok) {
        if (dashboardResponse.status === 401) {
          const errorMsg = "Session expired. Please log in again.";
          setError(errorMsg);
          warningToast(errorMsg);
          return;
        }
        throw new Error(`HTTP error! status: ${dashboardResponse.status}`);
      }

      const dashboardData = await dashboardResponse.json();
      
      if (!dashboardData.success) {
        throw new Error(dashboardData.message || "Failed to fetch user data");
      }

      // Set wallet balance from dashboard data
      setWalletBalance(dashboardData.data?.walletBalance || 0);
      setPaymentData(dashboardData.data || {});

      // Now fetch subscriptions
      const subscriptionsResponse = await fetch(`${API_BASE_URL}/api/v1/subscriptions/my-subscriptions`, {
        headers: getHeaders(),
      });

      const subscriptionsResult = await subscriptionsResponse.json();

      if (!subscriptionsResponse.ok) {
        throw new Error(subscriptionsResult.message || `HTTP error! status: ${subscriptionsResponse.status}`);
      }

      setSubscriptions(subscriptionsResult.data || []);
      
      if (subscriptionsResult.data && subscriptionsResult.data.length === 0) {
        infoToast('No subscriptions found. Create your first subscription!');
      } else {
        successToast(`Loaded ${subscriptionsResult.data.length} subscriptions successfully`);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      const errorMsg = error.message || 'Failed to load your data. Please try again later.';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCreateNewSubscription = () => {
    infoToast('Redirecting to subscription plans...');
    navigate('/subscription-plans');
  };

  const toggleDropdown = (subscriptionId) => {
    setActiveDropdown(activeDropdown === subscriptionId ? null : subscriptionId);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
    closeDropdown();
    infoToast(`Viewing details for subscription #${subscription._id?.slice(-8)}`);
  };

  const handlePausePlan = async (subscriptionId) => {
    const subscription = subscriptions.find(sub => sub._id === subscriptionId);
    if (!subscription) return;

    if (!window.confirm('Are you sure you want to pause this subscription?')) {
      infoToast('Subscription pause cancelled');
      closeDropdown();
      return;
    }

    warningToast(`Pausing subscription #${subscriptionId.slice(-8)}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/pause`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error(`Failed to pause subscription: ${response.status}`);
      }

      if (result.success) {
        setSubscriptions(prev =>
          prev.map(sub =>
            sub._id === subscriptionId ? { ...sub, ...result.data } : sub
          )
        );
        successToast('Subscription paused successfully');
        
        // Refresh wallet balance after subscription modification
        fetchUserData();
      } else {
        throw new Error(result.message || 'Failed to pause subscription');
      }
    } catch (error) {
      console.error('Error pausing subscription:', error);
      const errorMsg = error.message || 'Failed to pause subscription. Please try again.';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      closeDropdown();
    }
  };

  const handleResumePlan = async (subscriptionId) => {
    const subscription = subscriptions.find(sub => sub._id === subscriptionId);
    if (!subscription) return;

    if (!window.confirm('Are you sure you want to resume this subscription?')) {
      infoToast('Subscription resume cancelled');
      closeDropdown();
      return;
    }

    infoToast(`Resuming subscription #${subscriptionId.slice(-8)}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/resume`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error(`Failed to resume subscription: ${response.status}`);
      }

      if (result.success) {
        setSubscriptions(prev =>
          prev.map(sub =>
            sub._id === subscriptionId ? { ...sub, ...result.data } : sub
          )
        );
        successToast('Subscription resumed successfully');
        
        // Refresh wallet balance after subscription modification
        fetchUserData();
      } else {
        throw new Error(result.message || 'Failed to resume subscription');
      }
    } catch (error) {
      console.error('Error resuming subscription:', error);
      const errorMsg = error.message || 'Failed to resume subscription. Please try again.';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      closeDropdown();
    }
  };

  const cancelSubscription = async (subscriptionId) => {
    const subscription = subscriptions.find(sub => sub._id === subscriptionId);
    if (!subscription) return;

    if (!window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      infoToast('Subscription cancellation cancelled');
      closeDropdown();
      return;
    }

    warningToast(`Cancelling subscription #${subscriptionId.slice(-8)}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/cancel-my`, {
        method: 'PUT',
        headers: getHeaders(),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      if (result.success) {
        setSubscriptions(prev =>
          prev.map(sub =>
            sub._id === subscriptionId ? { ...sub, ...result.data } : sub
          )
        );
        successToast('Subscription cancelled successfully');
        
        // Refresh wallet balance after subscription modification
        fetchUserData();
      } else {
        throw new Error(result.message || 'Failed to cancel subscription');
      }
      
      closeDropdown();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      const errorMsg = error.message || 'Failed to cancel subscription. Please try again.';
      setError(errorMsg);
      errorToast(errorMsg);
      closeDropdown();
    }
  };

  const handleSubscribeAgain = (subscription) => {
    infoToast('Redirecting to subscription plans...');
    navigate('/subscription-plans');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      infoToast('Search functionality coming soon...');
    }
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    infoToast('Subscription details closed');
  };

  const handleClearError = () => {
    setError('');
    infoToast('Error message cleared');
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₦0';
    return `₦${amount.toLocaleString()}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'cancelled': return 'status-cancelled';
      case 'expired': return 'status-expired';
      case 'pending': return 'status-pending';
      case 'paused': return 'status-paused';
      default: return '';
    }
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'Monthly': return '/month';
      case 'Weekly': return '/week';
      case 'Bi-Weekly': return '/2 weeks';
      case 'One-Time': return 'one-time';
      default: return frequency || 'N/A';
    }
  };

  const getPaymentMethodIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case 'wallet': return <FaWallet className="payment-method-icon wallet" />;
      case 'paystack': return <FaCreditCard className="payment-method-icon card" />;
      default: return null;
    }
  };

  const getPaymentMethodText = (paymentMethod) => {
    switch (paymentMethod) {
      case 'wallet': return 'Wallet Balance';
      case 'paystack': return 'Card Payment';
      default: return paymentMethod || 'N/A';
    }
  };

  // ✅ Split active vs inactive
  const activeSubscriptions = subscriptions.filter(sub =>
    ['active', 'pending'].includes(sub.status)
  );
  const inactiveSubscriptions = subscriptions.filter(sub =>
    ['cancelled', 'expired', 'paused'].includes(sub.status)
  );

  if (isLoading) {
    return <div className="sub-subscriptions-page loading">Loading your subscriptions...</div>;
  }

  return (
    <div className="sub-subscriptions-page">
      <div className="sub-dashboard-header">
        <h1>My Subscriptions</h1>
        <div className="sub-header-actions">
          <div className="sub-wallet-balance">
            <FaWallet className="wallet-icon" />
            <span>Wallet: {formatCurrency(walletBalance)}</span>
          </div>
          <div className="sub-search-bar">
            <FaSearch className="sub-search-icon" />
            <input 
              type="text" 
              placeholder="Search subscriptions..." 
              onKeyPress={handleSearch}
            />
          </div>
          <button className="sub-btn-primary" onClick={handleCreateNewSubscription}>
            <FaPlus className="sub-fas" /> New Subscription
          </button>
        </div>
      </div>

      {error && (
        <div className="sub-error-message">
          {error}
          <button onClick={handleClearError} className="close-error">
            <FaTimes className="sub-fas" />
          </button>
        </div>
      )}

      {/* Subscription Stats */}
      <div className="sub-stats-container">
        <div className="sub-stat-card">
          <div className="sub-stat-icon active">
            <FaWallet />
          </div>
          <h3>Active Subscriptions</h3>
          <div className="sub-value">{activeSubscriptions.length}</div>
        </div>

        <div className="sub-stat-card">
          <div className="sub-stat-icon total">
            <FaCreditCard />
          </div>
          <h3>Total Spent</h3>
          <div className="sub-value">{formatCurrency(paymentData.subscriptionTotal || 0)}</div>
        </div>

        <div className="sub-stat-card">
          <div className="sub-stat-icon monthly">
            <FaWallet />
          </div>
          <h3>This Month</h3>
          <div className="sub-value">{formatCurrency(paymentData.subscriptionMonthly || 0)}</div>
        </div>
      </div>

      <div className="sub-sub-content-section">
        {/* Active Subscriptions */}
        {activeSubscriptions.length > 0 && (
          <>
            <div className="sub-section-header">
              <h2>Active Subscriptions</h2>
              <span className="sub-count-badge">{activeSubscriptions.length}</span>
            </div>
            <div className="sub-subscriptions-list">
              {activeSubscriptions.map(subscription => (
                <div key={subscription._id} className="sub-subscription-card">
                  <div className="sub-subscription-header">
                    <div className="sub-subscription-id">#{subscription._id?.slice(-8)}</div>
                    <div className="sub-subscription-header-right">
                      <div className="sub-payment-method">
                        {getPaymentMethodIcon(subscription.paymentMethod)}
                        <span className="payment-method-text">
                          {getPaymentMethodText(subscription.paymentMethod)}
                        </span>
                      </div>
                      <div className={`sub-subscription-status ${getStatusClass(subscription.status)}`}>
                        {subscription.status}
                      </div>
                      <div className="sub-dropdown-container">
                        <button 
                          className="sub-dropdown-toggle"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(subscription._id);
                          }}
                        >
                          <FaEllipsisV />
                        </button>
                        {activeDropdown === subscription._id && (
                          <div className="sub-dropdown-menu">
                            <button 
                              className="sub-dropdown-item"
                              onClick={() => handleViewDetails(subscription)}
                            >
                              View Subscription Details
                            </button>
                            {subscription.status === 'active' && (
                              <button 
                                className="sub-dropdown-item"
                                onClick={() => handlePausePlan(subscription._id)}
                              >
                                Pause Plan
                              </button>
                            )}
                            <button 
                              className="sub-dropdown-item sub-dropdown-item-danger"
                              onClick={() => cancelSubscription(subscription._id)}
                            >
                              Cancel Subscription
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sub-subscription-details">
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Plan Name:</span>
                      <span className="sub-detail-value">{subscription.planName || 'N/A'}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Cylinder Size:</span>
                      <span className="sub-detail-value">{subscription.size || 'N/A'}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Delivery Frequency:</span>
                      <span className="sub-detail-value">
                        {subscription.frequency ? getFrequencyText(subscription.frequency) : 'N/A'}
                      </span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Price:</span>
                      <span className="sub-detail-value">
                        {formatCurrency(subscription.price)}
                        {subscription.frequency && subscription.frequency !== 'One-Time' && 
                          getFrequencyText(subscription.frequency)}
                      </span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Start Date:</span>
                      <span className="sub-detail-value">{formatDate(subscription.startDate)}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">End Date:</span>
                      <span className="sub-detail-value">{formatDate(subscription.endDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Inactive Subscriptions */}
        {inactiveSubscriptions.length > 0 && (
          <>
            <div className="sub-section-header">
              <h2>Subscription History</h2>
              <span className="sub-count-badge">{inactiveSubscriptions.length}</span>
            </div>
            <div className="sub-subscriptions-list">
              {inactiveSubscriptions.map(subscription => (
                <div key={subscription._id} className="sub-subscription-card">
                  <div className="sub-subscription-header">
                    <div className="sub-subscription-id">#{subscription._id?.slice(-8)}</div>
                    <div className="sub-subscription-header-right">
                      <div className="sub-payment-method">
                        {getPaymentMethodIcon(subscription.paymentMethod)}
                        <span className="payment-method-text">
                          {getPaymentMethodText(subscription.paymentMethod)}
                        </span>
                      </div>
                      <div className={`sub-subscription-status ${getStatusClass(subscription.status)}`}>
                        {subscription.status}
                      </div>
                      <div className="sub-dropdown-container">
                        <button 
                          className="sub-dropdown-toggle"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleDropdown(subscription._id);
                          }}
                        >
                          <FaEllipsisV />
                        </button>
                        {activeDropdown === subscription._id && (
                          <div className="sub-dropdown-menu">
                            <button 
                              className="sub-dropdown-item"
                              onClick={() => handleViewDetails(subscription)}
                            >
                              View Details
                            </button>
                            {subscription.status === 'expired' && (
                              <button 
                                className="sub-dropdown-item"
                                onClick={() => handleSubscribeAgain(subscription)}
                              >
                                Subscribe Again
                              </button>
                            )}
                            {subscription.status === 'paused' && (
                              <button 
                                className="sub-dropdown-item"
                                onClick={() => handleResumePlan(subscription._id)}
                              >
                                Resume Plan
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="sub-subscription-details">
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Plan Name:</span>
                      <span className="sub-detail-value">{subscription.planName || 'N/A'}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Cylinder Size:</span>
                      <span className="sub-detail-value">{subscription.size || 'N/A'}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Delivery Frequency:</span>
                      <span className="sub-detail-value">
                        {subscription.frequency ? getFrequencyText(subscription.frequency) : 'N/A'}
                      </span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Price:</span>
                      <span className="sub-detail-value">
                        {formatCurrency(subscription.price)}
                        {subscription.frequency && subscription.frequency !== 'One-Time' && 
                          getFrequencyText(subscription.frequency)}
                      </span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Start Date:</span>
                      <span className="sub-detail-value">{formatDate(subscription.startDate)}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">End Date:</span>
                      <span className="sub-detail-value">{formatDate(subscription.endDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* No subscriptions fallback */}
        {subscriptions.length === 0 && (
          <div className="sub-no-subscriptions">
            <p>You don't have any subscriptions yet.</p>
            <button className="sub-btn-primary" onClick={handleCreateNewSubscription}>
              Create Your First Subscription
            </button>
          </div>
        )}
      </div>

      {/* Subscription Details Modal */}
      {showDetailsModal && selectedSubscription && (
        <div className="sub-modal-overlay">
          <div className="sub-modal">
            <div className="sub-modal-header">
              <h3>Subscription Details</h3>
              <button 
                className="sub-modal-close"
                onClick={handleCloseModal}
              >
                <FaTimes />
              </button>
            </div>
            <div className="sub-modal-content">
              <div className="sub-detail-section">
                <h4>Subscription Information</h4>
                <div className="sub-detail-grid">
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Subscription ID:</span>
                    <span className="sub-detail-value">#{selectedSubscription._id}</span>
                  </div>
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Status:</span>
                    <span className={`sub-detail-value ${getStatusClass(selectedSubscription.status)}`}>
                      {selectedSubscription.status}
                    </span>
                  </div>
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Payment Method:</span>
                    <span className="sub-detail-value payment-method-display">
                      {getPaymentMethodIcon(selectedSubscription.paymentMethod)}
                      {getPaymentMethodText(selectedSubscription.paymentMethod)}
                    </span>
                  </div>
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Plan Name:</span>
                    <span className="sub-detail-value">{selectedSubscription.planName || 'N/A'}</span>
                  </div>
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Cylinder Size:</span>
                    <span className="sub-detail-value">{selectedSubscription.size || 'N/A'}</span>
                  </div>
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Delivery Frequency:</span>
                    <span className="sub-detail-value">
                      {selectedSubscription.frequency ? getFrequencyText(selectedSubscription.frequency) : 'N/A'}
                    </span>
                  </div>
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Price:</span>
                    <span className="sub-detail-value">
                      {formatCurrency(selectedSubscription.price)}
                      {selectedSubscription.frequency && selectedSubscription.frequency !== 'One-Time' && 
                        getFrequencyText(selectedSubscription.frequency)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sub-detail-section">
                <h4>Dates</h4>
                <div className="sub-detail-grid">
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">Start Date:</span>
                    <span className="sub-detail-value">{formatDate(selectedSubscription.startDate)}</span>
                  </div>
                  <div className="sub-detail-item">
                    <span className="sub-detail-label">End Date:</span>
                    <span className="sub-detail-value">{formatDate(selectedSubscription.endDate)}</span>
                  </div>
                  {selectedSubscription.cancelledAt && (
                    <div className="sub-detail-item">
                      <span className="sub-detail-label">Cancelled At:</span>
                      <span className="sub-detail-value">{formatDate(selectedSubscription.cancelledAt)}</span>
                    </div>
                  )}
                  {selectedSubscription.pausedAt && (
                    <div className="sub-detail-item">
                      <span className="sub-detail-label">Paused At:</span>
                      <span className="sub-detail-value">{formatDate(selectedSubscription.pausedAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedSubscription.description && (
                <div className="sub-detail-section">
                  <h4>Description</h4>
                  <p>{selectedSubscription.description}</p>
                </div>
              )}
            </div>
            <div className="sub-modal-actions">
              {selectedSubscription.status === 'paused' && (
                <button 
                  className="sub-btn-primary"
                  onClick={() => {
                    handleResumePlan(selectedSubscription._id);
                    setShowDetailsModal(false);
                  }}
                >
                  Resume Subscription
                </button>
              )}
              {selectedSubscription.status === 'active' && (
                <button 
                  className="sub-btn-secondary"
                  onClick={() => {
                    handlePausePlan(selectedSubscription._id);
                    setShowDetailsModal(false);
                  }}
                >
                  Pause Subscription
                </button>
              )}
              <button 
                className="sub-btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;