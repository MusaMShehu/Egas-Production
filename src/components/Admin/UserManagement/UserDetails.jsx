// components/UserDetails.js
import React, { useState } from "react";
import "./UserManagement.css"; 

const UserDetails = ({ user, onEdit, onBack, onToggleStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    await onToggleStatus(user._id, !user.isActive);
    setIsUpdating(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="user-details">
      {/* Header */}
      <div className="user-details-header">
        <button onClick={onBack} className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to Users
        </button>
        <div className="action-buttons">
          <button onClick={onEdit} className="edit-btn">
            <i className="fas fa-edit"></i> Edit
          </button>
          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={`status-btn ${user.isActive ? "deactivate" : "activate"}`}
          >
            {isUpdating ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i
                className={`fas ${
                  user.isActive ? "fa-ban" : "fa-check"
                }`}
              ></i>
            )}
            {user.isActive ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="user-details-content">
        <div className="user-details-left">
          <div className="profile-card">
            <img
              src={user.profilePic || "/default-avatar.png"}
              alt={`${user.firstName} ${user.lastName}`}
              className="profile-pic"
            />
            <h2 className="profile-name">
              {user.firstName} {user.lastName}
            </h2>
            <p className="profile-email">{user.email}</p>
            <div className="badges">
              <span className={`role-badge ${user.role}`}>
                {user.role}
              </span>
              <span
                className={`status-badge ${
                  user.isActive ? "active" : "inactive"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div className="wallet-card">
            <h3>Wallet Balance</h3>
            <p className="wallet-balance">
              ₦{user.walletBalance?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div className="user-details-right">
          <div className="info-card">
            <h3>Personal Information</h3>
            <dl>
              <div>
                <dt>First Name</dt>
                <dd>{user.firstName}</dd>
              </div>
              <div>
                <dt>Last Name</dt>
                <dd>{user.lastName}</dd>
              </div>
              <div>
                <dt>Date of Birth</dt>
                <dd>{formatDate(user.dob)}</dd>
              </div>
              <div>
                <dt>Gender</dt>
                <dd>
                  {user.gender
                    ? user.gender.charAt(0).toUpperCase() +
                      user.gender.slice(1)
                    : "Not provided"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="info-card">
            <h3>Contact Information</h3>
            <dl>
              <div>
                <dt>Email Address</dt>
                <dd>{user.email}</dd>
              </div>
              <div>
                <dt>Phone Number</dt>
                <dd>{user.phone}</dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>{user.address}</dd>
              </div>
            </dl>
          </div>

          <div className="info-card">
            <h3>Account Information</h3>
            <dl>
              <div>
                <dt>User ID</dt>
                <dd className="mono">{user._id}</dd>
              </div>
              <div>
                <dt>Account Created</dt>
                <dd>{formatDateTime(user.createdAt)}</dd>
              </div>
              <div>
                <dt>Last Updated</dt>
                <dd>{formatDateTime(user.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
