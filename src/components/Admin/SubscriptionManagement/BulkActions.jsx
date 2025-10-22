// components/BulkActions.js
import React, { useState } from 'react';
import { FaChevronDown, FaCheck, FaPause, FaTimes, FaCalendarAlt, FaTrash, FaBan } from 'react-icons/fa';
import RoleBasedAccess from './RoleBasedAccess';

const BulkActions = ({ selectedCount, onBulkAction, userRole }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAction = (action, data = null) => {
    onBulkAction(action, data);
    setShowDropdown(false);
  };

  return (
    <div className="asm-bulk-actions-bar">
      <div className="asm-bulk-actions-info">
        <strong>{selectedCount}</strong> subscription(s) selected
      </div>
      
      <div className="asm-bulk-actions-dropdown">
        <button
          className="asm-btn asm-btn-primary asm-bulk-actions-toggle"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          Bulk Actions <FaChevronDown className="asm-icon" />
        </button>
        
        {showDropdown && (
          <div className="asm-bulk-actions-menu">
            <RoleBasedAccess permission="subscriptions:update">
              <div className="asm-bulk-action-group">
                <h4>Update Status</h4>
                <button onClick={() => handleAction('updateStatus', { status: 'active' })}>
                  <FaCheck className="asm-icon" /> Set as Active
                </button>
                <button onClick={() => handleAction('updateStatus', { status: 'paused' })}>
                  <FaPause className="asm-icon" /> Set as Paused
                </button>
                <button onClick={() => handleAction('updateStatus', { status: 'cancelled' })}>
                  <FaTimes className="asm-icon" /> Set as Cancelled
                </button>
              </div>
            </RoleBasedAccess>

            <RoleBasedAccess permission="subscriptions:update">
              <div className="asm-bulk-action-group">
                <h4>Update Frequency</h4>
                <button onClick={() => handleAction('updateFrequency', { frequency: 'Weekly' })}>
                  <FaCalendarAlt className="asm-icon" /> Set to Weekly
                </button>
                <button onClick={() => handleAction('updateFrequency', { frequency: 'Monthly' })}>
                  <FaCalendarAlt className="asm-icon" /> Set to Monthly
                </button>
              </div>
            </RoleBasedAccess>

            <RoleBasedAccess permission="subscriptions:delete">
              <div className="asm-bulk-action-group">
                <h4>Danger Zone</h4>
                <button 
                  onClick={() => handleAction('delete')}
                  className="asm-bulk-action-danger"
                >
                  <FaTrash className="asm-icon" /> Delete Selected
                </button>
              </div>
            </RoleBasedAccess>
          </div>
        )}
      </div>
      
      <button
        className="asm-btn asm-btn-outline asm-bulk-clear"
        onClick={() => handleAction('clear')}
      >
        <FaBan className="asm-icon" /> Clear Selection
      </button>
    </div>
  );
};

export default BulkActions;