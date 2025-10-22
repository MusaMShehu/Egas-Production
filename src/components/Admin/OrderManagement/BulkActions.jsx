// components/BulkActions.js
import React, { useState } from 'react';
import { FaChevronDown, FaDownload, FaSyncAlt, FaTruck, FaBox, FaTimes, FaBan } from 'react-icons/fa';

const BulkActions = ({ 
  selectedCount, 
  onBulkUpdateStatus, 
  selectedOrderIds, 
  onClearSelection,
  permissions 
}) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleBulkStatusUpdate = async (newStatus) => {
    const result = await onBulkUpdateStatus(selectedOrderIds, newStatus);
    setShowStatusMenu(false);
    
    if (result.success) {
      // Show success message
    } else {
      alert(result.message);
    }
  };

  if (!permissions?.canBulkUpdate) return null;

  return (
    <div className="aom-bulk-actions">
      <div className="aom-bulk-info">
        <span>{selectedCount} orders selected</span>
        <button onClick={onClearSelection} className="aom-btn-clear-selection">
          <FaBan className="aom-icon" /> Clear Selection
        </button>
      </div>

      <div className="aom-bulk-buttons">
        <div className="aom-dropdown">
          <button 
            className="aom-btn-bulk-status"
            onClick={() => setShowStatusMenu(!showStatusMenu)}
          >
            Update Status <FaChevronDown className="aom-icon" />
          </button>
          
          {showStatusMenu && (
            <div className="aom-dropdown-menu">
              <button onClick={() => handleBulkStatusUpdate('processing')}>
                <FaSyncAlt className="aom-icon" /> Mark as Processing
              </button>
              <button onClick={() => handleBulkStatusUpdate('in-transit')}>
                <FaTruck className="aom-icon" /> Mark as In Transit
              </button>
              <button onClick={() => handleBulkStatusUpdate('delivered')}>
                <FaBox className="aom-icon" /> Mark as Delivered
              </button>
              <button onClick={() => handleBulkStatusUpdate('cancelled')}>
                <FaTimes className="aom-icon" /> Mark as Cancelled
              </button>
            </div>
          )}
        </div>

        <button className="aom-btn-bulk-export">
          <FaDownload className="aom-icon" /> Export Selected
        </button>
      </div>
    </div>
  );
};

export default BulkActions;