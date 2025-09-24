// components/settings/GeneralSettings.js
import React, { useState } from 'react';

const GeneralSettings = ({ settings, onUpdate, saveStatus }) => {
  const [formData, setFormData] = useState({
    siteName: settings.siteName || 'e-GAS Admin',
    siteDescription: settings.siteDescription || '',
    adminEmail: settings.adminEmail || '',
    timezone: settings.timezone || 'UTC',
    dateFormat: settings.dateFormat || 'MM/DD/YYYY',
    itemsPerPage: settings.itemsPerPage || 25,
    language: settings.language || 'en',
    maintenanceMode: settings.maintenanceMode || false,
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
      <h2>General Settings</h2>
      <p className="section-description">
        Configure basic settings for your admin portal
      </p>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="siteName">Site Name</label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={formData.siteName}
              onChange={handleChange}
              placeholder="Enter site name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminEmail">Admin Email</label>
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={handleChange}
              placeholder="admin@example.com"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="siteDescription">Site Description</label>
          <textarea
            id="siteDescription"
            name="siteDescription"
            value={formData.siteDescription}
            onChange={handleChange}
            placeholder="Brief description of your admin portal"
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="timezone">Timezone</label>
            <select
              id="timezone"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time (EST)</option>
              <option value="PST">Pacific Time (PST)</option>
              <option value="GMT">Greenwich Mean Time (GMT)</option>
              <option value="CET">Central European Time (CET)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dateFormat">Date Format</label>
            <select
              id="dateFormat"
              name="dateFormat"
              value={formData.dateFormat}
              onChange={handleChange}
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="itemsPerPage">Items Per Page</label>
            <select
              id="itemsPerPage"
              name="itemsPerPage"
              value={formData.itemsPerPage}
              onChange={handleChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Enable Maintenance Mode
          </label>
          <p className="checkbox-help">
            When enabled, the admin portal will be inaccessible to non-admin users
          </p>
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
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GeneralSettings;