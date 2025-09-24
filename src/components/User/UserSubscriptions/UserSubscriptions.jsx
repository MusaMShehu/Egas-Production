// components/Subscriptions.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserSubscriptions.css';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ✅ Use environment variable for production
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

  // ✅ Fetch only the logged-in user’s subscriptions
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

        const response = await fetch(`${API_BASE_URL}/subscriptions/my-subscriptions`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSubscriptions(data.subscriptions || []); // expect backend to return { subscriptions: [...] }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        setError('Failed to load your subscriptions. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleCreateNewSubscription = () => {
    navigate('/subscription-list');
  };

  const cancelSubscription = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel subscription: ${response.status}`);
      }

      // Update UI immediately
      setSubscriptions(prev =>
        prev.map(sub =>
          sub._id === subscriptionId ? { ...sub, status: 'Cancelled' } : sub
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
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`; // ✅ Updated to Naira for Nigeria
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      case 'Paused': return 'status-paused';
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

  // Split subscriptions
  const activeSubscriptions = subscriptions.filter(sub => 
    ['Active', 'Paused'].includes(sub.status)
  );
  const inactiveSubscriptions = subscriptions.filter(sub => 
    ['Completed', 'Cancelled'].includes(sub.status)
  );

  if (isLoading) {
    return <div className="subscriptions-page loading">Loading your subscriptions...</div>;
  }

  return (
    <div className="subscriptions-page">
      <div className="dashboard-header">
        <h1>My Subscriptions</h1>
        <div className="header-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search subscriptions..." />
          </div>
          <button className="btn-primary" onClick={handleCreateNewSubscription}>
            <i className="fas fa-plus"></i> New Subscription
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

      <div className="content-section">
        {/* ✅ Active Subscriptions */}
        {activeSubscriptions.length > 0 && (
          <>
            <div className="section-header">
              <h2>Active Subscriptions</h2>
              <span className="count-badge">{activeSubscriptions.length}</span>
            </div>
            <div className="subscriptions-list">
              {activeSubscriptions.map(subscription => (
                <div key={subscription._id} className="subscription-card">
                  <div className="subscription-header">
                    <div className="subscription-id">#{subscription._id}</div>
                    <div className={`subscription-status ${getStatusClass(subscription.status)}`}>
                      {subscription.status}
                    </div>
                  </div>
                  <div className="subscription-details">
                    <div className="detail-row">
                      <span className="detail-label">Plan:</span>
                      <span className="detail-value">{subscription.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cylinder Size:</span>
                      <span className="detail-value">{subscription.size}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">
                        {formatCurrency(subscription.price)}
                        {subscription.frequency !== 'One-Time' && getFrequencyText(subscription.frequency)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Next Delivery:</span>
                      <span className="detail-value">{formatDate(subscription.nextDelivery)}</span>
                    </div>
                  </div>
                  <div className="subscription-actions">
                    <button className="btn-primary">Manage</button>
                    <button 
                      className="btn-warning" 
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

        {/* ✅ Inactive Subscriptions */}
        {inactiveSubscriptions.length > 0 && (
          <>
            <div className="section-header">
              <h2>Subscription History</h2>
              <span className="count-badge">{inactiveSubscriptions.length}</span>
            </div>
            <div className="subscriptions-list">
              {inactiveSubscriptions.map(subscription => (
                <div key={subscription._id} className="subscription-card">
                  <div className="subscription-header">
                    <div className="subscription-id">#{subscription._id}</div>
                    <div className={`subscription-status ${getStatusClass(subscription.status)}`}>
                      {subscription.status}
                    </div>
                  </div>
                  <div className="subscription-details">
                    <div className="detail-row">
                      <span className="detail-label">Plan:</span>
                      <span className="detail-value">{subscription.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cylinder Size:</span>
                      <span className="detail-value">{subscription.size}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value">
                        {formatCurrency(subscription.price)}
                        {subscription.frequency !== 'One-Time' && getFrequencyText(subscription.frequency)}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Created:</span>
                      <span className="detail-value">{formatDate(subscription.createdAt)}</span>
                    </div>
                  </div>
                  <div className="subscription-actions">
                    <button className="btn-secondary">View Details</button>
                    {subscription.status === 'Completed' && (
                      <button className="btn-primary">Subscribe Again</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ✅ No subscriptions fallback */}
        {subscriptions.length === 0 && (
          <div className="no-subscriptions">
            <p>You don't have any subscriptions yet.</p>
            <button className="btn-primary" onClick={handleCreateNewSubscription}>
              Create Your First Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;
