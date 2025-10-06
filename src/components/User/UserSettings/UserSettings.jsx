// components/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserSettings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    language: 'english',
    currency: 'USD',
    notifications: {
      email: true,
      sms: true,
      push: false,
      orderUpdates: true,
      deliveryNotifications: true,
      promotionalOffers: true,
      newsletter: false
    },
    privacy: {
      profileVisibility: 'private',
      dataSharing: false,
      locationSharing: true,
      personalizedAds: false
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: 30,
      biometricAuth: false
    }
  });
  
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com/api/v1';
  const token = localStorage.getItem('token');

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await axios.get(`${API_BASE_URL}/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSettings(response.data);
      } catch (err) {
        console.error('Error fetching settings:', err);
        const errorMessage = err.response?.data?.message || 'Failed to load settings. Please try again later.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (token) {
      fetchSettings();
    } else {
      setError('Authentication required. Please log in.');
      setIsLoading(false);
    }
  }, [API_BASE_URL, token]);

  // Handle top-level setting changes
  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ 
      ...prev, 
      [key]: value 
    }));
  };

  // Handle nested setting changes
  const handleNestedSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  // Save settings to API
  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await axios.put(`${API_BASE_URL}/settings`, settings, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Settings saved successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Error saving settings:', err);
      const errorMessage = err.response?.data?.message || 'Failed to save settings. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    window.location.href = '/change-password';
  };

  const handleUpdateEmail = () => {
    window.location.href = '/update-email';
  };

  const handleDownloadData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/settings/export-data`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'personal-data.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to download personal data. Please try again.';
      setError(errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token');
        window.location.href = '/goodbye';
      } catch (err) {
        console.error('Error deleting account:', err);
        const errorMessage = err.response?.data?.message || 'Failed to delete account. Please try again.';
        setError(errorMessage);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="set-settings-page loading">
        <div className="set-loading-spinner"></div>
        Loading settings...
      </div>
    );
  }

  return (
    <div className="set-settings-page">
      <div className="set-dashboard-header">
        <h1>Settings</h1>
        <div className="set-header-actions">
          <button 
            className="set-btn-primary"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {error && (
        <div className="set-error-message">
          <span>{error}</span>
          <button onClick={() => setError('')} className="set-close-error">
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="set-success-message">
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="set-close-success">
            ×
          </button>
        </div>
      )}

      <div className="set-settings-content">
        <div className="set-settings-sidebar">
          <div 
            className={`set-settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <i className="fas fa-cog"></i>
            General
          </div>
          <div 
            className={`set-settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i>
            Notifications
          </div>
          <div 
            className={`set-settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <i className="fas fa-shield-alt"></i>
            Privacy & Security
          </div>
          <div 
            className={`set-settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fas fa-user"></i>
            Account
          </div>
        </div>

        <div className="set-settings-panel">
          {activeTab === 'general' && (
            <div className="set-settings-section">
              <h2>General Settings</h2>
              <div className="set-setting-item">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  disabled={isSaving}
                >
                  <option value="english">English</option>
                  <option value="japanese">Japanese</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="chinese">Chinese</option>
                </select>
              </div>
              <div className="set-setting-item">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', e.target.value)}
                  disabled={isSaving}
                >
                  <option value="JPY">Japanese Yen (¥)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">British Pound (£)</option>
                  <option value="NGN">Nigerian Naira (₦)</option>
                  <option value="INR">Indian Rupee (₹)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="set-settings-section">
              <h2>Notification Preferences</h2>
              <div className="set-settings-group">
                <h3>Notification Channels</h3>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => handleNestedSettingChange('notifications', 'email', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Email Notifications
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleNestedSettingChange('notifications', 'sms', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    SMS Notifications
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => handleNestedSettingChange('notifications', 'push', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Push Notifications
                  </label>
                </div>
              </div>

              <div className="set-settings-group">
                <h3>Notification Types</h3>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderUpdates}
                      onChange={(e) => handleNestedSettingChange('notifications', 'orderUpdates', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Order Updates
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.deliveryNotifications}
                      onChange={(e) => handleNestedSettingChange('notifications', 'deliveryNotifications', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Delivery Notifications
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.promotionalOffers}
                      onChange={(e) => handleNestedSettingChange('notifications', 'promotionalOffers', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Promotional Offers
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newsletter}
                      onChange={(e) => handleNestedSettingChange('notifications', 'newsletter', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Newsletter
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="set-settings-section">
              <h2>Privacy & Security</h2>
              <div className="set-settings-group">
                <h3>Privacy Settings</h3>
                <div className="set-setting-item">
                  <label htmlFor="profileVisibility">Profile Visibility</label>
                  <select
                    id="profileVisibility"
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleNestedSettingChange('privacy', 'profileVisibility', e.target.value)}
                    disabled={isSaving}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handleNestedSettingChange('privacy', 'dataSharing', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Allow data sharing for analytics
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.locationSharing}
                      onChange={(e) => handleNestedSettingChange('privacy', 'locationSharing', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Location Sharing (for delivery)
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.personalizedAds}
                      onChange={(e) => handleNestedSettingChange('privacy', 'personalizedAds', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Personalized Advertising
                  </label>
                </div>
              </div>

              <div className="set-settings-group">
                <h3>Security Settings</h3>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactor}
                      onChange={(e) => handleNestedSettingChange('security', 'twoFactor', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => handleNestedSettingChange('security', 'loginAlerts', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Login Alerts
                  </label>
                </div>
                <div className="set-setting-item">
                  <label className="set-checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.security.biometricAuth}
                      onChange={(e) => handleNestedSettingChange('security', 'biometricAuth', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="set-checkmark"></span>
                    Biometric Authentication
                  </label>
                </div>
                <div className="set-setting-item">
                  <label htmlFor="sessionTimeout">Session Timeout</label>
                  <select
                    id="sessionTimeout"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleNestedSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    disabled={isSaving}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never (not recommended)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="set-settings-section">
              <h2>Account Settings</h2>
              <div className="set-settings-group">
                <h3>Account Management</h3>
                <div className="set-setting-item">
                  <button 
                    className="set-btn-secondary"
                    onClick={handleChangePassword}
                    disabled={isSaving}
                  >
                    Change Password
                  </button>
                </div>
                <div className="set-setting-item">
                  <button 
                    className="set-btn-secondary"
                    onClick={handleUpdateEmail}
                    disabled={isSaving}
                  >
                    Update Email Address
                  </button>
                </div>
                <div className="set-setting-item">
                  <button 
                    className="set-btn-secondary"
                    onClick={handleDownloadData}
                    disabled={isSaving}
                  >
                    Download Personal Data
                  </button>
                </div>
              </div>

              <div className="set-settings-group">
                <h3>Danger Zone</h3>
                <div className="set-setting-item set-danger-zone">
                  <p className="set-danger-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  <button 
                    className="set-btn-danger"
                    onClick={handleDeleteAccount}
                    disabled={isSaving}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="set-settings-actions">
            <button 
              className="set-btn-primary" 
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;