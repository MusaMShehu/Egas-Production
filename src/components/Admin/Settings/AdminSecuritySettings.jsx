// components/settings/SecuritySettings.js
import React, { useState } from 'react';

const SecuritySettings = ({ settings, onUpdate, saveStatus }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: settings.twoFactorEnabled || false,
    sessionTimeout: settings.sessionTimeout || 60,
    loginAlerts: settings.loginAlerts || true,
    passwordExpiry: settings.passwordExpiry || 90,
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      alert('New password must be at least 8 characters long');
      return;
    }

    const result = await onUpdate(formData);
    
    if (result.success) {
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="settings-section">
      <h2>Security Settings</h2>
      <p className="section-description">
        Manage your account security and authentication settings
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="security-section">
          <h3>Password Settings</h3>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input-group">
              <input
                type={showPassword.current ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('current')}
              >
                <i className={`fas ${showPassword.current ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-group">
              <input
                type={showPassword.new ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                <i className={`fas ${showPassword.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-group">
              <input
                type={showPassword.confirm ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                <i className={`fas ${showPassword.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
        </div>

        <div className="security-section">
          <h3>Security Preferences</h3>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="twoFactorEnabled"
                checked={formData.twoFactorEnabled}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Enable Two-Factor Authentication
            </label>
            <p className="checkbox-help">
              Add an extra layer of security to your account
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="loginAlerts"
                checked={formData.loginAlerts}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Enable Login Alerts
            </label>
            <p className="checkbox-help">
              Get notified when someone logs into your account from a new device
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
            <select
              id="sessionTimeout"
              name="sessionTimeout"
              value={formData.sessionTimeout}
              onChange={handleChange}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="120">2 hours</option>
              <option value="240">4 hours</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="passwordExpiry">Password Expiry (days)</label>
            <select
              id="passwordExpiry"
              name="passwordExpiry"
              value={formData.passwordExpiry}
              onChange={handleChange}
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">365 days</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-save"
            disabled={saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Update Security Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecuritySettings;