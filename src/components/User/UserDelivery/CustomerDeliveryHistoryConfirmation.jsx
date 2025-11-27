// components/CustomerDeliveryHistory.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaMapMarkerAlt, 
  FaPhone,
  FaUser,
  FaClock,
  FaTruck,
  FaFilter,
  FaSort
} from 'react-icons/fa';
import './CustomerDeliveryHistory.css';

const CustomerDeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // New state for tabs, filtering and sorting
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('asc'); // Default ascending order (oldest first)

  useEffect(() => {
    fetchDeliveries();
  }, [page, activeTab, statusFilter, sortOrder]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      
      // Build query parameters - always sort by deliveryDate with specified order
      let queryParams = `page=${page}&limit=10&sortOrder=${sortOrder}`;
      
      // Apply status filter based on active tab
      if (activeTab === 'pending') {
        queryParams += '&status=pending';
      } else if (activeTab === 'delivered') {
        queryParams += '&status=delivered';
      } else if (statusFilter !== 'all') {
        queryParams += `&status=${statusFilter}`;
      }

      const response = await fetch(`https://egas-server-1.onrender.com/api/v1/admin/delivery/my-deliveries?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setDeliveries(data.data);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      showSnackbar('Error fetching delivery history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    try {
      const response = await fetch(`https://egas-server-1.onrender.com/api/v1/admin/delivery/${selectedDelivery._id}/confirm`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ notes: confirmationNotes })
      });

      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Delivery confirmed successfully', 'success');
        setConfirmDialogOpen(false);
        setConfirmationNotes('');
        setSelectedDelivery(null);
        fetchDeliveries();
      } else {
        showSnackbar(data.message, 'error');
      }
    } catch (error) {
      showSnackbar('Error confirming delivery', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar({ ...snackbar, open: false });
    }, 6000);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'adm-status-pending',
      assigned: 'adm-status-assigned',
      accepted: 'adm-status-accepted',
      out_for_delivery: 'adm-status-out_for_delivery',
      delivered: 'adm-status-delivered',
      failed: 'adm-status-failed',
      cancelled: 'adm-status-cancelled'
    };
    return `adm-status-chip ${statusMap[status] || 'adm-status-pending'}`;
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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1); // Reset to first page when changing tabs
    // Reset status filter when changing to specific tabs
    if (tab === 'all') {
      setStatusFilter('all');
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1); // Reset to first page when changing filters
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    setPage(1); // Reset to first page when changing sort order
  };

  if (loading) {
    return (
      <div className="adm-customer-delivery">
        <div className="adm-loading">
          <div className="adm-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-customer-delivery">
      <div className="adm-customer-header">
        <h1 className="adm-customer-title">My Delivery Schedules</h1>
        
        {/* Tabs */}
        <div className="adm-tabs">
          <button 
            className={`adm-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => handleTabChange('all')}
          >
            All Deliveries
          </button>
          <button 
            className={`adm-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => handleTabChange('pending')}
          >
            Pending Deliveries
          </button>
          <button 
            className={`adm-tab ${activeTab === 'delivered' ? 'active' : ''}`}
            onClick={() => handleTabChange('delivered')}
          >
            Delivered
          </button>
        </div>

        {/* Filters and Sorting */}
        <div className="adm-controls">
          {/* Status Filter (only show in "All Deliveries" tab) */}
          {activeTab === 'all' && (
            <div className="adm-filter-group">
              <FaFilter className="adm-control-icon" />
              <select 
                className="adm-filter-select"
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="accepted">Accepted</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {/* Sort Order */}
          <div className="adm-sort-group">
            <FaSort className="adm-control-icon" />
            <button 
              className="adm-sort-btn"
              onClick={handleSortOrderChange}
            >
              {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
            </button>
          </div>
        </div>
      </div>

      <div className="adm-deliveries-list">
        {deliveries.map((delivery) => (
          <div key={delivery._id} className="adm-delivery-card">
            <div className="adm-card-content">
              <div className="adm-card-header">
                <span className={getStatusClass(delivery.status)}>
                  {delivery.status.replace(/_/g, ' ').toUpperCase()}
                </span>
                <span className="adm-delivery-date">
                  {formatDate(delivery.deliveryDate)}
                </span>
              </div>

              <div className="adm-plan-info">
                <div className="adm-plan-name">
                  {delivery.subscriptionId?.planName || 'N/A'} - {delivery.subscriptionId?.size || 'N/A'}
                </div>
                {delivery.subscriptionId?.frequency && (
                  <div className="adm-plan-frequency">
                    Frequency: {delivery.subscriptionId.frequency}
                  </div>
                )}
              </div>

              <div className="adm-delivery-details">
                <div className="adm-detail-item">
                  <FaMapMarkerAlt className="adm-icon" />
                  <div className="adm-detail-text">
                    {delivery.address}
                  </div>
                </div>

                {delivery.deliveryAgent && (
                  <div className="adm-agent-info">
                    <div className="adm-detail-item">
                      <FaUser className="adm-icon" />
                      <div className="adm-detail-text">
                        <span className="adm-detail-label">Delivery Agent:</span>{' '}
                        {delivery.deliveryAgent.firstName} {delivery.deliveryAgent.lastName}
                      </div>
                    </div>
                    {delivery.deliveryAgent.phone && (
                      <div className="adm-detail-item">
                        <FaPhone className="adm-icon" />
                        <div className="adm-detail-text">
                          <span className="adm-detail-label">Phone:</span>{' '}
                          {delivery.deliveryAgent.phone}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {delivery.deliveredAt && (
                  <div className="adm-detail-item">
                    <FaTruck className="adm-icon" />
                    <div className="adm-detail-text">
                      <span className="adm-detail-label">Delivered:</span>{' '}
                      {formatDate(delivery.deliveredAt)}
                    </div>
                  </div>
                )}

                {delivery.agentNotes && (
                  <div className="adm-detail-item">
                    <FaClock className="adm-icon" />
                    <div className="adm-detail-text">
                      <span className="adm-detail-label">Agent Notes:</span>{' '}
                      {delivery.agentNotes}
                    </div>
                  </div>
                )}

                {delivery.failedReason && (
                  <div className="adm-status-message adm-message-error">
                    <div><strong>Failure Reason:</strong> {delivery.failedReason}</div>
                  </div>
                )}

                {delivery.customerConfirmation?.confirmed && (
                  <div className="adm-status-message adm-message-confirmed">
                    <div>
                      <FaCheckCircle className="adm-icon" />
                      <strong> Confirmed by you on:</strong> {formatDate(delivery.customerConfirmation.confirmedAt)}
                    </div>
                    {delivery.customerConfirmation.customerNotes && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <strong>Your Notes:</strong> {delivery.customerConfirmation.customerNotes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="adm-card-footer">
                <div className="adm-delivery-meta">
                  {delivery.retryCount > 0 && (
                    <div style={{ color: '#f39c12', fontSize: '0.9rem' }}>
                      Retry attempt: {delivery.retryCount}
                    </div>
                  )}
                </div>
                
                {delivery.status === 'delivered' && !delivery.customerConfirmation?.confirmed && (
                  <button
                    className="adm-btn adm-btn-success"
                    onClick={() => {
                      setSelectedDelivery(delivery);
                      setConfirmDialogOpen(true);
                    }}
                  >
                    <FaCheckCircle className="adm-icon" />
                    Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {deliveries.length === 0 && (
          <div className="adm-empty-state">
            <h3>No deliveries found</h3>
            <p>
              {activeTab === 'pending' 
                ? "You don't have any pending deliveries."
                : activeTab === 'delivered'
                ? "You don't have any delivered orders."
                : "You don't have any delivery records for the selected filter."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="adm-pagination">
          <div className="adm-pagination-info">
            Page {page} of {totalPages} • 
            Showing {deliveries.length} deliveries • 
            Sorted: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
          </div>
          <div className="adm-pagination-buttons">
            <button
              className="adm-page-btn"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + Math.max(1, page - 2);
              if (pageNumber > totalPages) return null;
              
              return (
                <button
                  key={pageNumber}
                  className={`adm-page-btn ${page === pageNumber ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              className="adm-page-btn"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="adm-dialog-overlay">
          <div className="adm-dialog">
            <div className="adm-dialog-header">
              <h2 className="adm-dialog-title">Confirm Delivery</h2>
            </div>
            <div className="adm-dialog-content">
              <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
                Please confirm that you have received your {selectedDelivery?.subscriptionId?.planName} delivery.
              </p>
              <div className="adm-form-group">
                <label className="adm-form-label">Delivery Notes (Optional)</label>
                <textarea
                  className="adm-form-textarea"
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  placeholder="Add any comments about the delivery service..."
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
                onClick={handleConfirmDelivery}
              >
                <FaCheckCircle className="adm-icon" />
                Confirm Receipt
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

export default CustomerDeliveryHistory;