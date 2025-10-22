// components/DeliveryAgentPortal.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaDirections, 
  FaPhone, 
  FaMapMarkerAlt,
  FaSync,
  FaShippingFast,
  FaHistory,
  FaExclamationTriangle
} from 'react-icons/fa';
import './DeliveryAgentPortal.css';

const DeliveryAgentPortal = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [failureDialogOpen, setFailureDialogOpen] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [failureReason, setFailureReason] = useState('');
  const [failureNotes, setFailureNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDeliveries();
  }, [selectedTab]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const status = selectedTab === 0 ? 'assigned,accepted,out_for_delivery' : 
                    selectedTab === 1 ? 'delivered' : 'failed';
      
      const response = await fetch(`/api/v1/deliveries/agent/my-deliveries?status=${status}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setDeliveries(data.data);
      }
    } catch (error) {
      showSnackbar('Error fetching deliveries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptDelivery = async (orderId) => {
    try {
      const response = await fetch(`/api/v1/deliveries/${orderId}/accept`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Delivery accepted successfully', 'success');
        fetchDeliveries();
      }
    } catch (error) {
      showSnackbar('Error accepting delivery', 'error');
    }
  };

  const handleMarkOutForDelivery = async (orderId) => {
    try {
      const response = await fetch(`/api/v1/deliveries/${orderId}/out-for-delivery`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Delivery marked as out for delivery', 'success');
        fetchDeliveries();
      }
    } catch (error) {
      showSnackbar('Error updating delivery status', 'error');
    }
  };

  const handleMarkDelivered = async () => {
    try {
      const response = await fetch(`/api/v1/deliveries/${selectedOrder._id}/delivered`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notes: deliveryNotes })
      });
      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Delivery marked as successful', 'success');
        setDeliveryDialogOpen(false);
        setDeliveryNotes('');
        setSelectedOrder(null);
        fetchDeliveries();
      }
    } catch (error) {
      showSnackbar('Error marking delivery', 'error');
    }
  };

  const handleMarkFailed = async () => {
    if (!failureReason.trim()) {
      showSnackbar('Please provide a reason for failure', 'error');
      return;
    }

    try {
      const response = await fetch(`/api/v1/deliveries/${selectedOrder._id}/failed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          reason: failureReason,
          notes: failureNotes 
        })
      });
      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Delivery marked as failed and rescheduled', 'success');
        setFailureDialogOpen(false);
        setFailureReason('');
        setFailureNotes('');
        setSelectedOrder(null);
        fetchDeliveries();
      }
    } catch (error) {
      showSnackbar('Error marking delivery as failed', 'error');
    }
  };

  const openDirections = (address) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
    window.open(mapsUrl, '_blank');
  };

  const callCustomer = (phone) => {
    window.open(`tel:${phone}`);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar({ ...snackbar, open: false });
    }, 6000);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      assigned: 'adm-status-assigned',
      accepted: 'adm-status-accepted',
      out_for_delivery: 'adm-status-out_for_delivery',
      delivered: 'adm-status-delivered',
      failed: 'adm-status-failed'
    };
    return `adm-status-chip ${statusMap[status] || 'adm-status-assigned'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  if (loading) {
    return (
      <div className="adm-agent-portal">
        <div className="adm-loading">
          <div className="adm-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-agent-portal">
      <div className="adm-agent-header">
        <h1 className="adm-agent-title">My Deliveries</h1>
        
        <div className="adm-tabs">
          <button 
            className={`adm-tab ${selectedTab === 0 ? 'active' : ''}`}
            onClick={() => handleTabChange(0)}
          >
            <FaShippingFast className="adm-icon" />
            Active Deliveries
          </button>
          <button 
            className={`adm-tab ${selectedTab === 1 ? 'active' : ''}`}
            onClick={() => handleTabChange(1)}
          >
            <FaHistory className="adm-icon" />
            Delivery History
          </button>
          <button 
            className={`adm-tab ${selectedTab === 2 ? 'active' : ''}`}
            onClick={() => handleTabChange(2)}
          >
            <FaExclamationTriangle className="adm-icon" />
            Failed Deliveries
          </button>
        </div>
      </div>

      <div className="adm-deliveries-grid">
        {deliveries.map((order) => (
          <div key={order._id} className="adm-delivery-card">
            <div className="adm-card-content">
              <div className="adm-card-header">
                <div className="adm-customer-info">
                  <div className="adm-customer-name">{order.customerName}</div>
                  
                  <div className="adm-customer-detail">
                    <FaMapMarkerAlt className="adm-icon" />
                    <span>{order.address}</span>
                  </div>

                  <div className="adm-customer-detail">
                    <FaPhone className="adm-icon" />
                    <span>{order.customerPhone}</span>
                  </div>

                  <div className={getStatusClass(order.status)}>
                    {order.status.replace(/_/g, ' ').toUpperCase()}
                  </div>

                  <div className="adm-plan-details">
                    <div className="adm-plan-detail">
                      <strong>Plan:</strong> {order.planDetails.planName} ({order.planDetails.size})
                    </div>
                    <div className="adm-plan-detail">
                      <strong>Delivery Date:</strong> {formatDate(order.deliveryDate)}
                    </div>

                    {order.retryCount > 0 && (
                      <div className="adm-retry-badge">
                        Retry Attempt: {order.retryCount}
                      </div>
                    )}
                  </div>
                </div>

                <div className="adm-action-buttons">
                  {/* Action Buttons based on status */}
                  {order.status === 'assigned' && (
                    <button
                      className="adm-btn adm-btn-primary"
                      onClick={() => handleAcceptDelivery(order._id)}
                    >
                      Accept Delivery
                    </button>
                  )}

                  {order.status === 'accepted' && (
                    <button
                      className="adm-btn adm-btn-warning"
                      onClick={() => handleMarkOutForDelivery(order._id)}
                    >
                      Start Delivery
                    </button>
                  )}

                  {['accepted', 'out_for_delivery'].includes(order.status) && (
                    <div className="adm-btn-group">
                      <button
                        className="adm-btn adm-btn-success adm-btn-small"
                        onClick={() => {
                          setSelectedOrder(order);
                          setDeliveryDialogOpen(true);
                        }}
                      >
                        <FaCheckCircle className="adm-icon" />
                        Delivered
                      </button>
                      <button
                        className="adm-btn adm-btn-error adm-btn-small"
                        onClick={() => {
                          setSelectedOrder(order);
                          setFailureDialogOpen(true);
                        }}
                      >
                        <FaTimesCircle className="adm-icon" />
                        Failed
                      </button>
                    </div>
                  )}
                  
                  <button
                    className="adm-btn adm-btn-outline adm-btn-small"
                    onClick={() => openDirections(order.address)}
                  >
                    <FaDirections className="adm-icon" />
                    Directions
                  </button>
                  
                  <button
                    className="adm-btn adm-btn-outline adm-btn-small"
                    onClick={() => callCustomer(order.customerPhone)}
                  >
                    <FaPhone className="adm-icon" />
                    Call Customer
                  </button>
                </div>
              </div>

              {order.status === 'delivered' && order.deliveredAt && (
                <div className="adm-delivery-status adm-status-success">
                  <div><strong>Delivered on:</strong> {formatDate(order.deliveredAt)}</div>
                  {order.agentNotes && (
                    <div><strong>Notes:</strong> {order.agentNotes}</div>
                  )}
                </div>
              )}

              {order.status === 'failed' && order.failedAt && (
                <div className="adm-delivery-status adm-status-failed">
                  <div><strong>Failed on:</strong> {formatDate(order.failedAt)}</div>
                  <div><strong>Reason:</strong> {order.failedReason}</div>
                  {order.agentNotes && (
                    <div><strong>Notes:</strong> {order.agentNotes}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {deliveries.length === 0 && (
          <div className="adm-empty-state">
            <h3>No deliveries found</h3>
            <p>
              {selectedTab === 0 
                ? "You don't have any active deliveries assigned." 
                : selectedTab === 1
                ? "No delivery history found."
                : "No failed deliveries found."}
            </p>
          </div>
        )}
      </div>

      {/* Delivery Success Dialog */}
      {deliveryDialogOpen && (
        <div className="adm-dialog-overlay">
          <div className="adm-dialog">
            <div className="adm-dialog-header">
              <h2 className="adm-dialog-title">Mark Delivery as Successful</h2>
            </div>
            <div className="adm-dialog-content">
              <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
                Confirm that you have successfully delivered to {selectedOrder?.customerName}
              </p>
              <div className="adm-form-group">
                <label className="adm-form-label">Delivery Notes (Optional)</label>
                <textarea
                  className="adm-form-textarea"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Add any notes about the delivery..."
                  rows={3}
                />
              </div>
            </div>
            <div className="adm-dialog-footer">
              <button 
                className="adm-btn adm-btn-outline"
                onClick={() => setDeliveryDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="adm-btn adm-btn-success"
                onClick={handleMarkDelivered}
              >
                <FaCheckCircle className="adm-icon" />
                Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Failure Dialog */}
      {failureDialogOpen && (
        <div className="adm-dialog-overlay">
          <div className="adm-dialog">
            <div className="adm-dialog-header">
              <h2 className="adm-dialog-title">Mark Delivery as Failed</h2>
            </div>
            <div className="adm-dialog-content">
              <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
                Please provide details about the delivery failure. The delivery will be automatically rescheduled for tomorrow.
              </p>
              <div className="adm-form-group">
                <label className="adm-form-label">Failure Reason</label>
                <select
                  className="adm-form-select"
                  value={failureReason}
                  onChange={(e) => setFailureReason(e.target.value)}
                >
                  <option value="">Select a reason...</option>
                  <option value="Customer not available">Customer not available</option>
                  <option value="Wrong address">Wrong address</option>
                  <option value="Customer refused delivery">Customer refused delivery</option>
                  <option value="Safety concerns">Safety concerns</option>
                  <option value="Vehicle breakdown">Vehicle breakdown</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Additional Notes</label>
                <textarea
                  className="adm-form-textarea"
                  value={failureNotes}
                  onChange={(e) => setFailureNotes(e.target.value)}
                  placeholder="Provide more details about the failure..."
                  rows={3}
                />
              </div>
            </div>
            <div className="adm-dialog-footer">
              <button 
                className="adm-btn adm-btn-outline"
                onClick={() => setFailureDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="adm-btn adm-btn-error"
                onClick={handleMarkFailed}
              >
                <FaTimesCircle className="adm-icon" />
                Mark as Failed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`adm-snackbar ${snackbar.severity}`}>
          {snackbar.severity === 'success' ? (
            <FaCheckCircle className="adm-icon" />
          ) : (
            <FaTimesCircle className="adm-icon" />
          )}
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default DeliveryAgentPortal;