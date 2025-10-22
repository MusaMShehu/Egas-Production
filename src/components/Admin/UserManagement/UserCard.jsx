// components/UserCard.js
import React from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaEye, 
  FaEdit, 
  FaPowerOff, 
  FaTrash 
} from 'react-icons/fa';

const UserCard = ({
  user,
  isSelected,
  onSelect,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const handleStatusToggle = (e) => {
    e.stopPropagation();
    onToggleStatus(user._id, !user.isActive);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      onDelete(user._id);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'manager': return 'role-manager';
      case 'user': return 'role-user';
      case 'viewer': return 'role-viewer';
      default: return 'role-user';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`aum-user-card ${isSelected ? 'aum-selected' : ''}`}>
      <div className="aum-card-header">
        <div className="aum-user-avatar">
          {getInitials(user.firstName, user.lastName)}
        </div>
        <div className="aum-user-info">
          <h3 className="aum-user-name">{user.firstName} {user.lastName}</h3>
          <p className="aum-user-email">{user.email}</p>
        </div>
        <input className="aum-user-select-checkbox"
          type="checkbox" 
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(user._id, e.target.checked);
          }}
          
        />
      </div>

      <div className="aum-card-details">
        <div className="aum-detail-item">
          <span className="aum-detail-label">Phone</span>
          <span className="aum-detail-value">{user.phone || 'N/A'}</span>
        </div>
        
        <div className="aum-detail-item">
          <span className="aum-detail-label">Role</span>
          <span className={`aum-role-badge ${getRoleBadgeClass(user.role)}`}>
            {user.role}
          </span>
        </div>
        
        <div className="aum-detail-item">
          <span className="aum-detail-label">Status</span>
          <span className={`aum-status-badge ${user.isActive ? 'aum-status-active' : 'aum-status-inactive'}`}>
            {user.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="aum-detail-item">
          <span className="aum-detail-label">Verified</span>
          <span className="aum-detail-value">
            {user.isVerified ? (
              <FaCheckCircle className="aum-verified-icon" />
            ) : (
              <FaTimesCircle className="aum-unverified-icon" />
            )}
          </span>
        </div>
        
        <div className="aum-detail-item">
          <span className="aum-detail-label">Created</span>
          <span className="aum-detail-value">{formatDate(user.createdAt)}</span>
        </div>
        
        {user.lastLogin && (
          <div className="aum-detail-item">
            <span className="aum-detail-label">Last Login</span>
            <span className="aum-detail-value">{formatDate(user.lastLogin)}</span>
          </div>
        )}
      </div>

      <div className="aum-card-actions">
        <button
          onClick={() => onView(user)}
          className="aum-btn aum-btn-icon aum-btn-sm"
          title="View Details"
        >
          <FaEye />
        </button>
        
        <button
          onClick={() => onEdit(user)}
          className="aum-btn aum-btn-icon aum-btn-sm"
          title="Edit User"
        >
          <FaEdit />
        </button>
        
        <button
          onClick={handleStatusToggle}
          className={`aum-btn aum-btn-icon aum-btn-sm ${user.isActive ? 'aum-btn-warning' : 'aum-btn-success'}`}
          title={user.isActive ? 'Deactivate User' : 'Activate User'}
        >
          <FaPowerOff />
        </button>
        
        <button
          onClick={handleDelete}
          className="aum-btn aum-btn-icon aum-btn-sm aum-btn-danger"
          title="Delete User"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default UserCard;