// components/Settings.js
import React, { useState, useEffect } from 'react';
import './UserSettings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    language: 'english',
    currency: 'JPY',
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

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = 'https://your-api-url.com/api';

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would use your actual API endpoint
        // const response = await fetch(`${API_BASE_URL}/settings`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // For demonstration, we'll use a timeout to simulate API call
        setTimeout(() => {
          // Mock settings data
          const mockSettings = {
            language: 'english',
            currency: 'JPY',
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
          };
          setSettings(mockSettings);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setError('Failed to load settings. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value
      }
    });
  };

  const handleNestedSettingChange = (category, subCategory, key, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [subCategory]: {
          ...settings[category][subCategory],
          [key]: value
        }
      }
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real app, this would be an API call to save settings
      // await fetch(`${API_BASE_URL}/settings`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(settings)
      // });

      // For demo purposes, simulate API call
      setTimeout(() => {
        setIsSaving(false);
        setSuccess('Settings saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }, 1000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
      setIsSaving(false);
    }
  };

  const handleChangePassword = () => {
    // Implement change password functionality
    alert('Change password functionality would open here');
  };

  const handleUpdateEmail = () => {
    // Implement update email functionality
    alert('Update email functionality would open here');
  };

  const handleDownloadData = async () => {
    try {
      // In a real app, this would download user data
      // const response = await fetch(`${API_BASE_URL}/settings/export-data`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'personal-data.json';
      // document.body.appendChild(a);
      // a.click();
      // window.URL.revokeObjectURL(url);
      
      alert('Personal data download would start here');
    } catch (error) {
      console.error('Error downloading data:', error);
      setError('Failed to download personal data. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion
      alert('Account deletion process would start here');
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      const defaultSettings = {
        language: 'english',
        currency: 'JPY',
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
      };
      setSettings(defaultSettings);
      setSuccess('Settings reset to defaults!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  if (isLoading) {
    return <div className="settings-page loading">Loading settings...</div>;
  }

  return (
    <div className="settings-page">
      <div className="dashboard-header">
        <h1>Settings</h1>
        <div className="header-actions">
          <button 
            className="btn-secondary"
            onClick={resetToDefaults}
            disabled={isSaving}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
          <button onClick={() => setSuccess('')} className="close-success">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="settings-content">
        <div className="settings-sidebar">
          <div 
            className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <i className="fas fa-cog"></i>
            General
          </div>
          <div 
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell"></i>
            Notifications
          </div>
          <div 
            className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            <i className="fas fa-shield-alt"></i>
            Privacy & Security
          </div>
          <div 
            className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <i className="fas fa-user"></i>
            Account
          </div>
        </div>

        <div className="settings-panel">
          {activeTab === 'general' && (
            <div className="settings-section">
              <h2>General Settings</h2>
              <div className="setting-item">
                <label>Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', 'language', e.target.value)}
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
              <div className="setting-item">
                <label>Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleSettingChange('currency', 'currency', e.target.value)}
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
              <div className="setting-item">
                <label>Theme</label>
                <select
                  defaultValue="light"
                  disabled={isSaving}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto (System)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <div className="settings-group">
                <h3>Notification Channels</h3>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => handleNestedSettingChange('notifications', 'notifications', 'email', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Email Notifications
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleNestedSettingChange('notifications', 'notifications', 'sms', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    SMS Notifications
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => handleNestedSettingChange('notifications', 'notifications', 'push', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Push Notifications
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h3>Notification Types</h3>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.orderUpdates}
                      onChange={(e) => handleNestedSettingChange('notifications', 'notifications', 'orderUpdates', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Order Updates
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.deliveryNotifications}
                      onChange={(e) => handleNestedSettingChange('notifications', 'notifications', 'deliveryNotifications', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Delivery Notifications
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.promotionalOffers}
                      onChange={(e) => handleNestedSettingChange('notifications', 'notifications', 'promotionalOffers', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Promotional Offers
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.notifications.newsletter}
                      onChange={(e) => handleNestedSettingChange('notifications', 'notifications', 'newsletter', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Newsletter
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy & Security</h2>
              <div className="settings-group">
                <h3>Privacy Settings</h3>
                <div className="setting-item">
                  <label>Profile Visibility</label>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleNestedSettingChange('privacy', 'privacy', 'profileVisibility', e.target.value)}
                    disabled={isSaving}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handleNestedSettingChange('privacy', 'privacy', 'dataSharing', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Allow data sharing for analytics
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.locationSharing}
                      onChange={(e) => handleNestedSettingChange('privacy', 'privacy', 'locationSharing', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Location Sharing (for delivery)
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.privacy.personalizedAds}
                      onChange={(e) => handleNestedSettingChange('privacy', 'privacy', 'personalizedAds', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Personalized Advertising
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h3>Security Settings</h3>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactor}
                      onChange={(e) => handleNestedSettingChange('security', 'security', 'twoFactor', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Enable Two-Factor Authentication
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => handleNestedSettingChange('security', 'security', 'loginAlerts', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Login Alerts
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.security.biometricAuth}
                      onChange={(e) => handleNestedSettingChange('security', 'security', 'biometricAuth', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="checkmark"></span>
                    Biometric Authentication
                  </label>
                </div>
                <div className="setting-item">
                  <label>Session Timeout</label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleNestedSettingChange('security', 'security', 'sessionTimeout', parseInt(e.target.value))}
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
            <div className="settings-section">
              <h2>Account Settings</h2>
              <div className="settings-group">
                <h3>Account Management</h3>
                <div className="setting-item">
                  <button 
                    className="btn-secondary"
                    onClick={handleChangePassword}
                    disabled={isSaving}
                  >
                    Change Password
                  </button>
                </div>
                <div className="setting-item">
                  <button 
                    className="btn-secondary"
                    onClick={handleUpdateEmail}
                    disabled={isSaving}
                  >
                    Update Email Address
                  </button>
                </div>
                <div className="setting-item">
                  <button 
                    className="btn-secondary"
                    onClick={handleDownloadData}
                    disabled={isSaving}
                  >
                    Download Personal Data
                  </button>
                </div>
              </div>

              <div className="settings-group">
                <h3>Danger Zone</h3>
                <div className="setting-item danger-zone">
                  <p className="danger-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  <button 
                    className="btn-danger"
                    onClick={handleDeleteAccount}
                    disabled={isSaving}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button 
              className="btn-primary" 
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