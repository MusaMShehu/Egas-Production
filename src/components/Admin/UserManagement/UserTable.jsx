// components/UserTable.js
import React from 'react';
import { FaSort, FaSortUp, FaSortDown, FaEye, FaEdit, FaPowerOff, FaTrash } from 'react-icons/fa';

const UserTable = ({
  users,
  sortConfig,
  onSort,
  selectedUsers,
  onUserSelect,
  onSelectAll,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  availableRoles
}) => {
  const handleSort = (key) => {
    onSort(key);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort />;
    }
    return sortConfig.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const handleStatusToggle = (userId, isCurrentlyActive) => {
    if (window.confirm(`Are you sure you want to ${isCurrentlyActive ? 'deactivate' : 'activate'} this user?`)) {
      onToggleStatus(userId, !isCurrentlyActive);
    }
  };

  const handleDelete = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      onDeleteUser(userId);
    }
  };

  const isAllSelected = users.length > 0 && users.every(user => selectedUsers.has(user._id));
  const isSomeSelected = users.some(user => selectedUsers.has(user._id));

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'delivery': return 'role-delivery';
      case 'customer_care': return 'role-customer-care';
      default: return 'role-user';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatWalletBalance = (balance) => {
  const amount = Number(balance) || 0;
  return amount.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  });
};


  return (
    <div className="aum-user-table">
      <div className="aum-table-header">
        <div className="aum-table-row">
          <div className="aum-table-cell aum-checkbox-cell">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={input => {
                if (input) {
                  input.indeterminate = isSomeSelected && !isAllSelected;
                }
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
            />
          </div>
          <div 
            className="aum-table-cell aum-sortable-header"
            onClick={() => handleSort('firstName')}
          >
            <span>Name</span>
            <span className={`aum-sort-icon ${sortConfig.key === 'firstName' ? 'active' : ''}`}>
              {getSortIcon('firstName')}
            </span>
          </div>
          <div 
            className="aum-table-cell aum-sortable-header"
            onClick={() => handleSort('email')}
          >
            <span>Email</span>
            <span className={`aum-sort-icon ${sortConfig.key === 'email' ? 'active' : ''}`}>
              {getSortIcon('email')}
            </span>
          </div>
          <div 
            className="aum-table-cell aum-sortable-header"
            onClick={() => handleSort('phone')}
          >
            <span>Phone</span>
            <span className={`aum-sort-icon ${sortConfig.key === 'phone' ? 'active' : ''}`}>
              {getSortIcon('phone')}
            </span>
          </div>
          <div 
            className="aum-table-cell aum-sortable-header"
            onClick={() => handleSort('role')}
          >
            <span>Role</span>
            <span className={`aum-sort-icon ${sortConfig.key === 'role' ? 'active' : ''}`}>
              {getSortIcon('role')}
            </span>
          </div>
          <div 
            className="aum-table-cell aum-sortable-header"
            onClick={() => handleSort('walletBalance')}
          >
            <span>Wallet</span>
            <span className={`aum-sort-icon ${sortConfig.key === 'walletBalance' ? 'active' : ''}`}>
              {getSortIcon('walletBalance')}
            </span>
          </div>
          <div 
            className="aum-table-cell aum-sortable-header"
            onClick={() => handleSort('isActive')}
          >
            <span>Status</span>
            <span className={`aum-sort-icon ${sortConfig.key === 'isActive' ? 'active' : ''}`}>
              {getSortIcon('isActive')}
            </span>
          </div>
          <div className="aum-table-cell">Actions</div>
        </div>
      </div>

      <div className="aum-table-body">
        {users.map(user => (
          <div key={user._id} className="aum-table-row">
            <div className="aum-table-cell aum-checkbox-cell">
              <input
                type="checkbox"
                checked={selectedUsers.has(user._id)}
                onChange={(e) => onUserSelect(user._id, e.target.checked)}
              />
            </div>
            
            <div className="aum-table-cell aum-user-info-cell">
              <div className="aum-user-avatar-sm">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
                ) : (
                  `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase()
                )}
              </div>
              <div className="aum-user-details">
                <div className="aum-user-name">
                  {user.firstName} {user.lastName}
                </div>
                <div className="aum-user-location">
                  {user.city}, {user.state}
                </div>
              </div>
            </div>
            
            <div className="aum-table-cell">
              <div className="aum-user-email">{user.email}</div>
            </div>
            
            <div className="aum-table-cell">
              <div className="aum-user-phone">{user.phone}</div>
            </div>
            
            <div className="aum-table-cell">
              <span className={`aum-role-badge ${getRoleBadgeClass(user.role)}`}>
                {user.role}
              </span>
            </div>
            
            <div className="aum-table-cell">
              <span className="aum-wallet-balance-sm">
                {formatWalletBalance(user.walletBalance)}
              </span>
            </div>
            
            <div className="aum-table-cell">
              <span className={`aum-status-badge ${user.isActive ? 'aum-status-active' : 'aum-status-inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="aum-table-cell aum-actions-cell">
              <div className="aum-action-buttons">
                <button
                  onClick={() => onViewUser(user)}
                  className="aum-btn aum-btn-icon aum-btn-sm"
                  title="View Details"
                >
                  <FaEye />
                </button>
                
                <button
                  onClick={() => onEditUser(user)}
                  className="aum-btn aum-btn-icon aum-btn-sm"
                  title="Edit User"
                >
                  <FaEdit />
                </button>
                
                <button
                  onClick={() => handleStatusToggle(user._id, user.isActive)}
                  className={`aum-btn aum-btn-icon aum-btn-sm ${user.isActive ? 'aum-btn-warning' : 'aum-btn-success'}`}
                  title={user.isActive ? 'Deactivate User' : 'Activate User'}
                >
                  <FaPowerOff />
                </button>
                
                <button
                  onClick={() => handleDelete(user._id, `${user.firstName} ${user.lastName}`)}
                  className="aum-btn aum-btn-icon aum-btn-sm aum-btn-danger"
                  title="Delete User"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;