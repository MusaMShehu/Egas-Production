// components/reports/DateRangePicker.js
import React, { useState, useRef, useEffect } from 'react';

const DateRangePicker = ({ 
  dateRange, 
  onDateRangeChange,
  presets = true,
  timeRanges = false,
  compareMode = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [compareDateRange, setCompareDateRange] = useState({
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  });
  const dropdownRef = useRef(null);

  const presetRanges = [
    { label: 'Today', days: 0, type: 'today' },
    { label: 'Yesterday', days: 1, type: 'yesterday' },
    { label: 'Last 7 Days', days: 7, type: 'last7' },
    { label: 'Last 30 Days', days: 30, type: 'last30' },
    { label: 'This Month', days: 'month', type: 'thisMonth' },
    { label: 'Last Month', days: 'last-month', type: 'lastMonth' },
    { label: 'This Quarter', days: 'quarter', type: 'thisQuarter' },
    { label: 'Last Quarter', days: 'last-quarter', type: 'lastQuarter' },
    { label: 'This Year', days: 'year', type: 'thisYear' },
    { label: 'Last Year', days: 'last-year', type: 'lastYear' },
    { label: 'Custom Range', days: 'custom', type: 'custom' }
  ];

  const quickRanges = [
    { label: '1H', hours: 1 },
    { label: '6H', hours: 6 },
    { label: '12H', hours: 12 },
    { label: '1D', hours: 24 },
    { label: '3D', hours: 72 }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const calculateDateRange = (type) => {
    const endDate = new Date();
    let startDate = new Date();

    switch (type) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        startDate.setDate(endDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'last7':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last30':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'thisMonth':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'lastMonth':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth() - 1, 1);
        endDate = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        break;
      case 'thisQuarter':
        const quarter = Math.floor(endDate.getMonth() / 3);
        startDate = new Date(endDate.getFullYear(), quarter * 3, 1);
        break;
      case 'lastQuarter':
        const lastQuarter = Math.floor((endDate.getMonth() - 3) / 3);
        startDate = new Date(endDate.getFullYear(), lastQuarter * 3, 1);
        endDate = new Date(endDate.getFullYear(), lastQuarter * 3 + 3, 0);
        break;
      case 'thisYear':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      case 'lastYear':
        startDate = new Date(endDate.getFullYear() - 1, 0, 1);
        endDate = new Date(endDate.getFullYear() - 1, 11, 31);
        break;
      default:
        return;
    }

    onDateRangeChange({ startDate, endDate });
    setIsOpen(false);
  };

  const handleQuickRange = (hours) => {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - hours * 60 * 60 * 1000);
    onDateRangeChange({ startDate, endDate });
    setIsOpen(false);
  };

  const handleCustomDateChange = (type, date) => {
    const newDate = new Date(date);
    if (type.includes('compare')) {
      const newCompareRange = { ...compareDateRange, [type.replace('compare', '').toLowerCase()]: newDate };
      setCompareDateRange(newCompareRange);
      onDateRangeChange({ 
        primary: dateRange, 
        compare: newCompareRange 
      });
    } else {
      const newDateRange = { ...dateRange, [type]: newDate };
      onDateRangeChange(newDateRange);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getActivePreset = () => {
    return presetRanges.find(preset => {
      if (preset.type === 'custom') return showCustomRange;
      // This would need more sophisticated matching in a real implementation
      return false;
    })?.label || 'Custom Range';
  };

  return (
    <div className="date-range-picker" ref={dropdownRef}>
      <button 
        className="date-range-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-calendar-alt"></i>
        <span className="date-range-display">
          {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
        </span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="date-range-dropdown">
          {timeRanges && (
            <div className="quick-time-ranges">
              <h4>Quick Ranges</h4>
              <div className="time-range-buttons">
                {quickRanges.map(range => (
                  <button
                    key={range.label}
                    className="time-range-btn"
                    onClick={() => handleQuickRange(range.hours)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {presets && (
            <div className="preset-ranges">
              <h4>Date Ranges</h4>
              <div className="preset-grid">
                {presetRanges.map(preset => (
                  <button
                    key={preset.type}
                    className={`preset-button ${getActivePreset() === preset.label ? 'active' : ''}`}
                    onClick={() => {
                      if (preset.type === 'custom') {
                        setShowCustomRange(true);
                      } else {
                        calculateDateRange(preset.type);
                      }
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="custom-range-section">
            <h4>Custom Range</h4>
            <div className="date-inputs">
              <div className="date-input-group">
                <label>From</label>
                <input
                  type="date"
                  value={dateRange.startDate.toISOString().split('T')[0]}
                  onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label>To</label>
                <input
                  type="date"
                  value={dateRange.endDate.toISOString().split('T')[0]}
                  onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
                />
              </div>
            </div>

            {compareMode && (
              <div className="compare-range">
                <h5>Compare With</h5>
                <div className="date-inputs">
                  <div className="date-input-group">
                    <label>From</label>
                    <input
                      type="date"
                      value={compareDateRange.startDate.toISOString().split('T')[0]}
                      onChange={(e) => handleCustomDateChange('compareStartDate', e.target.value)}
                    />
                  </div>
                  <div className="date-input-group">
                    <label>To</label>
                    <input
                      type="date"
                      value={compareDateRange.endDate.toISOString().split('T')[0]}
                      onChange={(e) => handleCustomDateChange('compareEndDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="date-range-actions">
            <button 
              className="btn-apply"
              onClick={() => setIsOpen(false)}
            >
              Apply
            </button>
            <button 
              className="btn-cancel"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;