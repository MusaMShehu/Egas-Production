// components/Subscriptions.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSubscriptions.css';
import { FaPlus, FaSearch, FaTimes, FaEllipsisV } from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com';

  // ✅ Fetch logged-in user's subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      infoToast('Loading your subscriptions...');
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          const errorMsg = 'You must be logged in to view subscriptions.';
          setError(errorMsg);
          warningToast(errorMsg);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/my-subscriptions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log("Subscriptions API response:", result);

        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        setSubscriptions(result.data || []);
        
        if (result.data && result.data.length === 0) {
          infoToast('No subscriptions found. Create your first subscription!');
        } else {
          successToast(`Loaded ${result.data.length} subscriptions successfully`);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        const errorMsg = 'Failed to load your subscriptions. Please try again later.';
        setError(errorMsg);
        errorToast(errorMsg);
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [API_BASE_URL]);

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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/pause`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error messages from backend
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error(`Failed to pause subscription: ${response.status}`);
      }

      if (result.success) {
        // Update UI with the data returned from backend
        setSubscriptions(prev =>
          prev.map(sub =>
            sub._id === subscriptionId ? { ...sub, ...result.data } : sub
          )
        );
        successToast('Subscription paused successfully');
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/resume`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error messages from backend
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error(`Failed to resume subscription: ${response.status}`);
      }

      if (result.success) {
        // Update UI with the data returned from backend
        setSubscriptions(prev =>
          prev.map(sub =>
            sub._id === subscriptionId ? { ...sub, ...result.data } : sub
          )
        );
        successToast('Subscription resumed successfully');
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
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/cancel-my`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific error messages from backend
        if (result.message) {
          throw new Error(result.message);
        }
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      if (result.success) {
        // Update UI with the data returned from backend
        setSubscriptions(prev =>
          prev.map(sub =>
            sub._id === subscriptionId ? { ...sub, ...result.data } : sub
          )
        );
        successToast('Subscription cancelled successfully');
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