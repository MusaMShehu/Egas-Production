// components/SubscriptionManagement.js
import React, { useState, useEffect } from 'react';
import SubscriptionList from './SubscriptionList';
import SubscriptionForm from './SubscriptionForm';
import SubscriptionDetails from './SubscriptionDetails';
import './SubscriptionManagement.css';

const SubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]); // always start with []
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); 
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [filters, setFilters] = useState({
    frequency: 'all',
    size: 'all',
    search: ''
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/admin/subscriptions');
      const data = await response.json();

      console.log("API response:", data); // debug log

      if (response.ok) {
        setSubscriptions(Array.isArray(data.subscriptions) ? data.subscriptions : []);
      } else {
        setError(data.message || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createSubscription = async (subscriptionData) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptions([...(subscriptions || []), data.subscription]);
        setView('list');
        return { success: true, message: 'Subscription created successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to create subscription' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const updateSubscription = async (subscriptionId, subscriptionData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/subscriptions/${subscriptionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptions((subscriptions || []).map(sub => 
          sub._id === subscriptionId ? data.subscription : sub
        ));
        
        if (selectedSubscription && selectedSubscription._id === subscriptionId) {
          setSelectedSubscription(data.subscription);
        }
        
        return { success: true, message: 'Subscription updated successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to update subscription' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const deleteSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptions((subscriptions || []).filter(sub => sub._id !== subscriptionId));
        return { success: true, message: 'Subscription deleted successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to delete subscription' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const filteredSubscriptions = (subscriptions || []).filter(subscription => {
    // Filter by frequency
    if (filters.frequency !== 'all' && subscription.frequency !== filters.frequency) {
      return false;
    }
    
    // Filter by size
    if (filters.size !== 'all' && subscription.size !== filters.size) {
      return false;
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        subscription.name?.toLowerCase().includes(searchTerm) ||
        subscription.userId?.firstName?.toLowerCase().includes(searchTerm) ||
        subscription.userId?.lastName?.toLowerCase().includes(searchTerm) ||
        subscription.userId?.email?.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  const handleViewSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedSubscription(null);
  };

  if (view === 'details' && selectedSubscription) {
    return (
      <SubscriptionDetails
        subscription={selectedSubscription}
        onBack={handleBackToList}
        onUpdateSubscription={updateSubscription}
        onDeleteSubscription={deleteSubscription}
      />
    );
  }

  if (view === 'create') {
    return (
      <SubscriptionForm
        onSubmit={createSubscription}
        onCancel={handleBackToList}
        mode="create"
      />
    );
  }

  return (
    <div className="subscription-management">
      <div className="subscription-header">
        <h1>Subscription Management</h1>
        <div className="header-actions">
          <button onClick={fetchSubscriptions} className="btn-refresh">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
          <button onClick={() => setView('create')} className="btn-create">
            <i className="fas fa-plus"></i> New Subscription
          </button>
        </div>
      </div>

      <div className="subscription-filters">
        <div className="filter-group">
          <label htmlFor="frequency-filter">Frequency:</label>
          <select
            id="frequency-filter"
            value={filters.frequency}
            onChange={(e) => setFilters({...filters, frequency: e.target.value})}
          >
            <option value="all">All Frequencies</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="One-Time">One-Time</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="size-filter">Cylinder Size:</label>
          <select
            id="size-filter"
            value={filters.size}
            onChange={(e) => setFilters({...filters, size: e.target.value})}
          >
            <option value="all">All Sizes</option>
            <option value="6kg">6kg</option>
            <option value="12kg">12kg</option>
            <option value="50kg">50kg</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="search-filter">Search:</label>
          <input
            id="search-filter"
            type="text"
            placeholder="Search by name or customer"
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
      </div>
      
      <SubscriptionList
        subscriptions={filteredSubscriptions}
        loading={loading}
        error={error}
        onViewSubscription={handleViewSubscription}
        onEditSubscription={(subscription) => {
          setSelectedSubscription(subscription);
          setView('details');
        }}
        onDeleteSubscription={deleteSubscription}
      />
    </div>
  );
};

export default SubscriptionManagement;
