import React, { useState } from 'react';
import './UserManagement.css'; 

const UserList = ({
  users,
  loading,
  error,
  searchTerm,
  onSearchChange,
  filterRole,
  onFilterRoleChange,
  filterStatus,
  onFilterStatusChange,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onCreateUser,
  onRefresh
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (user) => {
    const result = await onDeleteUser(user._id);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="userlist-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="userlist-error">
        <p>{error}</p>
        <button onClick={onRefresh}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="userlist-container">
      {/* Search + Filters */}
      <div className="userlist-filters">
        <div className="search-box">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <select value={filterRole} onChange={(e) => onFilterRoleChange(e.target.value)}>
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="delivery">Delivery</option>
          </select>
          
          <select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Empty State */}
      {users.length === 0 ? (
        <div className="userlist-empty">
          <i className="fas fa-users"></i>
          <p>No users found</p>
          {searchTerm || filterRole !== 'all' || filterStatus !== 'all' ? (
            <button
              onClick={() => {
                onSearchChange('');
                onFilterRoleChange('all');
                onFilterStatusChange('all');
              }}
            >
              Clear filters
            </button>
          ) : (
            <button onClick={onCreateUser}>Add your first user</button>
          )}
        </div>
      ) : (
        <div className="userlist-table-wrapper">
          <table className="userlist-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <img
                        src={user.profilePic || '/default-avatar.png'}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <div>
                        <div className="user-name">{user.firstName} {user.lastName}</div>
                        <div className="user-wallet">Wallet: ₦{user.walletBalance?.toLocaleString() || 0}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-contact">
                      <div>{user.email}</div>
                      <div>{user.phone}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge role-${user.role}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`badge status-${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="actions">
                    <button onClick={() => onViewUser(user)} title="View details">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button onClick={() => onEditUser(user)} title="Edit user">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button onClick={() => setDeleteConfirm(user)} title="Delete user">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete {deleteConfirm.firstName} {deleteConfirm.lastName}?  
              This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button onClick={() => setDeleteConfirm(null)} className="btn-cancel">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-delete">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
