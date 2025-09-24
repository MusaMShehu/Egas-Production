// components/Reports.js
import React, { useState, useEffect } from 'react';
import SalesReports from './SalesReports';
import UserReports from './UserReports';
import InventoryReports from './InventoryReports';
import SubscriptionReports from './SubscriptionReports';
import FinancialReports from './FinancialReports';
import ReportFilters from './ReportFilters';
import ExportOptions from './ExportOptions';
import './Reports.css';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    paymentMethod: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({});

  useEffect(() => {
    fetchReportData();
  }, [activeReport, dateRange, filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        ...filters
      });

      const response = await fetch(`/api/admin/reports/${activeReport}?${queryParams}`);
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

  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const reportTypes = [
    { id: 'sales', label: 'Sales Reports', icon: 'fas fa-chart-line' },
    { id: 'users', label: 'User Reports', icon: 'fas fa-users' },
    { id: 'inventory', label: 'Inventory Reports', icon: 'fas fa-boxes' },
    { id: 'subscriptions', label: 'Subscription Reports', icon: 'fas fa-calendar-check' },
    { id: 'financial', label: 'Financial Reports', icon: 'fas fa-money-bill-wave' }
  ];

  const renderReportContent = () => {
    if (loading) {
      return (
        <div className="report-loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Generating report...</p>
        </div>
      );
    }

    switch (activeReport) {
      case 'sales':
        return <SalesReports data={reportData} dateRange={dateRange} />;
      case 'users':
        return <UserReports data={reportData} dateRange={dateRange} />;
      case 'inventory':
        return <InventoryReports data={reportData} dateRange={dateRange} />;
      case 'subscriptions':
        return <SubscriptionReports data={reportData} dateRange={dateRange} />;
      case 'financial':
        return <FinancialReports data={reportData} dateRange={dateRange} />;
      default:
        return <div>Select a report type</div>;
    }
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-content">
          <h1>Reports & Analytics</h1>
          <p>Comprehensive insights into your business performance</p>
        </div>
        <ExportOptions 
          reportType={activeReport} 
          dateRange={dateRange}
          filters={filters}
        />
      </div>

      <div className="reports-content">
        <div className="reports-sidebar">
          <div className="report-types">
            {reportTypes.map(report => (
              <button
                key={report.id}
                className={`report-type-button ${activeReport === report.id ? 'active' : ''}`}
                onClick={() => setActiveReport(report.id)}
              >
                <i className={report.icon}></i>
                <span>{report.label}</span>
              </button>
            ))}
          </div>

          <ReportFilters
            reportType={activeReport}
            dateRange={dateRange}
            filters={filters}
            onDateRangeChange={handleDateRangeChange}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="reports-main">
          <div className="report-content">
            {renderReportContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;