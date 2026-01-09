import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileUserSubscriptions.css';
import { FaPlus, FaSearch, FaTimes, FaWallet, FaFire, FaCalendar, FaPause, FaPlay, FaTrash, FaEye, FaInfoCircle, FaClock, FaCalendarCheck } from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

// Confirmation Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", type = "warning" }) => {
  if (!isOpen) return null;

  const getButtonStyle = () => {
    switch (type) {
      case 'danger': return 'mobsubs-modal-btn-danger';
      case 'info': return 'mobsubs-modal-btn-info';
      default: return 'mobsubs-modal-btn-warning';
    }
  };

  return (
    <div className="mobsubs-modal-overlay">
      <div className="mobsubs-modal">
        <div className="mobsubs-modal-header">
          <h3>{title}</h3>
          <button className="mobsubs-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="mobsubs-modal-body">
          <FaInfoCircle className="mobsubs-modal-icon" />
          <p>{message}</p>
        </div>
        <div className="mobsubs-modal-footer">
          <button className="mobsubs-modal-btn-cancel" onClick={onClose}>
            {cancelText}
          </button>
          <button className={`mobsubs-modal-btn-confirm ${getButtonStyle()}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Subscription Details Modal Component
const SubscriptionDetailsModal = ({ isOpen, onClose, subscription }) => {
  if (!isOpen || !subscription) return null;

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'Monthly': return 'Once every month';
      case 'Weekly': return 'Every week';
      case 'Bi-Weekly': return 'Every 2 weeks';
      case 'One-Time': return 'Once';
      default: return frequency || 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    return `₦${(amount || 0).toLocaleString()}`;
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'active';
      case 'paused': return 'paused';
      case 'cancelled': return 'cancelled';
      case 'expired': return 'expired';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
  };

  return (
    <div className="mobsubs-modal-overlay">
      <div className="mobsubs-modal mobsubs-details-modal">
        <div className="mobsubs-modal-header">
          <h3>Subscription Details</h3>
          <button className="mobsubs-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="mobsubs-modal-body">
          <div className="mobsubs-details-section">
            <h4><FaFire /> Plan Information</h4>
            <div className="mobsubs-details-row">
              <span>Plan Name:</span>
              <strong>{subscription.planName || 'Premium Plan'}</strong>
            </div>
            <div className="mobsubs-details-row">
              <span>Subscription ID:</span>
              <code>#{subscription._id?.slice(-8)}</code>
            </div>
            <div className="mobsubs-details-row">
              <span>Cylinder Size:</span>
              <span>{subscription.size || '15 kg'}</span>
            </div>
            <div className="mobsubs-details-row">
              <span>Frequency:</span>
              <span>{getFrequencyText(subscription.frequency)}</span>
            </div>
          </div>

          <div className="mobsubs-details-section">
            <h4><FaCalendarCheck /> Subscription Period</h4>
            <div className="mobsubs-details-row">
              <span><FaClock /> Start Date:</span>
              <span>{formatDate(subscription.startDate || subscription.createdAt)}</span>
            </div>
            {subscription.endDate && (
              <div className="mobsubs-details-row">
                <span><FaCalendarCheck /> End Date:</span>
                <span>{formatDate(subscription.endDate)}</span>
              </div>
            )}
            <div className="mobsubs-details-row">
              <span>Next Delivery:</span>
              <span>{formatDate(subscription.nextDeliveryDate)}</span>
            </div>
            <div className="mobsubs-details-row">
              <span>Last Delivery:</span>
              <span>{formatDate(subscription.lastDeliveryDate) || 'Not yet delivered'}</span>
            </div>
          </div>

          <div className="mobsubs-details-section">
            <h4><FaInfoCircle /> Payment & Status</h4>
            <div className="mobsubs-details-row">
              <span>Price:</span>
              <strong className="mobsubs-price">{formatCurrency(subscription.price)}</strong>
            </div>
            <div className="mobsubs-details-row">
              <span>Status:</span>
              <span className={`mobsubs-status-badge ${getStatusClass(subscription.status)}`}>
                {getStatusText(subscription.status)}
              </span>
            </div>
            <div className="mobsubs-details-row">
              <span>Payment Method:</span>
              <span>{subscription.paymentMethod || 'Wallet/Card'}</span>
            </div>
          </div>
        </div>
        <div className="mobsubs-modal-footer">
          <button className="mobsubs-modal-btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const MobileSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  
  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning'
  });
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  
  const navigate = useNavigate();

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    infoToast('Loading subscriptions...');
    
    try {
      const token = localStorage.getItem('token');
      
      const subscriptionsResponse = await fetch(`${API_BASE_URL}/subscriptions/my-subscriptions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const subscriptionsResult = await subscriptionsResponse.json();
      
      if (subscriptionsResponse.ok) {
        const subsWithFixedDates = (subscriptionsResult.data || []).map(sub => ({
          ...sub,
          nextDeliveryDate: calculateNextDeliveryDate(sub),
          // Ensure startDate exists, fallback to createdAt
          startDate: sub.startDate || sub.createdAt,
          // Ensure endDate exists (might be null for active subscriptions)
          endDate: sub.endDate || null
        }));
        setSubscriptions(subsWithFixedDates);
      } else {
        throw new Error(subscriptionsResult.message || 'Failed to load subscriptions');
      }

      const dashboardResponse = await fetch(`${API_BASE_URL}/dashboard/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setWalletBalance(dashboardData.data?.walletBalance || 0);
      }
      
      successToast('Subscriptions loaded');
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.message || 'Failed to load subscriptions';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextDeliveryDate = (subscription) => {
    if (!subscription.lastDeliveryDate || subscription.status !== 'active') {
      return subscription.nextDeliveryDate;
    }
    
    const lastDelivery = new Date(subscription.lastDeliveryDate);
    const frequency = subscription.frequency;
    
    switch (frequency) {
      case 'Weekly':
        lastDelivery.setDate(lastDelivery.getDate() + 7);
        break;
      case 'Bi-Weekly':
        lastDelivery.setDate(lastDelivery.getDate() + 14);
        break;
      case 'Monthly':
        lastDelivery.setMonth(lastDelivery.getMonth() + 1);
        break;
      default:
        return subscription.nextDeliveryDate;
    }
    
    return lastDelivery.toISOString();
  };

  const handleCreateSubscription = () => {
    infoToast('Redirecting to subscription plans...');
    navigate('/subscription-plans');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatCurrency = (amount) => {
    return `₦${(amount || 0).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'active': return 'mobsubs-status-active';
      case 'paused': return 'mobsubs-status-paused';
      case 'cancelled': return 'mobsubs-status-cancelled';
      case 'expired': return 'mobsubs-status-expired';
      default: return 'mobsubs-status-pending';
    }
  };

  const getStatusText = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Pending';
  };

  const getFrequencyText = (frequency) => {
    switch (frequency) {
      case 'Monthly': return 'Once every month';
      case 'Weekly': return 'Every week';
      case 'Bi-Weekly': return 'Every 2 weeks';
      case 'One-Time': return 'Once';
      default: return frequency || 'N/A';
    }
  };

  const showConfirmationModal = (config) => {
    setModalConfig(config);
    setShowConfirmModal(true);
  };

  const handleViewDetails = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
  };

  const handlePauseSubscription = async (subscriptionId) => {
    const subscription = subscriptions.find(s => s._id === subscriptionId);
    if (!subscription) return;

    showConfirmationModal({
      title: 'Pause Subscription',
      message: 'Are you sure you want to pause this subscription? You can resume it later.',
      onConfirm: async () => {
        setShowConfirmModal(false);
        warningToast('Pausing subscription...');
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/pause`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          const result = await response.json();
          
          if (response.ok) {
            setSubscriptions(prev => prev.map(s =>
              s._id === subscriptionId ? { ...s, status: 'paused' } : s
            ));
            successToast('Subscription paused successfully');
          } else {
            throw new Error(result.message || 'Failed to pause');
          }
        } catch (err) {
          errorToast(err.message || 'Failed to pause subscription');
        }
      },
      type: 'warning'
    });
  };

  const handleResumeSubscription = async (subscriptionId) => {
    const subscription = subscriptions.find(s => s._id === subscriptionId);
    if (!subscription) return;

    showConfirmationModal({
      title: 'Resume Subscription',
      message: 'Are you sure you want to resume this subscription?',
      onConfirm: async () => {
        setShowConfirmModal(false);
        infoToast('Resuming subscription...');
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/resume`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          const result = await response.json();
          
          if (response.ok) {
            setSubscriptions(prev => prev.map(s =>
              s._id === subscriptionId ? { 
                ...s, 
                status: 'active',
                nextDeliveryDate: calculateNextDeliveryDate({ ...s, status: 'active' })
              } : s
            ));
            successToast('Subscription resumed successfully');
          } else {
            throw new Error(result.message || 'Failed to resume');
          }
        } catch (err) {
          errorToast(err.message || 'Failed to resume subscription');
        }
      },
      type: 'info'
    });
  };

  const handleCancelSubscription = async (subscriptionId) => {
    const subscription = subscriptions.find(s => s._id === subscriptionId);
    if (!subscription) return;

    showConfirmationModal({
      title: 'Cancel Subscription',
      message: 'Are you sure you want to cancel this subscription? This action cannot be undone.',
      onConfirm: async () => {
        setShowConfirmModal(false);
        warningToast('Cancelling subscription...');
        
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel-my`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
          });

          const result = await response.json();
          
          if (response.ok) {
            setSubscriptions(prev => prev.map(s =>
              s._id === subscriptionId ? { ...s, status: 'cancelled' } : s
            ));
            successToast('Subscription cancelled successfully');
          } else {
            throw new Error(result.message || 'Failed to cancel');
          }
        } catch (err) {
          errorToast(err.message || 'Failed to cancel subscription');
        }
      },
      type: 'danger',
      confirmText: 'Yes, Cancel'
    });
  };

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const otherSubscriptions = subscriptions.filter(s => s.status !== 'active');

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub.size?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="mobsubs-mobile-subscriptions mobsubs-loading">
        <div className="mobsubs-loading-spinner"></div>
        <p>Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="mobsubs-mobile-subscriptions">
      {/* Header */}
      <div className="mobsubs-subscriptions-header">
        <h1>My Subscriptions</h1>
        <div className="mobsubs-wallet-info">
          <FaWallet className="mobsubs-wallet-icon" />
          <span>{formatCurrency(walletBalance)}</span>
        </div>
      </div>

      {/* Search and Create */}
      <div className="mobsubs-actions-bar">
        <div className="mobsubs-search-container">
          <FaSearch className="mobsubs-search-icon" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button className="mobsubs-clear-search" onClick={() => setSearchQuery('')}>
              <FaTimes />
            </button>
          )}
        </div>
        
        <button className="mobsubs-new-subscription-btn" onClick={handleCreateSubscription}>
          <FaPlus /> Create New
        </button>
      </div>

      {/* Active Subscriptions */}
      {activeSubscriptions.length > 0 && (
        <div className="mobsubs-subscription-section">
          <div className="mobsubs-section-header">
            <h2>Active Subscriptions</h2>
            <span className="mobsubs-count-badge">{activeSubscriptions.length}</span>
          </div>
          
          <div className="mobsubs-subscriptions-list">
            {activeSubscriptions.map(subscription => (
              <div key={subscription._id} className="mobsubs-subscription-card mobsubs-active">
                <div className="mobsubs-subscription-header">
                  <div className="mobsubs-subscription-title">
                    <FaFire className="mobsubs-subscription-icon" />
                    <div>
                      <h3>{subscription.planName || 'Premium Plan'}</h3>
                      <p className="mobsubs-subscription-id">#{subscription._id?.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className={`mobsubs-status-badge ${getStatusClass(subscription.status)}`}>
                    {getStatusText(subscription.status)}
                  </div>
                </div>
                
                <div className="mobsubs-subscription-details">
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Cylinder Size:</span>
                    <span className="mobsubs-value">{subscription.size || '15 kg'}</span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Frequency:</span>
                    <span className="mobsubs-value">
                      {getFrequencyText(subscription.frequency)}
                    </span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Price:</span>
                    <span className="mobsubs-value mobsubs-price">
                      {formatCurrency(subscription.price)}
                    </span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Next Delivery:</span>
                    <span className="mobsubs-value">
                      <FaCalendar className="mobsubs-icon" />
                      {formatDate(subscription.nextDeliveryDate) || 'Not scheduled'}
                    </span>
                  </div>
                </div>
                
                <div className="mobsubs-action-buttons">
                  <button 
                    className="mobsubs-view-details-btn"
                    onClick={() => handleViewDetails(subscription)}
                  >
                    <FaEye /> View Details
                  </button>
                  <button 
                    className="mobsubs-pause-btn"
                    onClick={() => handlePauseSubscription(subscription._id)}
                  >
                    <FaPause /> Pause
                  </button>
                  <button 
                    className="mobsubs-cancel-btn"
                    onClick={() => handleCancelSubscription(subscription._id)}
                  >
                    <FaTrash /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Other Subscriptions */}
      {otherSubscriptions.length > 0 && (
        <div className="mobsubs-subscription-section">
          <div className="mobsubs-section-header">
            <h2>Subscription History</h2>
            <span className="mobsubs-count-badge">{otherSubscriptions.length}</span>
          </div>
          
          <div className="mobsubs-subscriptions-list">
            {otherSubscriptions.map(subscription => (
              <div key={subscription._id} className="mobsubs-subscription-card mobsubs-inactive">
                <div className="mobsubs-subscription-header">
                  <div className="mobsubs-subscription-title">
                    <FaFire className="mobsubs-subscription-icon" />
                    <div>
                      <h3>{subscription.planName || 'Plan'}</h3>
                      <p className="mobsubs-subscription-id">#{subscription._id?.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className={`mobsubs-status-badge ${getStatusClass(subscription.status)}`}>
                    {getStatusText(subscription.status)}
                  </div>
                </div>
                
                <div className="mobsubs-subscription-details">
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Status:</span>
                    <span className="mobsubs-value">
                      {getStatusText(subscription.status)} since {formatDate(subscription.updatedAt)}
                    </span>
                  </div>
                  
                  <div className="mobsubs-detail-row">
                    <span className="mobsubs-label">Price:</span>
                    <span className="mobsubs-value mobsubs-price">
                      {formatCurrency(subscription.price)}
                    </span>
                  </div>
                  
                  <div className="mobsubs-action-buttons">
                    <button 
                      className="mobsubs-view-details-btn"
                      onClick={() => handleViewDetails(subscription)}
                    >
                      <FaEye /> View Details
                    </button>
                    
                    {subscription.status === 'paused' && (
                      <button 
                        className="mobsubs-resume-btn"
                        onClick={() => handleResumeSubscription(subscription._id)}
                      >
                        <FaPlay /> Resume
                      </button>
                    )}
                    
                    {subscription.status === 'expired' && (
                      <button 
                        className="mobsubs-renew-btn"
                        onClick={handleCreateSubscription}
                      >
                        Renew
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Subscriptions */}
      {subscriptions.length === 0 && (
        <div className="mobsubs-no-subscriptions">
          <FaFire className="mobsubs-no-subscriptions-icon" />
          <h3>No Subscriptions Yet</h3>
          <p>Start a subscription plan for regular gas delivery</p>
          <button className="mobsubs-create-btn" onClick={handleCreateSubscription}>
            <FaPlus /> Create Subscription
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        type={modalConfig.type}
      />

      {/* Details Modal */}
      <SubscriptionDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        subscription={selectedSubscription}
      />
    </div>
  );
};

export default MobileSubscriptions;