// components/mobile/MobileSettings.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileUserSettings.css';
import { FaCog, FaBell, FaShieldAlt, FaUser, FaSave, FaTimes, FaLanguage, FaMoneyBill, FaEnvelope, FaSms, FaMobileAlt, FaBox, FaTruck, FaTag, FaNewspaper, FaEye, FaShareAlt, FaMapMarkerAlt, FaAd, FaLock, FaExclamationTriangle, FaUserShield, FaHourglassHalf, FaFingerprint, FaDownload, FaTrash, FaChevronRight, FaCheck } from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const MobileSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    language: 'english',
    currency: 'NGN',
    notifications: {
      email: true,
      sms: true,
      push: true,
      orderUpdates: true,
      deliveryNotifications: true,
      promotionalOffers: false,
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://egas-server-1.onrender.com/api/v1';

  // Fetch settings from API
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view settings');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setSettings(data);
    } catch (err) {
      console.error('Error fetching settings:', err);
      const errorMessage = err.message || 'Failed to load settings';
      setError(errorMessage);
      errorToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ 
      ...prev, 
      [key]: value 
    }));
  };

  const handleNestedSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      setSuccess('Settings saved successfully!');
      successToast('Settings saved');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      const errorMessage = err.message || 'Failed to save settings';
      setError(errorMessage);
      errorToast(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccountAction = (action) => {
    setModalAction(action);
    setShowConfirmModal(true);
  };

  const confirmAccountAction = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (modalAction === 'password') {
        navigate('/change-password');
      } else if (modalAction === 'email') {
        navigate('/update-email');
      } else if (modalAction === 'download') {
        await downloadPersonalData();
      } else if (modalAction === 'delete') {
        await deleteAccount();
      }
    } catch (err) {
      console.error('Account action error:', err);
      errorToast('Action failed. Please try again.');
    } finally {
      setShowConfirmModal(false);
      setModalAction('');
    }
  };

  const downloadPersonalData = async () => {
    infoToast('Downloading your data...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/settings/export-data`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'personal-data.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      successToast('Data downloaded successfully');
    } catch (err) {
      console.error('Download error:', err);
      errorToast('Failed to download data');
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm('This will permanently delete your account. Are you sure?')) {
      infoToast('Account deletion cancelled');
      return;
    }

    warningToast('Deleting account...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      successToast('Account deleted successfully');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Delete error:', err);
      errorToast('Failed to delete account');
    }
  };

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case 'NGN': return '₦';
      case 'USD': return '$';
      case 'EUR': return '€';
      case 'GBP': return '£';
      case 'JPY': return '¥';
      case 'INR': return '₹';
      default: return currency;
    }
  };

  if (isLoading) {
    return (
      <div className="mobile-settings loading">
        <div className="loading-spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="mobile-settings">
      {/* Header */}
      <div className="settings-header">
        <h1>Settings</h1>
        <button 
          className="save-btn"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <div className="save-spinner"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave /> Save
            </>
          )}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="error-message">
          <FaTimes />
          <span>{error}</span>
          <button onClick={() => setError('')} className="close-error">
            <FaTimes />
          </button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <FaCheck />
          <span>{success}</span>
          <button onClick={() => setSuccess('')} className="close-success">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <button 
          className={`settings-tab ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          <FaLanguage className="tab-icon" />
          <span>General</span>
        </button>
        
        <button 
          className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          <FaBell className="tab-icon" />
          <span>Notifications</span>
        </button>
        
        <button 
          className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <FaShieldAlt className="tab-icon" />
          <span>Privacy</span>
        </button>
        
        <button 
          className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
          onClick={() => setActiveTab('account')}
        >
          <FaUser className="tab-icon" />
          <span>Account</span>
        </button>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="settings-section">
            <h2 className="section-title">
              <FaLanguage />
              General Settings
            </h2>
            
            <div className="setting-group">
              <label className="setting-label">
                <FaLanguage className="label-icon" />
                <span>Language</span>
              </label>
              <select 
                className="setting-select"
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                disabled={isSaving}
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

            <div className="setting-group">
              <label className="setting-label">
                <FaMoneyBill className="label-icon" />
                <span>Currency</span>
              </label>
              <select 
                className="setting-select"
                value={settings.currency}
                onChange={(e) => handleSettingChange('currency', e.target.value)}
                disabled={isSaving}
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="JPY">Japanese Yen (¥)</option>
                <option value="INR">Indian Rupee (₹)</option>
              </select>
              <div className="setting-hint">
                Current: {getCurrencySymbol(settings.currency)}
              </div>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="settings-section">
            <h2 className="section-title">
              <FaBell />
              Notification Settings
            </h2>

            <div className="setting-group">
              <h3 className="sub-title">Channels</h3>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaEnvelope className="toggle-icon" />
                    <span>Email Notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => handleNestedSettingChange('notifications', 'email', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaSms className="toggle-icon" />
                    <span>SMS Notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleNestedSettingChange('notifications', 'sms', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaMobileAlt className="toggle-icon" />
                    <span>Push Notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => handleNestedSettingChange('notifications', 'push', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="setting-group">
              <h3 className="sub-title">Notification Types</h3>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaBox className="toggle-icon" />
                    <span>Order Updates</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.notifications.orderUpdates}
                      onChange={(e) => handleNestedSettingChange('notifications', 'orderUpdates', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaTruck className="toggle-icon" />
                    <span>Delivery Notifications</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.notifications.deliveryNotifications}
                      onChange={(e) => handleNestedSettingChange('notifications', 'deliveryNotifications', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaTag className="toggle-icon" />
                    <span>Promotional Offers</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.notifications.promotionalOffers}
                      onChange={(e) => handleNestedSettingChange('notifications', 'promotionalOffers', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaNewspaper className="toggle-icon" />
                    <span>Newsletter</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.notifications.newsletter}
                      onChange={(e) => handleNestedSettingChange('notifications', 'newsletter', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy & Security Settings */}
        {activeTab === 'privacy' && (
          <div className="settings-section">
            <h2 className="section-title">
              <FaShieldAlt />
              Privacy & Security
            </h2>

            <div className="setting-group">
              <h3 className="sub-title">Privacy Settings</h3>
              
              <div className="select-group">
                <div className="setting-item">
                  <label className="setting-label">
                    <FaEye className="label-icon" />
                    <span>Profile Visibility</span>
                  </label>
                  <select 
                    className="setting-select"
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleNestedSettingChange('privacy', 'profileVisibility', e.target.value)}
                    disabled={isSaving}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="toggle-group">
                  <div className="toggle-item">
                    <div className="toggle-label">
                      <FaShareAlt className="toggle-icon" />
                      <span>Data Sharing for Analytics</span>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.privacy.dataSharing}
                        onChange={(e) => handleNestedSettingChange('privacy', 'dataSharing', e.target.checked)}
                        disabled={isSaving}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-label">
                      <FaMapMarkerAlt className="toggle-icon" />
                      <span>Location Sharing (for delivery)</span>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.privacy.locationSharing}
                        onChange={(e) => handleNestedSettingChange('privacy', 'locationSharing', e.target.checked)}
                        disabled={isSaving}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="toggle-item">
                    <div className="toggle-label">
                      <FaAd className="toggle-icon" />
                      <span>Personalized Advertising</span>
                    </div>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox"
                        checked={settings.privacy.personalizedAds}
                        onChange={(e) => handleNestedSettingChange('privacy', 'personalizedAds', e.target.checked)}
                        disabled={isSaving}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="setting-group">
              <h3 className="sub-title">Security Settings</h3>
              
              <div className="toggle-group">
                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaLock className="toggle-icon" />
                    <span>Two-Factor Authentication</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.security.twoFactor}
                      onChange={(e) => handleNestedSettingChange('security', 'twoFactor', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaUserShield className="toggle-icon" />
                    <span>Login Alerts</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.security.loginAlerts}
                      onChange={(e) => handleNestedSettingChange('security', 'loginAlerts', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div className="toggle-label">
                    <FaFingerprint className="toggle-icon" />
                    <span>Biometric Authentication</span>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox"
                      checked={settings.security.biometricAuth}
                      onChange={(e) => handleNestedSettingChange('security', 'biometricAuth', e.target.checked)}
                      disabled={isSaving}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <label className="setting-label">
                    <FaHourglassHalf className="label-icon" />
                    <span>Session Timeout</span>
                  </label>
                  <select 
                    className="setting-select"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleNestedSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    disabled={isSaving}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings */}
        {activeTab === 'account' && (
          <div className="settings-section">
            <h2 className="section-title">
              <FaUser />
              Account Settings
            </h2>

            <div className="setting-group">
              <h3 className="sub-title">Account Management</h3>
              
              <div className="action-list">
                <button 
                  className="action-item"
                  onClick={() => handleAccountAction('password')}
                  disabled={isSaving}
                >
                  <div className="action-content">
                    <FaLock className="action-icon" />
                    <div className="action-text">
                      <span className="action-title">Change Password</span>
                      <span className="action-description">Update your account password</span>
                    </div>
                  </div>
                  <FaChevronRight className="action-arrow" />
                </button>

                <button 
                  className="action-item"
                  onClick={() => handleAccountAction('email')}
                  disabled={isSaving}
                >
                  <div className="action-content">
                    <FaEnvelope className="action-icon" />
                    <div className="action-text">
                      <span className="action-title">Update Email</span>
                      <span className="action-description">Change your email address</span>
                    </div>
                  </div>
                  <FaChevronRight className="action-arrow" />
                </button>

                <button 
                  className="action-item"
                  onClick={() => handleAccountAction('download')}
                  disabled={isSaving}
                >
                  <div className="action-content">
                    <FaDownload className="action-icon" />
                    <div className="action-text">
                      <span className="action-title">Download Personal Data</span>
                      <span className="action-description">Export all your account data</span>
                    </div>
                  </div>
                  <FaChevronRight className="action-arrow" />
                </button>
              </div>
            </div>

            <div className="setting-group danger-zone">
              <h3 className="sub-title danger">
                <FaExclamationTriangle />
                Danger Zone
              </h3>
              
              <div className="danger-warning">
                <FaExclamationTriangle className="warning-icon" />
                <p>These actions are irreversible. Please proceed with caution.</p>
              </div>
              
              <button 
                className="danger-action"
                onClick={() => handleAccountAction('delete')}
                disabled={isSaving}
              >
                <FaTrash className="danger-icon" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="modal-header">
              <h3>Confirm Action</h3>
              <button 
                className="close-modal"
                onClick={() => {
                  setShowConfirmModal(false);
                  setModalAction('');
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {modalAction === 'delete' ? (
                <>
                  <FaExclamationTriangle className="modal-icon danger" />
                  <p>Are you sure you want to delete your account? This action cannot be undone.</p>
                </>
              ) : modalAction === 'download' ? (
                <>
                  <FaDownload className="modal-icon" />
                  <p>Download your personal data as a JSON file?</p>
                </>
              ) : (
                <p>Continue with this action?</p>
              )}
            </div>
            
            <div className="modal-actions">
              <button 
                className="modal-btn secondary"
                onClick={() => {
                  setShowConfirmModal(false);
                  setModalAction('');
                }}
              >
                Cancel
              </button>
              <button 
                className="modal-btn primary"
                onClick={confirmAccountAction}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSettings;