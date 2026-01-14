// import React, { useState, useEffect } from 'react';
// import { 
//   FaGasPump, 
//   FaHistory, 
//   FaTruck, 
//   FaCheckCircle, 
//   FaClock,
//   FaPlus,
//   FaExclamationTriangle,
//   FaShoppingCart,
//   FaTimes,
//   FaCalendar,
//   FaEdit,
//   FaChevronRight
// } from 'react-icons/fa';
// import './MobileDeliveryRemnant.css';

// const MobileCustomerRemnant = () => {
//   const [remnant, setRemnant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [requestDialogOpen, setRequestDialogOpen] = useState(false);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [selectedEntry, setSelectedEntry] = useState(null);
//   const [requestedKg, setRequestedKg] = useState('');
//   const [deliveryDate, setDeliveryDate] = useState('');
//   const [deliveryNotes, setDeliveryNotes] = useState('');
//   const [confirmationNotes, setConfirmationNotes] = useState('');
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     fetchRemnant();
//   }, []);

//   const fetchRemnant = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/my-remnant', {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
//       const data = await response.json();
      
//       if (data.success) {
//         setRemnant(data.data);
//       }
//     } catch (error) {
//       showSnackbar('Error fetching remnant data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleConfirmEntry = async (entry) => {
//     try {
//       const response = await fetch(`https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/${remnant._id}/confirm`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ notes: confirmationNotes })
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         showSnackbar('Remnant entry confirmed successfully', 'success');
//         setConfirmDialogOpen(false);
//         setConfirmationNotes('');
//         fetchRemnant();
//       } else {
//         showSnackbar(data.message, 'error');
//       }
//     } catch (error) {
//       showSnackbar('Error confirming entry', 'error');
//     }
//   };

//   const handleRequestDelivery = async () => {
//     if (!requestedKg) {
//       showSnackbar('Please enter amount to deliver', 'error');
//       return;
//     }

//     if (parseFloat(requestedKg) < 6) {
//       showSnackbar('Minimum 6kg required for delivery', 'error');
//       return;
//     }

//     if (parseFloat(requestedKg) > remnant.accumulatedKg) {
//       showSnackbar(`Cannot request more than ${remnant.accumulatedKg}kg available`, 'error');
//       return;
//     }

//     try {
//       const response = await fetch('https://egas-server-1.onrender.com/api/v1/admin/delivery/remnant/request-delivery', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         },
//         body: JSON.stringify({ 
//           requestedKg,
//           deliveryDate,
//           notes: deliveryNotes
//         })
//       });

//       const data = await response.json();
      
//       if (data.success) {
//         showSnackbar('Remnant delivery requested successfully', 'success');
//         setRequestDialogOpen(false);
//         setRequestedKg('');
//         setDeliveryDate('');
//         setDeliveryNotes('');
//         fetchRemnant();
//       } else {
//         showSnackbar(data.message, 'error');
//       }
//     } catch (error) {
//       showSnackbar('Error requesting delivery', 'error');
//     }
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//     setTimeout(() => {
//       setSnackbar({ ...snackbar, open: false });
//     }, 6000);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="mobdelrem-container">
//         <div className="mobdelrem-header">
//           <h1 className="mobdelrem-header-title">My Gas Remnant</h1>
//         </div>
//         <div className="mobdelrem-loading">
//           <div className="mobdelrem-spinner"></div>
//           <p className="mobdelrem-loading-text">Loading remnant data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mobdelrem-container">
//       {/* Fixed Header */}
//       <div className="mobdelrem-header">
//         <div className="mobdelrem-header-content">
//           <h1 className="mobdelrem-header-title">
//             <FaGasPump className="mobdelrem-header-icon" />
//             My Gas Remnant
//           </h1>
//           <div className="mobdelrem-header-actions">
//             {remnant && (
//               <button
//                 className={`mobdelrem-fab ${remnant.accumulatedKg < 6 ? 'mobdelrem-fab-disabled' : ''}`}
//                 onClick={() => setRequestDialogOpen(true)}
//                 disabled={remnant.accumulatedKg < 6}
//                 title="Request Delivery"
//               >
//                 <FaPlus />
//               </button>
//             )}
//           </div>
//         </div>
        
//         {/* Quick Stats Bar */}
//         {remnant && (
//           <div className="mobdelrem-quick-stats">
//             <div className="mobdelrem-stat-item">
//               <div className="mobdelrem-stat-value">{remnant.accumulatedKg.toFixed(1)}kg</div>
//               <div className="mobdelrem-stat-label">Available</div>
//             </div>
//             <div className="mobdelrem-stat-divider"></div>
//             <div className="mobdelrem-stat-item">
//               <div className="mobdelrem-stat-value">{remnant.partialDeliveries?.filter(p => !p.confirmed).length || 0}</div>
//               <div className="mobdelrem-stat-label">Pending</div>
//             </div>
//             <div className="mobdelrem-stat-divider"></div>
//             <div className="mobdelrem-stat-item">
//               <div className="mobdelrem-stat-value">{remnant.deliveryRequests?.length || 0}</div>
//               <div className="mobdelrem-stat-label">Requests</div>
//             </div>
//           </div>
//         )}
        
