// components/SubscriptionList.js
import React, { useState } from 'react';
import { FaEye, FaEdit, FaPause, FaPlay, FaTimes, FaTrash, FaSpinner, FaSyncAlt } from 'react-icons/fa';
import RoleBasedAccess from './RoleBasedAccess';

const SubscriptionList = ({
  subscriptions,
  loading,
  error,
  selectedSubscriptions,
  sortConfig,
  onSort,
  onViewSubscription,
  onEditSubscription,
  onDeleteSubscription,
  onPauseSubscription,
  onResumeSubscription,
  onCancelSubscription,
  onSubscriptionSelect,
  onSelectAll,
  userRole
}) => {
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (action, subscriptionId) => {
    setActionLoading(subscriptionId);
    try {
      switch (action) {
        case 'delete':
          await onDeleteSubscription(subscriptionId);
          break;
        case 'pause':
          await onPauseSubscription(subscriptionId);
          break;
        case 'resume':
          await onResumeSubscription(subscriptionId);
          break;
        case 'cancel':
          await onCancelSubscription(subscriptionId);
          break;
        default:
          break;
      }
    } finally {
      setActionLoading(null);
    }
  };

  const SortableHeader = ({ label, sortKey, children }) => (
    <th 
      onClick={() => onSort(sortKey)}
      className="asm-sortable-header"
    >
      {children || label}
      {sortConfig.key === sortKey && (
        <span className="asm-sort-indicator">
          {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
        </span>
      )}
    </th>
  );

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      active: { class: 'asm-status-active', label: 'Active' },
      paused: { class: 'asm-status-paused', label: 'Paused' },
      cancelled: { class: 'asm-status-cancelled', label: 'Cancelled' },
      expired: { class: 'asm-status-expired', label: 'Expired' },
      pending: { class: 'asm-status-pending', label: 'Pending' }
    };
    
    const config = statusConfig[status] || { class: 'asm-status-default', label: status };
    
    return <span className={`asm-status-badge ${config.class}`}>{config.label}</span>;
  };

  const PlanTypeBadge = ({ planType }) => {
    const typeConfig = {
      custom: { class: 'asm-type-custom', label: 'Custom' },
      'one-time': { class: 'asm-type-onetime', label: 'One Time' },
      emergency: { class: 'asm-type-emergency', label: 'Emergency' },
      preset: { class: 'asm-type-preset', label: 'Preset' }
    };
    
    const config = typeConfig[planType] || { class: 'asm-type-default', label: planType };
    
    return <span className={`asm-type-badge ${config.class}`}>{config.label}</span>;
  };

  const getRemainingDays = (subscription) => {
    if (subscription.status === 'paused' && subscription.remainingDays !== null) {
      return subscription.remainingDays;
    }
    
    if (subscription.endDate) {
      const now = new Date();
      const end = new Date(subscription.endDate);
      const diffTime = end - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(diffDays, 0);
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="asm-loading-container">
        <div className="asm-loading-spinner"></div>
        <p>Loading subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="asm-error-container">
        <div className="asm-error-icon">⚠️</div>
        <h3>Error Loading Subscriptions</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="asm-btn asm-btn-retry">
          <FaSyncAlt className="asm-icon" /> Try Again
        </button>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="asm-empty-state">
        <div className="asm-empty-icon">📋</div>
        <h3>No Subscriptions Found</h3>
        <p>No subscriptions match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="asm-subscription-list-container">
      <div className="asm-table-responsive">
        <table className="asm-subscription-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedSubscriptions.size > 0 && selectedSubscriptions.size === subscriptions.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="asm-bulk-select-checkbox"
                />
              </th>
              <SortableHeader label="Customer" sortKey="userId.firstName" />
              <SortableHeader label="Plan" sortKey="planName" />
              <SortableHeader label="Type" sortKey="planType" />
              <SortableHeader label="Frequency" sortKey="frequency" />
              <SortableHeader label="Size" sortKey="size" />
              <SortableHeader label="Status" sortKey="status" />
              <SortableHeader label="Price" sortKey="price" />
              <SortableHeader label="Start Date" sortKey="startDate" />
              <SortableHeader label="End Date" sortKey="endDate" />
              <th>Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => {
              const remainingDays = getRemainingDays(subscription);
              const isActionLoading = actionLoading === subscription._id;
              
              return (
                <tr 
                  key={subscription._id} 
                  className={`asm-subscription-row ${selectedSubscriptions.has(subscription._id) ? 'asm-selected' : ''}`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedSubscriptions.has(subscription._id)}
                      onChange={(e) => onSubscriptionSelect(subscription._id, e.target.checked)}
                      className="asm-row-checkbox"
                    />
                  </td>
                  <td>
                    <div className="asm-customer-info">
                      <div className="asm-customer-name">
                        {subscription.userId?.firstName} {subscription.userId?.lastName}
                      </div>
                      <div className="asm-customer-email">{subscription.userId?.email}</div>
                    </div>
                  </td>
                  <td>
                    <div className="asm-plan-info">
                      <strong>{subscription.planName}</strong>
                      {subscription.reference && (
                        <div className="asm-subscription-reference">Ref: {subscription.reference}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <PlanTypeBadge planType={subscription.planType} />
                  </td>
                  <td>
                    <span className="asm-frequency-badge">{subscription.frequency}</span>
                  </td>
                  <td>
                    <span className="asm-size-badge">{subscription.size}</span>
                  </td>
                  <td>
                    <StatusBadge status={subscription.status} />
                  </td>
                  <td>
                    <div className="asm-price-info">
                      <strong>₦{subscription.price?.toLocaleString()}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="asm-date-info">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="asm-date-info">
                      {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td>
                    {remainingDays !== null ? (
                      <div className="asm-remaining-days">
                        <span className={`asm-days-badge ${remainingDays <= 7 ? 'asm-expiring' : ''}`}>
                          {remainingDays}d
                        </span>
                      </div>
                    ) : (
                      <span className="asm-text-muted">-</span>
                    )}
                  </td>
                  <td>
                    <div className="asm-action-buttons">
                      <RoleBasedAccess permission="subscriptions:read">
                        <button
                          onClick={() => onViewSubscription(subscription)}
                          className="asm-btn-action asm-btn-view"
                          title="View Details"
                        >
                          <FaEye className="asm-icon" />
                        </button>
                      </RoleBasedAccess>
                      
                      <RoleBasedAccess permission="subscriptions:update">
                        <button
                          onClick={() => onEditSubscription(subscription)}
                          className="asm-btn-action asm-btn-edit"
                          title="Edit Subscription"
                        >
                          <FaEdit className="asm-icon" />
                        </button>
                      </RoleBasedAccess>

                      {/* Pause/Resume Actions */}
                      {subscription.status === 'active' && (
                        <RoleBasedAccess permission="subscriptions:update">
                          <button
                            onClick={() => handleAction('pause', subscription._id)}
                            className="asm-btn-action asm-btn-pause"
                            title="Pause Subscription"
                            disabled={isActionLoading}
                          >
                            {isActionLoading ? <FaSpinner className="asm-icon asm-spin" /> : <FaPause className="asm-icon" />}
                          </button>
                        </RoleBasedAccess>
                      )}

                      {subscription.status === 'paused' && (
                        <RoleBasedAccess permission="subscriptions:update">
                          <button
                            onClick={() => handleAction('resume', subscription._id)}
                            className="asm-btn-action asm-btn-resume"
                            title="Resume Subscription"
                            disabled={isActionLoading}
                          >
                            {isActionLoading ? <FaSpinner className="asm-icon asm-spin" /> : <FaPlay className="asm-icon" />}
                          </button>
                        </RoleBasedAccess>
                      )}

                      {/* Cancel Action */}
                      {(subscription.status === 'active' || subscription.status === 'paused') && (
                        <RoleBasedAccess permission="subscriptions:update">
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this subscription?')) {
                                handleAction('cancel', subscription._id);
                              }
                            }}
                            className="asm-btn-action asm-btn-cancel"
                            title="Cancel Subscription"
                            disabled={isActionLoading}
                          >
                            {isActionLoading ? <FaSpinner className="asm-icon asm-spin" /> : <FaTimes className="asm-icon" />}
                          </button>
                        </RoleBasedAccess>
                      )}
                      
                      <RoleBasedAccess permission="subscriptions:delete">
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this subscription?')) {
                              handleAction('delete', subscription._id);
                            }
                          }}
                          className="asm-btn-action asm-btn-delete"
                          title="Delete Subscription"
                          disabled={isActionLoading}
                        >
                          {isActionLoading ? <FaSpinner className="asm-icon asm-spin" /> : <FaTrash className="asm-icon" />}
                        </button>
                      </RoleBasedAccess>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="asm-table-footer">
        <div className="asm-pagination-info">
          Showing {subscriptions.length} of {subscriptions.length} subscriptions
        </div>
      </div>
    </div>
  );
};

export default SubscriptionList;