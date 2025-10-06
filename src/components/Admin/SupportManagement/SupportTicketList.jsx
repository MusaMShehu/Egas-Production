// components/SupportTicketList.js
import React, { useState } from 'react';

const SupportTicketList = ({ tickets, loading, error, onViewTicket, onUpdateTicketStatus }) => {
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingTicketId(ticketId);
    const result = await onUpdateTicketStatus(ticketId, newStatus);
    setUpdatingTicketId(null);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-default';
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'delivery': return 'category-delivery';
      case 'payment': return 'category-payment';
      case 'product': return 'category-product';
      case 'account': return 'category-account';
      case 'other': return 'category-other';
      default: return 'category-default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getResponseCount = (ticket) => {
    return ticket.responses ? ticket.responses.length : 0;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading support tickets...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-headset"></i>
        <h3>No support tickets found</h3>
        <p>Try adjusting your filters or check back later for new tickets.</p>
      </div>
    );
  }

  return (
    <div className="support-ticket-list-container">
      <div className="ticket-grid">
        {tickets.map(ticket => (
          <div key={ticket._id} className="ticket-card">
            <div className="ticket-card-header">
              <div className="ticket-id">#{ticket.ticketId}</div>
              <div className="ticket-date">{formatDate(ticket.createdAt)}</div>
            </div>
            
            <div className="ticket-card-body">
              <div className="ticket-subject">{ticket.subject}</div>
              
              <div className="customer-info">
                <div className="customer-name">
                  {ticket.user?.firstName} {ticket.user?.lastName}
                </div>
                <div className="customer-email">{ticket.user?.email}</div>
              </div>
              
              <div className="ticket-details">
                <div className="detail-item">
                  <span className="label">Category:</span>
                  <span className={`category-badge ${getCategoryBadgeClass(ticket.category)}`}>
                    {ticket.category}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Responses:</span>
                  <span className="value">{getResponseCount(ticket)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Attachments:</span>
                  <span className="value">{ticket.attachments?.length || 0}</span>
                </div>
              </div>
              
              <div className="ticket-status-section">
                <div className={`status-badge ${getStatusBadgeClass(ticket.status)}`}>
                  {ticket.status}
                </div>
                
                <div className="status-actions">
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                    disabled={updatingTicketId === ticket._id}
                    className="status-select"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  {updatingTicketId === ticket._id && (
                    <i className="fas fa-spinner fa-spin updating-spinner"></i>
                  )}
                </div>
              </div>
            </div>
            
            <div className="ticket-card-footer">
              <button
                onClick={() => onViewTicket(ticket)}
                className="btn-view-details"
              >
                <i className="fas fa-eye"></i> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportTicketList;