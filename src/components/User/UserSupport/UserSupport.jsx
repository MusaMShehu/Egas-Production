// components/Support.js
import React, { useState, useEffect } from 'react';
import './UserSupport.css';

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newResponse, setNewResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'delivery',
    description: '',
    attachments: []
  });

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = 'https://your-api-url.com/api';

  // Fetch support tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would use your actual API endpoint
        // const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // For demonstration, we'll use a timeout to simulate API call
        setTimeout(() => {
          // Mock data that matches the schema
          const mockTickets = [
            {
              _id: '1',
              ticketId: 'TCK-1001',
              subject: 'Delivery Delay Issue',
              category: 'delivery',
              description: 'My order was supposed to be delivered yesterday but it hasn\'t arrived yet. Can you please check the status?',
              status: 'in-progress',
              attachments: [],
              responses: [
                {
                  _id: '1',
                  user: { name: 'Support Agent', _id: 'agent1' },
                  message: 'Thank you for reaching out. We\'ve checked your order and it\'s currently out for delivery. You should receive it within the next 2 hours.',
                  attachments: [],
                  createdAt: new Date('2023-05-16T10:30:00')
                }
              ],
              createdAt: new Date('2023-05-16T09:15:00'),
              updatedAt: new Date('2023-05-16T10:30:00')
            },
            {
              _id: '2',
              ticketId: 'TCK-1002',
              subject: 'Payment Refund Request',
              category: 'payment',
              description: 'I need to request a refund for my cancelled order #EG-1003. The payment was made via credit card.',
              status: 'open',
              attachments: ['receipt.pdf'],
              responses: [],
              createdAt: new Date('2023-05-15T14:20:00'),
              updatedAt: new Date('2023-05-15T14:20:00')
            },
            {
              _id: '3',
              ticketId: 'TCK-1003',
              subject: 'Gas Cylinder Quality Issue',
              category: 'product',
              description: 'The gas cylinder I received seems to have a leakage issue. I can smell gas around the valve area.',
              status: 'resolved',
              attachments: ['image1.jpg', 'image2.jpg'],
              responses: [
                {
                  _id: '2',
                  user: { name: 'Support Agent', _id: 'agent1' },
                  message: 'We apologize for the inconvenience. Our technician will visit your location within 2 hours to replace the cylinder.',
                  attachments: [],
                  createdAt: new Date('2023-05-14T11:45:00')
                },
                {
                  _id: '3',
                  user: { name: 'John Doe', _id: 'user123' },
                  message: 'Thank you! The technician came and replaced the cylinder. Everything is working fine now.',
                  attachments: [],
                  createdAt: new Date('2023-05-14T15:20:00')
                }
              ],
              createdAt: new Date('2023-05-14T10:30:00'),
              updatedAt: new Date('2023-05-14T15:20:00')
            }
          ];
          setTickets(mockTickets);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to load support tickets. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({
      ...newTicket,
      [name]: value
    });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewTicket({
      ...newTicket,
      attachments: [...newTicket.attachments, ...files.map(file => file.name)]
    });
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to create a ticket
      // const formData = new FormData();
      // formData.append('subject', newTicket.subject);
      // formData.append('category', newTicket.category);
      // formData.append('description', newTicket.description);
      
      // newTicket.attachments.forEach(file => {
      //   formData.append('attachments', file);
      // });

      // const response = await fetch(`${API_BASE_URL}/support/tickets`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: formData
      // });

      // For demo purposes, add to local state
      const newTicketData = {
        _id: `ticket-${Math.floor(Math.random() * 1000)}`,
        ticketId: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        ...newTicket,
        status: 'open',
        responses: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setTickets(prev => [newTicketData, ...prev]);
      setShowCreateForm(false);
      setNewTicket({
        subject: '',
        category: 'delivery',
        description: '',
        attachments: []
      });
      
      alert('Support ticket created successfully!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError('Failed to create support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddResponse = async (ticketId) => {
    if (!newResponse.trim()) return;

    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to add a response
      // await fetch(`${API_BASE_URL}/support/tickets/${ticketId}/respond`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({ message: newResponse })
      // });

      // For demo purposes, update local state
      setTickets(prev => prev.map(ticket => {
        if (ticket._id === ticketId) {
          return {
            ...ticket,
            responses: [
              ...ticket.responses,
              {
                _id: `response-${Math.floor(Math.random() * 1000)}`,
                user: { name: 'You', _id: 'current-user' },
                message: newResponse,
                attachments: [],
                createdAt: new Date()
              }
            ],
            status: ticket.status === 'resolved' ? 'in-progress' : ticket.status,
            updatedAt: new Date()
          };
        }
        return ticket;
      }));

      setNewResponse('');
      alert('Response added successfully!');
    } catch (error) {
      console.error('Error adding response:', error);
      setError('Failed to add response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeTicket = async (ticketId) => {
    if (window.confirm('Are you sure you want to close this ticket?')) {
      try {
        // In a real app, this would be an API call to close the ticket
        // await fetch(`${API_BASE_URL}/support/tickets/${ticketId}/close`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });

        // Update local state for demo purposes
        setTickets(prev => prev.map(ticket => 
          ticket._id === ticketId 
            ? { ...ticket, status: 'closed', updatedAt: new Date() } 
            : ticket
        ));

        if (selectedTicket && selectedTicket._id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: 'closed' });
        }
      } catch (error) {
        console.error('Error closing ticket:', error);
        setError('Failed to close ticket. Please try again.');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'in-progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open': return 'Open';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const getCategoryText = (category) => {
    switch (category) {
      case 'delivery': return 'Delivery';
      case 'payment': return 'Payment';
      case 'product': return 'Product';
      case 'account': return 'Account';
      case 'other': return 'Other';
      default: return category;
    }
  };

  // Filter tickets by status
  const filteredTickets = tickets;

  if (isLoading) {
    return <div className="support-page loading">Loading support tickets...</div>;
  }

  return (
    <div className="support-page">
      <div className="dashboard-header">
        <h1>Support Center</h1>
        <div className="header-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search tickets..." />
          </div>
          <button 
            className="btn-primary"
            onClick={() => setShowCreateForm(true)}
            disabled={isSubmitting}
          >
            <i className="fas fa-plus"></i> New Ticket
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="support-content">
        <div className="tickets-section">
          <div className="section-header">
            <h2>Your Support Tickets</h2>
            <span className="count-badge">{tickets.length} tickets</span>
          </div>

          {tickets.length > 0 ? (
            <div className="tickets-list">
              {tickets.map((ticket) => (
                <div key={ticket._id} className="ticket-card">
                  <div className="ticket-header">
                    <div className="ticket-info">
                      <div className="ticket-id">#{ticket.ticketId}</div>
                      <div className="ticket-category">
                        {getCategoryText(ticket.category)}
                      </div>
                    </div>
                    <div className={`ticket-status ${getStatusClass(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </div>
                  </div>
                  
                  <div className="ticket-subject">{ticket.subject}</div>
                  <div className="ticket-description">
                    {ticket.description.length > 150 
                      ? `${ticket.description.substring(0, 150)}...` 
                      : ticket.description
                    }
                  </div>
                  
                  <div className="ticket-meta">
                    <div className="ticket-date">
                      Created: {formatDate(ticket.createdAt)}
                    </div>
                    <div className="ticket-responses">
                      {ticket.responses.length} responses
                    </div>
                  </div>
                  
                  <div className="ticket-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      View Details
                    </button>
                    {ticket.status !== 'closed' && (
                      <button 
                        className="btn-warning"
                        onClick={() => closeTicket(ticket._id)}
                      >
                        Close Ticket
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-tickets">
              <p>You don't have any support tickets yet.</p>
              <button 
                className="btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Your First Ticket
              </button>
            </div>
          )}
        </div>

        {/* Ticket Detail View */}
        {selectedTicket && (
          <div className="ticket-detail">
            <div className="detail-header">
              <h2>Ticket #{selectedTicket.ticketId}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedTicket(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="ticket-info">
              <div className="info-grid">
                <div className="info-item">
                  <label>Subject:</label>
                  <span>{selectedTicket.subject}</span>
                </div>
                <div className="info-item">
                  <label>Category:</label>
                  <span>{getCategoryText(selectedTicket.category)}</span>
                </div>
                <div className="info-item">
                  <label>Status:</label>
                  <span className={getStatusClass(selectedTicket.status)}>
                    {getStatusText(selectedTicket.status)}
                  </span>
                </div>
                <div className="info-item">
                  <label>Created:</label>
                  <span>{formatDate(selectedTicket.createdAt)}</span>
                </div>
                <div className="info-item">
                  <label>Last Updated:</label>
                  <span>{formatDate(selectedTicket.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="ticket-conversation">
              <div className="conversation-header">
                <h3>Conversation</h3>
              </div>

              {/* Initial ticket message */}
              <div className="message user-message">
                <div className="message-header">
                  <span className="message-sender">You</span>
                  <span className="message-time">
                    {formatDate(selectedTicket.createdAt)}
                  </span>
                </div>
                <div className="message-content">
                  <p>{selectedTicket.description}</p>
                  {selectedTicket.attachments.length > 0 && (
                    <div className="message-attachments">
                      <strong>Attachments:</strong>
                      {selectedTicket.attachments.map((file, index) => (
                        <div key={index} className="attachment">
                          <i className="fas fa-paperclip"></i> {file}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Responses */}
              {selectedTicket.responses.map((response) => (
                <div 
                  key={response._id} 
                  className={`message ${response.user._id === 'current-user' ? 'user-message' : 'agent-message'}`}
                >
                  <div className="message-header">
                    <span className="message-sender">
                      {response.user.name}
                    </span>
                    <span className="message-time">
                      {formatDate(response.createdAt)}
                    </span>
                  </div>
                  <div className="message-content">
                    <p>{response.message}</p>
                    {response.attachments && response.attachments.length > 0 && (
                      <div className="message-attachments">
                        <strong>Attachments:</strong>
                        {response.attachments.map((file, index) => (
                          <div key={index} className="attachment">
                            <i className="fas fa-paperclip"></i> {file}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add response form */}
              {selectedTicket.status !== 'closed' && (
                <div className="response-form">
                  <h4>Add Response</h4>
                  <textarea
                    value={newResponse}
                    onChange={(e) => setNewResponse(e.target.value)}
                    placeholder="Type your response here..."
                    rows="4"
                    disabled={isSubmitting}
                  />
                  <div className="form-actions">
                    <button 
                      className="btn-primary"
                      onClick={() => handleAddResponse(selectedTicket._id)}
                      disabled={isSubmitting || !newResponse.trim()}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Response'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Support Ticket</h2>
              <button 
                className="close-btn" 
                onClick={() => !isSubmitting && setShowCreateForm(false)}
                disabled={isSubmitting}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select 
                    id="category" 
                    name="category"
                    value={newTicket.category}
                    onChange={handleInputChange}
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
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={newTicket.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={newTicket.description}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                    rows="5"
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="attachments">Attachments (Optional)</label>
                  <input
                    type="file"
                    id="attachments"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isSubmitting}
                  />
                  {newTicket.attachments.length > 0 && (
                    <div className="attachments-preview">
                      <strong>Selected files:</strong>
                      {newTicket.attachments.map((file, index) => (
                        <div key={index} className="attachment">
                          <i className="fas fa-paperclip"></i> {file}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
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

export default Support;