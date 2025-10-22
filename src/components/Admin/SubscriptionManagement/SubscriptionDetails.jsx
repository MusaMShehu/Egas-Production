// components/SubscriptionDetails.js
import React, { useState } from 'react';
import { 
  FaArrowLeft, 
  FaPause, 
  FaPlay, 
  FaTimes, 
  FaTrash, 
  FaSpinner, 
  FaBoxOpen,
  FaHistory,
  FaUser,
  FaTruck,
  FaInfoCircle
} from 'react-icons/fa';
import RoleBasedAccess from './RoleBasedAccess';
import './SubscriptionDetails.css';

const SubscriptionDetails = ({
  subscription,
  onBack,
  onUpdateSubscription,
  onDeleteSubscription,
  onPauseSubscription,
  onResumeSubscription,
  onCancelSubscription,
  userRole
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (action) => {
    setActionLoading(action);
    setLoading(true);
    
    try {
      switch (action) {
        case 'pause':
          await onPauseSubscription(subscription._id);
          break;
        case 'resume':
          await onResumeSubscription(subscription._id);
          break;
        case 'cancel':
          if (window.confirm('Are you sure you want to cancel this subscription?')) {
            await onCancelSubscription(subscription._id);
          }
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this subscription? This action cannot be undone.')) {
            await onDeleteSubscription(subscription._id);
          }
          break;
        default:
          break;
      }
    } finally {
      setActionLoading(null);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
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

  const getRemainingDays = () => {
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

  const remainingDays = getRemainingDays();

  return (
    <div className="asm-subscription-details">
      <div className="asm-details-header">
        <button onClick={onBack} className="asm-btn asm-btn-back">
          <FaArrowLeft className="asm-icon" /> Back to List
        </button>
        <h1>Subscription Details</h1>
        <div className="asm-header-actions">
          {subscription.status === 'active' && (
            <RoleBasedAccess permission="subscriptions:update">
              <button
                onClick={() => handleAction('pause')}
                className="asm-btn asm-btn-warning"
                disabled={loading}
              >
                {actionLoading === 'pause' ? (
                  <FaSpinner className="asm-icon asm-spin" />
                ) : (
                  <FaPause className="asm-icon" />
                )}
                Pause
              </button>
            </RoleBasedAccess>
          )}
          
          {subscription.status === 'paused' && (
            <RoleBasedAccess permission="subscriptions:update">
              <button
                onClick={() => handleAction('resume')}
                className="asm-btn asm-btn-success"
                disabled={loading}
              >
                {actionLoading === 'resume' ? (
                  <FaSpinner className="asm-icon asm-spin" />
                ) : (
                  <FaPlay className="asm-icon" />
                )}
                Resume
              </button>
            </RoleBasedAccess>
          )}
          
          {(subscription.status === 'active' || subscription.status === 'paused') && (
            <RoleBasedAccess permission="subscriptions:update">
              <button
                onClick={() => handleAction('cancel')}
                className="asm-btn asm-btn-warning"
                disabled={loading}
              >
                {actionLoading === 'cancel' ? (
                  <FaSpinner className="asm-icon asm-spin" />
                ) : (
                  <FaTimes className="asm-icon" />
                )}
                Cancel
              </button>
            </RoleBasedAccess>
          )}
          
          <RoleBasedAccess permission="subscriptions:delete">
            <button
              onClick={() => handleAction('delete')}
              className="asm-btn asm-btn-danger"
              disabled={loading}
            >
              {actionLoading === 'delete' ? (
                <FaSpinner className="asm-icon asm-spin" />
              ) : (
                <FaTrash className="asm-icon" />
              )}
              Delete
            </button>
          </RoleBasedAccess>
        </div>
      </div>

      <div className="asm-details-overview">
        <div className="asm-overview-card">
          <div className="asm-overview-main">
            <h2>{subscription.planName}</h2>
            <div className="asm-subscription-meta">
              <span className="asm-reference">Ref: {subscription.reference}</span>
              {getStatusBadge(subscription.status)}
            </div>
          </div>
          <div className="asm-overview-price">
            <div className="asm-price-amount">{formatCurrency(subscription.price)}</div>
            <div className="asm-price-period">{subscription.frequency}</div>
          </div>
        </div>

        {remainingDays !== null && (
          <div className="asm-remaining-days-card">
            <div className="asm-days-count">{remainingDays}</div>
            <div className="asm-days-label">Days Remaining</div>
          </div>
        )}
      </div>

      <div className="asm-details-tabs">
        <nav className="asm-tab-nav">
          <button
            className={`asm-tab-button ${activeTab === 'details' ? 'asm-active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <FaInfoCircle className="asm-icon" /> Details
          </button>
          <button
            className={`asm-tab-button ${activeTab === 'customer' ? 'asm-active' : ''}`}
            onClick={() => setActiveTab('customer')}
          >
            <FaUser className="asm-icon" /> Customer
          </button>
          <button
            className={`asm-tab-button ${activeTab === 'deliveries' ? 'asm-active' : ''}`}
            onClick={() => setActiveTab('deliveries')}
          >
            <FaTruck className="asm-icon" /> Deliveries
          </button>
          <button
            className={`asm-tab-button ${activeTab === 'history' ? 'asm-active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FaHistory className="asm-icon" /> History
          </button>
        </nav>

        <div className="asm-tab-content">
          {activeTab === 'details' && (
            <div className="asm-details-grid">
              <div className="asm-detail-item">
                <label>Plan Type</label>
                <span className="asm-plan-type">{subscription.planType}</span>
              </div>
              <div className="asm-detail-item">
                <label>Cylinder Size</label>
                <span>{subscription.size}</span>
              </div>
              <div className="asm-detail-item">
                <label>Frequency</label>
                <span>{subscription.frequency}</span>
              </div>
              <div className="asm-detail-item">
                <label>Subscription Period</label>
                <span>{subscription.subscriptionPeriod} month(s)</span>
              </div>
              <div className="asm-detail-item">
                <label>Start Date</label>
                <span>{formatDate(subscription.startDate)}</span>
              </div>
              <div className="asm-detail-item">
                <label>End Date</label>
                <span>{subscription.endDate ? formatDate(subscription.endDate) : 'N/A'}</span>
              </div>
              <div className="asm-detail-item">
                <label>Created</label>
                <span>{formatDate(subscription.createdAt)}</span>
              </div>
              {subscription.updatedAt && (
                <div className="asm-detail-item">
                  <label>Last Updated</label>
                  <span>{formatDate(subscription.updatedAt)}</span>
                </div>
              )}
              {subscription.pausedAt && (
                <div className="asm-detail-item">
                  <label>Paused Since</label>
                  <span>{formatDate(subscription.pausedAt)}</span>
                </div>
              )}
              {subscription.cancelledAt && (
                <div className="asm-detail-item">
                  <label>Cancelled At</label>
                  <span>{formatDate(subscription.cancelledAt)}</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customer' && subscription.userId && (
            <div className="asm-customer-info">
              <div className="asm-customer-header">
                <h3>Customer Information</h3>
              </div>
              <div className="asm-details-grid">
                <div className="asm-detail-item">
                  <label>Name</label>
                  <span>{subscription.userId.firstName} {subscription.userId.lastName}</span>
                </div>
                <div className="asm-detail-item">
                  <label>Email</label>
                  <span>{subscription.userId.email}</span>
                </div>
                <div className="asm-detail-item">
                  <label>Phone</label>
                  <span>{subscription.userId.phone || 'N/A'}</span>
                </div>
                <div className="asm-detail-item">
                  <label>Address</label>
                  <span>{subscription.userId.address || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deliveries' && (
            <div className="asm-deliveries-list">
              <div className="asm-section-header">
                <h3>Delivery History</h3>
                <span className="asm-delivery-count">
                  {subscription.deliveries?.length || 0} deliveries
                </span>
              </div>
              
              {subscription.deliveries && subscription.deliveries.length > 0 ? (
                <div className="asm-deliveries-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscription.deliveries.map(delivery => (
                        <tr key={delivery._id}>
                          <td>{delivery.orderId}</td>
                          <td>{formatDate(delivery.createdAt)}</td>
                          <td>
                            <span className={`asm-status-badge asm-status-${delivery.orderStatus?.toLowerCase()}`}>
                              {delivery.orderStatus}
                            </span>
                          </td>
                          <td>{formatCurrency(delivery.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="asm-empty-state">
                  <FaBoxOpen className="asm-icon asm-empty-icon" />
                  <p>No deliveries found for this subscription</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="asm-history-list">
              <div className="asm-section-header">
                <h3>Subscription History</h3>
              </div>
              
              <div className="asm-timeline">
                <div className="asm-timeline-item">
                  <div className="asm-timeline-marker"></div>
                  <div className="asm-timeline-content">
                    <h4>Subscription Created</h4>
                    <p>{formatDate(subscription.createdAt)}</p>
                  </div>
                </div>

                {subscription.pauseHistory?.map((pause, index) => (
                  <div key={index} className="asm-timeline-item">
                    <div className="asm-timeline-marker asm-paused"></div>
                    <div className="asm-timeline-content">
                      <h4>Subscription Paused</h4>
                      <p>Paused: {formatDate(pause.pausedAt)}</p>
                      {pause.resumedAt && (
                        <p>Resumed: {formatDate(pause.resumedAt)}</p>
                      )}
                      {pause.durationMs && (
                        <p>Duration: {Math.round(pause.durationMs / (1000 * 60 * 60 * 24))} days</p>
                      )}
                    </div>
                  </div>
                ))}

                {subscription.cancelledAt && (
                  <div className="asm-timeline-item">
                    <div className="asm-timeline-marker asm-cancelled"></div>
                    <div className="asm-timeline-content">
                      <h4>Subscription Cancelled</h4>
                      <p>{formatDate(subscription.cancelledAt)}</p>
                    </div>
                  </div>
                )}

                {subscription.updatedAt && subscription.updatedAt !== subscription.createdAt && (
                  <div className="asm-timeline-item">
                    <div className="asm-timeline-marker asm-updated"></div>
                    <div className="asm-timeline-content">
                      <h4>Subscription Updated</h4>
                      <p>Last updated: {formatDate(subscription.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;