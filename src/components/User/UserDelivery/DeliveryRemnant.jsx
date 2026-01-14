
import React, { useState, useEffect } from 'react';
import { 
  FaGasPump, 
  FaHistory, 
  FaTruck, 
  FaCheckCircle,
  FaEye, 
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
  FaHome,
  FaInfoCircle,
  FaSync
} from 'react-icons/fa';
import './DeliveryRemnant.css';
import "./SharedPartialDeliveryStyle.css";

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

  // Fix 1: Update the confirm endpoint to match backend route
  const handleConfirmEntry = async () => {
    try {
      console.log('Confirming remnant entries for:', remnant?._id);
      console.log('Confirmation notes:', confirmationNotes);

      const response = await fetch(`https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/${remnant?._id}/confirmmm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          notes: confirmationNotes  // This sends 'notes' which backend expects
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        showSnackbar('Remnant entries confirmed successfully', 'success');
        setConfirmDialogOpen(false);
        setConfirmationNotes('');
        fetchRemnant(); // Refresh data
      } else {
        showSnackbar(data.message, 'error');
      }
    } catch (error) {
      console.error('Error confirming entry:', error);
      showSnackbar('Error confirming entries: ' + error.message, 'error');
    }
  };

  // Fix 2: Update the confirm partial delivery endpoint
  const handleConfirmPartialDelivery = async (deliveryId) => {
    try {
      console.log('Confirming individual delivery:', deliveryId);
      
      // Note: You need to decide which endpoint to use
      // Option 1: If you want to confirm individual deliveries via remnant route
      const response = await fetch(`https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/${remnant?._id}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notes: 'Confirmed individual delivery' })
      });

      // Option 2: If you want to use deliveries route (make sure it exists in backend)
      // const response = await fetch(`https://egas-server-1.onrender.com/api/v1/deliveries/${deliveryId}/confirm-remnant`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ notes: 'Confirmed by customer' })
      // });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        showSnackbar('Remnant entry confirmed successfully', 'success');
        fetchRemnant(); // Refresh data
      } else {
        showSnackbar(data.message, 'error');
      }
    } catch (error) {
      console.error('Error confirming partial delivery:', error);
      showSnackbar('Error confirming entry: ' + error.message, 'error');
    }
  };

  const handleRequestDelivery = async () => {
    if (!requestedKg) {
      showSnackbar('Please enter amount to deliver', 'error');
      return;
    }

    const requested = parseFloat(requestedKg);
    const accumulated = remnant?.accumulatedKg || 0;

    if (requested < 6) {
      showSnackbar('Minimum 6kg required for delivery', 'error');
      return;
    }

    if (requested > accumulated) {
      showSnackbar(`Cannot request more than ${accumulated}kg available`, 'error');
      return;
    }

    // Check if customer has confirmed all partial deliveries
    const unconfirmedEntries = remnant?.partialDeliveries?.filter(p => !p.confirmed) || [];
    if (unconfirmedEntries.length > 0) {
      showSnackbar(`Please confirm ${unconfirmedEntries.length} pending remnant entries first`, 'error');
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
          requestedKg: requested,
          deliveryDate,
          notes: deliveryNotes
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Remnant delivery requested successfully', 'success');
        setRequestDialogOpen(false);
        setRequestedKg('');
        setDeliveryDate('');
        setDeliveryNotes('');
        fetchRemnant(); // Refresh data
      } else {
        showSnackbar(data.message, 'error');
      }
    } catch (error) {
      console.error('Error requesting delivery:', error);
      showSnackbar('Error requesting delivery: ' + error.message, 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar({ ...snackbar, open: false });
    }, 6000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Fix 3: Calculate pending entries correctly
  const getPendingEntries = () => {
    return remnant?.partialDeliveries?.filter(p => !p.confirmed) || [];
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

  const pendingEntries = getPendingEntries();

  return (
    <div className="delrem-remnant-container">
      <div className="delrem-remnant-main-content">
        {/* Header with Tabs */}
        <div className="delrem-content-header">
          <div className="delrem-header-left">
            <h2 className="delrem-content-title">
              <FaGasPump className="delrem-title-icon" />
              My Gas Remnant
            </h2>
            <div className="delrem-content-subtitle">
              Manage your accumulated gas remnant and delivery requests
            </div>
          </div>
          
          <div className="delrem-header-right">
            <button 
              className="delrem-header-btn delrem-primary"
              onClick={() => setRequestDialogOpen(true)}
              disabled={!remnant || remnant.accumulatedKg < 6 || pendingEntries.length > 0}
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
              Partial Delivery History
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
                    <div className="delrem-stat-card-value">{remnant.accumulatedKg?.toFixed(1) || '0'}kg</div>
                    <div className="delrem-stat-card-subtitle">
                      {remnant.accumulatedKg >= 6 ? (
                        <span className="delrem-status-success">
                          <FaCheckCircle /> Eligible for delivery
                        </span>
                      ) : (
                        <span className="delrem-status-warning">
                          <FaExclamationTriangle /> Needs {6 - remnant.accumulatedKg}kg more
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
                      {pendingEntries.length > 0 ? (
                        <span className="delrem-status-warning">
                          {pendingEntries.length} pending confirmation
                        </span>
                      ) : (
                        <span className="delrem-status-success">
                          All confirmed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="delrem-stat-card">
                  <div className="delrem-stat-card-header">
                    <FaTruck className="delrem-stat-card-icon" />
                    <span className="delrem-stat-card-title">Delivered Total</span>
                  </div>
                  <div className="delrem-stat-card-content">
                    <div className="delrem-stat-card-value">{remnant.deliveredFromRemnant?.toFixed(1) || '0'}kg</div>
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
                    <div className="delrem-stat-card-value">
                      {remnant.deliveryRequests?.filter(r => r.status === 'pending').length || 0}
                    </div>
                    <div className="delrem-stat-card-subtitle">
                      Pending delivery requests
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Requirements */}
              {pendingEntries.length > 0 && (
                <div className="delrem-confirmation-required">
                  <div className="delrem-confirmation-header">
                    <FaExclamationTriangle className="delrem-confirmation-icon" />
                    <h4>Action Required</h4>
                  </div>
                  <div className="delrem-confirmation-content">
                    <p>
                      You have {pendingEntries.length} unconfirmed partial delivery entries. 
                      Please confirm them before requesting remnant delivery.
                    </p>
                    <div className="delrem-pending-entries">
                      {pendingEntries.slice(0, 3).map((entry, index) => (
                        <div key={index} className="delrem-pending-entry">
                          <FaGasPump className="delrem-entry-icon" />
                          <div className="delrem-entry-details">
                            <div className="delrem-entry-date">{formatDate(entry.date)}</div>
                            <div className="delrem-entry-amount">
                              {entry.delivered}kg delivered, {entry.remaining}kg added to remnant
                            </div>
                          </div>
                          <button
                            className="delrem-confirm-entry-btn"
                            onClick={() => handleConfirmPartialDelivery(entry.deliveryId?._id || entry.deliveryId)}
                            disabled={!entry.deliveryId}
                          >
                            <FaCheckCircle /> Confirm
                          </button>
                        </div>
                      ))}
                    </div>
                    {pendingEntries.length > 3 && (
                      <div className="delrem-more-entries">
                        +{pendingEntries.length - 3} more entries pending
                      </div>
                    )}
                    <button 
                      className="delrem-confirm-all-btn"
                      onClick={() => setConfirmDialogOpen(true)}
                    >
                      <FaCheckCircle /> Confirm All Entries
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="delrem-quick-actions-section">
                <h3 className="delrem-section-title">Quick Actions</h3>
                <div className="delrem-quick-actions-grid">
                  <button 
                    className="delrem-quick-action-card"
                    onClick={() => setRequestDialogOpen(true)}
                    disabled={remnant.accumulatedKg < 6 || pendingEntries.length > 0}
                  >
                    <div className="delrem-quick-action-icon delrem-primary">
                      <FaShoppingCart />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">Request Delivery</div>
                      <div className="delrem-quick-action-subtitle">
                        {remnant.accumulatedKg >= 6 
                          ? `Request delivery of your ${remnant.accumulatedKg.toFixed(1)}kg remnant` 
                          : `Minimum ${6 - remnant.accumulatedKg}kg needed`}
                      </div>
                    </div>
                    <FaChevronRight className="delrem-quick-action-arrow" />
                  </button>

                  <button 
                    className="delrem-quick-action-card"
                    onClick={() => setConfirmDialogOpen(true)}
                    disabled={pendingEntries.length === 0}
                  >
                    <div className="delrem-quick-action-icon delrem-success">
                      <FaCheckCircle />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">Confirm Entries</div>
                      <div className="delrem-quick-action-subtitle">
                        {pendingEntries.length} entries pending confirmation
                      </div>
                    </div>
                    <FaChevronRight className="delrem-quick-action-arrow" />
                  </button>

                  <button className="delrem-quick-action-card" onClick={() => setActiveTab('history')}>
                    <div className="delrem-quick-action-icon delrem-info">
                      <FaHistory />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">View History</div>
                      <div className="delrem-quick-action-subtitle">
                        View your complete partial delivery history
                      </div>
                    </div>
                    <FaChevronRight className="delrem-quick-action-arrow" />
                  </button>

                  <button className="delrem-quick-action-card" onClick={() => setActiveTab('requests')}>
                    <div className="delrem-quick-action-icon delrem-warning">
                      <FaBell />
                    </div>
                    <div className="delrem-quick-action-content">
                      <div className="delrem-quick-action-title">Delivery Requests</div>
                      <div className="delrem-quick-action-subtitle">
                        View and manage your delivery requests
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
                        <h4>Recent Partial Deliveries</h4>
                        <button 
                          className="delrem-view-all-btn"
                          onClick={() => setActiveTab('history')}
                        >
                          View All
                        </button>
                      </div>
                      <div className="delrem-activity-list">
                        {remnant.partialDeliveries?.slice(0, 5).map((entry, index) => (
                          <div key={index} className="delrem-activity-item">
                            <div className={`delrem-activity-icon ${entry.confirmed ? 'delrem-confirmed' : 'delrem-pending'}`}>
                              {entry.confirmed ? <FaCheckCircle /> : <FaExclamationTriangle />}
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
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {remnant.partialDeliveries?.map((entry, index) => (
                            <tr key={index} className={entry.confirmed ? 'delrem-confirmed-row' : 'delrem-pending-row'}>
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
                              <td>
                                {!entry.confirmed ? (
                                  <button
                                    className="delrem-action-btn delrem-confirm-btn"
                                    onClick={() => handleConfirmPartialDelivery(entry.deliveryId?._id || entry.deliveryId)}
                                    disabled={!entry.deliveryId}
                                  >
                                    <FaCheckCircle /> Confirm
                                  </button>
                                ) : (
                                  <span className="delrem-confirmed-text">
                                    <FaCheckCircle /> Confirmed
                                  </span>
                                )}
                              </td>
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
                            <th>Delivery Status</th>
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
                              <td>
                                {request.deliveryId?.status ? (
                                  <span className={`delrem-status-badge ${request.deliveryId.status}`}>
                                    {request.deliveryId.status.toUpperCase()}
                                  </span>
                                ) : (
                                  '-'
                                )}
                              </td>
                              <td>{request.notes || '-'}</td>
                              <td>
                                <div className="delrem-table-actions">
                                  <button className="delrem-action-btn delrem-view-btn">
                                    <FaEye /> View
                                  </button>
                                  {request.status === 'pending' && (
                                    <button className="delrem-action-btn delrem-cancel-btn">
                                      <FaTimes /> Cancel
                                    </button>
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
        </div>
      </div>

      {/* Modals */}
      {requestDialogOpen && (
        <div className="delrem-modal-overlay">
          <div className="delrem-modal">
            <div className="delrem-modal-header">
              <h3><FaShoppingCart /> Request Remnant Delivery</h3>
              <button 
                className="delrem-modal-close"
                onClick={() => setRequestDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="delrem-modal-content">
              <div className="delrem-modal-info">
                <p><strong>Available Remnant:</strong> {remnant?.accumulatedKg?.toFixed(1) || '0'}kg</p>
                <p><strong>Minimum Delivery:</strong> 6kg</p>
                {pendingEntries.length > 0 && (
                  <div className="delrem-modal-warning">
                    <FaExclamationTriangle />
                    <p>You have {pendingEntries.length} unconfirmed entries. Please confirm them first.</p>
                  </div>
                )}
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
                      disabled={pendingEntries.length > 0}
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
                disabled={!requestedKg || parseFloat(requestedKg) < 6 || pendingEntries.length > 0}
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
              <h3><FaCheckCircle /> Confirm Remnant Entries</h3>
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
                  This is required before requesting remnant delivery.
                </p>
              </div>

              <div className="delrem-entries-list">
                {pendingEntries.map((entry, index) => (
                  <div key={index} className="delrem-entry-item">
                    <div className="delrem-entry-date">{formatDate(entry.date)}</div>
                    <div className="delrem-entry-details">
                      <span>{entry.delivered}kg delivered, </span>
                      <span className="delrem-entry-added">+{entry.remaining}kg added to remnant</span>
                    </div>
                    <div className="delrem-entry-original">Original order: {entry.originalKg}kg</div>
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
                disabled={!remnant?._id}
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