//         {/* Tab Navigation */}
//         <div className="mobdelrem-tab-nav">
//           <button 
//             className={`mobdelrem-tab ${activeTab === 'overview' ? 'mobdelrem-tab-active' : ''}`}
//             onClick={() => setActiveTab('overview')}
//           >
//             Overview
//           </button>
//           <button 
//             className={`mobdelrem-tab ${activeTab === 'history' ? 'mobdelrem-tab-active' : ''}`}
//             onClick={() => setActiveTab('history')}
//           >
//             History
//           </button>
//           <button 
//             className={`mobdelrem-tab ${activeTab === 'requests' ? 'mobdelrem-tab-active' : ''}`}
//             onClick={() => setActiveTab('requests')}
//           >
//             Requests
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="mobdelrem-content">
//         {!remnant ? (
//           <div className="mobdelrem-empty-state">
//             <FaGasPump className="mobdelrem-empty-icon" />
//             <h3 className="mobdelrem-empty-title">No Remnant Record</h3>
//             <p className="mobdelrem-empty-text">You don't have any accumulated gas remnant yet.</p>
//           </div>
//         ) : (
//           <>
//             {/* Action Card */}
//             {remnant.accumulatedKg < 6 && (
//               <div className="mobdelrem-action-card mobdelrem-action-card-warning">
//                 <div className="mobdelrem-action-card-content">
//                   <FaExclamationTriangle className="mobdelrem-action-card-icon" />
//                   <div>
//                     <h4 className="mobdelrem-action-card-title">Minimum Not Met</h4>
//                     <p className="mobdelrem-action-card-text">
//                       Need {6 - remnant.accumulatedKg}kg more for delivery
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {remnant.accumulatedKg >= 6 && (
//               <div className="mobdelrem-action-card mobdelrem-action-card-success">
//                 <div className="mobdelrem-action-card-content">
//                   <FaCheckCircle className="mobdelrem-action-card-icon" />
//                   <div>
//                     <h4 className="mobdelrem-action-card-title">Ready for Delivery</h4>
//                     <p className="mobdelrem-action-card-text">
//                       You have {remnant.accumulatedKg.toFixed(1)}kg available
//                     </p>
//                   </div>
//                 </div>
//                 <button 
//                   className="mobdelrem-action-card-button"
//                   onClick={() => setRequestDialogOpen(true)}
//                 >
//                   Request
//                 </button>
//               </div>
//             )}

//             {/* Tab Content */}
//             {activeTab === 'overview' && (
//               <>
//                 {/* Remnant Status Card */}
//                 <div className="mobdelrem-card">
//                   <div className="mobdelrem-card-header">
//                     <h3 className="mobdelrem-card-title">Remnant Status</h3>
//                     <span className="mobdelrem-card-badge mobdelrem-card-badge-primary">
//                       {remnant.customerConfirmation?.confirmed ? 'Confirmed' : 'Pending'}
//                     </span>
//                   </div>
//                   <div className="mobdelrem-card-content">
//                     <div className="mobdelrem-progress-container">
//                       <div className="mobdelrem-progress-label">
//                         <span>Accumulated Gas</span>
//                         <span>{remnant.accumulatedKg.toFixed(1)}kg</span>
//                       </div>
//                       <div className="mobdelrem-progress-bar">
//                         <div 
//                           className="mobdelrem-progress-fill"
//                           style={{ width: `${Math.min((remnant.accumulatedKg / 50) * 100, 100)}%` }}
//                         ></div>
//                       </div>
//                       <div className="mobdelrem-progress-minimum">Minimum: 6kg</div>
//                     </div>
                    
//                     <div className="mobdelrem-stats-grid">
//                       <div className="mobdelrem-stat-card">
//                         <div className="mobdelrem-stat-card-value">{remnant.partialDeliveries?.length || 0}</div>
//                         <div className="mobdelrem-stat-card-label">Partial Deliveries</div>
//                       </div>
//                       <div className="mobdelrem-stat-card">
//                         <div className="mobdelrem-stat-card-value">{remnant.deliveredFromRemnant?.toFixed(1) || 0}kg</div>
//                         <div className="mobdelrem-stat-card-label">Delivered Total</div>
//                       </div>
//                       <div className="mobdelrem-stat-card">
//                         <div className="mobdelrem-stat-card-value">{remnant.deliveryRequests?.length || 0}</div>
//                         <div className="mobdelrem-stat-card-label">Requests</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Confirmation Banner */}
//                 {!remnant.customerConfirmation?.confirmed && remnant.partialDeliveries?.filter(p => !p.confirmed).length > 0 && (
//                   <div className="mobdelrem-action-card mobdelrem-action-card-warning">
//                     <div className="mobdelrem-action-card-content">
//                       <FaExclamationTriangle className="mobdelrem-action-card-icon" />
//                       <div>
//                         <h4 className="mobdelrem-action-card-title">Action Required</h4>
//                         <p className="mobdelrem-action-card-text">
//                           Confirm {remnant.partialDeliveries.filter(p => !p.confirmed).length} pending entries
//                         </p>
//                       </div>
//                     </div>
//                     <button 
//                       className="mobdelrem-action-card-button"
//                       onClick={() => setConfirmDialogOpen(true)}
//                     >
//                       Confirm
//                     </button>
//                   </div>
//                 )}

//                 {/* Quick Actions */}
//                 <div className="mobdelrem-card">
//                   <div className="mobdelrem-card-header">
//                     <h3 className="mobdelrem-card-title">Quick Actions</h3>
//                   </div>
//                   <div className="mobdelrem-card-content">
//                     <button 
//                       className="mobdelrem-quick-action"
//                       onClick={() => setRequestDialogOpen(true)}
//                       disabled={remnant.accumulatedKg < 6}
//                     >
//                       <div className="mobdelrem-quick-action-content">
//                         <FaShoppingCart className="mobdelrem-quick-action-icon" />
//                         <div>
//                           <div className="mobdelrem-quick-action-title">Request Delivery</div>
//                           <div className="mobdelrem-quick-action-subtitle">
//                             {remnant.accumulatedKg >= 6 
//                               ? 'Available now' 
//                               : `Need ${6 - remnant.accumulatedKg}kg more`}
//                           </div>
//                         </div>
//                       </div>
//                       <FaChevronRight className="mobdelrem-quick-action-arrow" />
//                     </button>
                    
//                     <button 
//                       className="mobdelrem-quick-action"
//                       onClick={() => setConfirmDialogOpen(true)}
//                       disabled={!remnant.partialDeliveries?.filter(p => !p.confirmed).length}
//                     >
//                       <div className="mobdelrem-quick-action-content">
//                         <FaCheckCircle className="mobdelrem-quick-action-icon" />
//                         <div>
//                           <div className="mobdelrem-quick-action-title">Confirm Entries</div>
//                           <div className="mobdelrem-quick-action-subtitle">
//                             {remnant.partialDeliveries?.filter(p => !p.confirmed).length || 0} pending
//                           </div>
//                         </div>
//                       </div>
//                       <FaChevronRight className="mobdelrem-quick-action-arrow" />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}

//             {activeTab === 'history' && (
//               <div className="mobdelrem-card">
//                 <div className="mobdelrem-card-header">
//                   <h3 className="mobdelrem-card-title">Partial Delivery History</h3>
//                 </div>
//                 <div className="mobdelrem-card-content">
//                   {remnant.partialDeliveries?.length > 0 ? (
//                     <div className="mobdelrem-list">
//                       {remnant.partialDeliveries.map((entry, index) => (
//                         <div key={index} className="mobdelrem-list-item">
//                           <div className="mobdelrem-list-item-content">
//                             <div className="mobdelrem-list-item-header">
//                               <span className="mobdelrem-list-item-title">
//                                 {entry.delivered}kg delivered
//                               </span>
//                               <span className={`mobdelrem-list-item-badge ${entry.confirmed ? 'mobdelrem-list-item-badge-success' : 'mobdelrem-list-item-badge-warning'}`}>
//                                 {entry.confirmed ? 'Confirmed' : 'Pending'}
//                               </span>
//                             </div>
//                             <div className="mobdelrem-list-item-subtitle">
//                               {formatDate(entry.date)} • {entry.originalKg}kg order
//                             </div>
//                             <div className="mobdelrem-list-item-details">
//                               <span className="mobdelrem-list-item-detail">
//                                 +{entry.remaining}kg added
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="mobdelrem-empty-state mobdelrem-empty-state-small">
//                       <p>No partial deliveries recorded yet.</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'requests' && (
//               <div className="mobdelrem-card">
//                 <div className="mobdelrem-card-header">
//                   <h3 className="mobdelrem-card-title">Delivery Requests</h3>
//                 </div>
//                 <div className="mobdelrem-card-content">
//                   {remnant.deliveryRequests?.length > 0 ? (
//                     <div className="mobdelrem-list">
//                       {remnant.deliveryRequests.map((request, index) => (
//                         <div key={index} className="mobdelrem-list-item">
//                           <div className="mobdelrem-list-item-content">
//                             <div className="mobdelrem-list-item-header">
//                               <span className="mobdelrem-list-item-title">
//                                 {request.requestedKg}kg requested
//                               </span>
//                               <span className={`mobdelrem-list-item-badge mobdelrem-list-item-badge-${request.status}`}>
//                                 {request.status}
//                               </span>
//                             </div>
//                             <div className="mobdelrem-list-item-subtitle">
//                               {formatDate(request.date)}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="mobdelrem-empty-state mobdelrem-empty-state-small">
//                       <p>No delivery requests yet.</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Request Delivery Bottom Sheet */}
//       {requestDialogOpen && (
//         <div className="mobdelrem-bottom-sheet-overlay">
//           <div className="mobdelrem-bottom-sheet">
//             <div className="mobdelrem-bottom-sheet-header">
//               <h2 className="mobdelrem-bottom-sheet-title">Request Delivery</h2>
//               <button 
//                 className="mobdelrem-bottom-sheet-close"
//                 onClick={() => setRequestDialogOpen(false)}
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="mobdelrem-bottom-sheet-content">
//               <div className="mobdelrem-form-group">
//                 <label className="mobdelrem-form-label">Amount (kg)</label>
//                 <div className="mobdelrem-form-input-wrapper">
//                   <input
//                     type="number"
//                     className="mobdelrem-form-input"
//                     value={requestedKg}
//                     onChange={(e) => setRequestedKg(e.target.value)}
//                     min="6"
//                     max={remnant?.accumulatedKg}
//                     step="0.5"
//                     placeholder={`Enter amount (6-${remnant?.accumulatedKg}kg)`}
//                   />
//                   <span className="mobdelrem-form-input-suffix">kg</span>
//                 </div>
//                 <div className="mobdelrem-form-hint">
//                   Available: {remnant?.accumulatedKg.toFixed(1)}kg • Minimum: 6kg
//                 </div>
//               </div>
              
//               <div className="mobdelrem-form-group">
//                 <label className="mobdelrem-form-label">
//                   <FaCalendar className="mobdelrem-form-label-icon" />
//                   Preferred Date (Optional)
//                 </label>
//                 <input
//                   type="date"
//                   className="mobdelrem-form-input"
//                   value={deliveryDate}
//                   onChange={(e) => setDeliveryDate(e.target.value)}
//                   min={new Date().toISOString().split('T')[0]}
//                 />
//               </div>
              
//               <div className="mobdelrem-form-group">
//                 <label className="mobdelrem-form-label">Notes (Optional)</label>
//                 <textarea
//                   className="mobdelrem-form-textarea"
//                   value={deliveryNotes}
//                   onChange={(e) => setDeliveryNotes(e.target.value)}
//                   placeholder="Any special instructions..."
//                   rows={3}
//                 />
//               </div>
//             </div>
//             <div className="mobdelrem-bottom-sheet-footer">
//               <button 
//                 className="mobdelrem-btn mobdelrem-btn-outline"
//                 onClick={() => setRequestDialogOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="mobdelrem-btn mobdelrem-btn-primary"
//                 onClick={handleRequestDelivery}
//                 disabled={!requestedKg || parseFloat(requestedKg) < 6}
//               >
//                 Request Delivery
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Confirm Entries Bottom Sheet */}
//       {confirmDialogOpen && (
//         <div className="mobdelrem-bottom-sheet-overlay">
//           <div className="mobdelrem-bottom-sheet">
//             <div className="mobdelrem-bottom-sheet-header">
//               <h2 className="mobdelrem-bottom-sheet-title">Confirm Entries</h2>
//               <button 
//                 className="mobdelrem-bottom-sheet-close"
//                 onClick={() => setConfirmDialogOpen(false)}
//               >
//                 <FaTimes />
//               </button>
//             </div>
//             <div className="mobdelrem-bottom-sheet-content">
//               <div className="mobdelrem-confirmation-info">
//                 <FaExclamationTriangle className="mobdelrem-confirmation-icon" />
//                 <p className="mobdelrem-confirmation-text">
//                   Please confirm all your accumulated remnant entries. This is required before requesting delivery.
//                 </p>
//               </div>
              
//               <div className="mobdelrem-pending-list">
//                 {remnant?.partialDeliveries?.filter(p => !p.confirmed).map((entry, index) => (
//                   <div key={index} className="mobdelrem-pending-item">
//                     <div className="mobdelrem-pending-item-date">{formatDate(entry.date)}</div>
//                     <div className="mobdelrem-pending-item-details">
//                       <span>{entry.delivered}kg delivered</span>
//                       <span className="mobdelrem-pending-item-highlight">+{entry.remaining}kg added</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
              
//               <div className="mobdelrem-form-group">
//                 <label className="mobdelrem-form-label">
//                   <FaEdit className="mobdelrem-form-label-icon" />
//                   Confirmation Notes
//                 </label>
//                 <textarea
//                   className="mobdelrem-form-textarea"
//                   value={confirmationNotes}
//                   onChange={(e) => setConfirmationNotes(e.target.value)}
//                   placeholder="Add any comments..."
//                   rows={3}
//                 />
//               </div>
//             </div>
//             <div className="mobdelrem-bottom-sheet-footer">
//               <button 
//                 className="mobdelrem-btn mobdelrem-btn-outline"
//                 onClick={() => setConfirmDialogOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="mobdelrem-btn mobdelrem-btn-success"
//                 onClick={handleConfirmEntry}
//               >
//                 Confirm All
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Snackbar */}
//       {snackbar.open && (
//         <div className={`mobdelrem-snackbar mobdelrem-snackbar-${snackbar.severity}`}>
//           {snackbar.severity === 'success' ? (
//             <FaCheckCircle className="mobdelrem-snackbar-icon" />
//           ) : (
//             <FaExclamationTriangle className="mobdelrem-snackbar-icon" />
//           )}
//           <span className="mobdelrem-snackbar-text">{snackbar.message}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MobileCustomerRemnant;





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
import './MobileDeliveryRemnant.css';
import "./SharedPartialDeliveryStyle.css";

