// components/settings/SystemSettings.js
import React, { useState } from 'react';

const SystemSettings = ({ settings, onUpdate, saveStatus }) => {
  const [formData, setFormData] = useState({
    systemName: settings.systemName || 'e-GAS Management System',
    systemVersion: settings.systemVersion || '1.0.0',
    apiEndpoint: settings.apiEndpoint || 'https://api.egas.com',
    storageLimit: settings.storageLimit || 1000,
    backupFrequency: settings.backupFrequency || 'daily',
    autoUpdate: settings.autoUpdate || false,
    debugMode: settings.debugMode || false,
    logLevel: settings.logLevel || 'info',
    maxFileSize: settings.maxFileSize || 5,
    sessionEncryption: settings.sessionEncryption || true,
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

  const handleSystemRestart = () => {
    if (window.confirm('Are you sure you want to restart the system? This may cause temporary downtime.')) {
      // Implement system restart logic
      alert('System restart initiated. This may take a few minutes.');
    }
  };

  const handleClearCache = () => {
    if (window.confirm('Are you sure you want to clear all cached data?')) {
      // Implement cache clearing logic
      alert('Cache cleared successfully.');
    }
  };

  return (
    <div className="settings-section">
      <h2>System Settings</h2>
      <p className="section-description">
        Configure system-wide settings and preferences
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="system-section">
          <h3>System Information</h3>
          
          <div className="form-group">
            <label htmlFor="systemName">System Name</label>
            <input
              type="text"
              id="systemName"
              name="systemName"
              value={formData.systemName}
              onChange={handleChange}
              placeholder="Enter system name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="systemVersion">System Version</label>
            <input
              type="text"
              id="systemVersion"
              name="systemVersion"
              value={formData.systemVersion}
              onChange={handleChange}
              placeholder="Enter system version"
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="apiEndpoint">API Endpoint</label>
            <input
              type="url"
              id="apiEndpoint"
              name="apiEndpoint"
              value={formData.apiEndpoint}
              onChange={handleChange}
              placeholder="https://api.example.com"
            />
          </div>
        </div>

        <div className="system-section">
          <h3>Storage & Backup</h3>
          
          <div className="form-group">
            <label htmlFor="storageLimit">Storage Limit (MB)</label>
            <input
              type="number"
              id="storageLimit"
              name="storageLimit"
              value={formData.storageLimit}
              onChange={handleChange}
              min="100"
              max="10000"
              step="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="backupFrequency">Backup Frequency</label>
            <select
              id="backupFrequency"
              name="backupFrequency"
              value={formData.backupFrequency}
              onChange={handleChange}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="maxFileSize">Maximum File Size (MB)</label>
            <input
              type="number"
              id="maxFileSize"
              name="maxFileSize"
              value={formData.maxFileSize}
              onChange={handleChange}
              min="1"
              max="50"
              step="1"
            />
          </div>
        </div>

        <div className="system-section">
          <h3>Advanced Settings</h3>
          
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="autoUpdate"
                checked={formData.autoUpdate}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Automatic Updates
            </label>
            <p className="checkbox-help">
              Automatically install system updates when available
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="debugMode"
                checked={formData.debugMode}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Debug Mode
            </label>
            <p className="checkbox-help">
              Enable detailed logging for debugging purposes
            </p>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="sessionEncryption"
                checked={formData.sessionEncryption}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Session Encryption
            </label>
            <p className="checkbox-help">
              Encrypt all user sessions for enhanced security
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="logLevel">Log Level</label>
            <select
              id="logLevel"
              name="logLevel"
              value={formData.logLevel}
              onChange={handleChange}
            >
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info">Info</option>
              <option value="debug">Debug</option>
            </select>
          </div>
        </div>

        <div className="system-actions">
          <div className="danger-zone">
            <h3>Danger Zone</h3>
            <p className="danger-warning">
              These actions are irreversible. Please proceed with caution.
            </p>
            
            <div className="danger-buttons">
              <button
                type="button"
                className="btn-clear-cache"
                onClick={handleClearCache}
              >
                <i className="fas fa-broom"></i>
                Clear System Cache
              </button>
              
              <button
                type="button"
                className="btn-restart-system"
                onClick={handleSystemRestart}
              >
                <i className="fas fa-power-off"></i>
                Restart System
              </button>
            </div>
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
                Update System Settings
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemSettings;