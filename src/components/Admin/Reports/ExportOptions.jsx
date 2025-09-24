// components/reports/ExportOptions.js
import React from 'react';

const ExportOptions = ({ reportType, dateRange, filters }) => {
  const exportFormats = [
    { format: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf' },
    { format: 'excel', label: 'Excel', icon: 'fas fa-file-excel' },
    { format: 'csv', label: 'CSV', icon: 'fas fa-file-csv' },
    { format: 'print', label: 'Print', icon: 'fas fa-print' }
  ];

  const handleExport = async (format) => {
    try {
      const queryParams = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        ...filters,
        format
      });

      if (format === 'print') {
        window.print();
        return;
      }

      const response = await fetch(`/api/admin/reports/export/${reportType}?${queryParams}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to export report');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting report');
    }
  };

  return (
    <div className="export-options">
      <div className="export-dropdown">
        <button className="btn-export">
          <i className="fas fa-download"></i>
          Export Report
          <i className="fas fa-chevron-down"></i>
        </button>
        <div className="export-menu">
          {exportFormats.map(item => (
            <button
              key={item.format}
              className="export-option"
              onClick={() => handleExport(item.format)}
            >
              <i className={item.icon}></i>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;