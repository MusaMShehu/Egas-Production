// components/reports/DateRangePicker.js
import React, { useState } from 'react';

const DateRangePicker = ({ dateRange, onDateRangeChange }) => {
  const [showCustomRange, setShowCustomRange] = useState(false);

  const presetRanges = [
    { label: 'Today', days: 0 },
    { label: 'Yesterday', days: 1 },
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'This Month', days: 'month' },
    { label: 'Last Month', days: 'last-month' },
    { label: 'This Year', days: 'year' },
    { label: 'Custom Range', days: 'custom' }
  ];

  const handlePresetSelect = (days) => {
    if (days === 'custom') {
      setShowCustomRange(true);
      return;
    }

    setShowCustomRange(false);
    const endDate = new Date();
    let startDate = new Date();

    if (days === 'month') {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    } else if (days === 'last-month') {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
      endDate.setDate(0); // Last day of previous month
    } else if (days === 'year') {
      startDate = new Date(endDate.getFullYear(), 0, 1);
    } else {
      startDate.setDate(endDate.getDate() - days);
    }

    onDateRangeChange({ startDate, endDate });
  };

  const handleCustomDateChange = (type, date) => {
    const newDateRange = { ...dateRange, [type]: new Date(date) };
    onDateRangeChange(newDateRange);
  };

  return (
    <div className="date-range-picker">
      <div className="preset-ranges">
        {presetRanges.map(preset => (
          <button
            key={preset.label}
            className={`preset-button ${!showCustomRange && dateRange.days === preset.days ? 'active' : ''}`}
            onClick={() => handlePresetSelect(preset.days)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {showCustomRange && (
        <div className="custom-range">
          <div className="date-input-group">
            <label htmlFor="startDate">From</label>
            <input
              type="date"
              id="startDate"
              value={dateRange.startDate.toISOString().split('T')[0]}
              onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <label htmlFor="endDate">To</label>
            <input
              type="date"
              id="endDate"
              value={dateRange.endDate.toISOString().split('T')[0]}
              onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;