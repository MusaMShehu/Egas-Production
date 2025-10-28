// components/reports/ReportScheduler.js
import React, { useState, useEffect } from 'react';

const ReportScheduler = ({ 
  reportType, 
  filters, 
  dateRange,
  onScheduleCreated 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    frequency: 'weekly',
    deliveryTime: '09:00',
    deliveryDay: 'monday',
    deliveryDate: 1,
    recipients: [],
    format: 'pdf',
    includeCharts: true,
    includeData: true,
    enabled: true
  });
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [availableRecipients, setAvailableRecipients] = useState([]);

  useEffect(() => {
    // Load existing schedules and recipients
    fetchSchedules();
    fetchRecipients();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/reports/schedules');
      const data = await response.json();
      if (response.ok) {
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const fetchRecipients = async () => {
    try {
      const response = await fetch('/api/admin/reports/recipients');
      const data = await response.json();
      if (response.ok) {
        setAvailableRecipients(data);
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  };

  const frequencyOptions = [
    { value: 'daily', label: 'Daily', description: 'Every day at specified time' },
    { value: 'weekly', label: 'Weekly', description: 'Every week on specified day' },
    { value: 'monthly', label: 'Monthly', description: 'Every month on specified date' },
    { value: 'quarterly', label: 'Quarterly', description: 'Every quarter' },
    { value: 'yearly', label: 'Yearly', description: 'Every year' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: 'fas fa-file-pdf' },
    { value: 'excel', label: 'Excel', icon: 'fas fa-file-excel' },
    { value: 'csv', label: 'CSV', icon: 'fas fa-file-csv' }
  ];

  const handleInputChange = (field, value) => {
    setNewSchedule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecipientToggle = (recipient) => {
    setSelectedRecipients(prev => {
      const isSelected = prev.includes(recipient.id);
      if (isSelected) {
        return prev.filter(id => id !== recipient.id);
      } else {
        return [...prev, recipient.id];
      }
    });
  };

  const handleCreateSchedule = async () => {
    try {
      const scheduleData = {
        ...newSchedule,
        recipients: selectedRecipients,
        reportType,
        filters,
        dateRange,
        config: {
          includeCharts: newSchedule.includeCharts,
          includeData: newSchedule.includeData
        }
      };

      const response = await fetch('/api/admin/reports/schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData)
      });

      if (response.ok) {
        const createdSchedule = await response.json();
        setSchedules(prev => [...prev, createdSchedule]);
        setNewSchedule({
          name: '',
          frequency: 'weekly',
          deliveryTime: '09:00',
          deliveryDay: 'monday',
          deliveryDate: 1,
          recipients: [],
          format: 'pdf',
          includeCharts: true,
          includeData: true,
          enabled: true
        });
        setSelectedRecipients([]);
        setIsOpen(false);
        onScheduleCreated?.(createdSchedule);
      }
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  const handleToggleSchedule = async (scheduleId, enabled) => {
    try {
      const response = await fetch(`/api/admin/reports/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled })
      });

      if (response.ok) {
        setSchedules(prev => 
          prev.map(schedule => 
            schedule.id === scheduleId 
              ? { ...schedule, enabled } 
              : schedule
          )
        );
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const response = await fetch(`/api/admin/reports/schedules/${scheduleId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
      }
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const getNextRun = (schedule) => {
    // Calculate next run date based on frequency
    const now = new Date();
    let nextRun = new Date();
    
    switch (schedule.frequency) {
      case 'daily':
        nextRun.setDate(now.getDate() + 1);
        break;
      case 'weekly':
        const daysUntilNext = (7 - now.getDay() + ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'].indexOf(schedule.deliveryDay)) % 7;
        nextRun.setDate(now.getDate() + (daysUntilNext || 7));
        break;
      case 'monthly':
        nextRun.setMonth(now.getMonth() + 1);
        nextRun.setDate(schedule.deliveryDate);
        break;
      default:
        return 'N/A';
    }
    
    return nextRun.toLocaleDateString();
  };

  return (
    <div className="report-scheduler">
      <button 
        className="btn-scheduler-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="fas fa-clock"></i>
        Schedule Reports
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="scheduler-panel">
          <div className="scheduler-header">
            <h3>Report Scheduling</h3>
            <p>Automate report generation and delivery</p>
          </div>

          <div className="scheduler-content">
            {/* Existing Schedules */}
            <div className="existing-schedules">
              <h4>Active Schedules</h4>
              {schedules.length > 0 ? (
                <div className="schedules-list">
                  {schedules.map(schedule => (
                    <div key={schedule.id} className="schedule-item">
                      <div className="schedule-info">
                        <div className="schedule-name">{schedule.name}</div>
                        <div className="schedule-details">
                          <span className="frequency">{schedule.frequency}</span>
                          <span className="format">{schedule.format}</span>
                          <span className="next-run">
                            Next: {getNextRun(schedule)}
                          </span>
                        </div>
                      </div>
                      <div className="schedule-actions">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={schedule.enabled}
                            onChange={(e) => handleToggleSchedule(schedule.id, e.target.checked)}
                          />
                          <span className="slider"></span>
                        </label>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteSchedule(schedule.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-schedules">
                  <i className="fas fa-calendar-plus"></i>
                  <p>No scheduled reports yet</p>
                </div>
              )}
            </div>

            {/* New Schedule Form */}
            <div className="new-schedule">
              <h4>Create New Schedule</h4>
              <div className="schedule-form">
                <div className="form-group">
                  <label>Schedule Name *</label>
                  <input
                    type="text"
                    value={newSchedule.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Weekly Sales Report"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Frequency *</label>
                    <select
                      value={newSchedule.frequency}
                      onChange={(e) => handleInputChange('frequency', e.target.value)}
                    >
                      {frequencyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Delivery Time *</label>
                    <input
                      type="time"
                      value={newSchedule.deliveryTime}
                      onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    />
                  </div>
                </div>

                {newSchedule.frequency === 'weekly' && (
                  <div className="form-group">
                    <label>Delivery Day *</label>
                    <select
                      value={newSchedule.deliveryDay}
                      onChange={(e) => handleInputChange('deliveryDay', e.target.value)}
                    >
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                    </select>
                  </div>
                )}

                {newSchedule.frequency === 'monthly' && (
                  <div className="form-group">
                    <label>Delivery Date *</label>
                    <select
                      value={newSchedule.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', parseInt(e.target.value))}
                    >
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(date => (
                        <option key={date} value={date}>
                          {date}
                          {date === 1 && 'st'}
                          {date === 2 && 'nd'}
                          {date === 3 && 'rd'}
                          {date > 3 && 'th'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Report Format *</label>
                  <div className="format-options">
                    {formatOptions.map(option => (
                      <label key={option.value} className="format-option">
                        <input
                          type="radio"
                          value={option.value}
                          checked={newSchedule.format === option.value}
                          onChange={(e) => handleInputChange('format', e.target.value)}
                        />
                        <i className={option.icon}></i>
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Recipients</label>
                  <div className="recipients-list">
                    {availableRecipients.map(recipient => (
                      <label key={recipient.id} className="recipient-option">
                        <input
                          type="checkbox"
                          checked={selectedRecipients.includes(recipient.id)}
                          onChange={() => handleRecipientToggle(recipient)}
                        />
                        <div className="recipient-info">
                          <div className="recipient-name">{recipient.name}</div>
                          <div className="recipient-email">{recipient.email}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Content Options</label>
                  <div className="content-options">
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={newSchedule.includeCharts}
                        onChange={(e) => handleInputChange('includeCharts', e.target.checked)}
                      />
                      Include Charts & Graphs
                    </label>
                    <label className="checkbox-option">
                      <input
                        type="checkbox"
                        checked={newSchedule.includeData}
                        onChange={(e) => handleInputChange('includeData', e.target.checked)}
                      />
                      Include Raw Data
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="btn-create"
                    onClick={handleCreateSchedule}
                    disabled={!newSchedule.name}
                  >
                    <i className="fas fa-plus"></i>
                    Create Schedule
                  </button>
                  <button 
                    className="btn-cancel"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportScheduler;