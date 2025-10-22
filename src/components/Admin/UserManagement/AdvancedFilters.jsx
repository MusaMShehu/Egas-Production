// components/AdvancedFilters.js
import React, { useState, useEffect } from 'react';

const AdvancedFilters = ({ filters, onFiltersChange, availableRoles }) => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  // In a real app, you would fetch these from your API
  useEffect(() => {
    // Mock data - replace with actual API call
    setCities(['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix']);
    setStates(['California', 'Texas', 'New York', 'Florida', 'Illinois']);
  }, []);

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      role: 'all',
      status: 'all',
      city: 'all',
      state: 'all',
      gender: 'all'
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== 'all');

  return (
    <div className="aum-advanced-filters">
      <div className="aum-filter-header">
        <h3>Advanced Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="aum-btn aum-btn-sm aum-btn-outline">
            Clear All
          </button>
        )}
      </div>

      <div className="aum-filter-grid">
        <div className="aum-filter-group">
          <label className="aum-filter-label">User Role</label>
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="aum-filter-select"
          >
            <option value="all">All Roles</option>
            {availableRoles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="aum-filter-group">
          <label className="aum-filter-label">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="aum-filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="aum-filter-group">
          <label className="aum-filter-label">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="aum-filter-select"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="aum-filter-group">
          <label className="aum-filter-label">City</label>
          <select
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="aum-filter-select"
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="aum-filter-group">
          <label className="aum-filter-label">State</label>
          <select
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="aum-filter-select"
          >
            <option value="all">All States</option>
            {states.map(state => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="aum-active-filters">
          <h4>Active Filters:</h4>
          <div className="aum-filter-chips">
            {filters.role !== 'all' && (
              <span className="aum-filter-chip">
                Role: {availableRoles.find(r => r.value === filters.role)?.label || filters.role}
                <button onClick={() => handleFilterChange('role', 'all')}>×</button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="aum-filter-chip">
                Status: {filters.status}
                <button onClick={() => handleFilterChange('status', 'all')}>×</button>
              </span>
            )}
            {filters.gender !== 'all' && (
              <span className="aum-filter-chip">
                Gender: {filters.gender}
                <button onClick={() => handleFilterChange('gender', 'all')}>×</button>
              </span>
            )}
            {filters.city !== 'all' && (
              <span className="aum-filter-chip">
                City: {filters.city}
                <button onClick={() => handleFilterChange('city', 'all')}>×</button>
              </span>
            )}
            {filters.state !== 'all' && (
              <span className="aum-filter-chip">
                State: {filters.state}
                <button onClick={() => handleFilterChange('state', 'all')}>×</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;