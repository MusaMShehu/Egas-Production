import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileUserSubscriptions.css';
import { FaPlus, FaSearch, FaTimes, FaEllipsisV, FaWallet, FaCreditCard, FaFire, FaCalendar, FaMapMarkerAlt, FaPause, FaPlay, FaTrash } from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const MobileSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    infoToast('Loading subscriptions...');
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch subscriptions
      const subscriptionsResponse = await fetch(`${API_BASE_URL}/subscriptions/my-subscriptions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const subscriptionsResult = await subscriptionsResponse.json();
      
      if (subscriptionsResponse.ok) {
        setSubscriptions(subscriptionsResult.data || []);
      } else {
        throw new Error(subscriptionsResult.message || 'Failed to load subscriptions');
      }

      // Fetch wallet balance
      const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setWalletBalance(dashboardData.data?.walletBalance || 0);
      }
      
      successToast('Subscriptions loaded');
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.message || 'Failed to load subscriptions';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubscription = () => {
    infoToast('Redirecting to subscription plans...');
    navigate('/subscription-plans');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatCurrency = (amount) => {
    return `₦${(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'mobsubs-status-active';
      case 'paused': return 'mobsubs-status-paused';
      case 'cancelled': return 'mobsubs-status-cancelled';
      case 'expired': return 'mobsubs-status-expired';
      default: return 'mobsubs-status-pending';
    }
  };

  const getStatusText = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'Monthly': return '/month';
      case 'Weekly': return '/week';
      case 'Bi-Weekly': return '/2 weeks';
      case 'One-Time': return 'One Time';
      default: return frequency || 'N/A';
    }
  };

  const handlePauseSubscription = async (subscriptionId) => {
    const subscription = subscriptions.find(s => s._id === subscriptionId);
    if (!subscription) return;

    if (!window.confirm('Pause this subscription?')) {
      infoToast('Pause cancelled');
      return;
    }

    warningToast('Pausing subscription...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/pause`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubscriptions(prev => prev.map(s =>
          s._id === subscriptionId ? { ...s, status: 'paused' } : s
        ));
        setShowActionMenu(null);
        successToast('Subscription paused');
      } else {
        throw new Error(result.message || 'Failed to pause');
      }
    } catch (err) {
      errorToast(err.message || 'Failed to pause subscription');
    }
  };

  const handleResumeSubscription = async (subscriptionId) => {
    const subscription = subscriptions.find(s => s._id === subscriptionId);
    if (!subscription) return;

    if (!window.confirm('Resume this subscription?')) {
      infoToast('Resume cancelled');
      return;
    }

    infoToast('Resuming subscription...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/resume`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubscriptions(prev => prev.map(s =>
          s._id === subscriptionId ? { ...s, status: 'active' } : s
        ));
        setShowActionMenu(null);
        successToast('Subscription resumed');
      } else {
        throw new Error(result.message || 'Failed to resume');
      }
    } catch (err) {
      errorToast(err.message || 'Failed to resume subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    const subscription = subscriptions.find(s => s._id === subscriptionId);
    if (!subscription) return;

    if (!window.confirm('Cancel this subscription? This cannot be undone.')) {
      infoToast('Cancellation cancelled');
      return;
    }

    warningToast('Cancelling subscription...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel-my`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      
      if (response.ok) {
        setSubscriptions(prev => prev.map(s =>
          s._id === subscriptionId ? { ...s, status: 'cancelled' } : s
        ));
        setShowActionMenu(null);
        successToast('Subscription cancelled');
      } else {
        throw new Error(result.message || 'Failed to cancel');
      }
    } catch (err) {
      errorToast(err.message || 'Failed to cancel subscription');
    }
  };

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const otherSubscriptions = subscriptions.filter(s => s.status !== 'active');

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.size?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="mobsubs-mobile-subscriptions mobsubs-loading">
        <div className="mobsubs-loading-spinner"></div>
        <p>Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="mobsubs-mobile-subscriptions">
      {/* Header */}
      <div className="mobsubs-subscriptions-header">
        <h1>My Subscriptions</h1>
        <div className="mobsubs-wallet-info">
          <FaWallet className="mobsubs-wallet-icon" />
          <span>{formatCurrency(walletBalance)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mobsubs-subscription-stats">
        <div className="mobsubs-stat-card">
          <div className="mobsubs-stat-icon mobsubs-active">
            <FaFire />
          </div>
          <div className="mobsubs-stat-content">
            <h3>Active</h3>
            <p>{activeSubscriptions.length}</p>
          </div>
        </div>
        
        <div className="mobsubs-stat-card">
          <div className="mobsubs-stat-icon mobsubs-total">
            <FaCreditCard />
          </div>
          <div className="mobsubs-stat-content">
            <h3>Monthly</h3>
            <p>{formatCurrency(
              activeSubscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0)
            )}</p>
          </div>
        </div>
      </div>

      {/* Search and Create */}
      <div className="mobsubs-actions-bar">
        <div className="mobsubs-search-container">
          <FaSearch className="mobsubs-search-icon" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button className="mobsubs-clear-search" onClick={() => setSearchQuery('')}>
              <FaTimes />
            </button>
          )}
        </div>
        
        <button className="mobsubs-new-subscription-btn" onClick={handleCreateSubscription}>
          <FaPlus /> Create New
        </button>
      </div>

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <div className="mobsubs-subscription-section">
          <div className="mobsubs-section-header">
            <h2>Active Subscriptions</h2>
            <span className="mobsubs-count-badge">{activeSubscriptions.length}</span>
          </div>
          
          <div className="mobsubs-subscriptions-list">
            {activeSubscriptions.map(subscription => (
              <div key={subscription._id} className="mobsubs-subscription-card mobsubs-active">
                <div className="mobsubs-subscription-header">
                  <div className="mobsubs-subscription-title">
                    <FaFire className="mobsubs-subscription-icon" />
                    <div>
                      <h3>{subscription.planName || 'Premium Plan'}</h3>
                      <p className="mobsubs-subscription-id">#{subscription._id?.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className="mobsubs-subscription-actions">
                    <div className={`mobsubs-status-badge ${getStatusClass(subscription.status)}`}>
                      {getStatusText(subscription.status)}
                    </div>
                    
                    <button 
                      className="mobsubs-action-menu-btn"
                      onClick={() => setShowActionMenu(
                        showActionMenu === subscription._id ? null : subscription._id
                      )}
                    >
                      <FaEllipsisV />
                    </button>
                    
                    {showActionMenu === subscription._id && (
                      <div className="mobsubs-action-menu">
                        <button 
                          className="mobsubs-menu-item"
                          onClick={() => handlePauseSubscription(subscription._id)}
                        >
                          <FaPause /> Pause
                        </button>
                        <button 
                          className="mobsubs-menu-item mobsubs-danger"
                          onClick={() => handleCancelSubscription(subscription._id)}
                        >
                          <FaTrash /> Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mobsubs-subscription-details">
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Cylinder Size:</span>
                    <span className="mobsubs-value">{subscription.size || '15 kg'}</span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Frequency:</span>
                    <span className="mobsubs-value">
                      {getFrequencyText(subscription.frequency)}
                    </span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Price:</span>
                    <span className="mobsubs-value mobsubs-price">
                      {formatCurrency(subscription.price)}
                      {subscription.frequency && subscription.frequency !== 'One-Time' && 
                        ` ${getFrequencyText(subscription.frequency)}`}
                    </span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Next Delivery:</span>
                    <span className="mobsubs-value">
                      <FaCalendar className="mobsubs-icon" />
                      {formatDate(subscription.nextDeliveryDate) || 'Not scheduled'}
                    </span>
                  </div>
                </div>
                
                <div className="mobsubs-subscription-footer">
                  <button 
                    className="mobsubs-manage-btn"
                    onClick={() => navigate(`/subscriptions/${subscription._id}`)}
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Subscriptions */}
      {otherSubscriptions.length > 0 && (
        <div className="mobsubs-subscription-section">
          <div className="mobsubs-section-header">
            <h2>Subscription History</h2>
            <span className="mobsubs-count-badge">{otherSubscriptions.length}</span>
          </div>
          
          <div className="mobsubs-subscriptions-list">
            {otherSubscriptions.map(subscription => (
              <div key={subscription._id} className="mobsubs-subscription-card mobsubs-inactive">
                <div className="mobsubs-subscription-header">
                  <div className="mobsubs-subscription-title">
                    <FaFire className="mobsubs-subscription-icon" />
                    <div>
                      <h3>{subscription.planName || 'Plan'}</h3>
                      <p className="mobsubs-subscription-id">#{subscription._id?.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className={`mobsubs-status-badge ${getStatusClass(subscription.status)}`}>
                    {getStatusText(subscription.status)}
                  </div>
                </div>
                
                <div className="mobsubs-subscription-details">
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Status:</span>
                    <span className="mobsubs-value">
                      {getStatusText(subscription.status)} since {formatDate(subscription.updatedAt)}
                    </span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Price:</span>
                    <span className="mobsubs-value mobsubs-price">
                      {formatCurrency(subscription.price)}
                      {subscription.frequency && subscription.frequency !== 'One-Time' && 
                        ` ${getFrequencyText(subscription.frequency)}`}
                    </span>
                  </div>
                  
                  {subscription.status === 'paused' && (
                    <div className="mobsubs-subscription-footer">
                      <button 
                        className="mobsubs-resume-btn"
                        onClick={() => handleResumeSubscription(subscription._id)}
                      >
                        <FaPlay /> Resume
                      </button>
                    </div>
                  )}
                  
                  {subscription.status === 'expired' && (
                    <div className="mobsubs-subscription-footer">
                      <button 
                        className="mobsubs-renew-btn"
                        onClick={handleCreateSubscription}
                      >
                        Renew
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Subscriptions */}
      {subscriptions.length === 0 && (
        <div className="mobsubs-no-subscriptions">
          <FaFire className="mobsubs-no-subscriptions-icon" />
          <h3>No Subscriptions Yet</h3>
          <p>Start a subscription plan for regular gas delivery</p>
          <button className="mobsubs-create-btn" onClick={handleCreateSubscription}>
            <FaPlus /> Create Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileSubscriptions;