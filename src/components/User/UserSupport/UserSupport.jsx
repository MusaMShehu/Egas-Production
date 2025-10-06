// components/Support.js
import React, { useState, useEffect } from "react";
import { FaPaperclip, FaSearch, FaTimes } from "react-icons/fa";
import "./UserSupport.css";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newResponse, setNewResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "delivery",
    description: "",
    attachments: [],
  });

  // API base URL
  const API_BASE_URL = "https://egas-server-1.onrender.com/api/v1";

  // Auth headers helper
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  // Fetch tickets
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/support/tickets`, {
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error(`Failed: ${response.status}`);

        const data = await response.json();
        setTickets(data.data || []);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load support tickets. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewTicket({
      ...newTicket,
      attachments: [...newTicket.attachments, ...files],
    });
  };

  // Create ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("subject", newTicket.subject);
      formData.append("category", newTicket.category);
      formData.append("description", newTicket.description);
      newTicket.attachments.forEach((file) =>
        formData.append("attachments", file)
      );

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/support/tickets`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();
      setTickets((prev) => [data.data, ...prev]);

      setShowCreateForm(false);
      setNewTicket({
        subject: "",
        category: "delivery",
        description: "",
        attachments: [],
      });
      alert("Support ticket created successfully!");
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError("Failed to create ticket. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add response
  const handleAddResponse = async (_id) => {
    if (!newResponse.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/support/tickets/response/${_id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ message: newResponse }),
        }
      );

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();
      setTickets((prev) => prev.map((t) => (t._id === _id ? data.data : t)));
      if (selectedTicket && selectedTicket._id === _id) {
        setSelectedTicket(data.data);
      }

      setNewResponse("");
      alert("Response added!");
    } catch (err) {
      console.error("Error adding response:", err);
      setError("Failed to add response.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close ticket
  const closeTicket = async (_id) => {
    if (!window.confirm("Are you sure you want to close this ticket?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/support/tickets/${_id}/close`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          // body: JSON.stringify(),
        }
      );

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();
      setTickets((prev) => prev.map((t) => (t._id === _id ? data.data : t)));
      if (selectedTicket && selectedTicket._id === _id) {
        setSelectedTicket(data.data);
      }

      alert("Ticket closed successfully!");
    } catch (err) {
      console.error("Error closing ticket:", err);
      setError("Failed to close ticket.");
    }
  };

  // Helpers
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusClass = (status) =>
    ({
      open: "status-open",
      "in-progress": "status-in-progress",
      resolved: "status-resolved",
      closed: "status-closed",
    }[status] || "status-open");

  const getStatusText = (status) =>
    ({
      open: "Open",
      "in-progress": "In Progress",
      resolved: "Resolved",
      closed: "Closed",
    }[status] || status);

  const getCategoryText = (category) =>
    ({
      delivery: "Delivery",
      payment: "Payment",
      product: "Product",
      account: "Account",
      other: "Other",
    }[category] || category);

  // Search filter
  const filteredTickets = tickets.filter(
    (t) =>
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userId = localStorage.getItem("userId"); // set on login

  if (isLoading)
    return (
      <div className="support-page loading">Loading support tickets...</div>
    );

  return (
    <div className="sup-support-page">
      <div className="sup-dashboard-header">
        <h1>Support Center</h1>
        <div className="sup-header-actions">
          <div className="sup-search-bar">
            <FaSearch className="sup-fas" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="sup-btn-primary"
            onClick={() => setShowCreateForm(true)}
            disabled={isSubmitting}
          >
            <i className="sup-fas fa-plus"></i> New Ticket
          </button>
        </div>
      </div>

      {error && (
        <div className="sup-error-message">
          {error}
          <button onClick={() => setError("")} className="sup-close-error">
            <FaTimes className="sup-fas" />
          </button>
        </div>
      )}

      <div className="sup-support-content">
        {/* Ticket list */}
        <div className="sup-tickets-section">
          <div className="sup-section-header">
            <h2>Your Support Tickets</h2>
            <span className="sup-count-badge">{tickets.length} tickets</span>
          </div>

          {filteredTickets.length > 0 ? (
            <div className="sup-tickets-list">
              {filteredTickets.map((ticket) => (
                <div key={ticket._id} className="sup-ticket-card">
                  <div className="sup-ticket-header">
                    <div className="sup-ticket-info">
                      <div className="sup-ticket-id">#{ticket.ticketId}</div>
                      <div className="sup-ticket-category">
                        {getCategoryText(ticket.category)}
                      </div>
                    </div>
                    <div
                      className={`sup-ticket-status ${getStatusClass(
                        ticket.status
                      )}`}
                    >
                      {getStatusText(ticket.status)}
                    </div>
                  </div>

                  <div className="sup-ticket-subject">{ticket.subject}</div>
                  <div className="sup-ticket-description">
                    {ticket.description.length > 150
                      ? `${ticket.description.substring(0, 150)}...`
                      : ticket.description}
                  </div>

                  <div className="sup-ticket-meta">
                    <div className="sup-ticket-date">
                      Created: {formatDate(ticket.createdAt)}
                    </div>
                    <div className="sup-ticket-responses">
                      {ticket.responses?.length || 0} responses
                    </div>
                  </div>

                  <div className="sup-ticket-actions">
                    <button
                      className="sup-btn-primary"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      View Details
                    </button>
                    {ticket.status !== "closed" && (
                      <button
                        className="sup-btn-warning"
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
            <div className="sup-no-tickets">
              <p>No tickets found.</p>
              <button
                className="sup-btn-primary"
                onClick={() => setShowCreateForm(true)}
              >
                Create Ticket
              </button>
            </div>
          )}
        </div>

        {/* Ticket detail MODAL */}
        {selectedTicket && (
          <div className="sup-ticket-detail-overlay">
            <div className="sup-ticket-detail-modal">
              <div className="sup-ticket-detail-content">
                <div className="sup-detail-header">
                  <h2>Ticket #{selectedTicket.ticketId}</h2>
                  <button
                    className="sup-close-btn"
                    onClick={() => setSelectedTicket(null)}
                  >
                    <FaTimes className="sup-fas" />
                  </button>
                </div>

                <div className="sup-detail-body">
                  <div className="sup-ticket-info">
                    <div className="sup-info-grid">
                      <div className="sup-info-item">
                        <label>Subject:</label>
                        <span>{selectedTicket.subject}</span>
                      </div>
                      <div className="sup-info-item">
                        <label>Category:</label>
                        <span>{getCategoryText(selectedTicket.category)}</span>
                      </div>
                      <div className="sup-info-item">
                        <label>Status:</label>
                        <span className={getStatusClass(selectedTicket.status)}>
                          {getStatusText(selectedTicket.status)}
                        </span>
                      </div>
                      <div className="sup-info-item">
                        <label>Created:</label>
                        <span>{formatDate(selectedTicket.createdAt)}</span>
                      </div>
                      <div className="sup-info-item">
                        <label>Last Updated:</label>
                        <span>{formatDate(selectedTicket.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="sup-ticket-conversation">
                    <h3>Conversation</h3>

                    {/* Initial ticket */}
                    <div className="sup-message user-message">
                      <div className="sup-message-header">
                        <span className="sup-message-sender">You</span>
                        <span className="sup-message-time">
                          {formatDate(selectedTicket.createdAt)}
                        </span>
                      </div>
                      <div className="sup-message-content">
                        <p>{selectedTicket.description}</p>
                        {selectedTicket.attachments?.length > 0 && (
                          <div className="sup-message-attachments">
                            <strong>Attachments:</strong>
                            {selectedTicket.attachments.map((file, i) => (
                              <div key={i} className="sup-attachment">
                                <FaPaperclip className="sup-fas" />
                                <a
                                  href={file}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {file}
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Responses */}
                    {selectedTicket.responses?.map((response) => (
                      <div
                        key={response._id}
                        className={`sup-message ${
                          response.user && response.user._id === userId
                            ? "user-message"
                            : "agent-message"
                        }`}
                      >
                        <div className="sup-message-header">
                          <span className="sup-message-sender">
                            {response.user?.name || "Support Agent"}
                          </span>
                          <span className="sup-message-time">
                            {formatDate(response.createdAt)}
                          </span>
                        </div>
                        <div className="sup-message-content">
                          <p>{response.message}</p>
                          {response.attachments?.length > 0 && (
                            <div className="sup-message-attachments">
                              <strong>Attachments:</strong>
                              {response.attachments.map((file, i) => (
                                <div key={i} className="sup-attachment">
                                  <FaPaperclip className="sup-fas" />
                                  <a
                                    href={file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {file}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add response */}
                    {selectedTicket.status !== "closed" && (
                      <div className="sup-response-form">
                        <h4>Add Response</h4>
                        <textarea
                          value={newResponse}
                          onChange={(e) => setNewResponse(e.target.value)}
                          placeholder="Type your response..."
                          rows="4"
                          disabled={isSubmitting}
                        />
                        <div className="sup-form-actions">
                          <button
                            className="sup-btn-primary"
                            onClick={() =>
                              handleAddResponse(selectedTicket._id)
                            }
                            disabled={isSubmitting || !newResponse.trim()}
                          >
                            {isSubmitting ? "Sending..." : "Send Response"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create ticket modal */}
      {showCreateForm && (
        <div className="sup-support-modal-overlay">
          <div className="sup-support-modal-content">
            <div className="sup-support-modal-header">
              <h2>Create Ticket</h2>
              <button
                className="sup-close-btn"
                onClick={() => !isSubmitting && setShowCreateForm(false)}
                disabled={isSubmitting}
              >
                <FaTimes className="sup-fas" />
              </button>
            </div>
            <form onSubmit={handleCreateTicket}>
              <div className="sup-support-modal-body">
                <div className="sup-form-group">
                  <label>Category</label>
                  <select
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
                <div className="sup-form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={newTicket.subject}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="sup-form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={newTicket.description}
                    onChange={handleInputChange}
                    rows="5"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="sup-form-group">
                  <label>Attachments</label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    disabled={isSubmitting}
                  />
                  {newTicket.attachments.length > 0 && (
                    <div className="sup-attachments-preview">
                      <strong>Selected files:</strong>
                      {newTicket.attachments.map((f, i) => (
                        <div key={i} className="sup-attachment">
                          <FaPaperclip className="sup-fas" /> {f.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="sup-support-modal-footer">
                <button
                  type="button"
                  className="sup-btn-secondary"
                  onClick={() => setShowCreateForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sup-btn-primary"
                  disabled={
                    isSubmitting || !newTicket.subject || !newTicket.description
                  }
                >
                  {isSubmitting ? "Creating..." : "Create Ticket"}
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
