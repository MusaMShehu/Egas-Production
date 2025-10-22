// components/BulkActions.js
import React from 'react';
import { 
  FiUsers, 
  FiCheckCircle, 
  FiPauseCircle, 
  FiTrash2, 
  FiDownload, 
  FiUpload 
} from 'react-icons/fi';

const BulkActions = ({
  selectedCount,
  onBulkDelete,
  onBulkActivate,
  onBulkDeactivate,
  onExport,
  onImport
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="aum-bulk-actions">
      <div className="aum-bulk-info">
        <FiUsers />
        {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
      </div>
      
      <div className="aum-bulk-buttons">
        <button
          onClick={onBulkActivate}
          className="aum-btn aum-btn-success"
          title="Activate selected users"
        >
          <FiCheckCircle />
          Activate
        </button>
        
        <button
          onClick={onBulkDeactivate}
          className="aum-btn aum-btn-warning"
          title="Deactivate selected users"
        >
          <FiPauseCircle />
          Deactivate
        </button>
        
        <button
          onClick={onBulkDelete}
          className="aum-btn aum-btn-danger"
          title="Delete selected users"
        >
          <FiTrash2 />
          Delete
        </button>
        
        <button
          onClick={onExport}
          className="aum-btn aum-btn-info"
          title="Export selected users"
        >
          <FiDownload />
          Export
        </button>
        
        <button
          onClick={onImport}
          className="aum-btn aum-btn-secondary"
          title="Import users"
        >
          <FiUpload />
          Import
        </button>
      </div>
    </div>
  );
};

export default BulkActions;