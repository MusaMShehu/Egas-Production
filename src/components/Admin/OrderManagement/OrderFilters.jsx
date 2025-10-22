// components/OrderFilters.js
import React, { useState } from 'react';
import { 
  FaSearch, 
  FaSlidersH, 
  FaTimes, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaFilter
} from 'react-icons/fa';

const OrderFilters = ({ filters, onFilterChange, orderCount }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: 'all',
      paymentStatus: 'all',
      paymentMethod: 'all',
      deliveryOption: 'all',
      dateRange: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const hasActiveFilters = () => {
    return filters.status !== 'all' ||
           filters.paymentStatus !== 'all' ||
           filters.paymentMethod !== 'all' ||
           filters.deliveryOption !== 'all' ||
           filters.dateRange !== 'all' ||
           filters.search !== '';
  };

  return (
    <div className="aom-order-filters">
      <div className="aom-filters-main">
        <div className="aom-search-box">
          <FaSearch className="aom-icon" />
          <input
            type="text"
            placeholder="Search orders, customers, addresses..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="aom-quick-filters">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="in-transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.paymentStatus}
            onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>

          <button
            className={`aom-btn-advanced ${showAdvanced ? 'aom-active' : ''}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <FaSlidersH className="aom-icon" />
            Advanced
          </button>

          {hasActiveFilters() && (
            <button className="aom-btn-clear" onClick={clearFilters}>
              <FaTimes className="aom-icon" />
              Clear
            </button>
          )}
        </div>

        <div className="aom-sort-options">
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="createdAt">Date</option>
            <option value="totalAmount">Amount</option>
            <option value="orderId">Order ID</option>
          </select>

          <button
            className={`aom-btn-sort ${filters.sortOrder === 'desc' ? 'aom-desc' : 'aom-asc'}`}
            onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {filters.sortOrder === 'desc' ? (
              <FaSortAmountDown className="aom-icon" />
            ) : (
              <FaSortAmountUp className="aom-icon" />
            )}
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="aom-advanced-filters">
          <div className="aom-filter-group">
            <label>Payment Method</label>
            <select
              value={filters.paymentMethod}
              onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="wallet">Wallet</option>
              <option value="paystack">Paystack</option>
            </select>
          </div>

          <div className="aom-filter-group">
            <label>Delivery Option</label>
            <select
              value={filters.deliveryOption}
              onChange={(e) => handleFilterChange('deliveryOption', e.target.value)}
            >
              <option value="all">All Options</option>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
            </select>
          </div>

          <div className="aom-filter-group">
            <label>Amount Range</label>
            <div className="aom-amount-range">
              <input type="number" placeholder="Min" />
              <span>to</span>
              <input type="number" placeholder="Max" />
            </div>
          </div>
        </div>
      )}

      <div className="aom-filter-results">
        <span>{orderCount} orders found</span>
        {hasActiveFilters() && (
          <span className="aom-active-filters">(with filters applied)</span>
        )}
      </div>
    </div>
  );
};

export default OrderFilters;