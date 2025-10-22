// components/ExportModal.js
import React, { useState } from 'react';
import { FaTimes, FaDownload } from 'react-icons/fa';

const ExportModal = ({ users, onClose }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [includeFields, setIncludeFields] = useState({
    id: true,
    name: true,
    email: true,
    phone: true,
    role: true,
    status: true,
    verified: true,
    createdAt: true,
    lastLogin: true
  });
  const [exportRange, setExportRange] = useState('all'); // 'all', 'selected', 'filtered'

  const handleFieldToggle = (field) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleExport = () => {
    const dataToExport = users.map(user => {
      const userData = {};
      
      if (includeFields.id) userData.ID = user._id;
      if (includeFields.name) userData.Name = `${user.firstName} ${user.lastName}`;
      if (includeFields.email) userData.Email = user.email;
      if (includeFields.phone) userData.Phone = user.phone || 'N/A';
      if (includeFields.role) userData.Role = user.role;
      if (includeFields.status) userData.Status = user.isActive ? 'Active' : 'Inactive';
      if (includeFields.verified) userData.Verified = user.isVerified ? 'Yes' : 'No';
      if (includeFields.createdAt) userData['Created At'] = new Date(user.createdAt).toLocaleDateString();
      if (includeFields.lastLogin) userData['Last Login'] = user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never';
      
      return userData;
    });

    if (exportFormat === 'csv') {
      exportToCSV(dataToExport);
    } else if (exportFormat === 'json') {
      exportToJSON(dataToExport);
    } else if (exportFormat === 'excel') {
      exportToExcel(dataToExport);
    }
  };

  const exportToCSV = (data) => {
    if (data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, `users-export-${new Date().toISOString().split('T')[0]}.csv`);
    onClose();
  };

  const exportToJSON = (data) => {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    downloadBlob(blob, `users-export-${new Date().toISOString().split('T')[0]}.json`);
    onClose();
  };

  const exportToExcel = (data) => {
    // For a real implementation, you might want to use a library like SheetJS
    // This is a simplified version that creates a CSV that can be opened in Excel
    exportToCSV(data);
  };

  const downloadBlob = (blob, filename) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectAllFields = () => {
    setIncludeFields({
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      verified: true,
      createdAt: true,
      lastLogin: true
    });
  };

  const deselectAllFields = () => {
    setIncludeFields({
      id: false,
      name: false,
      email: false,
      phone: false,
      role: false,
      status: false,
      verified: false,
      createdAt: false,
      lastLogin: false
    });
  };

  return (
    <div className="aum-modal-overlay">
      <div className="aum-modal-content">
        <div className="aum-modal-header">
          <h2>Export Users</h2>
          <button onClick={onClose} className="aum-modal-close">
            <FaTimes />
          </button>
        </div>

        <div className="aum-modal-body">
          <div className="aum-export-section">
            <h3>Export Format</h3>
            <div className="aum-format-options">
              <label className="aum-format-option">
                <input
                  type="radio"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <span>CSV</span>
              </label>
              <label className="aum-format-option">
                <input
                  type="radio"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <span>JSON</span>
              </label>
              <label className="aum-format-option">
                <input
                  type="radio"
                  value="excel"
                  checked={exportFormat === 'excel'}
                  onChange={(e) => setExportFormat(e.target.value)}
                />
                <span>Excel</span>
              </label>
            </div>
          </div>

          <div className="aum-export-section">
            <h3>Include Fields</h3>
            <div className="aum-field-selection-actions">
              <button onClick={selectAllFields} className="aum-btn aum-btn-sm aum-btn-outline">
                Select All
              </button>
              <button onClick={deselectAllFields} className="aum-btn aum-btn-sm aum-btn-outline">
                Deselect All
              </button>
            </div>
            <div className="aum-field-grid">
              {Object.entries(includeFields).map(([field, isSelected]) => (
                <label key={field} className="aum-field-checkbox">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleFieldToggle(field)}
                  />
                  <span className="aum-field-label">
                    {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="aum-export-section">
            <h3>Export Range</h3>
            <div className="aum-range-options">
              <label className="aum-range-option">
                <input
                  type="radio"
                  value="all"
                  checked={exportRange === 'all'}
                  onChange={(e) => setExportRange(e.target.value)}
                />
                <span>All Users ({users.length})</span>
              </label>
              <label className="aum-range-option">
                <input
                  type="radio"
                  value="filtered"
                  checked={exportRange === 'filtered'}
                  onChange={(e) => setExportRange(e.target.value)}
                />
                <span>Currently Filtered ({users.length})</span>
              </label>
            </div>
          </div>
        </div>

        <div className="aum-modal-footer">
          <button onClick={onClose} className="aum-btn aum-btn-outline">
            Cancel
          </button>
          <button onClick={handleExport} className="aum-btn aum-btn-primary">
            <FaDownload />
            Export Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;