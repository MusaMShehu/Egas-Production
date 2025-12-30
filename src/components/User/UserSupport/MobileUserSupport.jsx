import React, { useState, useEffect } from 'react';
import './MobileUserSupport.css';
import { FaPaperclip, FaSearch, FaTimes, FaPlus, FaComment, FaCheckCircle, FaClock, FaExclamationCircle, FaImage, FaFile, FaTrash } from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const MobileSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newResponse, setNewResponse] = useState('');
  const [responseAttachments, setResponseAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'delivery',
    description: '',
    images: []
  });

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    filterTickets();
  }, [tickets, searchQuery]);

  const fetchTickets = async () => {
    setIsLoading(true);
    infoToast('Loading support tickets...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/support`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();
      setTickets(data.data || []);
      successToast('Tickets loaded');
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = 'Failed to load tickets. Please try again.';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTickets = () => {
    let filtered = tickets;

    if (searchQuery) {
      filtered = filtered.filter(ticket =>
        ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTickets(filtered);
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    infoToast('Creating ticket...');

    try {
      const formData = new FormData();
      formData.append('subject', newTicket.subject);
      formData.append('category', newTicket.category);
      formData.append('description', newTicket.description);
      
      newTicket.images.forEach(file => formData.append('images', file));

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/support`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const data = await response.json();
      setTickets(prev => [data.data, ...prev]);
      
      setShowCreateForm(false);
      setNewTicket({
        subject: '',
        category: 'delivery',
        description: '',
        images: []
      });
      
      successToast('Ticket created successfully!');
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.message || 'Failed to create ticket.';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddResponse = async (ticketId) => {
    if (!newResponse.trim() && responseAttachments.length === 0) {
      warningToast('Please enter a message or attach files');
      return;
    }

    setIsSubmitting(true);
    infoToast('Sending response...');

    try {
      const formData = new FormData();
      formData.append('message', newResponse);
      responseAttachments.forEach(file => formData.append('attachments', file));

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/support/${ticketId}/response`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const updatedTicket = await fetchTicketDetails(ticketId);
      setTickets(prev => prev.map(t => t._id === ticketId ? updatedTicket : t));
      
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(updatedTicket);
      }

      setNewResponse('');
      setResponseAttachments([]);
      successToast('Response sent!');
    } catch (err) {
      console.error('Error:', err);
      const errorMsg = err.message || 'Failed to send response.';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/support/${ticketId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      console.error('Error:', err);
      throw err;
    }
  };

  const closeTicket = async (ticketId) => {
    const ticket = tickets.find(t => t._id === ticketId);
    if (!ticket) return;

    if (!window.confirm('Close this ticket?')) {
      infoToast('Cancelled');
      return;
    }

    warningToast('Closing ticket...');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/support/${ticketId}/close`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();
      setTickets(prev => prev.map(t => t._id === ticketId ? data.data : t));
      
      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket(data.data);
      }

      successToast('Ticket closed');
    } catch (err) {
      console.error('Error:', err);
      errorToast('Failed to close ticket');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaExclamationCircle className="mobsup-status-icon mobsup-open" />;
      case 'in-progress': return <FaClock className="mobsup-status-icon mobsup-in-progress" />;
      case 'resolved': return <FaCheckCircle className="mobsup-status-icon mobsup-resolved" />;
      case 'closed': return <FaCheckCircle className="mobsup-status-icon mobsup-closed" />;
      default: return <FaExclamationCircle className="mobsup-status-icon mobsup-open" />;
    }
  };

  const getStatusText = (status) => {
    return status?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || 'Open';
  };

  const getCategoryText = (category) => {
    return category?.charAt(0).toUpperCase() + category?.slice(1) || 'Other';
  };

  const handleFileUpload = (e, isResponse = false) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        errorToast(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });

    if (isResponse) {
      setResponseAttachments(prev => [...prev, ...validFiles]);
    } else {
      setNewTicket(prev => ({
        ...prev,
        images: [...prev.images, ...validFiles]
      }));
    }

    if (validFiles.length > 0) {
      successToast(`Added ${validFiles.length} file(s)`);
    }
  };

  const handleRemoveFile = (index, isResponse = false) => {
    if (isResponse) {
      setResponseAttachments(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewTicket(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
    warningToast('File removed');
  };

  const getFileIcon = (filename) => {
    if (!filename) return <FaFile />;
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <FaImage className="mobsup-file-icon mobsup-image" />;
    } else if (ext === 'pdf') {
      return <FaFile className="mobsup-file-icon mobsup-pdf" />;
    }
    return <FaFile />;
  };

  const ticketsByStatus = {
    open: filteredTickets.filter(t => t.status === 'open'),
    'in-progress': filteredTickets.filter(t => t.status === 'in-progress'),
    resolved: filteredTickets.filter(t => t.status === 'resolved'),
    closed: filteredTickets.filter(t => t.status === 'closed')
  };

  if (isLoading) {
    return (
      <div className="mobsup-mobile-support mobsup-loading">
        <div className="mobsup-loading-spinner"></div>
        <p>Loading support tickets...</p>
      </div>
    );
  }

  return (
    <div className="mobsup-mobile-support">
      {/* Header */}
      <div className="mobsup-support-header">
        <h1>Support Center</h1>
        <button 
          className="mobsup-new-ticket-btn"
          onClick={() => setShowCreateForm(true)}
          disabled={isSubmitting}
        >
          <FaPlus /> New Ticket
        </button>
      </div>

      {/* Search */}
      <div className="mobsup-search-container">
        <div className="mobsup-search-bar">
          <FaSearch className="mobsup-search-icon" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="mobsup-clear-search" onClick={() => setSearchQuery('')}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Ticket Stats */}
      <div className="mobsup-ticket-stats">
        <div className="mobsup-stat-card">
          <div className="mobsup-stat-icon mobsup-open">
            <FaExclamationCircle />
          </div>
          <div className="mobsup-stat-content">
            <h3>Open</h3>
            <p>{ticketsByStatus.open.length}</p>
          </div>
        </div>
        
        <div className="mobsup-stat-card">
          <div className="mobsup-stat-icon mobsup-in-progress">
            <FaClock />
          </div>
          <div className="mobsup-stat-content">
            <h3>In Progress</h3>
            <p>{ticketsByStatus['in-progress'].length}</p>
          </div>
        </div>
        
        <div className="mobsup-stat-card">
          <div className="mobsup-stat-icon mobsup-resolved">
            <FaCheckCircle />
          </div>
          <div className="mobsup-stat-content">
            <h3>Resolved</h3>
            <p>{ticketsByStatus.resolved.length + ticketsByStatus.closed.length}</p>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="mobsup-tickets-section">
        <div className="mobsup-section-header">
          <h2>Your Tickets</h2>
          <span className="mobsup-count-badge">{filteredTickets.length}</span>
        </div>

        {filteredTickets.length > 0 ? (
          <div className="mobsup-tickets-list">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket._id} 
                className="mobsup-ticket-card"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="mobsup-ticket-header">
                  <div className="mobsup-ticket-title">
                    <h3>{ticket.subject}</h3>
                    <span className="mobsup-ticket-category">
                      {getCategoryText(ticket.category)}
                    </span>
                  </div>
                  <div className={`mobsup-ticket-status mobsup-${ticket.status}`}>
                    {getStatusIcon(ticket.status)}
                    <span>{getStatusText(ticket.status)}</span>
                  </div>
                </div>

                <div className="mobsup-ticket-body">
                  <p className="mobsup-ticket-description">
                    {ticket.description.length > 100
                      ? `${ticket.description.substring(0, 100)}...`
                      : ticket.description}
                  </p>
                  
                  <div className="mobsup-ticket-meta">
                    <div className="mobsup-meta-item">
                      <FaComment />
                      <span>{ticket.responses?.length || 0} replies</span>
                    </div>
                    <div className="mobsup-meta-item">
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="mobsup-ticket-footer">
                  <button 
                    className="mobsup-view-details-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTicket(ticket);
                    }}
                  >
                    View Details
                  </button>
                  {ticket.status !== 'closed' && (
                    <button 
                      className="mobsup-close-ticket-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTicket(ticket._id);
                      }}
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mobsup-no-tickets">
            <FaComment className="mobsup-no-tickets-icon" />
            <h3>No tickets found</h3>
            <p>{searchQuery ? 'Try a different search' : 'Create your first support ticket'}</p>
            <button 
              className="mobsup-create-ticket-btn"
              onClick={() => setShowCreateForm(true)}
            >
              <FaPlus /> Create Ticket
            </button>
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="mobsup-ticket-details-modal">
          <div className="mobsup-modal-content">
            <div className="mobsup-modal-header">
              <h2>Ticket #{selectedTicket.ticketId}</h2>
              <button 
                className="mobsup-close-modal"
                onClick={() => setSelectedTicket(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="mobsup-modal-body">
              {/* Ticket Info */}
              <div className="mobsup-ticket-info-section">
                <div className="mobsup-info-grid">
                  <div className="mobsup-info-item">
                    <span className="mobsup-label">Subject:</span>
                    <span className="mobsup-value">{selectedTicket.subject}</span>
                  </div>
                  <div className="mobsup-info-item">
                    <span className="mobsup-label">Category:</span>
                    <span className="mobsup-value">{getCategoryText(selectedTicket.category)}</span>
                  </div>
                  <div className="mobsup-info-item">
                    <span className="mobsup-label">Status:</span>
                    <span className={`mobsup-value mobsup-status mobsup-${selectedTicket.status}`}>
                      {getStatusIcon(selectedTicket.status)}
                      {getStatusText(selectedTicket.status)}
                    </span>
                  </div>
                  <div className="mobsup-info-item">
                    <span className="mobsup-label">Created:</span>
                    <span className="mobsup-value">{formatDate(selectedTicket.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Conversation */}
              <div className="mobsup-conversation-section">
                <h3>Conversation</h3>
                
                {/* Initial Message */}
                <div className="mobsup-message mobsup-user-message">
                  <div className="mobsup-message-header">
                    <span className="mobsup-sender">You</span>
                    <span className="mobsup-time">{formatDate(selectedTicket.createdAt)}</span>
                  </div>
                  <div className="mobsup-message-content">
                    <p>{selectedTicket.description}</p>
                    {selectedTicket.images && selectedTicket.images.length > 0 && (
                      <div className="mobsup-message-attachments">
                        <strong>Attachments:</strong>
                        <div className="mobsup-attachments-list">
                          {selectedTicket.images.map((img, index) => (
                            <div key={index} className="mobsup-attachment">
                              {getFileIcon(typeof img === 'string' ? img : img.name)}
                              <span className="mobsup-filename">
                                {typeof img === 'string' ? img.split('/').pop() : img.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Responses */}
                {selectedTicket.responses?.map((response, index) => (
                  <div 
                    key={response._id || index}
                    className={`mobsup-message ${response.user ? 'mobsup-user-message' : 'mobsup-agent-message'}`}
                  >
                    <div className="mobsup-message-header">
                      <span className="mobsup-sender">
                        {response.user ? 'You' : 'Support Agent'}
                      </span>
                      <span className="mobsup-time">{formatDate(response.createdAt)}</span>
                    </div>
                    <div className="mobsup-message-content">
                      <p>{response.message}</p>
                      {response.attachments && response.attachments.length > 0 && (
                        <div className="mobsup-message-attachments">
                          <strong>Attachments:</strong>
                          <div className="mobsup-attachments-list">
                            {response.attachments.map((att, idx) => (
                              <div key={idx} className="mobsup-attachment">
                                {getFileIcon(typeof att === 'string' ? att : att.name)}
                                <span className="mobsup-filename">
                                  {typeof att === 'string' ? att.split('/').pop() : att.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== 'closed' && (
                <div className="mobsup-reply-section">
                  <h4>Add Reply</h4>
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type your reply here..."
                    rows="4"
                    disabled={isSubmitting}
                  />
                  
                  {/* Attachments */}
                  <div className="mobsup-attachments-input">
                    <label className="mobsup-attach-btn">
                      <FaPaperclip />
                      <span>Attach Files</span>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e, true)}
                        disabled={isSubmitting}
                        accept="image/*,.pdf"
                      />
                    </label>
                    
                    {responseAttachments.length > 0 && (
                      <div className="mobsup-attachments-preview">
                        {responseAttachments.map((file, index) => (
                          <div key={index} className="mobsup-attachment-preview">
                            {getFileIcon(file.name)}
                            <span className="mobsup-filename">{file.name}</span>
                            <button
                              type="button"
                              className="mobsup-remove-attachment"
                              onClick={() => handleRemoveFile(index, true)}
                              disabled={isSubmitting}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mobsup-reply-actions">
                    <button
                      className="mobsup-send-btn"
                      onClick={() => handleAddResponse(selectedTicket._id)}
                      disabled={isSubmitting || (!newResponse.trim() && responseAttachments.length === 0)}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Reply'}
                    </button>
                    <button
                      className="mobsup-cancel-btn"
                      onClick={() => {
                        setNewResponse('');
                        setResponseAttachments([]);
                      }}
                      disabled={isSubmitting}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mobsup-modal-footer">
              <button 
                className="mobsup-close-ticket-modal-btn"
                onClick={() => closeTicket(selectedTicket._id)}
                disabled={selectedTicket.status === 'closed'}
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Ticket Modal */}
      {showCreateForm && (
        <div className="mobsup-create-ticket-modal">
          <div className="mobsup-modal-content">
            <div className="mobsup-modal-header">
              <h2>Create New Ticket</h2>
              <button 
                className="mobsup-close-modal"
                onClick={() => !isSubmitting && setShowCreateForm(false)}
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateTicket}>
              <div className="mobsup-modal-body">
                <div className="mobsup-form-group">
                  <label>Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="delivery">Delivery</option>
                    <option value="payment">Payment</option>
                    <option value="product">Product</option>
                    <option value="account">Account</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="mobsup-form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    required
                    disabled={isSubmitting}
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="mobsup-form-group">
                  <label>Description</label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                    required
                    disabled={isSubmitting}
                    rows="5"
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>

                <div className="mobsup-form-group">
                  <label>Attachments (Optional)</label>
                  <div className="mobsup-file-input-container">
                    <label className="mobsup-file-input-label">
                      <FaPaperclip />
                      <span>Choose Files</span>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e, false)}
                        disabled={isSubmitting}
                        accept="image/*,.pdf"
                      />
                    </label>
                    
                    {newTicket.images.length > 0 && (
                      <div className="mobsup-attachments-preview">
                        {newTicket.images.map((file, index) => (
                          <div key={index} className="mobsup-attachment-preview">
                            {getFileIcon(file.name)}
                            <span className="mobsup-filename">{file.name}</span>
                            <button
                              type="button"
                              className="mobsup-remove-attachment"
                              onClick={() => handleRemoveFile(index, false)}
                              disabled={isSubmitting}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mobsup-modal-footer">
                <button
                  type="button"
                  className="mobsup-cancel-btn"
                  onClick={() => !isSubmitting && setShowCreateForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mobsup-submit-btn"
                  disabled={isSubmitting || !newTicket.subject || !newTicket.description}
                >
                  {isSubmitting ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileSupport;