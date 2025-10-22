// components/Reports.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SalesReports from './SalesReports';
import UserReports from './UserReports';
import InventoryReports from './InventoryReports';
import SubscriptionReports from './SubscriptionReports';
import FinancialReports from './FinancialReports';
import ReportFilters from './ReportFilters';
import ExportOptions from './ExportOptions';
import RealTimeMetrics from './RealTimemetrics';
import ReportScheduler from './ReportScheduler';
import CustomReportBuilder from './CustomReportBuilder';
import SavedReports from './SavedReports';
import './ReportStyles/AdminReports.css';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    paymentMethod: 'all',
    deliveryOption: 'all',
    orderStatus: 'all',
    subscriptionType: 'all',
    userRole: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({});
  const [realTimeData, setRealTimeData] = useState({});
  const [viewMode, setViewMode] = useState('dashboard'); // dashboard, detailed, comparative
  const [timeFrame, setTimeFrame] = useState('30d'); // 7d, 30d, 90d, 1y, custom
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Real-time data polling
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchRealTimeData, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    fetchReportData();
    fetchRealTimeData();
  }, [activeReport, dateRange, filters, timeFrame]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        timeFrame,
        viewMode,
        ...filters
      });

      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }

      if (sortConfig.key) {
        queryParams.append('sortBy', sortConfig.key);
        queryParams.append('sortOrder', sortConfig.direction);
      }

      const response = await fetch(`http://localhost:5000/api/v1/admin/reports/${activeReport}?${queryParams}`);
      const data = await response.json();
      
      if (response.ok) {
        setReportData(data);
      } else {
        console.error('Failed to fetch report data:', data.message);
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/reports/realtime-metrics');
      const data = await response.json();
      if (response.ok) {
        setRealTimeData(data);
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const handleDateRangeChange = useCallback((newDateRange) => {
    setDateRange(newDateRange);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleTimeFrameChange = useCallback((newTimeFrame) => {
    setTimeFrame(newTimeFrame);
    // Auto-update date range based on time frame
    const endDate = new Date();
    const startDate = new Date();
    
    switch (newTimeFrame) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        // Keep current date range for custom
        return;
    }
    
    setDateRange({ startDate, endDate });
  }, []);

  const reportTypes = [
    { 
      id: 'sales', 
      label: 'Sales Reports', 
      icon: 'fas fa-chart-line',
      description: 'Order volumes, revenue trends, and product performance'
    },
    { 
      id: 'users', 
      label: 'User Reports', 
      icon: 'fas fa-users',
      description: 'User growth, activity, and demographic insights'
    },
    { 
      id: 'inventory', 
      label: 'Inventory Reports', 
      icon: 'fas fa-boxes',
      description: 'Stock levels, turnover rates, and product movement'
    },
    { 
      id: 'subscriptions', 
      label: 'Subscription Reports', 
      icon: 'fas fa-calendar-check',
      description: 'Subscription metrics, retention, and revenue'
    },
    { 
      id: 'financial', 
      label: 'Financial Reports', 
      icon: 'fas fa-money-bill-wave',
      description: 'Revenue, expenses, and financial performance'
    }
  ];

  const quickActions = [
    {
      label: 'Export Current',
      icon: 'fas fa-download',
      action: () => {/* Export logic */},
      color: 'primary'
    },
    {
      label: 'Schedule Report',
      icon: 'fas fa-clock',
      action: () => {/* Schedule logic */},
      color: 'secondary'
    },
    {
      label: 'Save View',
      icon: 'fas fa-bookmark',
      action: () => {/* Save logic */},
      color: 'success'
    },
    {
      label: 'Compare Periods',
      icon: 'fas fa-chart-bar',
      action: () => setViewMode('comparative'),
      color: 'info'
    }
  ];

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="report-loading">
          <div className="loading-spinner">
            <i className="fas fa-chart-bar fa-spin"></i>
          </div>
          <p>Generating comprehensive report...</p>
          <div className="loading-progress">
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>
        </div>
      );
    }

    const commonProps = {
      data: reportData,
      dateRange,
      filters,
      searchQuery,
      sortConfig,
      onSort: handleSort,
      viewMode
    };

    switch (activeReport) {
      case 'sales':
        return <SalesReports {...commonProps} />;
      case 'users':
        return <UserReports {...commonProps} />;
      case 'inventory':
        return <InventoryReports {...commonProps} />;
      case 'subscriptions':
        return <SubscriptionReports {...commonProps} />;
      case 'financial':
        return <FinancialReports {...commonProps} />;
      default:
        return <div>Select a report type</div>;
    }
  };

  const currentReport = useMemo(() => 
    reportTypes.find(report => report.id === activeReport),
    [activeReport]
  );

  return (
    <div className="reports-container">
      {/* Header Section */}
      <div className="reports-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Advanced Analytics Dashboard</h1>
            <div className="header-badges">
              <span className="badge live-badge">
                <i className="fas fa-circle"></i>
                Live Data
              </span>
              <span className="badge updated-badge">
                Updated just now
              </span>
            </div>
          </div>
          <p>{currentReport?.description}</p>
        </div>
        
        <div className="header-actions">
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'dashboard' ? 'active' : ''}`}
              onClick={() => setViewMode('dashboard')}
            >
              <i className="fas fa-chart-pie"></i>
              Dashboard
            </button>
            <button 
              className={`view-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => setViewMode('detailed')}
            >
              <i className="fas fa-table"></i>
              Detailed
            </button>
            <button 
              className={`view-btn ${viewMode === 'comparative' ? 'active' : ''}`}
              onClick={() => setViewMode('comparative')}
            >
              <i className="fas fa-chart-bar"></i>
              Compare
            </button>
          </div>
          
          <ExportOptions 
            reportType={activeReport} 
            dateRange={dateRange}
            filters={filters}
            data={reportData}
          />
        </div>
      </div>

      {/* Real-time Metrics */}
      <RealTimeMetrics 
        data={realTimeData}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={setAutoRefresh}
      />

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className={`quick-action-btn ${action.color}`}
            onClick={action.action}
          >
            <i className={action.icon}></i>
            {action.label}
          </button>
        ))}
      </div>

      <div className="reports-content">
        {/* Sidebar */}
        <div className="reports-sidebar">
          {/* Report Type Navigation */}
          <div className="report-types-section">
            <h3>Report Types</h3>
            <div className="report-types">
              {reportTypes.map(report => (
                <button
                  key={report.id}
                  className={`report-type-button ${activeReport === report.id ? 'active' : ''}`}
                  onClick={() => setActiveReport(report.id)}
                >
                  <div className="report-icon">
                    <i className={report.icon}></i>
                  </div>
                  <div className="report-info">
                    <span className="report-label">{report.label}</span>
                    <span className="report-description">{report.description}</span>
                  </div>
                  <i className="fas fa-chevron-right arrow"></i>
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          <ReportFilters
            reportType={activeReport}
            dateRange={dateRange}
            filters={filters}
            timeFrame={timeFrame}
            searchQuery={searchQuery}
            onDateRangeChange={handleDateRangeChange}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
            onTimeFrameChange={handleTimeFrameChange}
          />

          {/* Saved Reports */}
          <SavedReports 
            onReportSelect={(savedReport) => {
              setActiveReport(savedReport.type);
              setDateRange(savedReport.dateRange);
              setFilters(savedReport.filters);
            }}
          />
        </div>

        {/* Main Content */}
        <div className="reports-main">
          {/* Report Header */}
          <div className="report-header">
            <div className="report-title">
              <h2>{currentReport?.label}</h2>
              <div className="report-meta">
                <span className="date-range">
                  {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
                </span>
                <span className="data-points">
                  {reportData.totalRecords || 0} records
                </span>
              </div>
            </div>
            
            <div className="report-tools">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              
              <button className="refresh-btn" onClick={fetchReportData}>
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div className="report-content">
            {renderReportContent()}
          </div>
        </div>
      </div>

      {/* Advanced Features Modal */}
      <ReportScheduler 
        reportType={activeReport}
        filters={filters}
        dateRange={dateRange}
      />
      
      <CustomReportBuilder 
        availableData={reportData}
        onCustomReportGenerate={(customReport) => {
          // Handle custom report generation
        }}
      />
    </div>
  );
};

export default Reports;