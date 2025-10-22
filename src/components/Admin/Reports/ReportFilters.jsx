// components/reports/ReportFilters.js
import React, { useState, useMemo } from 'react';
import DateRangePicker from './DateRangePicker';

const ReportFilters = ({ 
  reportType, 
  dateRange, 
  filters, 
  timeFrame,
  searchQuery,
  onDateRangeChange, 
  onFilterChange,
  onSearch,
  onTimeFrameChange,
  compareMode = false 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const timeFrames = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
    { value: 'ytd', label: 'Year to Date' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const statusOptions = {
    all: { label: 'All Statuses', color: 'gray' },
    pending: { label: 'Pending', color: 'yellow' },
    completed: { label: 'Completed', color: 'green' },
    cancelled: { label: 'Cancelled', color: 'red' },
    processing: { label: 'Processing', color: 'blue' },
    delivered: { label: 'Delivered', color: 'green' },
    refunded: { label: 'Refunded', color: 'orange' }
  };

  const categoryOptions = {
    all: 'All Categories',
    gas: 'Gas Cylinders',
    accessory: 'Accessories',
    '6kg': '6kg Cylinders',
    '12kg': '12kg Cylinders', 
    '50kg': '50kg Cylinders'
  };

  const paymentMethods = {
    all: 'All Methods',
    wallet: 'Wallet',
    paystack: 'Paystack',
    card: 'Credit Card',
    transfer: 'Bank Transfer'
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      category: 'all',
      status: 'all',
      paymentMethod: 'all',
      deliveryOption: 'all',
      orderStatus: 'all',
      subscriptionType: 'all',
      userRole: 'all'
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const renderCategoryFilters = () => {
    if (['sales', 'inventory', 'financial'].includes(reportType)) {
      return (
        <div className="filter-group">
          <label htmlFor="category">Product Category</label>
          <select
            id="category"
            value={localFilters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {Object.entries(categoryOptions).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  const renderStatusFilters = () => {
    if (['sales', 'subscriptions', 'users'].includes(reportType)) {
      return (
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={localFilters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {Object.entries(statusOptions).map(([value, config]) => (
              <option key={value} value={value}>{config.label}</option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  const renderPaymentFilters = () => {
    if (['sales', 'financial'].includes(reportType)) {
      return (
        <div className="filter-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            value={localFilters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
          >
            {Object.entries(paymentMethods).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      );
    }
    return null;
  };

  const renderDeliveryFilters = () => {
    if (reportType === 'sales') {
      return (
        <div className="filter-group">
          <label htmlFor="deliveryOption">Delivery Option</label>
          <select
            id="deliveryOption"
            value={localFilters.deliveryOption}
            onChange={(e) => handleFilterChange('deliveryOption', e.target.value)}
          >
            <option value="all">All Options</option>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
          </select>
        </div>
      );
    }
    return null;
  };

  const renderSubscriptionFilters = () => {
    if (reportType === 'subscriptions') {
      return (
        <>
          <div className="filter-group">
            <label htmlFor="subscriptionType">Subscription Type</label>
            <select
              id="subscriptionType"
              value={localFilters.subscriptionType}
              onChange={(e) => handleFilterChange('subscriptionType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="custom">Custom</option>
              <option value="one-time">One-Time</option>
              <option value="emergency">Emergency</option>
              <option value="preset">Preset</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="frequency">Frequency</label>
            <select
              id="frequency"
              value={localFilters.frequency}
              onChange={(e) => handleFilterChange('frequency', e.target.value)}
            >
              <option value="all">All Frequencies</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-Weekly">Bi-Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="One-Time">One-Time</option>
            </select>
          </div>
        </>
      );
    }
    return null;
  };

  const renderUserFilters = () => {
    if (reportType === 'users') {
      return (
        <div className="filter-group">
          <label htmlFor="userRole">User Role</label>
            <select
              id="userRole"
              value={localFilters.userRole}
              onChange={(e) => handleFilterChange('userRole', e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery</option>
              <option value="customer_care">Customer Care</option>
            </select>
          </div>
      );
    }
    return null;
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(localFilters).filter(value => value !== 'all').length;
  }, [localFilters]);

  return (
    <div className="report-filters">
      <div className="filters-header">
        <h3>Filters & Settings</h3>
        <div className="filter-actions">
          <span className="active-filters">{activeFilterCount} active</span>
          <button 
            className="btn-toggle-advanced"
            onClick={() => setAdvancedOpen(!advancedOpen)}
          >
            <i className={`fas fa-chevron-${advancedOpen ? 'up' : 'down'}`}></i>
          </button>
        </div>
      </div>

      {/* Quick Time Frame Selector */}
      <div className="filter-group">
        <label htmlFor="timeFrame">Time Frame</label>
        <select
          id="timeFrame"
          value={timeFrame}
          onChange={(e) => onTimeFrameChange(e.target.value)}
        >
          {timeFrames.map(frame => (
            <option key={frame.value} value={frame.value}>
              {frame.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Picker */}
      <div className="filter-group">
        <label>Date Range</label>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={onDateRangeChange}
          presets={true}
          timeRanges={reportType === 'sales'}
          compareMode={compareMode}
        />
      </div>

      {/* Search */}
      <div className="filter-group">
        <label htmlFor="search">Search</label>
        <div className="search-input">
          <i className="fas fa-search"></i>
          <input
            type="text"
            id="search"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => onSearch('')}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      {/* Basic Filters */}
      <div className="basic-filters">
        {renderCategoryFilters()}
        {renderStatusFilters()}
        {renderPaymentFilters()}
        {renderDeliveryFilters()}
        {renderSubscriptionFilters()}
        {renderUserFilters()}
      </div>

      {/* Advanced Filters */}
      {advancedOpen && (
        <div className="advanced-filters">
          <h4>Advanced Filters</h4>
          
          <div className="filter-group">
            <label htmlFor="amountRange">Amount Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.minAmount || ''}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.maxAmount || ''}
                onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="quantityRange">Quantity Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                value={localFilters.minQuantity || ''}
                onChange={(e) => handleFilterChange('minQuantity', e.target.value)}
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={localFilters.maxQuantity || ''}
                onChange={(e) => handleFilterChange('maxQuantity', e.target.value)}
              />
            </div>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={localFilters.includeInactive || false}
                onChange={(e) => handleFilterChange('includeInactive', e.target.checked)}
              />
              Include Inactive Items
            </label>
          </div>

          <div className="filter-group">
            <label htmlFor="sortBy">Sort By</label>
            <select
              id="sortBy"
              value={localFilters.sortBy || 'date'}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="quantity">Quantity</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      )}

      {/* Filter Actions */}
      <div className="filter-actions-bottom">
        <button
          onClick={handleApplyFilters}
          className="btn-apply-filters"
        >
          <i className="fas fa-check"></i>
          Apply Filters
        </button>
        <button
          onClick={handleResetFilters}
          className="btn-clear-filters"
        >
          <i className="fas fa-times"></i>
          Clear All
        </button>
      </div>

      {/* Saved Filter Presets */}
      <div className="filter-presets">
        <h4>Quick Presets</h4>
        <div className="preset-buttons">
          <button className="preset-btn" onClick={() => {
            handleFilterChange('status', 'completed');
            handleFilterChange('paymentMethod', 'paystack');
          }}>
            Successful Sales
          </button>
          <button className="preset-btn" onClick={() => {
            handleFilterChange('status', 'active');
            handleFilterChange('subscriptionType', 'monthly');
          }}>
            Active Subscriptions
          </button>
          <button className="preset-btn" onClick={() => {
            handleFilterChange('status', 'low');
            handleFilterChange('category', 'gas');
          }}>
            Low Stock Gas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;