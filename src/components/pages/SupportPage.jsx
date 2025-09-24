// components/pages/SupportPage.js
import React, { useState, useEffect } from 'react';
import { formatDate } from '../../utils/helpers';
import '../../styles/SupportPage.css';

const SupportPage = ({ user, setUser }) => {
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'delivery',
    description: ''
  });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch tickets from backend API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/support/tickets');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setTickets(data.tickets);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load support tickets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user.id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setTicketForm(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    
    if (!ticketForm.subject || !ticketForm.description) {
      setError('Please fill in all required fields');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: ticketForm.subject,
          category: ticketForm.category,
          description: ticketForm.description,
          userId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error(`Ticket creation failed with status: ${response.status}`);
      }

      const newTicket = await response.json();
      
      // Add the new ticket to the local state
      setTickets(prev => [newTicket, ...prev]);
      
      setSuccessMessage(`Ticket #${newTicket.id} created successfully! Our support team will get back to you soon.`);
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Reset form
      setTicketForm({
        subject: '',
        category: 'delivery',
        description: ''
      });
      setShowNewTicket(false);
    } catch (error) {
      console.error('Ticket creation error:', error);
      setError('Failed to create support ticket. Please try again.');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const showTicketDetails = async (ticket) => {
    try {
      // Fetch detailed ticket information
      const response = await fetch(`/api/support/tickets/${ticket.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ticket details: ${response.status}`);
      }
      
      const ticketDetails = await response.json();
      
      // Show detailed information in a modal or alert
      alert(`Ticket Details:\n\nID: ${ticketDetails.id}\nSubject: ${ticketDetails.subject}\nCategory: ${ticketDetails.category}\nStatus: ${ticketDetails.status}\nDate: ${formatDate(ticketDetails.date)}\nLast Updated: ${formatDate(ticketDetails.lastUpdated)}\n\nDescription:\n${ticketDetails.description}`);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      alert('Failed to load ticket details. Please try again.');
    }
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i]);
      }

      const response = await fetch('/api/support/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`File upload failed with status: ${response.status}`);
      }

      const uploadData = await response.json();
      setSuccessMessage('Files uploaded successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // You might want to store the file URLs in state to attach them to the ticket
      console.log('Uploaded files:', uploadData.files);
    } catch (error) {
      console.error('File upload error:', error);
      setError('Failed to upload files. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const fetchFAQs = async () => {
    try {
      const response = await fetch('/api/support/faqs');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch FAQs: ${response.status}`);
      }
      
      const faqs = await response.json();
      // You could display these in a modal or separate page
      alert(`Available FAQs:\n\n${faqs.map(faq => `• ${faq.question}`).join('\n')}`);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      alert('Failed to load FAQs. Please try again.');
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="support-page">
        <div className="support-container">
          <div className="loading-spinner">Loading support tickets...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="support-page">
      <div className="support-container">
        <h2 className="text-xl font-bold mb-6">Support Center</h2>
        
        {/* Success and Error Messages */}
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="support-stats">
          <div 
            className="stat-card new-ticket-card" 
            onClick={() => setShowNewTicket(true)}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <i className="new-ticket-icon fas fa-plus-circle"></i>
                <h3 className="font-semibold">New Support Ticket</h3>
              </div>
            </div>
          </div>
          
          <div className="stat-card open-tickets-card">
            <h3 className="font-semibold mb-2">Open Tickets</h3>
            <p className="stat-value">
              {tickets.filter(ticket => ticket.status === 'open').length}
            </p>
            <button className="stat-action">
              View All
            </button>
          </div>
          
          <div className="stat-card faq-card">
            <h3 className="font-semibold mb-2">FAQ</h3>
            <p className="mb-2">Find answers to common questions</p>
            <button className="stat-action" onClick={fetchFAQs}>
              Browse FAQs
            </button>
          </div>
        </div>
        
        {!showNewTicket ? (
          <div>
            <h3 className="font-semibold mb-4">Recent Tickets</h3>
            <div className="ticket-list">
              {tickets.length > 0 ? (
                tickets.map(ticket => (
                  <div 
                    key={ticket.id} 
                    className="ticket-item"
                    onClick={() => showTicketDetails(ticket)}
                  >
                    <div className="ticket-header">
                      <div>
                        <h4 className="ticket-subject">{ticket.subject}</h4>
                        <p className="ticket-meta">{ticket.category.replace(/^\w/, c => c.toUpperCase())} • {formatDate(ticket.date)}</p>
                      </div>
                      <span className={`ticket-status ${ticket.status === 'open' ? 'status-open' : 'status-resolved'}`}>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </div>
                    <div className="ticket-footer">
                      <p className="ticket-date">Last updated: {formatDate(ticket.lastUpdated, true)}</p>
                      <button 
                        className="view-ticket" 
                        onClick={(e) => {
                          e.stopPropagation();
                          showTicketDetails(ticket);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-tickets">
                  <p>No support tickets found.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="ticket-form">
            <h3 className="font-semibold mb-4">Create New Ticket</h3>
            <form onSubmit={handleSubmitTicket}>
              <div className="form-group">
                <label className="form-label">Subject *</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="form-input"
                  value={ticketForm.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  id="category" 
                  className="form-input"
                  value={ticketForm.category}
                  onChange={handleInputChange}
                >
                  <option value="delivery">Delivery Issues</option>
                  <option value="payment">Payment Issues</option>
                  <option value="product">Product Questions</option>
                  <option value="account">Account Issues</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea 
                  id="description" 
                  rows="5" 
                  className="form-input form-textarea"
                  value={ticketForm.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label className="form-label">Attachments (optional)</label>
                <input 
                  type="file" 
                  id="ticket-attachments" 
                  className="form-input" 
                  multiple 
                  onChange={handleFileUpload}
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowNewTicket(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportPage;