// components/UserForm.js
import React, { useState } from 'react';
import { FaArrowLeft, FaExclamationCircle, FaSpinner, FaPlus, FaSave } from 'react-icons/fa';

const UserForm = ({ user, onSubmit, onCancel, mode, availableRoles }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    gender: user?.gender || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    gpsCoordinates: user?.gpsCoordinates ? {
      type: user.gpsCoordinates.type || 'Point',
      coordinates: user.gpsCoordinates.coordinates || [0, 0]
    } : { type: 'Point', coordinates: [0, 0] },
    profilePic: user?.profilePic || '',
    role: user?.role || 'user',
    walletBalance: user?.walletBalance || 0,
    isActive: user?.isActive !== undefined ? user.isActive : true
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCoordinateChange = (index, value) => {
    const newCoordinates = [...formData.gpsCoordinates.coordinates];
    newCoordinates[index] = parseFloat(value) || 0;
    
    setFormData(prev => ({
      ...prev,
      gpsCoordinates: {
        ...prev.gpsCoordinates,
        coordinates: newCoordinates
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Prepare data for API
      const submitData = { ...formData };
      
      // Don't send password if empty in edit mode
      if (mode === 'edit' && !submitData.password) {
        delete submitData.password;
      }

      // Convert dob to Date object
      if (submitData.dob) {
        submitData.dob = new Date(submitData.dob).toISOString();
      }

      // Convert walletBalance to number
      submitData.walletBalance = parseFloat(submitData.walletBalance) || 0;

      const result = await onSubmit(submitData);
      
      if (!result.success) {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="aum-user-form-container">
      <div className="aum-form-header">
        <h2>{mode === 'create' ? 'Create New User' : 'Edit User'}</h2>
        <button onClick={onCancel} className="aum-btn aum-btn-outline">
          <FaArrowLeft /> Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="aum-user-form">
        {errors.submit && (
          <div className="aum-error-message">
            <FaExclamationCircle />
            {errors.submit}
          </div>
        )}

        <div className="aum-form-grid">
          {/* Personal Information */}
          <div className="aum-form-section">
            <h3>Personal Information</h3>
            <div className="aum-form-row">
              <div className="aum-form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'aum-error' : ''}
                />
                {errors.firstName && <span className="aum-field-error">{errors.firstName}</span>}
              </div>

              <div className="aum-form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'aum-error' : ''}
                />
                {errors.lastName && <span className="aum-field-error">{errors.lastName}</span>}
              </div>
            </div>

            <div className="aum-form-row">
              <div className="aum-form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'aum-error' : ''}
                  disabled={mode === 'edit'}
                />
                {errors.email && <span className="aum-field-error">{errors.email}</span>}
              </div>

              <div className="aum-form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'aum-error' : ''}
                  placeholder="+1234567890"
                />
                {errors.phone && <span className="aum-field-error">{errors.phone}</span>}
              </div>
            </div>

            {mode === 'create' && (
              <div className="aum-form-group">
                <label>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'aum-error' : ''}
                  minLength="6"
                />
                {errors.password && <span className="aum-field-error">{errors.password}</span>}
              </div>
            )}

            <div className="aum-form-row">
              <div className="aum-form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div className="aum-form-group">
                <label>Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="aum-form-section">
            <h3>Address Information</h3>
            <div className="aum-form-group">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'aum-error' : ''}
                placeholder="Street address"
              />
              {errors.address && <span className="aum-field-error">{errors.address}</span>}
            </div>

            <div className="aum-form-row">
              <div className="aum-form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'aum-error' : ''}
                />
                {errors.city && <span className="aum-field-error">{errors.city}</span>}
              </div>

              <div className="aum-form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'aum-error' : ''}
                />
                {errors.state && <span className="aum-field-error">{errors.state}</span>}
              </div>
            </div>

            <div className="aum-form-section">
              <h4>GPS Coordinates</h4>
              <div className="aum-form-row">
                <div className="aum-form-group">
                  <label>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.gpsCoordinates.coordinates[0]}
                    onChange={(e) => handleCoordinateChange(0, e.target.value)}
                    placeholder="Longitude"
                  />
                </div>

                <div className="aum-form-group">
                  <label>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.gpsCoordinates.coordinates[1]}
                    onChange={(e) => handleCoordinateChange(1, e.target.value)}
                    placeholder="Latitude"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="aum-form-section">
            <h3>Account Settings</h3>
            <div className="aum-form-row">
              <div className="aum-form-group">
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  {availableRoles.map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="aum-form-group">
                <label>Wallet Balance</label>
                <input
                  type="number"
                  name="walletBalance"
                  value={formData.walletBalance}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="aum-form-group">
              <label>Profile Picture URL</label>
              <input
                type="url"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                placeholder="https://example.com/profile.jpg"
              />
            </div>

            <div className="aum-form-group aum-checkbox-group">
              <label className="aum-checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <span className="aum-checkmark"></span>
                Active Account
              </label>
            </div>
          </div>
        </div>

        <div className="aum-form-actions">
          <button type="button" onClick={onCancel} className="aum-btn aum-btn-outline">
            Cancel
          </button>
          <button type="submit" className="aum-btn aum-btn-primary" disabled={loading}>
            {loading ? (
              <>
                <FaSpinner className="aum-fa-spin" />
                {mode === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                {mode === 'create' ? <FaPlus /> : <FaSave />}
                {mode === 'create' ? 'Create User' : 'Update User'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;