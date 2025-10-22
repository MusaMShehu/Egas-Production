// components/ExportTools.js
import React, { useState } from 'react';
import { FaDownload, FaTimes, FaSpinner, FaCheckSquare, FaSquare } from 'react-icons/fa';
import './ExportTools.css';

const ExportTools = ({ subscriptions, onExport }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportLoading, setExportLoading] = useState(false);
  const [includeFields, setIncludeFields] = useState({
    id: true,
    customer: true,
    plan: true,
    type: true,
    frequency: true,
    size: true,
    status: true,
    price: true,
    dates: true,
    reference: true
  });

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Call the export function passed as prop or use default
      if (onExport) {
        await onExport({
          format: exportFormat,
          filters: {
            // Include any current filters here
          },
          fields: Object.keys(includeFields).filter(field => includeFields[field])
        });
      } else {
        // Default export behavior
        await handleDefaultExport();
      }
      setShowExportModal(false);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  };

  const handleDefaultExport = async () => {
    // Convert subscriptions to CSV
    const headers = [
      'Subscription ID',
      'Customer Name',
      'Customer Email', 
      'Plan Name',
      'Plan Type',
      'Frequency',
      'Size',
      'Status',
      'Price',
      'Start Date',
      'End Date',
      'Created Date',
      'Reference'
    ];

    const csvData = subscriptions.map(sub => [
      sub._id,
      `${sub.userId?.firstName || ''} ${sub.userId?.lastName || ''}`.trim(),
      sub.userId?.email || '',
      sub.planName,
      sub.planType,
      sub.frequency,
      sub.size,
      sub.status,
      sub.price,
      new Date(sub.startDate).toLocaleDateString(),
      sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A',
      new Date(sub.createdAt).toLocaleDateString(),
      sub.reference || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `subscriptions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const toggleField = (field) => {
    setIncludeFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const selectAllFields = () => {
    setIncludeFields({
      id: true,
      customer: true,
      plan: true,
      type: true,
      frequency: true,
      size: true,
      status: true,
      price: true,
      dates: true,
      reference: true
    });
  };

  const deselectAllFields = () => {
    setIncludeFields({
      id: false,
      customer: false,
      plan: false,
      type: false,
      frequency: false,
      size: false,
      status: false,
      price: false,
      dates: false,
      reference: false
    });
  };

  return (
    <>
      <button 
        onClick={() => setShowExportModal(true)}
        className="asm-btn asm-btn-export"
      >
        <FaDownload className="asm-icon" /> Export
      </button>

      {showExportModal && (
        <div className="asm-export-modal-overlay">
          <div className="asm-export-modal">
            <div className="asm-modal-header">
              <h3>Export Subscriptions</h3>
              <button 
                onClick={() => setShowExportModal(false)}
                className="asm-btn-close"
              >
                <FaTimes className="asm-icon" />
              </button>
            </div>

            <div className="asm-modal-body">
              <div className="asm-export-option">
                <label>Format</label>
                <div className="asm-format-options">
                  <label className="asm-format-option">
                    <input
                      type="radio"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <span>CSV</span>
                  </label>
                  <label className="asm-format-option">
                    <input
                      type="radio"
                      value="json"
                      checked={exportFormat === 'json'}
                      onChange={(e) => setExportFormat(e.target.value)}
                    />
                    <span>JSON</span>
                  </label>
                </div>
              </div>

              <div className="asm-export-option">
                <div className="asm-fields-header">
                  <label>Include Fields</label>
                  <div className="asm-field-actions">
                    <button type="button" onClick={selectAllFields} className="asm-btn-link">
                      Select All
                    </button>
                    <button type="button" onClick={deselectAllFields} className="asm-btn-link">
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="asm-fields-grid">
                  {Object.entries(includeFields).map(([field, isSelected]) => (
                    <label key={field} className="asm-field-option">
                      {isSelected ? (
                        <FaCheckSquare className="asm-icon asm-checkbox-icon" />
                      ) : (
                        <FaSquare className="asm-icon asm-checkbox-icon" />
                      )}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleField(field)}
                        className="asm-checkbox-input"
                      />
                      <span>{getFieldLabel(field)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="asm-export-summary">
                <p>
                  <strong>{subscriptions.length}</strong> subscriptions will be exported
                  {exportFormat === 'csv' ? ' as CSV file' : ' as JSON file'}.
                </p>
              </div>
            </div>

            <div className="asm-modal-footer">
              <button
                onClick={() => setShowExportModal(false)}
                className="asm-btn asm-btn-outline"
                disabled={exportLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="asm-btn asm-btn-primary"
                disabled={exportLoading}
              >
                {exportLoading ? (
                  <>
                    <FaSpinner className="asm-icon asm-spin" /> Exporting...
                  </>
                ) : (
                  <>
                    <FaDownload className="asm-icon" /> Export
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const getFieldLabel = (field) => {
  const labels = {
    id: 'Subscription ID',
    customer: 'Customer Information',
    plan: 'Plan Details',
    type: 'Plan Type',
    frequency: 'Delivery Frequency',
    size: 'Cylinder Size',
    status: 'Status',
    price: 'Price',
    dates: 'Date Information',
    reference: 'Reference Number'
  };
  return labels[field] || field;
};

export default ExportTools;