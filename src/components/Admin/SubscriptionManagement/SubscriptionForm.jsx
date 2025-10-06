// components/SubscriptionForm.js
import React, { useState, useEffect } from 'react';

const SubscriptionForm = ({ subscription, onSubmit, onCancel, mode }) => {
  const [formData, setFormData] = useState({
    name: '',
    size: '6kg',
    frequency: 'Monthly',
    price: 0,
    userId: ''
  });
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'create') {
      fetchUsers();
    }
    
    if (subscription && mode === 'edit') {
      setFormData({
        name: subscription.name || '',
        size: subscription.size || '6kg',
        frequency: subscription.frequency || 'Monthly',
        price: subscription.price || 0,
        userId: subscription.userId?._id || ''
      });
    }
  }, [subscription, mode]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.size) newErrors.size = 'Cylinder size is required';
    if (!formData.frequency) newErrors.frequency = 'Frequency is required';
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (mode === 'create' && !formData.userId && !formData.name) {
      newErrors.userId = 'Either select a user or enter a plan name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const result = await onSubmit(formData);
    
    if (!result.success) {
      setErrors({ submit: result.message });
    }
    
    setIsSubmitting(false);
  };

  const presetPlans = [
    { name: 'Basic Monthly', size: '6kg', frequency: 'Monthly', price: 4500 },
    { name: 'Standard Monthly', size: '12kg', frequency: 'Monthly', price: 8500 },
    { name: 'Premium Monthly', size: '50kg', frequency: 'Monthly', price: 35000 },
    { name: 'Basic Weekly', size: '6kg', frequency: 'Weekly', price: 1200 },
    { name: 'Standard Weekly', size: '12kg', frequency: 'Weekly', price: 2200 },
  ];

  const applyPreset = (plan) => {
    setFormData({
      ...formData,
      name: plan.name,
      size: plan.size,
      frequency: plan.frequency,
      price: plan.price
    });
  };

  return (
    <div className="subscription-form-container">
      <div className="form-header">
        <h2>{mode === 'create' ? 'Create New Subscription' : 'Edit Subscription'}</h2>
        <button onClick={onCancel} className="btn-back">
          <i className="fas fa-arrow-left"></i> Back
        </button>
      </div>

      {errors.submit && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {errors.submit}
        </div>
      )}

      <div className="form-content">
        <div className="preset-plans">
          <h3>Preset Plans</h3>
          <div className="preset-grid">
            {presetPlans.map((plan, index) => (
              <div 
                key={index} 
                className="preset-card"
                onClick={() => applyPreset(plan)}
              >
                <div className="preset-name">{plan.name}</div>
                <div className="preset-details">
                  <span className="size">{plan.size}</span>
                  <span className="frequency">{plan.frequency}</span>
                </div>
                <div className="preset-price">₦{plan.price.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="form-group">
            <label htmlFor="name">Plan Name (optional for user subscriptions):</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Custom Plan, Premium Package"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {mode === 'create' && (
            <div className="form-group">
              <label htmlFor="userId">Customer (leave empty for preset plans):</label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className={errors.userId ? 'error' : ''}
                disabled={loadingUsers}
              >
                <option value="">Select a customer</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              {loadingUsers && <span>Loading users...</span>}
              {errors.userId && <span className="error-text">{errors.userId}</span>}
            </div>
          )}

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
              onClick={onCancel}
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
              {mode === 'create' ? 'Create Subscription' : 'Update Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;