const MobileCustomerRemnant = () => {
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
      <div className="mobdelrem-container">
        <div className="mobdelrem-header">
          <h1 className="mobdelrem-header-title">My Gas Remnant</h1>
        </div>
        <div className="mobdelrem-loading">
          <div className="mobdelrem-spinner"></div>
          <p className="mobdelrem-loading-text">Loading remnant data...</p>
        </div>
      </div>
    );
  }

  const pendingEntries = getPendingEntries();

  return (
    <div className="mobdelrem-container">
      {/* Fixed Header */}
      <div className="mobdelrem-header">
        <div className="mobdelrem-header-content">
          <h1 className="mobdelrem-header-title">
            <FaGasPump className="mobdelrem-header-icon" />
            My Gas Remnant
          </h1>
          <div className="mobdelrem-header-actions">
            {remnant && (
              <button
                className={`mobdelrem-fab ${remnant.accumulatedKg < 6 ? 'mobdelrem-fab-disabled' : ''}`}
                onClick={() => setRequestDialogOpen(true)}
                disabled={remnant.accumulatedKg < 6}
                title="Request Delivery"
              >
                <FaPlus />
              </button>
            )}
          </div>
        </div>
        
        {/* Quick Stats Bar */}
        {remnant && (
          <div className="mobdelrem-quick-stats">
            <div className="mobdelrem-stat-item">
              <div className="mobdelrem-stat-value">{remnant.accumulatedKg?.toFixed(1) || '0'}kg</div>
              <div className="mobdelrem-stat-label">Available</div>
            </div>
            <div className="mobdelrem-stat-divider"></div>
            <div className="mobdelrem-stat-item">
              <div className="mobdelrem-stat-value">{pendingEntries.length || 0}</div>
              <div className="mobdelrem-stat-label">Pending</div>
            </div>
            <div className="mobdelrem-stat-divider"></div>
            <div className="mobdelrem-stat-item">
              <div className="mobdelrem-stat-value">{remnant.deliveryRequests?.length || 0}</div>
              <div className="mobdelrem-stat-label">Requests</div>
            </div>
          </div>
        )}
        
        {/* Tab Navigation */}
        <div className="mobdelrem-tab-nav">
          <button 
            className={`mobdelrem-tab ${activeTab === 'overview' ? 'mobdelrem-tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`mobdelrem-tab ${activeTab === 'history' ? 'mobdelrem-tab-active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            History
          </button>
          <button 
            className={`mobdelrem-tab ${activeTab === 'requests' ? 'mobdelrem-tab-active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            Requests
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mobdelrem-content">
        {!remnant ? (
          <div className="mobdelrem-empty-state">
            <FaGasPump className="mobdelrem-empty-icon" />
            <h3 className="mobdelrem-empty-title">No Remnant Record</h3>
            <p className="mobdelrem-empty-text">You don't have any accumulated gas remnant yet.</p>
          </div>
        ) : (
          <>
            {/* Action Card */}
            {remnant.accumulatedKg < 6 && (
              <div className="mobdelrem-action-card mobdelrem-action-card-warning">
                <div className="mobdelrem-action-card-content">
                  <FaExclamationTriangle className="mobdelrem-action-card-icon" />
                  <div>
                    <h4 className="mobdelrem-action-card-title">Minimum Not Met</h4>
                    <p className="mobdelrem-action-card-text">
                      Need {6 - remnant.accumulatedKg}kg more for delivery
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {remnant.accumulatedKg >= 6 && (
              <div className="mobdelrem-action-card mobdelrem-action-card-success">
                <div className="mobdelrem-action-card-content">
                  <FaCheckCircle className="mobdelrem-action-card-icon" />
                  <div>
                    <h4 className="mobdelrem-action-card-title">Ready for Delivery</h4>
                    <p className="mobdelrem-action-card-text">
                      You have {remnant.accumulatedKg.toFixed(1)}kg available
                    </p>
                  </div>
                </div>
                <button 
                  className="mobdelrem-action-card-button"
                  onClick={() => setRequestDialogOpen(true)}
                  disabled={pendingEntries.length > 0}
                >
                  Request
                </button>
              </div>
            )}

            {/* Confirmation Requirements */}
            {pendingEntries.length > 0 && (
              <div className="mobdelrem-action-card mobdelrem-action-card-warning">
                <div className="mobdelrem-action-card-content">
                  <FaExclamationTriangle className="mobdelrem-action-card-icon" />
                  <div>
                    <h4 className="mobdelrem-action-card-title">Action Required</h4>
                    <p className="mobdelrem-action-card-text">
                      Confirm {pendingEntries.length} pending entries before requesting delivery
                    </p>
                  </div>
                </div>
                <button 
                  className="mobdelrem-action-card-button"
                  onClick={() => setConfirmDialogOpen(true)}
                >
                  Confirm
                </button>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <>
                {/* Remnant Status Card */}
                <div className="mobdelrem-card">
                  <div className="mobdelrem-card-header">
                    <h3 className="mobdelrem-card-title">Remnant Status</h3>
                    <span className="mobdelrem-card-badge mobdelrem-card-badge-primary">
                      {remnant.customerConfirmation?.confirmed ? 'Confirmed' : 'Pending'}
                    </span>
                  </div>
                  <div className="mobdelrem-card-content">
                    <div className="mobdelrem-progress-container">
                      <div className="mobdelrem-progress-label">
                        <span>Accumulated Gas</span>
                        <span>{remnant.accumulatedKg.toFixed(1)}kg</span>
                      </div>
                      <div className="mobdelrem-progress-bar">
                        <div 
                          className="mobdelrem-progress-fill"
                          style={{ width: `${Math.min((remnant.accumulatedKg / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="mobdelrem-progress-minimum">Minimum: 6kg</div>
                    </div>
                    
                    <div className="mobdelrem-stats-grid">
                      <div className="mobdelrem-stat-card">
                        <div className="mobdelrem-stat-card-value">{remnant.partialDeliveries?.length || 0}</div>
                        <div className="mobdelrem-stat-card-label">Partial Deliveries</div>
                      </div>
                      <div className="mobdelrem-stat-card">
                        <div className="mobdelrem-stat-card-value">{remnant.deliveredFromRemnant?.toFixed(1) || 0}kg</div>
                        <div className="mobdelrem-stat-card-label">Delivered Total</div>
                      </div>
                      <div className="mobdelrem-stat-card">
                        <div className="mobdelrem-stat-card-value">{remnant.deliveryRequests?.filter(r => r.status === 'pending').length || 0}</div>
                        <div className="mobdelrem-stat-card-label">Active Requests</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mobdelrem-card">
                  <div className="mobdelrem-card-header">
                    <h3 className="mobdelrem-card-title">Quick Actions</h3>
                  </div>
                  <div className="mobdelrem-card-content">
                    <button 
                      className="mobdelrem-quick-action"
                      onClick={() => setRequestDialogOpen(true)}
                      disabled={remnant.accumulatedKg < 6 || pendingEntries.length > 0}
                    >
                      <div className="mobdelrem-quick-action-content">
                        <FaShoppingCart className="mobdelrem-quick-action-icon" />
                        <div>
                          <div className="mobdelrem-quick-action-title">Request Delivery</div>
                          <div className="mobdelrem-quick-action-subtitle">
                            {remnant.accumulatedKg >= 6 
                              ? `Available: ${remnant.accumulatedKg.toFixed(1)}kg` 
                              : `Need ${6 - remnant.accumulatedKg}kg more`}
                          </div>
                        </div>
                      </div>
                      <FaChevronRight className="mobdelrem-quick-action-arrow" />
                    </button>
                    
                    <button 
                      className="mobdelrem-quick-action"
                      onClick={() => setConfirmDialogOpen(true)}
                      disabled={pendingEntries.length === 0}
                    >
                      <div className="mobdelrem-quick-action-content">
                        <FaCheckCircle className="mobdelrem-quick-action-icon" />
                        <div>
                          <div className="mobdelrem-quick-action-title">Confirm Entries</div>
                          <div className="mobdelrem-quick-action-subtitle">
                            {pendingEntries.length} entries pending confirmation
                          </div>
                        </div>
                      </div>
                      <FaChevronRight className="mobdelrem-quick-action-arrow" />
                    </button>

                    <button 
                      className="mobdelrem-quick-action"
                      onClick={() => setActiveTab('history')}
                    >
                      <div className="mobdelrem-quick-action-content">
                        <FaHistory className="mobdelrem-quick-action-icon" />
                        <div>
                          <div className="mobdelrem-quick-action-title">View History</div>
                          <div className="mobdelrem-quick-action-subtitle">
                            View complete partial delivery history
                          </div>
                        </div>
                      </div>
                      <FaChevronRight className="mobdelrem-quick-action-arrow" />
                    </button>

                    <button 
                      className="mobdelrem-quick-action"
                      onClick={() => setActiveTab('requests')}
                    >
                      <div className="mobdelrem-quick-action-content">
                        <FaBell className="mobdelrem-quick-action-icon" />
                        <div>
                          <div className="mobdelrem-quick-action-title">Delivery Requests</div>
                          <div className="mobdelrem-quick-action-subtitle">
                            View and manage delivery requests
                          </div>
                        </div>
                      </div>
                      <FaChevronRight className="mobdelrem-quick-action-arrow" />
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mobdelrem-card">
                  <div className="mobdelrem-card-header">
                    <h3 className="mobdelrem-card-title">Recent Partial Deliveries</h3>
                    <button 
                      className="mobdelrem-view-all-btn"
                      onClick={() => setActiveTab('history')}
                    >
                      View All
                    </button>
                  </div>
                  <div className="mobdelrem-card-content">
                    {remnant.partialDeliveries?.slice(0, 3).length > 0 ? (
                      <div className="mobdelrem-activity-list">
                        {remnant.partialDeliveries.slice(0, 3).map((entry, index) => (
                          <div key={index} className="mobdelrem-activity-item">
                            <div className={`mobdelrem-activity-icon ${entry.confirmed ? 'mobdelrem-confirmed' : 'mobdelrem-pending'}`}>
                              {entry.confirmed ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            </div>
                            <div className="mobdelrem-activity-content">
                              <div className="mobdelrem-activity-title">
                                Partial Delivery - {entry.delivered}kg delivered
                              </div>
                              <div className="mobdelrem-activity-subtitle">
                                {formatDate(entry.date)} • Added {entry.remaining}kg to remnant
                              </div>
                            </div>
                            <div className={`mobdelrem-activity-status ${entry.confirmed ? 'mobdelrem-confirmed' : 'mobdelrem-pending'}`}>
                              {entry.confirmed ? 'Confirmed' : 'Pending'}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mobdelrem-empty-state mobdelrem-empty-state-small">
                        <p>No partial deliveries recorded yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <div className="mobdelrem-card">
                <div className="mobdelrem-card-header">
                  <h3 className="mobdelrem-card-title">Partial Delivery History</h3>
                </div>
                <div className="mobdelrem-card-content">
                  {remnant.partialDeliveries?.length > 0 ? (
                    <div className="mobdelrem-history-list">
                      {remnant.partialDeliveries.map((entry, index) => (
                        <div key={index} className={`mobdelrem-history-item ${entry.confirmed ? 'mobdelrem-confirmed' : 'mobdelrem-pending'}`}>
                          <div className="mobdelrem-history-item-header">
                            <div className="mobdelrem-history-item-date">{formatDate(entry.date)}</div>
                            <span className={`mobdelrem-history-item-badge ${entry.confirmed ? 'mobdelrem-confirmed' : 'mobdelrem-pending'}`}>
                              {entry.confirmed ? 'Confirmed' : 'Pending'}
                            </span>
                          </div>
                          <div className="mobdelrem-history-item-details">
                            <div className="mobdelrem-history-item-row">
                              <span>Original Order:</span>
                              <span>{entry.originalKg}kg</span>
                            </div>
                            <div className="mobdelrem-history-item-row">
                              <span>Delivered:</span>
                              <span>{entry.delivered}kg</span>
                            </div>
                            <div className="mobdelrem-history-item-row">
                              <span>Added to Remnant:</span>
                              <span className="mobdelrem-success">+{entry.remaining}kg</span>
                            </div>
                            <div className="mobdelrem-history-item-row">
                              <span>Agent Notes:</span>
                              <span>{entry.deliveryId?.agentNotes || '-'}</span>
                            </div>
                          </div>
                          {!entry.confirmed && (
                            <div className="mobdelrem-history-item-actions">
                              <button
                                className="mobdelrem-confirm-entry-btn"
                                onClick={() => handleConfirmPartialDelivery(entry.deliveryId?._id || entry.deliveryId)}
                                disabled={!entry.deliveryId}
                              >
                                <FaCheckCircle /> Confirm
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mobdelrem-empty-state mobdelrem-empty-state-small">
                      <p>No partial deliveries recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="mobdelrem-card">
                <div className="mobdelrem-card-header">
                  <h3 className="mobdelrem-card-title">Delivery Requests</h3>
                </div>
                <div className="mobdelrem-card-content">
                  {remnant.deliveryRequests?.length > 0 ? (
                    <div className="mobdelrem-requests-list">
                      {remnant.deliveryRequests.map((request, index) => (
                        <div key={index} className="mobdelrem-request-item">
                          <div className="mobdelrem-request-item-header">
                            <div className="mobdelrem-request-item-date">{formatDate(request.date)}</div>
                            <span className={`mobdelrem-request-item-badge mobdelrem-request-item-badge-${request.status}`}>
                              {request.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="mobdelrem-request-item-details">
                            <div className="mobdelrem-request-item-row">
                              <span>Amount:</span>
                              <span>{request.requestedKg}kg</span>
                            </div>
                            <div className="mobdelrem-request-item-row">
                              <span>Delivery Date:</span>
                              <span>{request.deliveryDate || '-'}</span>
                            </div>
                            <div className="mobdelrem-request-item-row">
                              <span>Delivery Status:</span>
                              <span className={`mobdelrem-status-badge ${request.deliveryId?.status || 'pending'}`}>
                                {request.deliveryId?.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </div>
                            <div className="mobdelrem-request-item-row">
                              <span>Notes:</span>
                              <span>{request.notes || '-'}</span>
                            </div>
                          </div>
                          <div className="mobdelrem-request-item-actions">
                            <button className="mobdelrem-view-btn">
                              <FaEye /> View
                            </button>
                            {request.status === 'pending' && (
                              <button className="mobdelrem-cancel-btn">
                                <FaTimes /> Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mobdelrem-empty-state mobdelrem-empty-state-small">
                      <p>No delivery requests yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Request Delivery Bottom Sheet */}
      {requestDialogOpen && (
        <div className="mobdelrem-bottom-sheet-overlay">
          <div className="mobdelrem-bottom-sheet">
            <div className="mobdelrem-bottom-sheet-header">
              <h2 className="mobdelrem-bottom-sheet-title">Request Delivery</h2>
              <button 
                className="mobdelrem-bottom-sheet-close"
                onClick={() => setRequestDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mobdelrem-bottom-sheet-content">
              <div className="mobdelrem-modal-info">
                <p><strong>Available Remnant:</strong> {remnant?.accumulatedKg?.toFixed(1) || '0'}kg</p>
                <p><strong>Minimum Delivery:</strong> 6kg</p>
                {pendingEntries.length > 0 && (
                  <div className="mobdelrem-modal-warning">
                    <FaExclamationTriangle />
                    <p>You have {pendingEntries.length} unconfirmed entries. Please confirm them first.</p>
                  </div>
                )}
              </div>
              
              <div className="mobdelrem-form-group">
                <label className="mobdelrem-form-label">Amount (kg)</label>
                <div className="mobdelrem-form-input-wrapper">
                  <input
                    type="number"
                    className="mobdelrem-form-input"
                    value={requestedKg}
                    onChange={(e) => setRequestedKg(e.target.value)}
                    min="6"
                    max={remnant?.accumulatedKg}
                    step="0.5"
                    placeholder={`Enter amount (6-${remnant?.accumulatedKg}kg)`}
                    disabled={pendingEntries.length > 0}
                  />
                  <span className="mobdelrem-form-input-suffix">kg</span>
                </div>
                <div className="mobdelrem-form-hint">
                  Available: {remnant?.accumulatedKg.toFixed(1)}kg • Minimum: 6kg
                </div>
              </div>
              
              <div className="mobdelrem-form-group">
                <label className="mobdelrem-form-label">
                  <FaCalendar className="mobdelrem-form-label-icon" />
                  Preferred Date (Optional)
                </label>
                <input
                  type="date"
                  className="mobdelrem-form-input"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="mobdelrem-form-group">
                <label className="mobdelrem-form-label">Notes (Optional)</label>
                <textarea
                  className="mobdelrem-form-textarea"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Any special instructions..."
                  rows={3}
                />
              </div>
            </div>
            <div className="mobdelrem-bottom-sheet-footer">
              <button 
                className="mobdelrem-btn mobdelrem-btn-outline"
                onClick={() => setRequestDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="mobdelrem-btn mobdelrem-btn-primary"
                onClick={handleRequestDelivery}
                disabled={!requestedKg || parseFloat(requestedKg) < 6 || pendingEntries.length > 0}
              >
                Request Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Entries Bottom Sheet */}
      {confirmDialogOpen && (
        <div className="mobdelrem-bottom-sheet-overlay">
          <div className="mobdelrem-bottom-sheet">
            <div className="mobdelrem-bottom-sheet-header">
              <h2 className="mobdelrem-bottom-sheet-title">Confirm Remnant Entries</h2>
              <button 
                className="mobdelrem-bottom-sheet-close"
                onClick={() => setConfirmDialogOpen(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="mobdelrem-bottom-sheet-content">
              <div className="mobdelrem-modal-alert">
                <FaExclamationTriangle />
                <p>
                  Please confirm all your accumulated remnant entries. 
                  This is required before requesting remnant delivery.
                </p>
              </div>

              <div className="mobdelrem-entries-list">
                {pendingEntries.map((entry, index) => (
                  <div key={index} className="mobdelrem-entry-item">
                    <div className="mobdelrem-entry-date">{formatDate(entry.date)}</div>
                    <div className="mobdelrem-entry-details">
                      <span>{entry.delivered}kg delivered, </span>
                      <span className="mobdelrem-entry-added">+{entry.remaining}kg added to remnant</span>
                    </div>
                    <div className="mobdelrem-entry-original">Original order: {entry.originalKg}kg</div>
                  </div>
                ))}
              </div>

              <div className="mobdelrem-form-group">
                <label className="mobdelrem-form-label">
                  <FaEdit className="mobdelrem-form-label-icon" />
                  Confirmation Notes
                </label>
                <textarea
                  className="mobdelrem-form-textarea"
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  placeholder="Add any comments or notes..."
                  rows={3}
                />
              </div>
            </div>
            <div className="mobdelrem-bottom-sheet-footer">
              <button 
                className="mobdelrem-btn mobdelrem-btn-outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="mobdelrem-btn mobdelrem-btn-success"
                onClick={handleConfirmEntry}
                disabled={!remnant?._id}
              >
                Confirm All Entries
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`mobdelrem-snackbar mobdelrem-snackbar-${snackbar.severity}`}>
          {snackbar.severity === 'success' ? (
            <FaCheckCircle className="mobdelrem-snackbar-icon" />
          ) : (
            <FaExclamationTriangle className="mobdelrem-snackbar-icon" />
          )}
          <span className="mobdelrem-snackbar-text">{snackbar.message}</span>
        </div>
      )}
    </div>
  );
};

export default MobileCustomerRemnant;