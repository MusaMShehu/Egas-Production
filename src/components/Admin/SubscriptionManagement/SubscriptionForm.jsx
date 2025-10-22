// components/SubscriptionForm.js
import React, { useState, useEffect } from 'react';
import { FaCalculator, FaSave, FaTimes } from 'react-icons/fa';
import './SubscriptionManagement.css';

const SubscriptionForm = ({ onSubmit, onCancel, mode = 'create', initialData = {} }) => {
  const [formData, setFormData] = useState({
    userId: '',
    planName: '',
    planType: 'preset',
    size: '6kg',
    frequency: 'Monthly',
    subscriptionPeriod: 1,
    price: 0,
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    customPlanDetails: {
      size: '',
      frequency: '',
      subscriptionPeriod: 1
    }
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);

  // Fetch users for dropdown
  useEffect(() => {
    fetchUsers();
  }, []);

  // Set initial data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        userId: initialData.userId?._id || initialData.userId || '',
        planName: initialData.planName || '',
        planType: initialData.planType || 'preset',
        size: initialData.size || '6kg',
        frequency: initialData.frequency || 'Monthly',
        subscriptionPeriod: initialData.subscriptionPeriod || 1,
        price: initialData.price || 0,
        status: initialData.status || 'active',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
        customPlanDetails: initialData.customPlanDetails || {
          size: '',
          frequency: '',
          subscriptionPeriod: 1
        }
      });
    }
  }, [mode, initialData]);

  const fetchUsers = async () => {
    try {
      // This would typically call your users API
      const mockUsers = [
        { _id: '1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        { _id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('customPlanDetails.')) {
      const customField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customPlanDetails: {
          ...prev.customPlanDetails,
          [customField]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePlanTypeChange = (e) => {
    const planType = e.target.value;
    setFormData(prev => ({
      ...prev,
      planType,
      // Reset custom plan details when switching away from custom
      ...(planType !== 'custom' && {
        customPlanDetails: {
          size: '',
          frequency: '',
          subscriptionPeriod: 1
        }
      })
    }));
  };

  const calculatePrice = () => {
    // Simple price calculation based on size and frequency
    const sizeKg = parseInt(formData.size) || 6;
    const basePrice = sizeKg * 1000; // ₦1000 per kg
    
    let frequencyMultiplier = 1;
    switch (formData.frequency) {
      case 'Daily': frequencyMultiplier = 30; break;
      case 'Weekly': frequencyMultiplier = 4; break;
      case 'Bi-Weekly': frequencyMultiplier = 2; break;
      case 'Monthly': frequencyMultiplier = 1; break;
      default: frequencyMultiplier = 1;
    }

    const totalPrice = basePrice * frequencyMultiplier * formData.subscriptionPeriod;
    setFormData(prev => ({ ...prev, price: totalPrice }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) newErrors.userId = 'User is required';
    if (!formData.planName) newErrors.planName = 'Plan name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.planType === 'custom') {
      if (!formData.customPlanDetails.size) newErrors['customPlanDetails.size'] = 'Size is required for custom plans';
      if (!formData.customPlanDetails.frequency) newErrors['customPlanDetails.frequency'] = 'Frequency is required for custom plans';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="asm-subscription-form-container">
      <div className="asm-form-header">
        <h2>{mode === 'create' ? 'Create New Subscription' : 'Edit Subscription'}</h2>
        <button onClick={onCancel} className="asm-btn asm-btn-cancel" disabled={loading}>
          <FaTimes className="asm-icon" /> Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="asm-subscription-form">
        {errors.submit && (
          <div className="asm-error-message asm-global-error">
            {errors.submit}
          </div>
        )}

        <div className="asm-form-section">
          <h3>Basic Information</h3>
          
          <div className="asm-form-group">
            <label htmlFor="userId">Customer *</label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={errors.userId ? 'asm-error' : ''}
              disabled={loading}
            >
              <option value="">Select a customer</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.firstName} {user.lastName} ({user.email})
                </option>
              ))}
            </select>
            {errors.userId && <span className="asm-error-text">{errors.userId}</span>}
          </div>

          <div className="asm-form-group">
            <label htmlFor="planName">Plan Name *</label>
            <input
              type="text"
              id="planName"
              name="planName"
              value={formData.planName}
              onChange={handleChange}
              className={errors.planName ? 'asm-error' : ''}
              placeholder="Enter plan name"
              disabled={loading}
            />
            {errors.planName && <span className="asm-error-text">{errors.planName}</span>}
          </div>

          <div className="asm-form-row">
            <div className="asm-form-group">
              <label htmlFor="planType">Plan Type</label>
              <select
                id="planType"
                name="planType"
                value={formData.planType}
                onChange={handlePlanTypeChange}
                disabled={loading}
              >
                <option value="preset">Preset</option>
                <option value="custom">Custom</option>
                <option value="one-time">One Time</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>

            <div className="asm-form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="cancelled">Cancelled</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {formData.planType === 'custom' ? (
          <div className="asm-form-section">
            <h3>Custom Plan Details</h3>
            
            <div className="asm-form-row">
              <div className="asm-form-group">
                <label htmlFor="customSize">Size *</label>
                <select
                  id="customSize"
                  name="customPlanDetails.size"
                  value={formData.customPlanDetails.size}
                  onChange={handleChange}
                  className={errors['customPlanDetails.size'] ? 'asm-error' : ''}
                  disabled={loading}
                >
                  <option value="">Select size</option>
                  <option value="6kg">6kg</option>
                  <option value="12kg">12kg</option>
                  <option value="50kg">50kg</option>
                </select>
                {errors['customPlanDetails.size'] && (
                  <span className="asm-error-text">{errors['customPlanDetails.size']}</span>
                )}
              </div>

              <div className="asm-form-group">
                <label htmlFor="customFrequency">Frequency *</label>
                <select
                  id="customFrequency"
                  name="customPlanDetails.frequency"
                  value={formData.customPlanDetails.frequency}
                  onChange={handleChange}
                  className={errors['customPlanDetails.frequency'] ? 'asm-error' : ''}
                  disabled={loading}
                >
                  <option value="">Select frequency</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="One-Time">One-Time</option>
                </select>
                {errors['customPlanDetails.frequency'] && (
                  <span className="asm-error-text">{errors['customPlanDetails.frequency']}</span>
                )}
              </div>
            </div>

            <div className="asm-form-group">
              <label htmlFor="customSubscriptionPeriod">Subscription Period (Months)</label>
              <input
                type="number"
                id="customSubscriptionPeriod"
                name="customPlanDetails.subscriptionPeriod"
                value={formData.customPlanDetails.subscriptionPeriod}
                onChange={handleChange}
                min="1"
                max="12"
                disabled={loading}
              />
            </div>
          </div>
        ) : (
          <div className="asm-form-section">
            <h3>Subscription Details</h3>
            
            <div className="asm-form-row">
              <div className="asm-form-group">
                <label htmlFor="size">Cylinder Size</label>
                <select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="6kg">6kg</option>
                  <option value="12kg">12kg</option>
                  <option value="50kg">50kg</option>
                </select>
              </div>

              <div className="asm-form-group">
                <label htmlFor="frequency">Delivery Frequency</label>
                <select
                  id="frequency"
                  name="frequency"
                  value={formData.frequency}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-Weekly">Bi-Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="One-Time">One-Time</option>
                </select>
              </div>
            </div>

            <div className="asm-form-group">
              <label htmlFor="subscriptionPeriod">Subscription Period (Months)</label>
              <input
                type="number"
                id="subscriptionPeriod"
                name="subscriptionPeriod"
                value={formData.subscriptionPeriod}
                onChange={handleChange}
                min="1"
                max="12"
                disabled={loading}
              />
            </div>
          </div>
        )}

        <div className="asm-form-section">
          <h3>Pricing & Dates</h3>
          
          <div className="asm-form-row">
            <div className="asm-form-group">
              <label htmlFor="price">Price (₦)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={loading}
              />
            </div>

            <div className="asm-form-group">
              <button 
                type="button" 
                onClick={calculatePrice}
                className="asm-btn asm-btn-secondary"
                disabled={loading}
              >
                <FaCalculator className="asm-icon" /> Calculate Price
              </button>
            </div>
          </div>

          <div className="asm-form-row">
            <div className="asm-form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={errors.startDate ? 'asm-error' : ''}
                disabled={loading}
              />
              {errors.startDate && <span className="asm-error-text">{errors.startDate}</span>}
            </div>

            <div className="asm-form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <div className="asm-form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="asm-btn asm-btn-outline"
            disabled={loading}
          >
            <FaTimes className="asm-icon" /> Cancel
          </button>
          <button
            type="submit"
            className="asm-btn asm-btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSave className="asm-icon asm-spin" /> Saving...
              </>
            ) : mode === 'create' ? (
              <>
                <FaSave className="asm-icon" /> Create Subscription
              </>
            ) : (
              <>
                <FaSave className="asm-icon" /> Update Subscription
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;