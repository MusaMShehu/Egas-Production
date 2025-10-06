// components/SupportTicketDetails.js
import React, { useState } from 'react';

const SupportTicketDetails = ({ ticket, onBack, onUpdateTicketStatus, onAddResponse }) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    const result = await onUpdateTicketStatus(ticket._id, newStatus);
    setUpdatingStatus(false);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    if (!responseMessage.trim()) {
      alert('Please enter a response message');
      return;
    }
    
    setIsSubmitting(true);
    const result = await onAddResponse(ticket._id, responseMessage, attachments);
    setIsSubmitting(false);
    
    if (result.success) {
      setResponseMessage('');
      setAttachments([]);
    } else {
      alert(result.message);
    }
  };

  const handleAttachmentChange = (e) => {
    setAttachments(Array.from(e.target.files));
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

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getResponderName = (response) => {
    if (response.user) {
      return `${response.user.firstName} ${response.user.lastName}`;
    }
    return 'Support Agent';
  };

  return (
    <div className="support-ticket-details-container">
      <div className="ticket-details-header">
        <button onClick={onBack} className="btn-back">
          <i className="fas fa-arrow-left"></i> Back to Tickets
        </button>
        <h2>Support Ticket: #{ticket.ticketId}</h2>
      </div>

      <div className="ticket-details-content">
        <div className="ticket-info-grid">
          {/* Ticket Information */}
          <div className="info-card">
            <h3>Ticket Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Subject:</span>
                <span className="value">{ticket.subject}</span>
              </div>
              <div className="info-item">
                <span className="label">Category:</span>
                <span className={`category-badge ${getCategoryBadgeClass(ticket.category)}`}>
                  {ticket.category}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <div className="status-controls">
                  <span className={`status-badge large ${getStatusBadgeClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={updatingStatus}
                    className="status-select"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  {updatingStatus && <i className="fas fa-spinner fa-spin"></i>}
                </div>
              </div>
              <div className="info-item">
                <span className="label">Created:</span>
                <span className="value">{formatDateTime(ticket.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="label">Last Updated:</span>
                <span className="value">{formatDateTime(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="info-card">
            <h3>Customer Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{ticket.user?.firstName} {ticket.user?.lastName}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{ticket.user?.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{ticket.user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Ticket Description */}
          <div className="info-card full-width">
            <h3>Issue Description</h3>
            <div className="description-content">
              <p>{ticket.description}</p>
            </div>
            
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="attachments-section">
                <h4>Attachments</h4>
                <div className="attachments-list">
                  {ticket.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="attachment-item"
                    >
                      <i className="fas fa-paperclip"></i>
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ticket Responses */}
          <div className="info-card full-width">
            <h3>Conversation</h3>
            <div className="conversation-timeline">
              {/* Initial ticket message */}
              <div className="message customer-message">
                <div className="message-header">
                  <span className="sender">{ticket.user?.firstName} {ticket.user?.lastName}</span>
                  <span className="timestamp">{formatDateTime(ticket.createdAt)}</span>
                </div>
                <div className="message-content">
                  <p>{ticket.description}</p>
                </div>
              </div>

              {/* Responses */}
              {ticket.responses && ticket.responses.map((response, index) => (
                <div key={index} className={response.user ? "message customer-message" : "message admin-message"}>
                  <div className="message-header">
                    <span className="sender">{getResponderName(response)}</span>
                    <span className="timestamp">{formatDateTime(response.createdAt)}</span>
                  </div>
                  <div className="message-content">
                    <p>{response.message}</p>
                    
                    {response.attachments && response.attachments.length > 0 && (
                      <div className="response-attachments">
                        {response.attachments.map((attachment, attIndex) => (
                          <a
                            key={attIndex}
                            href={attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-item"
                          >
                            <i className="fas fa-paperclip"></i>
                            Attachment {attIndex + 1}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response Form */}
          <div className="info-card full-width">
            <h3>Add Response</h3>
            <form onSubmit={handleSubmitResponse} className="response-form">
              <div className="form-group">
                <label htmlFor="response-message">Your Response *</label>
                <textarea
                  id="response-message"
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Type your response here..."
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="attachments">Attachments (optional)</label>
                <input
                  type="file"
                  id="attachments"
                  multiple
                  onChange={handleAttachmentChange}
                  className="file-input"
                />
                <div className="file-input-label">
                  <i className="fas fa-paperclip"></i>
                  {attachments.length > 0 
                    ? `${attachments.length} file(s) selected` 
                    : 'Choose files to attach'
                  }
                </div>
              </div>
              
              <div className="form-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-submit-response"
                >
                  {isSubmitting && <i className="fas fa-spinner fa-spin"></i>}
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportTicketDetails;