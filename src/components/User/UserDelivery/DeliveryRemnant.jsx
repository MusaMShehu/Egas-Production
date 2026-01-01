import React, { useState, useEffect } from 'react';
import { 
  FaGasPump, 
  FaHistory, 
  FaTruck, 
  FaCheckCircle, 
  FaClock,
  FaPlus,
  FaExclamationTriangle,
  FaShoppingCart,
  FaTimes,
  FaCalendar,
  FaEdit,
  FaChevronRight,
  FaFilter,
  FaDownload,
  FaBell,
  FaUser,
  FaHome
} from 'react-icons/fa';
import './DeliveryRemnant.css';

const CustomerRemnant = () => {
  const [remnant, setRemnant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [requestedKg, setRequestedKg] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchRemnant();
  }, []);

  const fetchRemnant = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/my-remnant', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setRemnant(data.data);
      }
    } catch (error) {
      showSnackbar('Error fetching remnant data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmEntry = async (entry) => {
    try {
      const response = await fetch(`https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/${remnant._id}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notes: confirmationNotes })
      });

      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Remnant entry confirmed successfully', 'success');
        setConfirmDialogOpen(false);
        setConfirmationNotes('');
        fetchRemnant();
      } else {
        showSnackbar(data.message, 'error');
      }
    } catch (error) {
      showSnackbar('Error confirming entry', 'error');
    }
  };

  const handleRequestDelivery = async () => {
    if (!requestedKg) {
      showSnackbar('Please enter amount to deliver', 'error');
      return;
    }

    if (parseFloat(requestedKg) < 6) {
      showSnackbar('Minimum 6kg required for delivery', 'error');
      return;
    }

    if (parseFloat(requestedKg) > remnant.accumulatedKg) {
      showSnackbar(`Cannot request more than ${remnant.accumulatedKg}kg available`, 'error');
      return;
    }

    try {
      const response = await fetch('https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/request-delivery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          requestedKg,
          deliveryDate,
          notes: deliveryNotes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Remnant delivery requested successfully', 'success');
        setRequestDialogOpen(false);
        setRequestedKg('');
        setDeliveryDate('');
        setDeliveryNotes('');
        fetchRemnant();
      } else {
        showSnackbar(data.message, 'error');
      }
    } catch (error) {
      showSnackbar('Error requesting delivery', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar({ ...snackbar, open: false });
    }, 6000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      delivered: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return (
      <div className="delrem-remnant-container">
        <div className="delrem-remnant-loading">
          <div className="delrem-remnant-spinner"></div>
          <p>Loading remnant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="delrem-remnant-container">
      {/* Main Content - Full width without sidebar */}
      <div className="delrem-remnant-main-content">
        {/* Header with Tabs */}
        <div className="delrem-content-header">
          <div className="delrem-header-left">
            <h2 className="delrem-content-title">
              Remnant management
            </h2>
            <div className="delrem-content-subtitle">
              Manage your accumulated gas remnant and delivery requests
            </div>
          </div>
          
          <div className="delrem-header-right">
            {/* <button className="delrem-header-btn">
              <FaFilter />
              Filter
            </button>
            <button className="delrem-header-btn">
              <FaDownload />
              Export
            </button> */}
            <button 
              className="delrem-header-btn delrem-primary"
              onClick={() => setRequestDialogOpen(true)}
              disabled={remnant?.accumulatedKg < 6}
            >
              <FaShoppingCart />
              Request Delivery
            </button>
          </div>
        </div>

        {/* Secondary Tab Navigation */}
        <div className="delrem-secondary-tabs">
          <div className="delrem-secondary-tab-nav">
            <button 
              className={`delrem-secondary-tab ${activeTab === 'overview' ? 'delrem-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`delrem-secondary-tab ${activeTab === 'history' ? 'delrem-active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Delivery History
            </button>
            <button 
              className={`delrem-secondary-tab ${activeTab === 'requests' ? 'delrem-active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Delivery Requests
            </button>
          </div>
          
          <div className="delrem-tab-indicator"></div>
        </div>

        {/* Main Content Area */}
        <div className="delrem-content-area">
          {!remnant ? (
            <div className="delrem-empty-state">
              <FaGasPump className="delrem-empty-icon" />
              <h3>No Remnant Record Found</h3>
              <p>You don't have any accumulated gas remnant yet.</p>
            </div>
          ) : (
            <>
              {/* Top Stats Cards */}
              <div className="delrem-top-stats-cards">
                <div className="delrem-stat-card delrem-stat-card-primary">
                  <div className="delrem-stat-card-header">
                    <FaGasPump className="delrem-stat-card-icon" />
                    <span className="delrem-stat-card-title">Accumulated Gas</span>
                  </div>
                  <div className="delrem-stat-card-content">
                    <div className="delrem-stat-card-value">{remnant.accumulatedKg.toFixed(1)}kg</div>
                    <div className="delrem-stat-card-subtitle">
                      {remnant.accumulatedKg >= 6 ? (
                        <span className="delrem-status-success">✓ Eligible for delivery</span>
                      ) : (
                        <span className="delrem-status-warning">
                          Needs {6 - remnant.accumulatedKg}kg more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="delrem-stat-card">
                  <div className="delrem-stat-card-header">
                    <FaHistory className="delrem-stat-card-icon" />
                    <span className="delrem-stat-card-title">Partial Deliveries</span>
                  </div>
                  <div className="delrem-stat-card-content">
                    <div className="delrem-stat-card-value">{remnant.partialDeliveries?.length || 0}</div>
                    <div className="delrem-stat-card-subtitle">
                      <span className="delrem-status-warning">
                        {remnant.partialDeliveries?.filter(p => !p.confirmed).length || 0} pending confirmation
                      </span>
                    </div>
                  </div>
                </div>

                <div className="delrem-stat-card">
                  <div className="delrem-stat-card-header">
                    <FaTruck className="delrem-stat-card-icon" />
                    <span className="delrem-stat-card-title">Delivered Total</span>
                  </div>
                  <div className="delrem-stat-card-content">
                    <div className="delrem-stat-card-value">{remnant.deliveredFromRemnant?.toFixed(1) || 0}kg</div>
                    <div className="delrem-stat-card-subtitle">
                      Total delivered from remnant
                    </div>
                  </div>
                </div>

                <div className="delrem-stat-card">
                  <div className="delrem-stat-card-header">
                    <FaShoppingCart className="delrem-stat-card-icon" />
                    <span className="delrem-stat-card-title">Active Requests</span>
                  </div>
                  <div className="delrem-stat-card-content">
                    <div className="delrem-stat-card-value">{remnant.deliveryRequests?.filter(r => r.status === 'pending').length || 0}</div>
                    <div className="delrem-stat-card-subtitle">
                      Pending delivery requests
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="delrem-quick-actions-section">
                <h3 className="delrem-section-title">Quick Actions</h3>
                <div className="delrem-quick-actions-grid">
                  <button 
                    className="delrem-quick-action-card"
                    onClick={() => setRequestDialogOpen(true)}
                    disabled={remnant.accumulatedKg < 6}
                  >
                    <div className="delrem-quick-action-icon delrem-primary">
                      <FaShoppingCart />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">Request Delivery</div>
                      <div className="delrem-quick-action-subtitle">
                        {remnant.accumulatedKg >= 6 
                          ? 'Request delivery from your remnant' 
                          : `Minimum ${6 - remnant.accumulatedKg}kg needed`}
                      </div>
                    </div>
                    <FaChevronRight className="delrem-quick-action-arrow" />
                  </button>

                  <button 
                    className="delrem-quick-action-card"
                    onClick={() => setConfirmDialogOpen(true)}
                    disabled={!remnant.partialDeliveries?.filter(p => !p.confirmed).length}
                  >
                    <div className="delrem-quick-action-icon delrem-success">
                      <FaCheckCircle />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">Confirm Entries</div>
                      <div className="delrem-quick-action-subtitle">
                        {remnant.partialDeliveries?.filter(p => !p.confirmed).length || 0} entries pending
                      </div>
                    </div>
                    <FaChevronRight className="delrem-quick-action-arrow" />
                  </button>

                  <button className="delrem-quick-action-card">
                    <div className="delrem-quick-action-icon delrem-info">
                      <FaHistory />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">View History</div>
                      <div className="delrem-quick-action-subtitle">
                        View your complete delivery history
                      </div>
                    </div>
                    <FaChevronRight className="delrem-quick-action-arrow" />
                  </button>

                  <button className="delrem-quick-action-card">
                    <div className="delrem-quick-action-icon delrem-warning">
                      <FaBell />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">Notifications</div>
                      <div className="delrem-quick-action-subtitle">
                        Setup delivery notifications
                      </div>
                    </div>
                    <FaChevronRight className="delrem-quick-action-arrow" />
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="delrem-tab-content">
                {activeTab === 'overview' && (
                  <div className="delrem-overview-content">
                    {/* Progress Section */}
                    <div className="delrem-progress-section">
                      <div className="delrem-progress-header">
                        <h4>Remnant Progress</h4>
                        <span className="delrem-progress-target">Target: 50kg</span>
                      </div>
                      <div className="delrem-progress-bar-large">
                        <div 
                          className="delrem-progress-fill"
                          style={{ width: `${Math.min((remnant.accumulatedKg / 50) * 100, 100)}%` }}
                        >
                          <span className="delrem-progress-label">
                            {remnant.accumulatedKg.toFixed(1)}kg accumulated
                          </span>
                        </div>
                      </div>
                      <div className="delrem-progress-metrics">
                        <div className="delrem-progress-metric">
                          <span className="delrem-metric-label">Minimum Delivery</span>
                          <span className="delrem-metric-value">6kg</span>
                        </div>
                        <div className="delrem-progress-metric">
                          <span className="delrem-metric-label">Current Available</span>
                          <span className="delrem-metric-value">{remnant.accumulatedKg.toFixed(1)}kg</span>
                        </div>
                        <div className="delrem-progress-metric">
                          <span className="delrem-metric-label">Next Delivery At</span>
                          <span className="delrem-metric-value">{Math.max(6 - remnant.accumulatedKg, 0)}kg more</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="delrem-recent-activity">
                      <div className="delrem-activity-header">
                        <h4>Recent Activity</h4>
                        <button className="delrem-view-all-btn">View All</button>
                      </div>
                      <div className="delrem-activity-list">
                        {remnant.partialDeliveries?.slice(0, 5).map((entry, index) => (
                          <div key={index} className="delrem-activity-item">
                            <div className="delrem-activity-icon delrem-success">
                              <FaGasPump />
                            </div>
                            <div className="delrem-activity-content">
                              <div className="delrem-activity-title">
                                Partial Delivery - {entry.delivered}kg delivered
                              </div>
                              <div className="delrem-activity-subtitle">
                                {formatDate(entry.date)} • Added {entry.remaining}kg to remnant
                              </div>
                            </div>
                            <div className={`delrem-activity-status ${entry.confirmed ? 'delrem-confirmed' : 'delrem-pending'}`}>
                              {entry.confirmed ? 'Confirmed' : 'Pending'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="delrem-history-content">
                    <div className="delrem-table-container">
                      <table className="delrem-data-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Original Order</th>
                            <th>Delivered</th>
                            <th>Remaining Added</th>
                            <th>Status</th>
                            <th>Agent Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {remnant.partialDeliveries?.map((entry, index) => (
                            <tr key={index}>
                              <td>{formatDate(entry.date)}</td>
                              <td>{entry.originalKg}kg</td>
                              <td>{entry.delivered}kg</td>
                              <td className="delrem-success">{entry.remaining}kg</td>
                              <td>
                                <span className={`delrem-status-badge ${entry.confirmed ? 'delrem-confirmed' : 'delrem-pending'}`}>
                                  {entry.confirmed ? 'Confirmed' : 'Pending'}
                                </span>
                              </td>
                              <td>{entry.deliveryId?.agentNotes || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'requests' && (
                  <div className="delrem-requests-content">
                    <div className="delrem-table-container">
                      <table className="delrem-data-table">
                        <thead>
                          <tr>
                            <th>Request Date</th>
                            <th>Amount</th>
                            <th>Delivery Date</th>
                            <th>Status</th>
                            <th>Notes</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {remnant.deliveryRequests?.map((request, index) => (
                            <tr key={index}>
                              <td>{formatDate(request.date)}</td>
                              <td>{request.requestedKg}kg</td>
                              <td>{request.deliveryDate || '-'}</td>
                              <td>
                                <span className={`delrem-status-badge ${request.status}`}>
                                  {request.status.toUpperCase()}
                                </span>
                              </td>
                              <td>{request.notes || '-'}</td>
                              <td>
                                <div className="delrem-table-actions">
                                  <button className="delrem-action-btn delrem-view-btn">View</button>
                                  {request.status === 'pending' && (
                                    <button className="delrem-action-btn delrem-cancel-btn">Cancel</button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Confirmation Banner */}
          {!remnant?.customerConfirmation?.confirmed && 
           remnant?.partialDeliveries?.filter(p => !p.confirmed).length > 0 && (
            <div className="delrem-confirmation-banner">
              <div className="delrem-banner-content">
                <FaExclamationTriangle className="delrem-banner-icon" />
                <div>
                  <h4>Action Required</h4>
                  <p>
                    You have {remnant.partialDeliveries.filter(p => !p.confirmed).length} 
                    unconfirmed remnant entries. Please confirm them to proceed with delivery requests.
                  </p>
                </div>
              </div>
              <button 
                className="delrem-banner-btn"
                onClick={() => setConfirmDialogOpen(true)}
              >
                <FaCheckCircle />
                Confirm All Entries
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {requestDialogOpen && (
        <div className="delrem-modal-overlay">
          <div className="delrem-modal">
            <div className="delrem-modal-header">
              <h3>Request Remnant Delivery</h3>
              <button 
                className="delrem-modal-close"
                onClick={() => setRequestDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="delrem-modal-content">
              <div className="delrem-modal-info">
                <p><strong>Available Remnant:</strong> {remnant?.accumulatedKg.toFixed(1)}kg</p>
                <p><strong>Minimum Delivery:</strong> 6kg</p>
              </div>
              
              <div className="delrem-modal-form">
                <div className="delrem-form-group">
                  <label>Amount to Deliver (kg)</label>
                  <div className="delrem-input-with-suffix">
                    <input
                      type="number"
                      value={requestedKg}
                      onChange={(e) => setRequestedKg(e.target.value)}
                      min="6"
                      max={remnant?.accumulatedKg}
                      step="0.5"
                      placeholder={`Enter amount (6-${remnant?.accumulatedKg}kg)`}
                    />
                    <span className="delrem-input-suffix">kg</span>
                  </div>
                </div>

                <div className="delrem-form-row">
                  <div className="delrem-form-group">
                    <label>Preferred Delivery Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="delrem-form-group">
                    <label>Delivery Time</label>
                    <select>
                      <option>Any Time</option>
                      <option>Morning (9AM-12PM)</option>
                      <option>Afternoon (12PM-4PM)</option>
                      <option>Evening (4PM-7PM)</option>
                    </select>
                  </div>
                </div>

                <div className="delrem-form-group">
                  <label>Delivery Notes (Optional)</label>
                  <textarea
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Any special delivery instructions..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
            <div className="delrem-modal-footer">
              <button 
                className="delrem-btn delrem-btn-outline"
                onClick={() => setRequestDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="delrem-btn delrem-btn-primary"
                onClick={handleRequestDelivery}
                disabled={!requestedKg || parseFloat(requestedKg) < 6}
              >
                <FaShoppingCart />
                Request Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDialogOpen && (
        <div className="delrem-modal-overlay">
          <div className="delrem-modal">
            <div className="delrem-modal-header">
              <h3>Confirm Remnant Entries</h3>
              <button 
                className="delrem-modal-close"
                onClick={() => setConfirmDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="delrem-modal-content">
              <div className="delrem-modal-alert">
                <FaExclamationTriangle />
                <p>
                  Please confirm all your accumulated remnant entries. 
                  This is required before requesting delivery.
                </p>
              </div>

              <div className="delrem-entries-list">
                {remnant?.partialDeliveries?.filter(p => !p.confirmed).map((entry, index) => (
                  <div key={index} className="delrem-entry-item">
                    <div className="delrem-entry-date">{formatDate(entry.date)}</div>
                    <div className="delrem-entry-details">
                      <span>{entry.delivered}kg delivered, </span>
                      <span className="delrem-entry-added">+{entry.remaining}kg added to remnant</span>
                    </div>
                    <div className="delrem-entry-original">Original: {entry.originalKg}kg</div>
                  </div>
                ))}
              </div>

              <div className="delrem-form-group">
                <label>Confirmation Notes (Optional)</label>
                <textarea
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  placeholder="Add any comments or notes..."
                  rows={3}
                />
              </div>
            </div>
            <div className="delrem-modal-footer">
              <button 
                className="delrem-btn delrem-btn-outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="delrem-btn delrem-btn-success"
                onClick={handleConfirmEntry}
              >
                <FaCheckCircle />
                Confirm All Entries
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`delrem-snackbar ${snackbar.severity}`}>
          {snackbar.severity === 'success' ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationTriangle />
          )}
          <span>{snackbar.message}</span>
        </div>
      )}
    </div>
  );
};

export default CustomerRemnant;