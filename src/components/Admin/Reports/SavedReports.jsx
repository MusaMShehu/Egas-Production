// components/reports/SavedReports.js
import React, { useState, useEffect } from 'react';
import './ReportStyles/SavedReports.css'

const SavedReports = ({ onReportSelect }) => {
  const [savedReports, setSavedReports] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSavedReports();
  }, []);

  const loadSavedReports = async () => {
    try {
      const response = await fetch('/api/admin/reports/saved');
      const data = await response.json();
      if (response.ok) {
        setSavedReports(data);
      }
    } catch (error) {
      console.error('Error loading saved reports:', error);
    }
  };

  const filteredReports = savedReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunReport = (report) => {
    onReportSelect?.(report);
    setIsOpen(false);
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this saved report?')) return;

    try {
      const response = await fetch(`/api/admin/reports/saved/${reportId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSavedReports(prev => prev.filter(report => report.id !== reportId));
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const handleSaveCurrentReport = async () => {
    const reportName = prompt('Enter a name for this report:');
    if (!reportName) return;

    try {
      const currentReport = {
        name: reportName,
        type: 'sales', // This would come from current state
        description: 'Custom saved report',
        filters: {},
        dateRange: {
          startDate: new Date(),
          endDate: new Date()
        },
        config: {}
      };

      const response = await fetch('/api/admin/reports/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentReport)
      });

      if (response.ok) {
        const savedReport = await response.json();
        setSavedReports(prev => [...prev, savedReport]);
      }
    } catch (error) {
      console.error('Error saving report:', error);
    }
  };

  const getReportIcon = (type) => {
    switch (type) {
      case 'sales':
        return 'fas fa-chart-line';
      case 'users':
        return 'fas fa-users';
      case 'inventory':
        return 'fas fa-boxes';
      case 'subscriptions':
        return 'fas fa-calendar-check';
      case 'financial':
        return 'fas fa-money-bill-wave';
      default:
        return 'fas fa-chart-bar';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="saved-reports">
      <button 
        className="btn-saved-reports-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-bookmark"></i>
        Saved Reports
        <span className="saved-count">{savedReports.length}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="saved-reports-panel">
          <div className="panel-header">
            <h3>Saved Reports</h3>
            <p>Quick access to your frequently used reports</p>
          </div>

          <div className="panel-controls">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search saved reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              className="btn-save-current"
              onClick={handleSaveCurrentReport}
            >
              <i className="fas fa-save"></i>
              Save Current
            </button>
          </div>

          <div className="reports-list">
            {filteredReports.length > 0 ? (
              filteredReports.map(report => (
                <div key={report.id} className="saved-report-item">
                  <div className="report-icon">
                    <i className={getReportIcon(report.type)}></i>
                  </div>
                  
                  <div className="report-info">
                    <div className="report-name">{report.name}</div>
                    <div className="report-description">{report.description}</div>
                    <div className="report-meta">
                      <span className="report-type">{report.type}</span>
                      <span className="report-date">
                        Saved {formatDate(report.savedAt)}
                      </span>
                      {report.lastRun && (
                        <span className="report-last-run">
                          Last run {formatDate(report.lastRun)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="report-actions">
                    <button 
                      className="btn-run"
                      onClick={() => handleRunReport(report)}
                      title="Run this report"
                    >
                      <i className="fas fa-play"></i>
                    </button>
                    <button 
                      className="btn-edit"
                      title="Edit report"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDeleteReport(report.id)}
                      title="Delete report"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-reports">
                <i className="fas fa-folder-open"></i>
                <div className="no-reports-content">
                  <h4>No saved reports found</h4>
                  <p>
                    {searchTerm 
                      ? 'No reports match your search criteria'
                      : 'Save your frequently used reports for quick access'
                    }
                  </p>
                  {!searchTerm && (
                    <button 
                      className="btn-save-first"
                      onClick={handleSaveCurrentReport}
                    >
                      <i className="fas fa-save"></i>
                      Save Your First Report
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Templates */}
          <div className="report-templates">
            <h4>Quick Templates</h4>
            <div className="templates-grid">
              <div 
                className="template-card"
                onClick={() => handleRunReport({
                  name: 'Daily Sales Snapshot',
                  type: 'sales',
                  filters: { status: 'completed' },
                  dateRange: {
                    startDate: new Date(),
                    endDate: new Date()
                  }
                })}
              >
                <i className="fas fa-sun"></i>
                <div className="template-name">Daily Sales</div>
                <div className="template-desc">Today's performance</div>
              </div>
              
              <div 
                className="template-card"
                onClick={() => handleRunReport({
                  name: 'Weekly Performance',
                  type: 'sales',
                  filters: {},
                  dateRange: {
                    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date()
                  }
                })}
              >
                <i className="fas fa-calendar-week"></i>
                <div className="template-name">Weekly Review</div>
                <div className="template-desc">Last 7 days</div>
              </div>
              
              <div 
                className="template-card"
                onClick={() => handleRunReport({
                  name: 'Monthly Analytics',
                  type: 'financial',
                  filters: {},
                  dateRange: {
                    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    endDate: new Date()
                  }
                })}
              >
                <i className="fas fa-chart-bar"></i>
                <div className="template-name">Monthly Report</div>
                <div className="template-desc">Current month</div>
              </div>
              
              <div 
                className="template-card"
                onClick={() => handleRunReport({
                  name: 'Inventory Health',
                  type: 'inventory',
                  filters: { status: 'low' },
                  dateRange: {
                    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    endDate: new Date()
                  }
                })}
              >
                <i className="fas fa-heartbeat"></i>
                <div className="template-name">Stock Check</div>
                <div className="template-desc">Low inventory alert</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedReports;