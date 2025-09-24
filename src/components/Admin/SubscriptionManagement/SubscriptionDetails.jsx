// components/SubscriptionDetails.js
import React, { useState } from 'react';

const SubscriptionDetails = ({ subscription, onBack, onUpdateSubscription, onDeleteSubscription }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: subscription.name || '',
    size: subscription.size || '6kg',
    frequency: subscription.frequency || 'Monthly',
    price: subscription.price || 0
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.size) newErrors.size = 'Cylinder size is required';
    if (!formData.frequency) newErrors.frequency = 'Frequency is required';
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await onUpdateSubscription(subscription._id, formData);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setErrors({ submit: result.message });
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    const result = await onDeleteSubscription(subscription._id);
    if (result.success) {
      onBack();
    } else {
      alert(result.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (isEditing) {
    return (
      <div className="subscription-details-container">
        <div className="details-header">
          <button onClick={() => setIsEditing(false)} className="btn-back">
            <i className="fas fa-arrow-left"></i> Back to Details
          </button>
          <h2>Edit Subscription</h2>
        </div>

        {errors.submit && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="form-group">
            <label htmlFor="name">Plan Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Custom Plan, Premium Package"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="size">Cylinder Size *</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className={errors.size ? 'error' : ''}
              >
                <option value="6kg">6kg</option>
                <option value="12kg">12kg</option>
                <option value="50kg">50kg</option>
              </select>
              {errors.size && <span className="error-text">{errors.size}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="frequency">Delivery Frequency *</label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className={errors.frequency ? 'error' : ''}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="One-Time">One-Time</option>
              </select>
              {errors.frequency && <span className="error-text">{errors.frequency}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (₦) *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-submit"
            >
              {isSubmitting && <i className="fas fa-spinner fa-spin"></i>}
              Update Subscription
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="subscription-details-container">
      <div className="details-header">
        <button onClick={onBack} className="btn-back">
          <i className="fas fa-arrow-left"></i> Back to Subscriptions
        </button>
        <div className="header-actions">
          <button
            onClick={() => setIsEditing(true)}
            className="btn-edit"
          >
            <i className="fas fa-edit"></i> Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-delete"
          >
            <i className="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>

      <div className="details-content">
        <div className="details-card">
          <h3>Subscription Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Plan Name:</span>
              <span className="value">{subscription.name || 'Custom Subscription'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Cylinder Size:</span>
              <span className={`value size-badge ${getSizeBadgeClass(subscription.size)}`}>
                {subscription.size}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Frequency:</span>
              <span className={`value frequency-badge ${getFrequencyBadgeClass(subscription.frequency)}`}>
                {subscription.frequency}
              </span>
            </div>
            <div className="detail-item">
              <span className="label">Price:</span>
              <span className="value price">₦{subscription.price?.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Created:</span>
              <span className="value">{formatDate(subscription.createdAt)}</span>
            </div>
          </div>
        </div>

        {subscription.userId && (
          <div className="details-card">
            <h3>Customer Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Name:</span>
                <span className="value">
                  {subscription.userId.firstName} {subscription.userId.lastName}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{subscription.userId.email}</span>
              </div>
              <div className="detail-item">
                <span className="label">Phone:</span>
                <span className="value">{subscription.userId.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="details-card">
          <h3>Billing Information</h3>
          <div className="billing-summary">
            <div className="billing-item">
              <span className="label">Base Price:</span>
              <span className="value">₦{subscription.price?.toLocaleString()}</span>
            </div>
            <div className="billing-item">
              <span className="label">Delivery Fee:</span>
              <span className="value">₦0</span>
            </div>
            <div className="billing-item total">
              <span className="label">Total:</span>
              <span className="value">₦{subscription.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete this subscription? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default SubscriptionDetails;