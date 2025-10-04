// components/Subscriptions.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSubscriptions.css';
import { FaPlus, FaSearch, FaTimes } from 'react-icons/fa';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://egas-server.onrender.com';

  // ✅ Fetch logged-in user's subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view subscriptions.');
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

        // ✅ backend sends result.data
        setSubscriptions(result.data || []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setError('Failed to load your subscriptions. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [API_BASE_URL]);

  const handleCreateNewSubscription = () => {
    navigate('/subscription-plans');
  };

  const cancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/v1/subscriptions/${subscriptionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      // ✅ Update UI immediately
      setSubscriptions(prev =>
        prev.map(sub =>
          sub._id === subscriptionId ? { ...sub, status: 'cancelled', cancelledAt: new Date() } : sub
        )
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError('Failed to cancel subscription. Please try again.');
    }
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
      default: return '';
    }
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'Monthly': return '/month';
      case 'Weekly': return '/week';
      case 'Bi-Weekly': return '/2 weeks';
      case 'One-Time': return 'one-time';
      default: return '';
    }
  };

  // ✅ Split active vs inactive
  const activeSubscriptions = subscriptions.filter(sub =>
    ['active', 'pending'].includes(sub.status)
  );
  const inactiveSubscriptions = subscriptions.filter(sub =>
    ['cancelled', 'expired'].includes(sub.status)
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
            <input type="text" placeholder="Search subscriptions..." />
          </div>
          <button className="sub-btn-primary" onClick={handleCreateNewSubscription}>
            <FaPlus className="sub-fas" /> New Subscription
          </button>
        </div>
      </div>

      {error && (
        <div className="sub-error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
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
                    <div className="sub-subscription-id">#{subscription._id}</div>
                    <div className={`sub-subscription-status ${getStatusClass(subscription.status)}`}>
                      {subscription.status}
                    </div>
                  </div>
                  <div className="sub-subscription-details">
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Plan:</span>
                      <span className="sub-detail-value">{subscription.planName}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Cylinder Size:</span>
                      <span className="sub-detail-value">{subscription.size || 'N/A'}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Price:</span>
                      <span className="sub-detail-value">
                        {formatCurrency(subscription.price)}
                        {subscription.frequency !== 'One-Time' && getFrequencyText(subscription.frequency)}
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
                  <div className="sub-subscription-actions">
                    <button className="sub-btn-primary">Manage</button>
                    <button 
                      className="sub-btn-warning" 
                      onClick={() => cancelSubscription(subscription._id)}
                    >
                      Cancel
                    </button>
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
                    <div className="sub-subscription-id">#{subscription._id}</div>
                    <div className={`sub-subscription-status ${getStatusClass(subscription.status)}`}>
                      {subscription.status}
                    </div>
                  </div>
                  <div className="sub-subscription-details">
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Plan:</span>
                      <span className="sub-detail-value">{subscription.planName}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Cylinder Size:</span>
                      <span className="sub-detail-value">{subscription.size || 'N/A'}</span>
                    </div>
                    <div className="sub-detail-row">
                      <span className="sub-detail-label">Price:</span>
                      <span className="sub-detail-value">
                        {formatCurrency(subscription.price)}
                        {subscription.frequency !== 'One-Time' && getFrequencyText(subscription.frequency)}
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
                  <div className="sub-subscription-actions">
                    <button className="sub-btn-secondary">View Details</button>
                    {subscription.status === 'expired' && (
                      <button className="sub-btn-primary">Subscribe Again</button>
                    )}
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
    </div>
  );
};

export default Subscriptions;
