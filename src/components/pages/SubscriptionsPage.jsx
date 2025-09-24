// components/pages/SubscriptionsPage.js
import React, { useState, useEffect } from 'react';
import { formatDate, getNextMonthDate } from '../../utils/helpers';
import '../../styles/SubscriptionsPage.css';

const SubscriptionsPage = ({ user, setUser }) => {
  const [showNewSubscription, setShowNewSubscription] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subscription plans from backend API
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/v1/subscriptions');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setSubscriptionPlans(data);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    if (window.confirm(`Confirm subscription to ${plan.name} for ₦${plan.price.toLocaleString()} per month?`)) {
      try {
        const response = await fetch('http://localhost:5000/api/v1/subscriptions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            planId: plan.id
          }),
        });

        if (!response.ok) {
          throw new Error(`Subscription failed with status: ${response.status}`);
        }

        const subscriptionData = await response.json();
        
        const updatedUser = { 
          ...user, 
          subscription: {
            active: true,
            type: "monthly",
            product: plan.product,
            price: plan.price,
            nextDelivery: getNextMonthDate(),
            status: "active",
            id: subscriptionData.subscriptionId // Assuming the API returns a subscription ID
          }
        };
        
        setUser(updatedUser);
        alert('Subscription activated successfully!');
      } catch (error) {
        console.error('Subscription error:', error);
        alert('Failed to activate subscription. Please try again.');
      }
    }
  };

  const handleCancelSubscription = async () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      try {
        const response = await fetch('/api/cancel-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            subscriptionId: user.subscription.id
          }),
        });

        if (!response.ok) {
          throw new Error(`Cancellation failed with status: ${response.status}`);
        }

        const updatedUser = { ...user };
        updatedUser.subscription.active = false;
        setUser(updatedUser);
        alert('Subscription cancelled successfully!');
      } catch (error) {
        console.error('Cancellation error:', error);
        alert('Failed to cancel subscription. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="subscriptions-page">
        <div className="subscriptions-container">
          <div className="loading-spinner">Loading subscription plans...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscriptions-page">
        <div className="subscriptions-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="subscriptions-page">
      <div className="subscriptions-container">
        <div className="subscriptions-header">
          <h2 className="text-xl font-bold">My Subscriptions</h2>
          <button 
            className="new-subscription-btn" 
            onClick={() => setShowNewSubscription(!showNewSubscription)}
          >
            <i className="fas fa-plus mr-2"></i> New Subscription
          </button>
        </div>
        
        <div>
          {user.subscription.active ? (
            <div className="active-subscription">
              <div className="subscription-header">
                <div>
                  <h3 className="font-bold">Active Subscription</h3>
                  <p className="text-gray-600">{user.subscription.type.replace(/^\w/, c => c.toUpperCase())} Auto-Refill</p>
                </div>
                <span className="status-badge">Active</span>
              </div>
              
              <div className="subscription-details">
                <div className="detail-item">
                  <span className="detail-label">Product</span>
                  <span className="detail-value">{user.subscription.product}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price</span>
                  <span className="detail-value">₦{user.subscription.price.toLocaleString()}/month</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Next Delivery</span>
                  <span className="detail-value">{formatDate(user.subscription.nextDelivery)}</span>
                </div>
              </div>
              
              <div className="subscription-actions">
                <button className="subscription-action-btn modify-btn">
                  Modify
                </button>
                <button 
                  className="subscription-action-btn cancel-btn"
                  onClick={handleCancelSubscription}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="no-subscription">
              <p className="text-gray-600 mb-3">You don't have an active subscription</p>
              <button 
                className="action-button bg-blue-600" 
                onClick={() => setShowNewSubscription(true)}
              >
                Subscribe Now
              </button>
            </div>
          )}
        </div>
        
        {(showNewSubscription || !user.subscription.active) && (
          <div className="plans-section">
            <h3 className="font-semibold mb-4">Available Subscription Plans</h3>
            <div className="plans-grid">
              {subscriptionPlans.map(plan => (
                <div key={plan.id} className="plan-card">
                  <h4 className="plan-name">{plan.name}</h4>
                  <p className="plan-product">{plan.product}</p>
                  <p className="plan-price">₦{plan.price.toLocaleString()}</p>
                  <p className="plan-savings">{plan.savings}</p>
                  <button 
                    className="choose-plan-btn" 
                    onClick={() => handleSubscribe(plan)}
                  >
                    Choose Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;