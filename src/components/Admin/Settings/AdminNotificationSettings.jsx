// components/settings/NotificationSettings.js
import React, { useState } from 'react';

const NotificationSettings = ({ settings, onUpdate, saveStatus }) => {
  const [formData, setFormData] = useState({
    emailNotifications: settings.emailNotifications || true,
    pushNotifications: settings.pushNotifications || false,
    orderAlerts: settings.orderAlerts || true,
    paymentAlerts: settings.paymentAlerts || true,
    userAlerts: settings.userAlerts || true,
    systemAlerts: settings.systemAlerts || true,
    marketingEmails: settings.marketingEmails || false,
    digestEmail: settings.digestEmail || true,
    digestFrequency: settings.digestFrequency || 'daily',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onUpdate(formData);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div className="settings-section">
      <h2>Notification Settings</h2>
      <p className="section-description">
        Configure how you receive notifications and alerts
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="notification-section">
          <h3>Notification Channels</h3>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Email Notifications
            </label>
            <p className="checkbox-help">
              Receive important notifications via email
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="pushNotifications"
                checked={formData.pushNotifications}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Push Notifications
            </label>
            <p className="checkbox-help">
              Receive browser push notifications
            </p>
          </div>
        </div>

        <div className="notification-section">
          <h3>Alert Types</h3>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="orderAlerts"
                checked={formData.orderAlerts}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Order Alerts
            </label>
            <p className="checkbox-help">
              Get notified about new orders and order status changes
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="paymentAlerts"
                checked={formData.paymentAlerts}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Payment Alerts
            </label>
            <p className="checkbox-help">
              Receive notifications for payment successes and failures
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="userAlerts"
                checked={formData.userAlerts}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              User Alerts
            </label>
            <p className="checkbox-help">
              Get notified about new user registrations and important user actions
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="systemAlerts"
                checked={formData.systemAlerts}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              System Alerts
            </label>
            <p className="checkbox-help">
              Receive critical system notifications and maintenance alerts
            </p>
          </div>
        </div>

        <div className="notification-section">
          <h3>Email Preferences</h3>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Marketing Emails
            </label>
            <p className="checkbox-help">
              Receive promotional emails and product updates
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="digestEmail"
                checked={formData.digestEmail}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Daily/Weekly Digest
            </label>
            <p className="checkbox-help">
              Receive a summary of important events and metrics
            </p>
          </div>

          {formData.digestEmail && (
            <div className="form-group">
              <label htmlFor="digestFrequency">Digest Frequency</label>
              <select
                id="digestFrequency"
                name="digestFrequency"
                value={formData.digestFrequency}
                onChange={handleChange}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
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
                Update Notification Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationSettings;