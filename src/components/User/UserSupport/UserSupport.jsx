// // components/Support.js
// import React, { useState, useEffect } from "react";
// import { FaPaperclip, FaSearch, FaTimes } from "react-icons/fa";
// import "./UserSupport.css";
// import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

// const Support = () => {
//   const [tickets, setTickets] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [newResponse, setNewResponse] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   const [newTicket, setNewTicket] = useState({
//     subject: "",
//     category: "delivery",
//     description: "",
//     attachments: [],
//   });

//   // API base URL
//   const API_BASE_URL = "https://egas-server-1.onrender.com/api/v1";

//   // Auth headers helper
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token");
//     return {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };
//   };

//   // Fetch tickets
//   useEffect(() => {
//     const fetchTickets = async () => {
//       setIsLoading(true);
//       infoToast("Loading your support tickets...");
      
//       try {
//         const response = await fetch(`${API_BASE_URL}/support/tickets`, {
//           headers: getAuthHeaders(),
//         });

//         if (!response.ok) throw new Error(`Failed: ${response.status}`);

//         const data = await response.json();
//         setTickets(data.data || []);
        
//         if (data.data && data.data.length === 0) {
//           infoToast("No support tickets found. Create your first ticket!");
//         } else {
//           successToast(`Loaded ${data.data.length} support tickets successfully`);
//         }
//       } catch (err) {
//         console.error("Error fetching tickets:", err);
//         const errorMsg = "Failed to load support tickets. Please try again.";
//         setError(errorMsg);
//         errorToast(errorMsg);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchTickets();
//   }, []);

//   // Input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setNewTicket({ ...newTicket, [name]: value });
//   };

//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     setNewTicket({
//       ...newTicket,
//       attachments: [...newTicket.attachments, ...files],
//     });
//     successToast(`Added ${files.length} file(s) to attachments`);
//   };

//   // Create ticket
//   const handleCreateTicket = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setError("");
//     infoToast("Creating support ticket...");

//     try {
//       const formData = new FormData();
//       formData.append("subject", newTicket.subject);
//       formData.append("category", newTicket.category);
//       formData.append("description", newTicket.description);
//       newTicket.attachments.forEach((file) =>
//         formData.append("attachments", file)
//       );

//       const token = localStorage.getItem("token");
//       const response = await fetch(`${API_BASE_URL}/support/tickets`, {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (!response.ok) throw new Error(`Failed: ${response.status}`);

//       const data = await response.json();
//       setTickets((prev) => [data.data, ...prev]);

//       setShowCreateForm(false);
//       setNewTicket({
//         subject: "",
//         category: "delivery",
//         description: "",
//         attachments: [],
//       });
//       successToast("Support ticket created successfully!");
//     } catch (err) {
//       console.error("Error creating ticket:", err);
//       const errorMsg = "Failed to create ticket. Please try again.";
//       setError(errorMsg);
//       errorToast(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Add response
//   const handleAddResponse = async (_id) => {
//     if (!newResponse.trim()) {
//       warningToast("Please enter a response message");
//       return;
//     }

//     setIsSubmitting(true);
//     infoToast("Sending your response...");
    
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/support/tickets/response/${_id}`,
//         {
//           method: "PUT",
//           headers: getAuthHeaders(),
//           body: JSON.stringify({ message: newResponse }),
//         }
//       );

//       if (!response.ok) throw new Error(`Failed: ${response.status}`);

//       const data = await response.json();
//       setTickets((prev) => prev.map((t) => (t._id === _id ? data.data : t)));
//       if (selectedTicket && selectedTicket._id === _id) {
//         setSelectedTicket(data.data);
//       }

//       setNewResponse("");
//       successToast("Response sent successfully!");
//     } catch (err) {
//       console.error("Error adding response:", err);
//       const errorMsg = "Failed to send response. Please try again.";
//       setError(errorMsg);
//       errorToast(errorMsg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Close ticket
//   const closeTicket = async (_id) => {
//     const ticket = tickets.find(t => t._id === _id);
//     if (!ticket) return;

//     if (!window.confirm("Are you sure you want to close this ticket?")) {
//       infoToast("Ticket closure cancelled");
//       return;
//     }

//     warningToast(`Closing ticket #${ticket.ticketId}...`);

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/support/tickets/${_id}/close`,
//         {
//           method: "PUT",
//           headers: getAuthHeaders(),
//         }
//       );

//       if (!response.ok) throw new Error(`Failed: ${response.status}`);

//       const data = await response.json();
//       setTickets((prev) => prev.map((t) => (t._id === _id ? data.data : t)));
//       if (selectedTicket && selectedTicket._id === _id) {
//         setSelectedTicket(data.data);
//       }

//       successToast("Ticket closed successfully!");
//     } catch (err) {
//       console.error("Error closing ticket:", err);
//       const errorMsg = "Failed to close ticket. Please try again.";
//       setError(errorMsg);
//       errorToast(errorMsg);
//     }
//   };

//   // Helpers
//   const formatDate = (date) =>
//     new Date(date).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });

//   const getStatusClass = (status) =>
//     ({
//       open: "status-open",
//       "in-progress": "status-in-progress",
//       resolved: "status-resolved",
//       closed: "status-closed",
//     }[status] || "status-open");

//   const getStatusText = (status) =>
//     ({
//       open: "Open",
//       "in-progress": "In Progress",
//       resolved: "Resolved",
//       closed: "Closed",
//     }[status] || status);

//   const getCategoryText = (category) =>
//     ({
//       delivery: "Delivery",
//       payment: "Payment",
//       product: "Product",
//       account: "Account",
//       other: "Other",
//     }[category] || category);

//   // Search filter
//   const filteredTickets = tickets.filter(
//     (t) =>
//       t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       t.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const userId = localStorage.getItem("userId"); // set on login

//   // Event handlers with toast
//   const handleSearchChange = (e) => {
//     setSearchQuery(e.target.value);
//     if (e.target.value) {
//       infoToast(`Searching for "${e.target.value}"...`);
//     }
//   };

//   const handleCreateFormOpen = () => {
//     setShowCreateForm(true);
//     infoToast("Opening ticket creation form...");
//   };

//   const handleCreateFormClose = () => {
//     if (!isSubmitting) {
//       setShowCreateForm(false);
//       infoToast("Ticket creation cancelled");
//     }
//   };

//   const handleViewTicketDetails = (ticket) => {
//     setSelectedTicket(ticket);
//     infoToast(`Viewing ticket #${ticket.ticketId}`);
//   };

//   const handleCloseTicketDetails = () => {
//     setSelectedTicket(null);
//     infoToast("Ticket details closed");
//   };

//   const handleClearError = () => {
//     setError("");
//     infoToast("Error message cleared");
//   };

//   const handleRemoveAttachment = (index) => {
//     const updatedAttachments = newTicket.attachments.filter((_, i) => i !== index);
//     setNewTicket({
//       ...newTicket,
//       attachments: updatedAttachments
//     });
//     warningToast("Attachment removed");
//   };

//   if (isLoading)
//     return (
//       <div className="support-page loading">Loading support tickets...</div>
//     );

//   return (
//     <div className="sup-support-page">
//       <div className="sup-dashboard-header">
//         <h1>Support Center</h1>
//         <div className="sup-header-actions">
//           <div className="sup-search-bar">
//             <FaSearch className="sup-fas" />
//             <input
//               type="text"
//               placeholder="Search tickets..."
//               value={searchQuery}
//               onChange={handleSearchChange}
//             />
//             {searchQuery && (
//               <button 
//                 className="sup-clear-search"
//                 onClick={() => {
//                   setSearchQuery("");
//                   infoToast("Search cleared");
//                 }}
//                 title="Clear search"
//               >
//                 <FaTimes />
//               </button>
//             )}
//           </div>
//           <button
//             className="sup-btn-primary"
//             onClick={handleCreateFormOpen}
//             disabled={isSubmitting}
//           >
//             <i className="sup-fas fa-plus"></i> New Ticket
//           </button>
//         </div>
//       </div>

//       {error && (
//         <div className="sup-error-message">
//           {error}
//           <button onClick={handleClearError} className="sup-close-error">
//             <FaTimes className="sup-fas" />
//           </button>
//         </div>
//       )}

//       <div className="sup-support-content">
//         {/* Ticket list */}
//         <div className="sup-tickets-section">
//           <div className="sup-section-header">
//             <h2>Your Support Tickets</h2>
//             <span className="sup-count-badge">{tickets.length} tickets</span>
//           </div>

//           {filteredTickets.length > 0 ? (
//             <div className="sup-tickets-list">
//               {filteredTickets.map((ticket) => (
//                 <div key={ticket._id} className="sup-ticket-card">
//                   <div className="sup-ticket-header">
//                     <div className="sup-ticket-info">
//                       <div className="sup-ticket-id">#{ticket.ticketId}</div>
//                       <div className="sup-ticket-category">
//                         {getCategoryText(ticket.category)}
//                       </div>
//                     </div>
//                     <div
//                       className={`sup-ticket-status ${getStatusClass(
//                         ticket.status
//                       )}`}
//                     >
//                       {getStatusText(ticket.status)}
//                     </div>
//                   </div>

//                   <div className="sup-ticket-subject">{ticket.subject}</div>
//                   <div className="sup-ticket-description">
//                     {ticket.description.length > 150
//                       ? `${ticket.description.substring(0, 150)}...`
//                       : ticket.description}
//                   </div>

//                   <div className="sup-ticket-meta">
//                     <div className="sup-ticket-date">
//                       Created: {formatDate(ticket.createdAt)}
//                     </div>
//                     <div className="sup-ticket-responses">
//                       {ticket.responses?.length || 0} responses
//                     </div>
//                   </div>

//                   <div className="sup-ticket-actions">
//                     <button
//                       className="sup-btn-primary"
//                       onClick={() => handleViewTicketDetails(ticket)}
//                     >
//                       View Details
//                     </button>
//                     {ticket.status !== "closed" && (
//                       <button
//                         className="sup-btn-warning"
//                         onClick={() => closeTicket(ticket._id)}
//                       >
//                         Close Ticket
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="sup-no-tickets">
//               <p>No tickets found.</p>
//               {searchQuery ? (
//                 <button
//                   className="sup-btn-secondary"
//                   onClick={() => {
//                     setSearchQuery("");
//                     infoToast("Search cleared");
//                   }}
//                 >
//                   Clear Search
//                 </button>
//               ) : (
//                 <button
//                   className="sup-btn-primary"
//                   onClick={handleCreateFormOpen}
//                 >
//                   Create Your First Ticket
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Ticket detail MODAL */}
//         {selectedTicket && (
//           <div className="sup-ticket-detail-overlay">
//             <div className="sup-ticket-detail-modal">
//               <div className="sup-ticket-detail-content">
//                 <div className="sup-detail-header">
//                   <h2>Ticket #{selectedTicket.ticketId}</h2>
//                   <button
//                     className="sup-close-btn"
//                     onClick={handleCloseTicketDetails}
//                   >
//                     <FaTimes className="sup-fas" />
//                   </button>
//                 </div>

//                 <div className="sup-detail-body">
//                   <div className="sup-ticket-info">
//                     <div className="sup-info-grid">
//                       <div className="sup-info-item">
//                         <label>Subject:</label>
//                         <span>{selectedTicket.subject}</span>
//                       </div>
//                       <div className="sup-info-item">
//                         <label>Category:</label>
//                         <span>{getCategoryText(selectedTicket.category)}</span>
//                       </div>
//                       <div className="sup-info-item">
//                         <label>Status:</label>
//                         <span className={getStatusClass(selectedTicket.status)}>
//                           {getStatusText(selectedTicket.status)}
//                         </span>
//                       </div>
//                       <div className="sup-info-item">
//                         <label>Created:</label>
//                         <span>{formatDate(selectedTicket.createdAt)}</span>
//                       </div>
//                       <div className="sup-info-item">
//                         <label>Last Updated:</label>
//                         <span>{formatDate(selectedTicket.updatedAt)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="sup-ticket-conversation">
//                     <h3>Conversation</h3>

