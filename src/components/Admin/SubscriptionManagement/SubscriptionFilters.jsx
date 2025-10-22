// components/SubscriptionFilters.js
import React, { useState } from 'react';
import { FaPlus, FaMinus, FaTimes, FaFilter } from 'react-icons/fa';

const SubscriptionFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateRangeChange = (type, value) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [type]: value
      }
    });
  };

  const hasActiveFilters = () => {
    return filters.frequency !== 'all' || 
           filters.size !== 'all' || 
           filters.status !== 'all' ||
           filters.planType !== 'all' || 
           filters.search || 
           filters.dateRange.start || 
           filters.dateRange.end;
  };

  return (
    <div className="asm-subscription-filters">
      <div className="asm-filters-main">
        <div className="asm-filter-group">
          <label htmlFor="asm-search-filter">Search:</label>
          <input
            id="asm-search-filter"
            type="text"
            placeholder="Search by name, customer, email, or reference"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="asm-filter-input"
          />
        </div>

        <div className="asm-filter-group">
          <label htmlFor="asm-status-filter">Status:</label>
          <select
            id="asm-status-filter"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="asm-filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="asm-filter-group">
          <label htmlFor="asm-planType-filter">Plan Type:</label>
          <select
            id="asm-planType-filter"
            value={filters.planType}
            onChange={(e) => handleFilterChange('planType', e.target.value)}
            className="asm-filter-select"
          >
            <option value="all">All Types</option>
            <option value="custom">Custom</option>
            <option value="one-time">One Time</option>
            <option value="emergency">Emergency</option>
            <option value="preset">Preset</option>
          </select>
        </div>

        <div className="asm-filter-group">
          <label htmlFor="asm-frequency-filter">Frequency:</label>
          <select
            id="asm-frequency-filter"
            value={filters.frequency}
            onChange={(e) => handleFilterChange('frequency', e.target.value)}
            className="asm-filter-select"
          >
            <option value="all">All Frequencies</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Bi-Weekly">Bi-Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="One-Time">One-Time</option>
          </select>
        </div>

        <div className="asm-filter-actions">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="asm-btn asm-btn-outline"
          >
            {showAdvanced ? (
              <FaMinus className="asm-icon" />
            ) : (
              <FaPlus className="asm-icon" />
            )}
            Advanced
          </button>

          {hasActiveFilters() && (
            <button
              type="button"
              onClick={onClearFilters}
              className="asm-btn asm-btn-outline asm-btn-clear"
            >
              <FaTimes className="asm-icon" />
              Clear
            </button>
          )}
        </div>
      </div>

      {showAdvanced && (
        <div className="asm-filters-advanced">
          <div className="asm-advanced-filters-grid">
            <div className="asm-filter-group">
              <label htmlFor="asm-size-filter">Cylinder Size:</label>
              <select
                id="asm-size-filter"
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="asm-filter-select"
              >
                <option value="all">All Sizes</option>
                <option value="6kg">6kg</option>
                <option value="12kg">12kg</option>
                <option value="50kg">50kg</option>
              </select>
            </div>

            <div className="asm-filter-group">
              <label>Start Date Range:</label>
              <div className="asm-date-range-inputs">
                <input
                  type="date"
                  value={filters.dateRange.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="asm-filter-input"
                />
                <span className="asm-date-range-separator">to</span>
                <input
                  type="date"
                  value={filters.dateRange.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="asm-filter-input"
                />
              </div>
            </div>

            <div className="asm-filter-group">
              <label htmlFor="asm-subscription-period">Subscription Period:</label>
              <select
                id="asm-subscription-period"
                className="asm-filter-select"
                disabled
              >
                <option>Filter by period (coming soon)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionFilters;