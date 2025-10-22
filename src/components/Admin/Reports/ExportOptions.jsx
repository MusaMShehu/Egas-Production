// components/reports/ExportOptions.js
import React, { useState } from 'react';

const ExportOptions = ({ 
  reportType, 
  dateRange, 
  filters, 
  data,
  onExportComplete 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportConfig, setExportConfig] = useState({
    format: 'pdf',
    includeCharts: true,
    includeTables: true,
    dataRange: 'current',
    compression: 'normal'
  });

  const exportFormats = [
    { 
      format: 'pdf', 
      label: 'PDF Document', 
      icon: 'fas fa-file-pdf',
      description: 'Best for printing and sharing',
      supported: true
    },
    { 
      format: 'excel', 
      label: 'Excel Spreadsheet', 
      icon: 'fas fa-file-excel',
      description: 'Best for data analysis',
      supported: true
    },
    { 
      format: 'csv', 
      label: 'CSV File', 
      icon: 'fas fa-file-csv',
      description: 'Best for data processing',
      supported: true
    },
    { 
      format: 'json', 
      label: 'JSON Data', 
      icon: 'fas fa-file-code',
      description: 'Best for developers',
      supported: true
    },
    { 
      format: 'print', 
      label: 'Print', 
      icon: 'fas fa-print',
      description: 'Print optimized version',
      supported: true
    }
  ];

  const dataRanges = [
    { value: 'current', label: 'Current View' },
    { value: 'all', label: 'All Data' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleExport = async (format = exportConfig.format) => {
    try {
      setExporting(true);

      if (format === 'print') {
        window.print();
        onExportComplete?.('success');
        return;
      }

      const exportData = {
        reportType,
        dateRange,
        filters,
        config: exportConfig,
        timestamp: new Date().toISOString()
      };

      const queryParams = new URLSearchParams({
        config: JSON.stringify(exportData)
      });

      const response = await fetch(`/api/admin/reports/export/${format}?${queryParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data })
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = generateFileName(format);
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        onExportComplete?.('success');
        
        // Log export activity
        logExportActivity(format, exportConfig);
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      onExportComplete?.('error', error.message);
    } finally {
      setExporting(false);
      setIsOpen(false);
    }
  };

  const generateFileName = (format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
    return `${reportType}_report_${timestamp}_${time}.${format}`;
  };

  const logExportActivity = (format, config) => {
    // In a real app, this would send to your analytics/audit log
    console.log('Export activity:', {
      reportType,
      format,
      config,
      timestamp: new Date().toISOString()
    });
  };

  const handleQuickExport = (format) => {
    handleExport(format);
  };

  const updateExportConfig = (key, value) => {
    setExportConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="export-options">
      <div className="export-buttons">
        <button 
          className="btn-export-quick"
          onClick={() => handleQuickExport('pdf')}
          disabled={exporting}
        >
          <i className="fas fa-download"></i>
          Quick Export
        </button>

        <div className="export-dropdown">
          <button 
            className="btn-export-advanced"
            onClick={() => setIsOpen(!isOpen)}
            disabled={exporting}
          >
            <i className="fas fa-cog"></i>
            Advanced
            <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
          </button>

          {isOpen && (
            <div className="export-panel">
              <div className="export-header">
                <h4>Export Report</h4>
                <p>Customize your export settings</p>
              </div>

              <div className="export-config">
                <div className="config-group">
                  <label>Format</label>
                  <div className="format-options">
                    {exportFormats.map(item => (
                      <button
                        key={item.format}
                        className={`format-option ${exportConfig.format === item.format ? 'active' : ''}`}
                        onClick={() => updateExportConfig('format', item.format)}
                        disabled={!item.supported}
                      >
                        <i className={item.icon}></i>
                        <div className="format-info">
                          <div className="format-label">{item.label}</div>
                          <div className="format-description">{item.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="config-group">
                  <label>Data Range</label>
                  <select
                    value={exportConfig.dataRange}
                    onChange={(e) => updateExportConfig('dataRange', e.target.value)}
                  >
                    {dataRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="config-group">
                  <label>Content</label>
                  <div className="checkbox-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={exportConfig.includeCharts}
                        onChange={(e) => updateExportConfig('includeCharts', e.target.checked)}
                      />
                      Include Charts & Graphs
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={exportConfig.includeTables}
                        onChange={(e) => updateExportConfig('includeTables', e.target.checked)}
                      />
                      Include Data Tables
                    </label>
                  </div>
                </div>

                <div className="config-group">
                  <label>Compression</label>
                  <select
                    value={exportConfig.compression}
                    onChange={(e) => updateExportConfig('compression', e.target.value)}
                  >
                    <option value="low">Low (Best Quality)</option>
                    <option value="normal">Normal</option>
                    <option value="high">High (Smaller File)</option>
                  </select>
                </div>
              </div>

              <div className="export-actions">
                <button 
                  className="btn-export-apply"
                  onClick={() => handleExport()}
                  disabled={exporting}
                >
                  {exporting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-download"></i>
                      Export Now
                    </>
                  )}
                </button>
                <button 
                  className="btn-export-cancel"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick format buttons */}
        <div className="quick-export-buttons">
          {exportFormats.slice(0, 3).map(item => (
            <button
              key={item.format}
              className={`quick-format-btn ${item.format}`}
              onClick={() => handleQuickExport(item.format)}
              disabled={exporting || !item.supported}
              title={`Export as ${item.label}`}
            >
              <i className={item.icon}></i>
            </button>
          ))}
        </div>
      </div>

      {exporting && (
        <div className="export-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <span>Preparing your export...</span>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;