//                     {/* Initial ticket */}
//                     <div className="sup-message user-message">
//                       <div className="sup-message-header">
//                         <span className="sup-message-sender">You</span>
//                         <span className="sup-message-time">
//                           {formatDate(selectedTicket.createdAt)}
//                         </span>
//                       </div>
//                       <div className="sup-message-content">
//                         <p>{selectedTicket.description}</p>
//                         {selectedTicket.attachments?.length > 0 && (
//                           <div className="sup-message-attachments">
//                             <strong>Attachments:</strong>
//                             {selectedTicket.attachments.map((file, i) => (
//                               <div key={i} className="sup-attachment">
//                                 <FaPaperclip className="sup-fas" />
//                                 <a
//                                   href={file}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   onClick={() => infoToast("Downloading attachment...")}
//                                 >
//                                   {file}
//                                 </a>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Responses */}
//                     {selectedTicket.responses?.map((response) => (
//                       <div
//                         key={response._id}
//                         className={`sup-message ${
//                           response.user && response.user._id === userId
//                             ? "user-message"
//                             : "agent-message"
//                         }`}
//                       >
//                         <div className="sup-message-header">
//                           <span className="sup-message-sender">
//                             {response.user?.name || "Support Agent"}
//                           </span>
//                           <span className="sup-message-time">
//                             {formatDate(response.createdAt)}
//                           </span>
//                         </div>
//                         <div className="sup-message-content">
//                           <p>{response.message}</p>
//                           {response.attachments?.length > 0 && (
//                             <div className="sup-message-attachments">
//                               <strong>Attachments:</strong>
//                               {response.attachments.map((file, i) => (
//                                 <div key={i} className="sup-attachment">
//                                   <FaPaperclip className="sup-fas" />
//                                   <a
//                                     href={file}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     onClick={() => infoToast("Downloading attachment...")}
//                                   >
//                                     {file}
//                                   </a>
//                                 </div>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}

//                     {/* Add response */}
//                     {selectedTicket.status !== "closed" && (
//                       <div className="sup-response-form">
//                         <h4>Add Response</h4>
//                         <textarea
//                           value={newResponse}
//                           onChange={(e) => setNewResponse(e.target.value)}
//                           placeholder="Type your response..."
//                           rows="4"
//                           disabled={isSubmitting}
//                         />
//                         <div className="sup-form-actions">
//                           <button
//                             className="sup-btn-primary"
//                             onClick={() =>
//                               handleAddResponse(selectedTicket._id)
//                             }
//                             disabled={isSubmitting || !newResponse.trim()}
//                           >
//                             {isSubmitting ? "Sending..." : "Send Response"}
//                           </button>
//                           <button
//                             className="sup-btn-secondary"
//                             onClick={() => {
//                               setNewResponse("");
//                               infoToast("Response cleared");
//                             }}
//                             disabled={isSubmitting}
//                           >
//                             Clear
//                           </button>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Create ticket modal */}
//       {showCreateForm && (
//         <div className="sup-support-modal-overlay">
//           <div className="sup-support-modal-content">
//             <div className="sup-support-modal-header">
//               <h2>Create Support Ticket</h2>
//               <button
//                 className="sup-close-btn"
//                 onClick={handleCreateFormClose}
//                 disabled={isSubmitting}
//               >
//                 <FaTimes className="sup-fas" />
//               </button>
//             </div>
//             <form onSubmit={handleCreateTicket}>
//               <div className="sup-support-modal-body">
//                 <div className="sup-form-group">
//                   <label>Category</label>
//                   <select
//                     name="category"
//                     value={newTicket.category}
//                     onChange={handleInputChange}
//                     required
//                     disabled={isSubmitting}
//                   >
//                     <option value="delivery">Delivery</option>
//                     <option value="payment">Payment</option>
//                     <option value="product">Product</option>
//                     <option value="account">Account</option>
//                     <option value="other">Other</option>
//                   </select>
//                 </div>
//                 <div className="sup-form-group">
//                   <label>Subject</label>
//                   <input
//                     type="text"
//                     name="subject"
//                     value={newTicket.subject}
//                     onChange={handleInputChange}
//                     required
//                     disabled={isSubmitting}
//                     placeholder="Enter ticket subject"
//                   />
//                 </div>
//                 <div className="sup-form-group">
//                   <label>Description</label>
//                   <textarea
//                     name="description"
//                     value={newTicket.description}
//                     onChange={handleInputChange}
//                     rows="5"
//                     required
//                     disabled={isSubmitting}
//                     placeholder="Describe your issue in detail..."
//                   />
//                 </div>
//                 <div className="sup-form-group">
//                   <label>Attachments</label>
//                   <input
//                     type="file"
//                     multiple
//                     onChange={handleFileUpload}
//                     disabled={isSubmitting}
//                   />
//                   {newTicket.attachments.length > 0 && (
//                     <div className="sup-attachments-preview">
//                       <strong>Selected files ({newTicket.attachments.length}):</strong>
//                       {newTicket.attachments.map((f, i) => (
//                         <div key={i} className="sup-attachment">
//                           <FaPaperclip className="sup-fas" /> 
//                           {f.name}
//                           <button
//                             type="button"
//                             className="sup-remove-attachment"
//                             onClick={() => handleRemoveAttachment(i)}
//                             disabled={isSubmitting}
//                           >
//                             <FaTimes />
//                           </button>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <div className="sup-support-modal-footer">
//                 <button
//                   type="button"
//                   className="sup-btn-secondary"
//                   onClick={handleCreateFormClose}
//                   disabled={isSubmitting}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="sup-btn-primary"
//                   disabled={
//                     isSubmitting || !newTicket.subject || !newTicket.description
//                   }
//                 >
//                   {isSubmitting ? "Creating..." : "Create Ticket"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Support;


// components/Support.js
import React, { useState, useEffect } from "react";
import { FaPaperclip, FaSearch, FaTimes, FaImage, FaFile, FaTrash } from "react-icons/fa";
import "./UserSupport.css";
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newResponse, setNewResponse] = useState("");
  const [responseAttachments, setResponseAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newTicket, setNewTicket] = useState({
    subject: "",
    category: "delivery",
    description: "",
    images: [],
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

  // Get auth headers for multipart/form-data
  const getAuthHeadersFormData = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Fetch user's tickets only
  const fetchTickets = async () => {
    setIsLoading(true);
    infoToast("Loading your support tickets...");
    
    try {
      const response = await fetch(`${API_BASE_URL}/support`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error(`Failed: ${response.status}`);

      const data = await response.json();
      setTickets(data.data || []);
      
      if (data.data && data.data.length === 0) {
        infoToast("No support tickets found. Create your first ticket!");
      } else {
        successToast(`Loaded ${data.data.length} support tickets successfully`);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      const errorMsg = "Failed to load support tickets. Please try again.";
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket({ ...newTicket, [name]: value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        errorToast(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    setNewTicket({
      ...newTicket,
      images: [...newTicket.images, ...validFiles],
    });
    if (validFiles.length > 0) {
      successToast(`Added ${validFiles.length} image(s) to ticket`);
    }
  };

  // Create ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    infoToast("Creating support ticket...");

    try {
      const formData = new FormData();
      formData.append("subject", newTicket.subject);
      formData.append("category", newTicket.category);
      formData.append("description", newTicket.description);
      
      // Add images
      newTicket.images.forEach((file) =>
        formData.append("images", file)
      );

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/support`, {
        method: "POST",
        headers: getAuthHeadersFormData(),
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const data = await response.json();
      setTickets((prev) => [data.data, ...prev]);

      setShowCreateForm(false);
      setNewTicket({
        subject: "",
        category: "delivery",
        description: "",
        images: [],
      });
      successToast("Support ticket created successfully!");
    } catch (err) {
      console.error("Error creating ticket:", err);
      const errorMsg = err.message || "Failed to create ticket. Please try again.";
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add response with attachments
  const handleAddResponse = async (id) => {
    if (!newResponse.trim() && responseAttachments.length === 0) {
      warningToast("Please enter a response message or attach a file");
      return;
    }

    setIsSubmitting(true);
    infoToast("Sending your response...");
    
    try {
      const formData = new FormData();
      formData.append("message", newResponse);
      
      // Add response attachments
      responseAttachments.forEach((file) => {
        formData.append("attachments", file);
      });

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/support/${id}/response`,
        {
          method: "PUT",
          headers: getAuthHeadersFormData(),
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const data = await response.json();
      // Update the specific ticket with new response
      const updatedTicket = await fetchTicketDetails(id);
      setTickets((prev) => prev.map((t) => (t._id === id ? updatedTicket : t)));
      if (selectedTicket && selectedTicket._id === id) {
        setSelectedTicket(updatedTicket);
      }

      setNewResponse("");
      setResponseAttachments([]);
      successToast("Response sent successfully!");
    } catch (err) {
      console.error("Error adding response:", err);
      const errorMsg = err.message || "Failed to send response. Please try again.";
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch single ticket details
  const fetchTicketDetails = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/support/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      throw err;
    }
  };

  // Handle response attachment upload
  const handleResponseAttachmentUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        errorToast(`${file.name} exceeds 5MB limit`);
        return false;
      }
      return true;
    });
    
    setResponseAttachments([...responseAttachments, ...validFiles]);
    if (validFiles.length > 0) {
      successToast(`Added ${validFiles.length} attachment(s) to response`);
    }
  };

  // Remove response attachment
  const handleRemoveResponseAttachment = (index) => {
    const updatedAttachments = responseAttachments.filter((_, i) => i !== index);
    setResponseAttachments(updatedAttachments);
    warningToast("Attachment removed from response");
  };

  // View ticket details
  const handleViewTicketDetails = async (ticket) => {
    infoToast(`Loading ticket #${ticket.ticketId}...`);
    try {
      const ticketDetails = await fetchTicketDetails(ticket._id);
      setSelectedTicket(ticketDetails);
    } catch (err) {
      console.error("Error loading ticket details:", err);
      // Fallback to basic ticket data if API fails
      setSelectedTicket(ticket);
      warningToast("Showing cached ticket data. Some details may be outdated.");
    }
  };

  // Close ticket
  const closeTicket = async (id) => {
    const ticket = tickets.find(t => t._id === id);
    if (!ticket) return;

    if (!window.confirm("Are you sure you want to close this ticket?")) {
      infoToast("Ticket closure cancelled");
      return;
    }

    warningToast(`Closing ticket #${ticket.ticketId}...`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/support/${id}/close`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed: ${response.status}`);
      }

      const data = await response.json();
      setTickets((prev) => prev.map((t) => (t._id === id ? data.data : t)));
      if (selectedTicket && selectedTicket._id === id) {
        setSelectedTicket(data.data);
      }

      successToast("Ticket closed successfully!");
    } catch (err) {
      console.error("Error closing ticket:", err);
      const errorMsg = err.message || "Failed to close ticket. Please try again.";
      setError(errorMsg);
      errorToast(errorMsg);
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

  const userId = localStorage.getItem("userId");

  // Event handlers with toast
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      infoToast(`Searching for "${e.target.value}"...`);
    }
  };

  const handleCreateFormOpen = () => {
    setShowCreateForm(true);
    infoToast("Opening ticket creation form...");
  };

  const handleCreateFormClose = () => {
    if (!isSubmitting) {
      setShowCreateForm(false);
      infoToast("Ticket creation cancelled");
    }
  };

  const handleCloseTicketDetails = () => {
    setSelectedTicket(null);
    infoToast("Ticket details closed");
  };

  const handleClearError = () => {
    setError("");
    infoToast("Error message cleared");
  };

  const handleRemoveImage = (index) => {
    const updatedImages = newTicket.images.filter((_, i) => i !== index);
    setNewTicket({
      ...newTicket,
      images: updatedImages
    });
    warningToast("Image removed");
  };

  // Format Cloudinary URL for display
  const formatAttachmentUrl = (attachment) => {
    if (typeof attachment === 'string') {
      return attachment;
    }
    if (attachment && attachment.url) {
      return attachment.url;
    }
    if (attachment && attachment.secure_url) {
      return attachment.secure_url;
    }
    return '';
  };

  // Get attachment name
  const getAttachmentName = (attachment) => {
    if (typeof attachment === 'string') {
      return attachment.split('/').pop() || 'Attachment';
    }
    if (attachment && attachment.original_filename) {
      return attachment.original_filename;
    }
    return 'Attachment';
  };

  // Get file icon based on type
  const getFileIcon = (filename) => {
    if (!filename) return <FaFile />;
    
    const ext = filename.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) {
      return <FaImage />;
    } else if (['pdf'].includes(ext)) {
      return <FaFile className="pdf-icon" />;
    } else if (['doc', 'docx'].includes(ext)) {
      return <FaFile className="doc-icon" />;
    } else {
      return <FaFile />;
    }
  };

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
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                className="sup-clear-search"
                onClick={() => {
                  setSearchQuery("");
                  infoToast("Search cleared");
                }}
                title="Clear search"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            className="sup-btn-primary"
            onClick={handleCreateFormOpen}
            disabled={isSubmitting}
          >
            <i className="sup-fas fa-plus"></i> New Ticket
          </button>
        </div>
      </div>

      {error && (
        <div className="sup-error-message">
          {error}
          <button onClick={handleClearError} className="sup-close-error">
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
                    {ticket.images && ticket.images.length > 0 && (
                      <div className="sup-ticket-attachments">
                        <FaImage className="sup-fas" /> {ticket.images.length} image(s)
                      </div>
                    )}
                  </div>

                  <div className="sup-ticket-actions">
                    <button
                      className="sup-btn-primary"
                      onClick={() => handleViewTicketDetails(ticket)}
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
              {searchQuery ? (
                <button
                  className="sup-btn-secondary"
                  onClick={() => {
                    setSearchQuery("");
                    infoToast("Search cleared");
                  }}
                >
                  Clear Search
                </button>
              ) : (
                <button
                  className="sup-btn-primary"
                  onClick={handleCreateFormOpen}
                >
                  Create Your First Ticket
                </button>
              )}
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
                    onClick={handleCloseTicketDetails}
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
                        {selectedTicket.images && selectedTicket.images.length > 0 && (
                          <div className="sup-message-attachments">
                            <strong>Images:</strong>
                            <div className="sup-attachments-grid">
                              {selectedTicket.images.map((img, i) => {
                                const imageUrl = formatAttachmentUrl(img);
                                const imageName = getAttachmentName(img);
                                return (
                                  <div key={i} className="sup-attachment">
                                    <div className="sup-attachment-info">
                                      {getFileIcon(imageName)}
                                      <a
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => infoToast("Opening image...")}
                                      >
                                        {imageName}
                                      </a>
                                    </div>
                                    {imageUrl && imageUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                      <div className="sup-image-preview">
                                        <img 
                                          src={imageUrl} 
                                          alt={`Attachment ${i + 1}`}
                                          onClick={() => window.open(imageUrl, '_blank')}
                                        />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Responses */}
                    {selectedTicket.responses && selectedTicket.responses.map((response, index) => (
                      <div
                        key={response._id || response.createdAt}
                        className={`sup-message ${
                          response.user && response.user._id === userId
                            ? "user-message"
                            : "agent-message"
                        }`}
                      >
                        <div className="sup-message-header">
                          <span className="sup-message-sender">
                            {response.user && response.user._id === userId 
                              ? "You" 
                              : (response.user?.firstName || "Support Agent")}
                          </span>
                          <span className="sup-message-time">
                            {formatDate(response.createdAt)}
                          </span>
                        </div>
                        <div className="sup-message-content">
                          <p>{response.message}</p>
                          {response.attachments && response.attachments.length > 0 && (
                            <div className="sup-message-attachments">
                              <strong>Attachments:</strong>
                              <div className="sup-attachments-grid">
                                {response.attachments.map((att, i) => {
                                  const attUrl = formatAttachmentUrl(att);
                                  const attName = getAttachmentName(att);
                                  return (
                                    <div key={i} className="sup-attachment">
                                      <div className="sup-attachment-info">
                                        {getFileIcon(attName)}
                                        <a
                                          href={attUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => infoToast("Downloading attachment...")}
                                        >
                                          {attName}
                                        </a>
                                      </div>
                                      {attUrl && attUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) && (
                                        <div className="sup-image-preview">
                                          <img 
                                            src={attUrl} 
                                            alt={`Attachment ${i + 1}`}
                                            onClick={() => window.open(attUrl, '_blank')}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Add response with attachments */}
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
                        
                        {/* Response attachments */}
                        <div className="sup-attachments-section">
                          <label className="sup-attachments-label">
                            <FaPaperclip className="sup-fas" />
                            <span>Add Attachments</span>
                            <input
                              type="file"
                              multiple
                              onChange={handleResponseAttachmentUpload}
                              disabled={isSubmitting}
                              style={{ display: 'none' }}
                              accept="image/*,.pdf,.doc,.docx"
                            />
                          </label>
                          
                          {responseAttachments.length > 0 && (
                            <div className="sup-attachments-preview">
                              <strong>Selected attachments ({responseAttachments.length}):</strong>
                              {responseAttachments.map((file, index) => (
                                <div key={index} className="sup-attachment-item">
                                  {getFileIcon(file.name)}
                                  <span className="sup-filename">{file.name}</span>
                                  <span className="sup-filesize">
                                    ({(file.size / 1024).toFixed(1)} KB)
                                  </span>
                                  <button
                                    type="button"
                                    className="sup-remove-attachment"
                                    onClick={() => handleRemoveResponseAttachment(index)}
                                    disabled={isSubmitting}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="sup-form-actions">
                          <button
                            className="sup-btn-primary"
                            onClick={() => handleAddResponse(selectedTicket._id)}
                            disabled={isSubmitting || (!newResponse.trim() && responseAttachments.length === 0)}
                          >
                            {isSubmitting ? "Sending..." : "Send Response"}
                          </button>
                          <button
                            className="sup-btn-secondary"
                            onClick={() => {
                              setNewResponse("");
                              setResponseAttachments([]);
                              infoToast("Response cleared");
                            }}
                            disabled={isSubmitting}
                          >
                            Clear
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
              <h2>Create Support Ticket</h2>
              <button
                className="sup-close-btn"
                onClick={handleCreateFormClose}
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
                    placeholder="Enter ticket subject"
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
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <div className="sup-form-group">
                  <label>Images (Optional)</label>
                  <div className="sup-file-input-wrapper">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      disabled={isSubmitting}
                      className="sup-file-input"
                    />
                    <div className="sup-file-input-label">
                      <FaPaperclip className="sup-fas" />
                      <span>Choose files (images, PDF, DOC)</span>
                    </div>
                  </div>
                  {newTicket.images.length > 0 && (
                    <div className="sup-attachments-preview">
                      <strong>Selected files ({newTicket.images.length}):</strong>
                      {newTicket.images.map((f, i) => (
                        <div key={i} className="sup-attachment-item">
                          {getFileIcon(f.name)}
                          <span className="sup-filename">{f.name}</span>
                          <span className="sup-filesize">
                            ({(f.size / 1024).toFixed(1)} KB)
                          </span>
                          <button
                            type="button"
                            className="sup-remove-attachment"
                            onClick={() => handleRemoveImage(i)}
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
              <div className="sup-support-modal-footer">
                <button
                  type="button"
                  className="sup-btn-secondary"
                  onClick={handleCreateFormClose}
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