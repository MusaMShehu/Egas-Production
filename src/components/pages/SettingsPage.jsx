// components/pages/SettingsPage.js
import React, { useState, useEffect } from 'react';
import '../../styles/SettingsPage.css';

const SettingsPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    language: 'English',
    timezone: '(GMT+1) West Africa Time',
    currency: 'Naira (₦)',
    notifications: {
      email: true,
      sms: true,
      push: true
    },
    privacy: {
      profileVisibility: 'Private',
      dataSharing: false
    },
    preferences: {
      defaultDeliveryAddress: 'Home - 123 Main St, Lagos',
      preferredPaymentMethod: 'Wallet',
      autoTopUp: false
    }
  });
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const tabs = [
    { id: 'account', label: 'Account Settings' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'security', label: 'Security' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'preferences', label: 'Preferences' }
  ];

  // Fetch settings data from backend API
  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        setLoading(true);
        
        // Fetch user settings
        const settingsResponse = await fetch('/api/user/settings');
        if (!settingsResponse.ok) {
          throw new Error(`Failed to fetch settings: ${settingsResponse.status}`);
        }
        const settingsData = await settingsResponse.json();
        setSettings(settingsData);
        
        // Fetch active sessions
        const sessionsResponse = await fetch('/api/user/sessions');
        if (!sessionsResponse.ok) {
          throw new Error(`Failed to fetch sessions: ${sessionsResponse.status}`);
        }
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData.sessions);
        
      } catch (err) {
        console.error('Error fetching settings data:', err);
        setError('Failed to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettingsData();
  }, [user.id]);

  const handleSettingChange = async (category, key, value) => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          key,
          value
        }),
      });

      if (!response.ok) {
        throw new Error(`Setting update failed with status: ${response.status}`);
      }

      const updatedSettings = await response.json();
      setSettings(prev => ({ ...prev, ...updatedSettings }));
      
      setSuccessMessage('Setting updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Setting update error:', error);
      setError('Failed to update setting. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = async (category, key) => {
    const currentValue = settings[category][key];
    await handleSettingChange(category, key, !currentValue);
  };

  const handleLogoutSession = async (sessionId) => {
    try {
      const response = await fetch(`/api/user/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Session logout failed with status: ${response.status}`);
      }

      // Remove the session from local state
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      setSuccessMessage('Session logged out successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Session logout error:', error);
      setError('Failed to logout session. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const response = await fetch('/api/user/enable-2fa', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`2FA enable failed with status: ${response.status}`);
      }

      const { qrCodeUrl } = await response.json();
      
      // Show QR code to user (in a real app, you'd display this in a modal)
      alert('Scan the QR code with your authenticator app. QR code URL: ' + qrCodeUrl);
      
      setSuccessMessage('Two-factor authentication enabled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('2FA enable error:', error);
      setError('Failed to enable two-factor authentication. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDeactivateAccount = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/user/deactivate', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error(`Account deactivation failed with status: ${response.status}`);
        }

        alert('Account deactivated successfully. You will be logged out.');
        // In a real app, you would redirect to logout or home page
      } catch (error) {
        console.error('Account deactivation error:', error);
        setError('Failed to deactivate account. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  if (loading && !settings.language) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <div className="loading-spinner">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h2 className="text-xl font-bold mb-6">Settings</h2>
        
        {/* Success and Error Messages */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="settings-grid">
          <div>
            <div className="settings-menu">
              {tabs.map(tab => (
                <button 
                  key={tab.id}
                  className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="settings-content">
            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div className="settings-tab">
                <h3 className="tab-heading">Account Settings</h3>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select 
                      className="form-input"
                      value={settings.language}
                      onChange={(e) => handleSettingChange('account', 'language', e.target.value)}
                    >
                      <option>English</option>
                      <option>French</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Timezone</label>
                    <select 
                      className="form-input"
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('account', 'timezone', e.target.value)}
                    >
                      <option>(GMT+1) West Africa Time</option>
                      <option>(GMT) Greenwich Mean Time</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Currency</label>
                    <select 
                      className="form-input"
                      value={settings.currency}
                      onChange={(e) => handleSettingChange('account', 'currency', e.target.value)}
                    >
                      <option>Naira (₦)</option>
                      <option>Dollar ($)</option>
                      <option>Euro (€)</option>
                    </select>
                  </div>
                  
                  <div className="danger-zone">
                    <button 
                      className="deactivate-button"
                      onClick={handleDeactivateAccount}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Deactivate Account'}
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="settings-tab">
                <h3 className="tab-heading">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Email Notifications</h4>
                      <p className="setting-description">Receive important updates via email</p>
                    </div>
                    <label className="setting-control toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.email}
                        onChange={() => handleToggleChange('notifications', 'email')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">SMS Notifications</h4>
                      <p className="setting-description">Receive order updates via SMS</p>
                    </div>
                    <label className="setting-control toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.sms}
                        onChange={() => handleToggleChange('notifications', 'sms')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Push Notifications</h4>
                      <p className="setting-description">Receive app notifications</p>
                    </div>
                    <label className="setting-control toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.notifications.push}
                        onChange={() => handleToggleChange('notifications', 'push')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="settings-tab">
                <h3 className="tab-heading">Security Settings</h3>
                <div className="space-y-4">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Two-Factor Authentication</h4>
                      <p className="setting-description">Add an extra layer of security to your account</p>
                    </div>
                    <button 
                      className="setting-control action-button bg-blue-600"
                      onClick={handleEnable2FA}
                      disabled={loading}
                    >
                      {loading ? 'Enabling...' : 'Enable'}
                    </button>
                  </div>
                  
                  <div className="tab-section">
                    <h4 className="setting-name mb-2">Active Sessions</h4>
                    <div className="space-y-3">
                      {sessions.length > 0 ? (
                        sessions.map(session => (
                          <div key={session.id} className="session-item">
                            <div className="session-info">
                              <p className="session-device">{session.device}</p>
                              <p className="session-details">{session.location} • {session.lastActive}</p>
                            </div>
                            <button 
                              className="logout-session"
                              onClick={() => handleLogoutSession(session.id)}
                              disabled={loading}
                            >
                              <i className="fas fa-sign-out-alt"></i> Logout
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No active sessions found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="settings-tab">
                <h3 className="tab-heading">Privacy Settings</h3>
                <div className="space-y-4">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Profile Visibility</h4>
                      <p className="setting-description">Who can see your profile</p>
                    </div>
                    <select 
                      className="setting-control select-control"
                      value={settings.privacy.profileVisibility}
                      onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    >
                      <option>Private</option>
                      <option>Public</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Data Sharing</h4>
                      <p className="setting-description">Allow anonymized data for analytics</p>
                    </div>
                    <label className="setting-control toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.privacy.dataSharing}
                        onChange={() => handleToggleChange('privacy', 'dataSharing')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
            
            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="settings-tab">
                <h3 className="tab-heading">Preferences</h3>
                <div className="space-y-4">
                  <div className="form-group">
                    <label className="form-label">Default Delivery Address</label>
                    <select 
                      className="form-input"
                      value={settings.preferences.defaultDeliveryAddress}
                      onChange={(e) => handleSettingChange('preferences', 'defaultDeliveryAddress', e.target.value)}
                    >
                      <option>Home - 123 Main St, Lagos</option>
                      <option>Office - 456 Business Ave, Lagos</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Preferred Payment Method</label>
                    <select 
                      className="form-input"
                      value={settings.preferences.preferredPaymentMethod}
                      onChange={(e) => handleSettingChange('preferences', 'preferredPaymentMethod', e.target.value)}
                    >
                      <option>Wallet</option>
                      <option>Card</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                  
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4 className="setting-name">Auto-Top Up</h4>
                      <p className="setting-description">Automatically top up wallet when balance is low</p>
                    </div>
                    <label className="setting-control toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={settings.preferences.autoTopUp}
                        onChange={() => handleToggleChange('preferences', 'autoTopUp')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;