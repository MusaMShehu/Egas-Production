// components/UserDetails.js
import React, { useState } from 'react';
import { FaArrowLeft, FaPowerOff, FaEdit, FaSpinner } from 'react-icons/fa';

const UserDetails = ({ 
  user, 
  onEdit, 
  onBack, 
  onToggleStatus, 
  onUpdateWalletBalance,
  availableRoles 
}) => {
  const [walletAction, setWalletAction] = useState({ type: 'add', amount: '' });
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="error-container">
        <p>User not found</p>
        <button onClick={onBack} className="btn btn-primary">
          Back to List
        </button>
      </div>
    );
  }

  const handleStatusToggle = async () => {
    if (window.confirm(`Are you sure you want to ${user.isActive ? 'deactivate' : 'activate'} this user?`)) {
      const result = await onToggleStatus(user._id, !user.isActive);
      if (result.success) {
        // Status will be updated in parent component
      }
    }
  };

  const handleWalletUpdate = async () => {
    if (!walletAction.amount || parseFloat(walletAction.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (window.confirm(`Are you sure you want to ${walletAction.type} $${walletAction.amount} to wallet?`)) {
      setLoading(true);
      const result = await onUpdateWalletBalance(
        user._id, 
        parseFloat(walletAction.amount), 
        walletAction.type
      );
      
      if (result.success) {
        setWalletAction({ type: 'add', amount: '' });
      }
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'role-admin';
      case 'delivery': return 'role-delivery';
      case 'customer_care': return 'role-customer-care';
      default: return 'role-user';
    }
  };

  const getGenderDisplay = (gender) => {
    if (!gender) return 'N/A';
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  return (
    <div className="aum-user-details">
      <div className="aum-details-header">
        <button onClick={onBack} className="aum-btn aum-btn-outline">
          <FaArrowLeft /> Back to List
        </button>
        <div className="aum-header-actions">
          <button onClick={handleStatusToggle} className={`aum-btn ${user.isActive ? 'aum-btn-warning' : 'aum-btn-success'}`}>
            <FaPowerOff />
            {user.isActive ? ' Deactivate' : ' Activate'}
          </button>
          <button onClick={onEdit} className="aum-btn btn-primary">
            <FaEdit /> Edit User
          </button>
        </div>
      </div>

      <div className="aum-details-content">
        {/* Profile Header */}
        <div className="aum-profile-header">
          <div className="aum-profile-avatar">
            {user.profilePic ? (
              <img src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <div className="aum-avatar-placeholder">
                {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
              </div>
            )}
          </div>
          <div className="aum-profile-info">
            <h1>{user.firstName} {user.lastName}</h1>
            <p className="aum-user-email">{user.email}</p>
            <div className="aum-profile-badges">
              <span className={`aum-role-badge ${getRoleBadgeClass(user.role)}`}>
                {user.role}
              </span>
              <span className={`aum-status-badge ${user.isActive ? 'aum-status-active' : 'aum-status-inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        <div className="aum-details-grid">
          {/* Personal Information */}
          <div className="aum-details-section">
            <h3>Personal Information</h3>
            <div className="aum-details-list">
              <div className="aum-detail-item">
                <span className="aum-detail-label">First Name</span>
                <span className="aum-detail-value">{user.firstName}</span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">Last Name</span>
                <span className="aum-detail-value">{user.lastName}</span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">Email</span>
                <span className="aum-detail-value">{user.email}</span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">Phone</span>
                <span className="aum-detail-value">{user.phone}</span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">Date of Birth</span>
                <span className="aum-detail-value">{formatDate(user.dob)}</span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">Gender</span>
                <span className="aum-detail-value">{getGenderDisplay(user.gender)}</span>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="aum-details-section">
            <h3>Address Information</h3>
            <div className="aum-details-list">
              <div className="aum-detail-item">
                <span className="aum-detail-label">Address</span>
                <span className="aum-detail-value">{user.address}</span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">City</span>
                <span className="aum-detail-value">{user.city}</span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">State</span>
                <span className="aum-detail-value">{user.state}</span>
              </div>
              {user.gpsCoordinates && (
                <div className="aum-detail-item">
                  <span className="aum-detail-label">GPS Coordinates</span>
                  <span className="aum-detail-value">
                    {user.gpsCoordinates.coordinates[0]}, {user.gpsCoordinates.coordinates[1]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="aum-details-section">
            <h3>Account Information</h3>
            <div className="aum-details-list">
              <div className="aum-detail-item">
                <span className="aum-detail-label">Role</span>
                <span className="aum-detail-value">
                  <span className={`aum-role-badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">Status</span>
                <span className="aum-detail-value">
                  <span className={`aum-status-badge ${user.isActive ? 'aum-status-active' : 'aum-status-inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </span>
              </div>
              <div className="aum-detail-item">
                <span className="aum-detail-label">Member Since</span>
                <span className="aum-detail-value">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Wallet Management */}
          <div className="aum-details-section">
            <h3>Wallet Management</h3>
            <div className="aum-wallet-info">
              <div className="aum-wallet-balance">
                <span className="aum-balance-label">Current Balance</span>
                <span className="aum-balance-amount">${user.walletBalance?.toFixed(2) || '0.00'}</span>
              </div>
              
              <div className="aum-wallet-actions">
                <h4>Update Wallet</h4>
                <div className="aum-wallet-form">
                  <select 
                    value={walletAction.type} 
                    onChange={(e) => setWalletAction(prev => ({ ...prev, type: e.target.value }))}
                    className="aum-wallet-select"
                  >
                    <option value="add">Add Funds</option>
                    <option value="subtract">Subtract Funds</option>
                    <option value="set">Set Balance</option>
                  </select>
                  <input
                    type="number"
                    value={walletAction.amount}
                    onChange={(e) => setWalletAction(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="Amount"
                    min="0"
                    step="0.01"
                    className="aum-wallet-input"
                  />
                  <button 
                    onClick={handleWalletUpdate} 
                    className="aum-btn aum-btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <FaSpinner className="aum-fa-spin" />
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;