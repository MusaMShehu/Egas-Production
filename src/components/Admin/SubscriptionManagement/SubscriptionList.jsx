// components/SubscriptionList.js
import React, { useState } from 'react';

const SubscriptionList = ({ 
  subscriptions, 
  loading, 
  error, 
  onViewSubscription, 
  onEditSubscription,
  onDeleteSubscription 
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (subscription) => {
    const result = await onDeleteSubscription(subscription._id);
    if (result.success) {
      setDeleteConfirm(null);
    } else {
      alert(result.message);
    }
  };

  const getFrequencyBadgeClass = (frequency) => {
    switch (frequency) {
      case 'Daily': return 'frequency-daily';
      case 'Weekly': return 'frequency-weekly';
      case 'Bi-Weekly': return 'frequency-biweekly';
      case 'Monthly': return 'frequency-monthly';
      case 'One-Time': return 'frequency-onetime';
      default: return 'frequency-default';
    }
  };

  const getSizeBadgeClass = (size) => {
    switch (size) {
      case '6kg': return 'size-small';
      case '12kg': return 'size-medium';
      case '50kg': return 'size-large';
      default: return 'size-default';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading subscriptions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-calendar-check"></i>
        <h3>No subscriptions found</h3>
        <p>Try adjusting your filters or create a new subscription.</p>
      </div>
    );
  }

  return (
    <div className="subscription-list-container">
      <div className="subscription-grid">
        {subscriptions.map(subscription => (
          <div key={subscription._id} className="subscription-card">
            <div className="subscription-card-header">
              <div className="subscription-name">
                {subscription.name || 'Custom Subscription'}
              </div>
              <div className="subscription-date">
                {new Date(subscription.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="subscription-card-body">
              <div className="customer-info">
                {subscription.userId ? (
                  <>
                    <div className="customer-name">
                      {subscription.userId.firstName} {subscription.userId.lastName}
                    </div>
                    <div className="customer-email">{subscription.userId.email}</div>
                  </>
                ) : (
                  <div className="customer-name">Preset Plan</div>
                )}
              </div>
              
              <div className="subscription-details">
                <div className="detail-item">
                  <span className="label">Size:</span>
                  <span className={`size-badge ${getSizeBadgeClass(subscription.size)}`}>
                    {subscription.size}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Frequency:</span>
                  <span className={`frequency-badge ${getFrequencyBadgeClass(subscription.frequency)}`}>
                    {subscription.frequency}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="value">₦{subscription.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="subscription-card-footer">
              <button
                onClick={() => onViewSubscription(subscription)}
                className="btn-view-details"
              >
                <i className="fas fa-eye"></i> View Details
              </button>
              <div className="action-buttons">
                <button
                  onClick={() => onEditSubscription(subscription)}
                  className="btn-edit"
                  title="Edit subscription"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => setDeleteConfirm(subscription)}
                  className="btn-delete"
                  title="Delete subscription"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete the subscription for {deleteConfirm.userId ? 
              `${deleteConfirm.userId.firstName} ${deleteConfirm.userId.lastName}` : 
              'this preset plan'}? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn-confirm-delete"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionList;