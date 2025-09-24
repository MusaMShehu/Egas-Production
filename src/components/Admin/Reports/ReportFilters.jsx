// components/reports/ReportFilters.js
import React, { useState } from 'react';
import DateRangePicker from './DateRangePicker';

const ReportFilters = ({ reportType, dateRange, filters, onDateRangeChange, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderCategoryFilters = () => {
    if (reportType === 'sales' || reportType === 'inventory') {
      return (
        <div className="filter-group">
          <label htmlFor="category">Product Category</label>
          <select
            id="category"
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="6kg">6kg Cylinders</option>
            <option value="12kg">12kg Cylinders</option>
            <option value="50kg">50kg Cylinders</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const renderStatusFilters = () => {
    if (reportType === 'sales' || reportType === 'subscriptions') {
      return (
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const renderPaymentFilters = () => {
    if (reportType === 'sales' || reportType === 'financial') {
      return (
        <div className="filter-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            value={localFilters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="card">Credit Card</option>
            <option value="wallet">Wallet</option>
            <option value="transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
          </select>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="report-filters">
      <h3>Filters</h3>
      
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />

      {renderCategoryFilters()}
      {renderStatusFilters()}
      {renderPaymentFilters()}

      <div className="filter-group">
        <label htmlFor="comparison">Compare With</label>
        <select
          id="comparison"
          onChange={(e) => handleFilterChange('comparison', e.target.value)}
        >
          <option value="none">No Comparison</option>
          <option value="previousPeriod">Previous Period</option>
          <option value="previousYear">Same Period Last Year</option>
          <option value="target">Target Goals</option>
        </select>
      </div>

      <button
        onClick={() => onFilterChange({ category: 'all', status: 'all', paymentMethod: 'all' })}
        className="btn-clear-filters"
      >
        <i className="fas fa-times"></i>
        Clear All Filters
      </button>
    </div>
  );
};

export default ReportFilters;