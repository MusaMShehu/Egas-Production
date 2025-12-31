import React, { useState, useEffect } from 'react';
import { 
  FaGasPump, 
  FaHistory, 
  FaTruck, 
  FaCheckCircle, 
  FaClock,
  FaPlus,
  FaExclamationTriangle,
  FaShoppingCart
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
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="adm-customer-remnant">
        <div className="adm-loading">
          <div className="adm-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-customer-remnant">
      <div className="adm-remnant-header">
        <h1 className="adm-remnant-title">
          <FaGasPump className="adm-icon" />
          My Gas Remnant
        </h1>
        
        {remnant && (
          <button
            className="adm-btn adm-btn-primary"
            onClick={() => setRequestDialogOpen(true)}
            disabled={remnant.accumulatedKg < 6}
          >
            <FaShoppingCart className="adm-icon" />
            Request Delivery
            {remnant.accumulatedKg < 6 && (
              <span className="adm-tooltip">
                Minimum 6kg required
              </span>
            )}
          </button>
        )}
      </div>

      {remnant ? (
        <div className="adm-remnant-container">
          {/* Remnant Summary Card */}
          <div className="adm-remnant-summary">
            <div className="adm-summary-card primary">
              <div className="adm-summary-label">Accumulated Gas</div>
              <div className="adm-summary-value">
                {remnant.accumulatedKg.toFixed(1)} kg
              </div>
              <div className="adm-summary-subtext">
                {remnant.accumulatedKg >= 6 ? (
                  <span className="adm-text-success">
                    ✓ Eligible for delivery
                  </span>
                ) : (
                  <span className="adm-text-warning">
                    Needs {6 - remnant.accumulatedKg}kg more for delivery
                  </span>
                )}
              </div>
            </div>
            
            <div className="adm-summary-card secondary">
              <div className="adm-summary-label">Partial Deliveries</div>
              <div className="adm-summary-value">
                {remnant.partialDeliveries?.length || 0}
              </div>
              <div className="adm-summary-subtext">
                Unconfirmed: {remnant.partialDeliveries?.filter(p => !p.confirmed).length || 0}
              </div>
            </div>
            
            <div className="adm-summary-card success">
              <div className="adm-summary-label">Delivered From Remnant</div>
              <div className="adm-summary-value">
                {remnant.deliveredFromRemnant?.toFixed(1) || 0} kg
              </div>
              <div className="adm-summary-subtext">
                Total delivered so far
              </div>
            </div>
          </div>

          {/* Customer Confirmation Banner */}
          {!remnant.customerConfirmation?.confirmed && remnant.accumulatedKg > 0 && (
            <div className="adm-alert adm-alert-warning">
              <FaExclamationTriangle className="adm-icon" />
              <div>
                <strong>Action Required:</strong> You have {remnant.partialDeliveries?.filter(p => !p.confirmed).length || 0} 
                unconfirmed remnant entries. Please confirm them to proceed with delivery requests.
              </div>
              <button
                className="adm-btn adm-btn-warning adm-btn-small"
                onClick={() => setConfirmDialogOpen(true)}
              >
                <FaCheckCircle className="adm-icon" />
                Confirm All
              </button>
            </div>
          )}

          {/* Partial Deliveries History */}
          <div className="adm-section">
            <h2 className="adm-section-title">
              <FaHistory className="adm-icon" />
              Partial Delivery History
            </h2>
            
            {remnant.partialDeliveries?.length > 0 ? (
              <div className="adm-delivery-history">
                {remnant.partialDeliveries.map((entry, index) => (
                  <div key={index} className="adm-history-card">
                    <div className="adm-history-header">
                      <span className="adm-history-date">
                        {formatDate(entry.date)}
                      </span>
                      <span className={`adm-history-status ${entry.confirmed ? 'confirmed' : 'pending'}`}>
                        {entry.confirmed ? 'Confirmed' : 'Pending Confirmation'}
                      </span>
                    </div>
                    
                    <div className="adm-history-details">
                      <div className="adm-detail-item">
                        <span className="adm-detail-label">Original Order:</span>
                        <span className="adm-detail-value">{entry.originalKg}kg</span>
                      </div>
                      
                      <div className="adm-detail-item">
                        <span className="adm-detail-label">Delivered:</span>
                        <span className="adm-detail-value">{entry.delivered}kg</span>
                      </div>
                      
                      <div className="adm-detail-item">
                        <span className="adm-detail-label">Remaining (Added):</span>
                        <span className="adm-detail-value success">{entry.remaining}kg</span>
                      </div>
                      
                      {entry.deliveryId?.agentNotes && (
                        <div className="adm-detail-item">
                          <span className="adm-detail-label">Agent Notes:</span>
                          <span className="adm-detail-value">{entry.deliveryId.agentNotes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="adm-empty-state">
                <p>No partial deliveries recorded yet.</p>
              </div>
            )}
          </div>

          {/* Remnant Delivery Requests */}
          <div className="adm-section">
            <h2 className="adm-section-title">
              <FaTruck className="adm-icon" />
              Remnant Delivery Requests
            </h2>
            
            {remnant.deliveryRequests?.length > 0 ? (
              <div className="adm-requests-list">
                {remnant.deliveryRequests.map((request, index) => (
                  <div key={index} className="adm-request-card">
                    <div className="adm-request-header">
                      <span className="adm-request-date">
                        {formatDate(request.date)}
                      </span>
                      <span className={`adm-request-status ${request.status}`}>
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="adm-request-details">
                      <div className="adm-detail-item">
                        <span className="adm-detail-label">Requested Amount:</span>
                        <span className="adm-detail-value">{request.requestedKg}kg</span>
                      </div>
                      
                      {request.deliveryId && (
                        <div className="adm-detail-item">
                          <span className="adm-detail-label">Delivery Status:</span>
                          <span className="adm-detail-value">
                            {request.deliveryId.status?.replace(/_/g, ' ') || 'Pending'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="adm-empty-state">
                <p>No remnant delivery requests yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="adm-empty-state">
          <FaGasPump className="adm-icon-large" />
          <h3>No Remnant Record Found</h3>
          <p>You don't have any accumulated gas remnant yet. Remnant is created when you receive partial deliveries.</p>
        </div>
      )}

      {/* Request Delivery Dialog */}
      {requestDialogOpen && (
        <div className="adm-dialog-overlay">
          <div className="adm-dialog">
            <div className="adm-dialog-header">
              <h2 className="adm-dialog-title">Request Remnant Delivery</h2>
            </div>
            <div className="adm-dialog-content">
              <div className="adm-info-box">
                <p>
                  <strong>Available Remnant:</strong> {remnant?.accumulatedKg.toFixed(1)}kg<br />
                  <strong>Minimum Delivery:</strong> 6kg
                </p>
              </div>
              
              <div className="adm-form-group">
                <label className="adm-form-label">Amount to Deliver (kg)</label>
                <input
                  type="number"
                  className="adm-form-input"
                  value={requestedKg}
                  onChange={(e) => setRequestedKg(e.target.value)}
                  min="6"
                  max={remnant?.accumulatedKg}
                  step="0.5"
                  placeholder={`Enter amount (6-${remnant?.accumulatedKg}kg)`}
                />
              </div>
              
              <div className="adm-form-group">
                <label className="adm-form-label">Preferred Delivery Date (Optional)</label>
                <input
                  type="date"
                  className="adm-form-input"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="adm-form-group">
                <label className="adm-form-label">Delivery Notes (Optional)</label>
                <textarea
                  className="adm-form-textarea"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Any special delivery instructions..."
                  rows={3}
                />
              </div>
            </div>
            <div className="adm-dialog-footer">
              <button 
                className="adm-btn adm-btn-outline"
                onClick={() => setRequestDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="adm-btn adm-btn-primary"
                onClick={handleRequestDelivery}
                disabled={!requestedKg || parseFloat(requestedKg) < 6}
              >
                <FaShoppingCart className="adm-icon" />
                Request Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Entries Dialog */}
      {confirmDialogOpen && (
        <div className="adm-dialog-overlay">
          <div className="adm-dialog">
            <div className="adm-dialog-header">
              <h2 className="adm-dialog-title">Confirm Remnant Entries</h2>
            </div>
            <div className="adm-dialog-content">
              <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
                Please confirm all your accumulated remnant entries. This is required before requesting delivery.
              </p>
              
              <div className="adm-pending-entries">
                {remnant?.partialDeliveries?.filter(p => !p.confirmed).map((entry, index) => (
                  <div key={index} className="adm-pending-entry">
                    <div className="adm-entry-date">{formatDate(entry.date)}</div>
                    <div className="entry-details">
                      <span>{entry.delivered}kg delivered, </span>
                      <span className="success">{entry.remaining}kg added to remnant</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="adm-form-group">
                <label className="adm-form-label">Confirmation Notes (Optional)</label>
                <textarea
                  className="adm-form-textarea"
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  placeholder="Add any comments..."
                  rows={3}
                />
              </div>
            </div>
            <div className="adm-dialog-footer">
              <button 
                className="adm-btn adm-btn-outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="adm-btn adm-btn-success"
                onClick={handleConfirmEntry}
              >
                <FaCheckCircle className="adm-icon" />
                Confirm All Entries
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
            <FaExclamationTriangle className="adm-icon" />
          )}
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default CustomerRemnant;