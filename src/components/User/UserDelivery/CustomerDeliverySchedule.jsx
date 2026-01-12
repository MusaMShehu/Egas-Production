
// // components/CustomerDeliveryHistory.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaUser,
//   FaClock,
//   FaTruck,
//   FaFilter,
//   FaSort,
//   FaCalendarAlt,
//   FaExclamationTriangle,
//   FaGasPump,
// } from "react-icons/fa";
// import "./CustomerDeliverySchedule.css";

// const CustomerDeliveryHistory = () => {
//   const [deliveries, setDeliveries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
//   const [selectedDelivery, setSelectedDelivery] = useState(null);
//   const [confirmationNotes, setConfirmationNotes] = useState("");
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success",
//   });

//   // State for tabs, filtering and sorting
//   const [activeTab, setActiveTab] = useState("upcoming"); // upcoming, delivered, overdue
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [dateFilter, setDateFilter] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc"); // asc for chronological (nearest first)

//   // Categorize deliveries based on status and date
//   const categorizedDeliveries = useMemo(() => {
//     const now = new Date();
//     now.setHours(0, 0, 0, 0);

//     return deliveries.reduce(
//       (acc, delivery) => {
//         const deliveryDate = new Date(delivery.deliveryDate);
//         deliveryDate.setHours(0, 0, 0, 0);

//         // Determine if delivery is overdue
//         const isOverdue =
//           deliveryDate < now &&
//           !["delivered", "cancelled", "failed"].includes(delivery.status);

//         // Categorize
//         if (delivery.status === "delivered") {
//           acc.delivered.push(delivery);
//         } else if (isOverdue) {
//           acc.overdue.push(delivery);
//         } else if (deliveryDate >= now && delivery.status !== "delivered") {
//           acc.upcoming.push(delivery);
//         } else {
//           acc.other.push(delivery);
//         }

//         return acc;
//       },
//       { upcoming: [], delivered: [], overdue: [], other: [] }
//     );
//   }, [deliveries]);

//   // Get deliveries for current tab
//   const getTabDeliveries = () => {
//     switch (activeTab) {
//       case "upcoming":
//         return categorizedDeliveries.upcoming;
//       case "delivered":
//         return categorizedDeliveries.delivered;
//       case "overdue":
//         return categorizedDeliveries.overdue;
//       default:
//         return deliveries;
//     }
//   };

//   useEffect(() => {
//     fetchDeliveries();
//   }, [page, activeTab, statusFilter, dateFilter, sortOrder]);

//   const fetchDeliveries = async () => {
//     try {
//       setLoading(true);

//       // Build query parameters
//       let queryParams = `page=${page}&limit=20&sortBy=deliveryDate&sortOrder=${sortOrder}`;

//       // Remove tab-based filtering from backend - we'll handle it in frontend
//       // Apply date filter if selected
//       if (dateFilter) {
//         queryParams += `&deliveryDate=${dateFilter}`;
//       }

//       // Apply status filter if not "all"
//       if (statusFilter !== "all") {
//         queryParams += `&status=${statusFilter}`;
//       }

//       const response = await fetch(
//         `https://egas-server-1.onrender.com/api/v1/admin/delivery/my-deliveries?${queryParams}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       const data = await response.json();

//       if (data.success) {
//         // Sort deliveries: today first, then upcoming, then past
//         const sortedDeliveries = sortDeliveriesByPriority(data.data);
//         setDeliveries(sortedDeliveries);
//         setTotalPages(data.pagination.pages);
//       }
//     } catch (error) {
//       showSnackbar("Error fetching delivery history", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Sort deliveries with priority: Today's deliveries first
//   const sortDeliveriesByPriority = (deliveries) => {
//     const now = new Date();
//     now.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(now);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     return deliveries.sort((a, b) => {
//       const dateA = new Date(a.deliveryDate);
//       const dateB = new Date(b.deliveryDate);

//       // Get day comparison
//       dateA.setHours(0, 0, 0, 0);
//       dateB.setHours(0, 0, 0, 0);

//       // Check if today
//       const isAToday = dateA.getTime() === now.getTime();
//       const isBToday = dateB.getTime() === now.getTime();

//       // Check if tomorrow
//       const isATomorrow = dateA.getTime() === tomorrow.getTime();
//       const isBTomorrow = dateB.getTime() === tomorrow.getTime();

//       // Priority: Today > Tomorrow > Upcoming > Overdue > Past
//       if (isAToday && !isBToday) return -1;
//       if (!isAToday && isBToday) return 1;

//       if (isATomorrow && !isBTomorrow) return -1;
//       if (!isATomorrow && isBTomorrow) return 1;

//       // For same day, sort by status priority
//       if (dateA.getTime() === dateB.getTime()) {
//         const statusOrder = {
//           out_for_delivery: 1,
//           accepted: 2,
//           assigned: 3,
//           pending: 4,
//           failed: 5,
//           cancelled: 6,
//           delivered: 7,
//           paused: 8,
//         };

//         return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
//       }

//       // Sort by date
//       if (sortOrder === "asc") {
//         return dateA - dateB;
//       } else {
//         return dateB - dateA;
//       }
//     });
//   };

//   const handleConfirmDelivery = async () => {
//     try {
//       const response = await fetch(
//         `https://egas-server-1.onrender.com/api/v1/admin/delivery/${selectedDelivery._id}/confirm`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           body: JSON.stringify({ notes: confirmationNotes }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         showSnackbar("Delivery confirmed successfully", "success");
//         setConfirmDialogOpen(false);
//         setConfirmationNotes("");
//         setSelectedDelivery(null);
//         fetchDeliveries();
//       } else {
//         showSnackbar(data.message, "error");
//       }
//     } catch (error) {
//       showSnackbar("Error confirming delivery", "error");
//     }
//   };

//   const showSnackbar = (message, severity) => {
//     setSnackbar({ open: true, message, severity });
//     setTimeout(() => {
//       setSnackbar({ ...snackbar, open: false });
//     }, 6000);
//   };

//   const getStatusClass = (status) => {
//     const statusMap = {
//       pending: "adm-status-pending",
//       assigned: "adm-status-assigned",
//       accepted: "adm-status-accepted",
//       out_for_delivery: "adm-status-out_for_delivery",
//       delivered: "adm-status-delivered",
//       failed: "adm-status-failed",
//       cancelled: "adm-status-cancelled",
//       paused: "adm-status-paused",
//     };
//     return `adm-status-chip ${statusMap[status] || "adm-status-pending"}`;
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const formatDateShort = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     now.setHours(0, 0, 0, 0);

//     const deliveryDate = new Date(date);
//     deliveryDate.setHours(0, 0, 0, 0);

//     if (deliveryDate.getTime() === now.getTime()) {
//       return (
//         "Today " +
//         date.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//     }

//     const tomorrow = new Date(now);
//     tomorrow.setDate(tomorrow.getDate() + 1);

//     if (deliveryDate.getTime() === tomorrow.getTime()) {
//       return (
//         "Tomorrow " +
//         date.toLocaleTimeString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//         })
//       );
//     }

//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getDeliveryTimeContext = (delivery) => {
//     const now = new Date();
//     now.setHours(0, 0, 0, 0);

//     const deliveryDate = new Date(delivery.deliveryDate);
//     deliveryDate.setHours(0, 0, 0, 0);

//     const timeDiff = deliveryDate - now;
//     const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

//     // Handle paused status first
//     if (delivery.status === "paused") {
//       return {
//         type: "paused",
//         text: "Paused",
//         icon: <FaExclamationTriangle className="adm-icon-sm" />,
//       };
//     } else if (delivery.status === "delivered") {
//       return {
//         type: "delivered",
//         text: `Delivered`,
//         icon: <FaCheckCircle className="adm-icon-sm" />,
//       };
//     } else if (daysDiff === 0) {
//       return {
//         type: "today",
//         text: "Today",
//         icon: <FaExclamationTriangle className="adm-icon-sm" />,
//       };
//     } else if (daysDiff === 1) {
//       return {
//         type: "tomorrow",
//         text: "Tomorrow",
//         icon: <FaClock className="adm-icon-sm" />,
//       };
//     } else if (daysDiff > 1 && daysDiff <= 7) {
//       return {
//         type: "this-week",
//         text: `In ${daysDiff} days`,
//         icon: <FaClock className="adm-icon-sm" />,
//       };
//     } else if (daysDiff > 7) {
//       return {
//         type: "future",
//         text: `${Math.floor(daysDiff / 7)} weeks`,
//         icon: <FaCalendarAlt className="adm-icon-sm" />,
//       };
//     } else if (daysDiff < 0) {
//       return {
//         type: "overdue",
//         text: `${Math.abs(daysDiff)} days overdue`,
//         icon: <FaExclamationTriangle className="adm-icon-sm" />,
//       };
//     }

//     return {
//       type: "scheduled",
//       text: "Scheduled",
//       icon: <FaCalendarAlt className="adm-icon-sm" />,
//     };
//   };

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setPage(1);
//     // Reset filters when changing tabs
//     setStatusFilter("all");
//     setDateFilter("");
//   };

//   const handleStatusFilterChange = (status) => {
//     setStatusFilter(status);
//     setPage(1);
//   };

//   const handleDateFilterChange = (date) => {
//     setDateFilter(date);
//     setPage(1);
//   };

//   const handleSortOrderChange = () => {
//     setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     setPage(1);
//   };

//   const clearFilters = () => {
//     setStatusFilter("all");
//     setDateFilter("");
//     setPage(1);
//   };

//   // Add this function to calculate delivery sequence
//   const calculateDeliverySequence = (delivery) => {
//     if (!delivery.sequenceNumber || !delivery.totalSequences) {
//       return null;
//     }

//     return {
//       current: delivery.sequenceNumber,
//       total: delivery.totalSequences,
//       isInitial: delivery.sequenceNumber === 1,
//     };
//   };


//   // In SubscriptionPlans.jsx - Update price calculation function
// const getPriceBreakdown = (plan, size, frequency, subscriptionPeriod) => {
//   const sizeKg = parseInt(String(size).replace("kg", ""), 10) || parseInt(size, 10);
//   const baseAmount = sizeKg * (plan.pricePerKg || 0);
  
//   let deliveriesPerMonth = 0;
//   switch (frequency) {
//     case "Daily": deliveriesPerMonth = 30; break;
//     case "Weekly": deliveriesPerMonth = 4; break;
//     case "Bi-weekly": deliveriesPerMonth = 2; break;
//     case "Monthly": deliveriesPerMonth = 1; break;
//     default: deliveriesPerMonth = 1;
//   }

//   let totalDeliveries = 0;
//   let breakdown = [];

//   if (frequency === "One-Time" || frequency === "Emergency") {
//     totalDeliveries = 1;
//     breakdown.push(`${totalDeliveries} delivery`);
//   } else {
//     if (subscriptionPeriod === 1) {
//       totalDeliveries = deliveriesPerMonth + 1;
//       breakdown.push(`${deliveriesPerMonth + 1} deliveries (${deliveriesPerMonth} regular + 1 initial)`);
//     } else {
//       totalDeliveries = (deliveriesPerMonth + 1) + (deliveriesPerMonth * (subscriptionPeriod - 1));
//       breakdown.push(`${totalDeliveries} total deliveries`);
//       breakdown.push(`- Month 1: ${deliveriesPerMonth + 1} (${deliveriesPerMonth} + 1 initial)`);
//       breakdown.push(`- Subsequent months: ${deliveriesPerMonth} per month`);
//     }
//   }

//   const totalPrice = baseAmount * totalDeliveries;

//   return {
//     totalPrice: Math.round(totalPrice),
//     breakdown,
//     pricePerKg: plan.pricePerKg || 0,
//     totalDeliveries
//   };
// };

//   // Get deliveries for current tab
//   const currentDeliveries = getTabDeliveries();

//   if (loading) {
//     return (
//       <div className="adm-customer-delivery">
//         <div className="adm-loading">
//           <div className="adm-spinner"></div>
//           <p>Loading your deliveries...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="adm-customer-delivery">
//       <div className="adm-customer-header">
//         <h1 className="adm-customer-title">My Delivery Schedule</h1>

//         {/* Tabs with counts */}
//         <div className="adm-tabs">
//           <button
//             className={`adm-tab ${activeTab === "upcoming" ? "active" : ""}`}
//             onClick={() => handleTabChange("upcoming")}
//           >
//             Upcoming Deliveries
//             <span className="adm-tab-count">
//               {categorizedDeliveries.upcoming.length}
//             </span>
//           </button>
//           <button
//             className={`adm-tab ${activeTab === "delivered" ? "active" : ""}`}
//             onClick={() => handleTabChange("delivered")}
//           >
//             Delivered
//             <span className="adm-tab-count">
//               {categorizedDeliveries.delivered.length}
//             </span>
//           </button>
//           <button
//             className={`adm-tab ${activeTab === "overdue" ? "active" : ""}`}
//             onClick={() => handleTabChange("overdue")}
//           >
//             Overdue
//             <span className="adm-tab-count">
//               {categorizedDeliveries.overdue.length}
//             </span>
//           </button>

//           <Link to="/dashboard/remnant" className="adm-tab adm-rem-tab">
//             My Gas Remnant
//           </Link>
//         </div>

//         {/* Filters and Sorting */}
//         <div className="adm-controls">
//           {/* Date Filter */}
//           <div className="adm-filter-group">
//             <FaCalendarAlt className="adm-control-icon" />
//             <input
//               type="date"
//               className="adm-filter-input"
//               value={dateFilter}
//               onChange={(e) => handleDateFilterChange(e.target.value)}
//             />
//           </div>

//           {/* Status Filter */}
//           {activeTab !== "delivered" && (
//             <div className="adm-filter-group">
//               <FaFilter className="adm-control-icon" />
//               <select
//                 className="adm-filter-select"
//                 value={statusFilter}
//                 onChange={(e) => handleStatusFilterChange(e.target.value)}
//               >
//                 <option value="all">All Status</option>
//                 <option value="pending">Pending</option>
//                 <option value="assigned">Assigned</option>
//                 <option value="accepted">Accepted</option>
//                 <option value="out_for_delivery">Out for Delivery</option>
//                 <option value="failed">Failed</option>
//                 <option value="cancelled">Cancelled</option>
//                 <option value="paused">Paused</option>
//               </select>
//             </div>
//           )}

//           {/* Sort Order */}
//           <div className="adm-sort-group">
//             <FaSort className="adm-control-icon" />
//             <button className="adm-sort-btn" onClick={handleSortOrderChange}>
//               {sortOrder === "asc" ? "Nearest First" : "Furthest First"}
//             </button>
//           </div>

//           {/* Clear Filters */}
//           {(statusFilter !== "all" || dateFilter) && (
//             <button className="adm-clear-filters" onClick={clearFilters}>
//               Clear Filters
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="adm-deliveries-list">
//         {currentDeliveries.map((delivery) => {
//           const timeContext = getDeliveryTimeContext(delivery);

//           return (
//             <div key={delivery._id} className="adm-delivery-card">
//               {/* <div className="adm-card-content">
//                 <div
//                   className={`adm-time-context adm-time-${timeContext.type}`}
//                 >
//                   {timeContext.icon}
//                   <span>{timeContext.text}</span>
//                 </div>

//                 <div className="adm-card-header">
//                   <span className={getStatusClass(delivery.status)}>
//                     {delivery.status.replace(/_/g, " ").toUpperCase()}
//                   </span>
//                   <span className="adm-delivery-date">
//                     {formatDateShort(delivery.deliveryDate)}
//                   </span>
//                 </div>

//                 <div className="adm-plan-info">
//                   <div className="adm-plan-name">
//                     {delivery.subscriptionId?.planName || "N/A"} -{" "}
//                     {delivery.subscriptionId?.size || "N/A"}
//                   </div>
//                   {delivery.subscriptionId?.frequency && (
//                     <div className="adm-plan-frequency">
//                       Frequency: {delivery.subscriptionId.frequency}
//                     </div>
//                   )}
//                 </div> */}

//               {/* Add delivery sequence badge */}
//               {delivery.sequenceNumber && delivery.totalSequences && (
//                 <div className="adm-delivery-sequence">
//                   <span className="adm-sequence-badge">
//                     Delivery {delivery.sequenceNumber} of{" "}
//                     {delivery.totalSequences}
//                     {delivery.sequenceNumber === 1 && " (Initial)"}
//                   </span>
//                 </div>
//               )}

//               <div className="adm-card-content">
//                 <div
//                   className={`adm-time-context adm-time-${timeContext.type}`}
//                 >
//                   {timeContext.icon}
//                   <span>{timeContext.text}</span>
//                 </div>

//                 <div className="adm-card-header">
//                   <span className={getStatusClass(delivery.status)}>
//                     {delivery.status.replace(/_/g, " ").toUpperCase()}
//                   </span>
//                   <span className="adm-delivery-date">
//                     {formatDateShort(delivery.deliveryDate)}
//                   </span>
//                 </div>

//                 <div className="adm-plan-info">
//                   <div className="adm-plan-name">
//                     {delivery.planDetails?.planName ||
//                       delivery.subscriptionId?.planName ||
//                       "N/A"}{" "}
//                     -
//                     {delivery.planDetails?.size ||
//                       delivery.subscriptionId?.size ||
//                       "N/A"}
//                   </div>

//                   {/* Show subscription period */}
//                   {delivery.planDetails?.subscriptionPeriod && (
//                     <div className="adm-plan-period">
//                       Subscription: {delivery.planDetails.subscriptionPeriod}{" "}
//                       month(s)
//                     </div>
//                   )}

//                   {/* Show delivery frequency */}
//                   <div className="adm-plan-frequency">
//                     Frequency:{" "}
//                     {delivery.planDetails?.frequency ||
//                       delivery.subscriptionId?.frequency ||
//                       "N/A"}
//                   </div>

//                   {/* Show if this is initial delivery */}
//                   {delivery.isInitialDelivery && (
//                     <div className="adm-initial-badge">
//                       <FaGasPump className="adm-icon-sm" /> Initial Delivery
//                     </div>
//                   )}
//                 </div>

//                 <div className="adm-delivery-details">
//                   <div className="adm-detail-item">
//                     <FaMapMarkerAlt className="adm-icon" />
//                     <div className="adm-detail-text">{delivery.address}</div>
//                   </div>

//                   {delivery.status === "paused" && (
//                     <div className="adm-status-message adm-message-warning">
//                       <FaExclamationTriangle className="adm-icon" />
//                       <strong>
//                         {" "}
//                         Delivery paused due to subscription pause
//                       </strong>
//                       {delivery.pausedAt && (
//                         <div>Paused on: {formatDate(delivery.pausedAt)}</div>
//                       )}
//                     </div>
//                   )}

//                   {delivery.deliveryAgent && (
//                     <div className="adm-agent-info">
//                       <div className="adm-detail-item">
//                         <FaUser className="adm-icon" />
//                         <div className="adm-detail-text">
//                           <span className="adm-detail-label">
//                             Delivery Agent:
//                           </span>{" "}
//                           {delivery.deliveryAgent.firstName}{" "}
//                           {delivery.deliveryAgent.lastName}
//                         </div>
//                       </div>
//                       {delivery.deliveryAgent.phone && (
//                         <div className="adm-detail-item">
//                           <FaPhone className="adm-icon" />
//                           <div className="adm-detail-text">
//                             <span className="adm-detail-label">Phone:</span>{" "}
//                             {delivery.deliveryAgent.phone}
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {delivery.deliveredAt && (
//                     <div className="adm-detail-item">
//                       <FaTruck className="adm-icon" />
//                       <div className="adm-detail-text">
//                         <span className="adm-detail-label">Delivered:</span>{" "}
//                         {formatDate(delivery.deliveredAt)}
//                       </div>
//                     </div>
//                   )}

//                   {delivery.agentNotes && (
//                     <div className="adm-detail-item">
//                       <FaClock className="adm-icon" />
//                       <div className="adm-detail-text">
//                         <span className="adm-detail-label">Agent Notes:</span>{" "}
//                         {delivery.agentNotes}
//                       </div>
//                     </div>
//                   )}

//                   {delivery.failedReason && (
//                     <div className="adm-status-message adm-message-error">
//                       <div>
//                         <FaTimesCircle className="adm-icon" />
//                         <strong> Failure Reason:</strong>{" "}
//                         {delivery.failedReason}
//                       </div>
//                     </div>
//                   )}

//                   {delivery.customerConfirmation?.confirmed && (
//                     <div className="adm-status-message adm-message-confirmed">
//                       <div>
//                         <FaCheckCircle className="adm-icon" />
//                         <strong> Confirmed by you on:</strong>{" "}
//                         {formatDate(delivery.customerConfirmation.confirmedAt)}
//                       </div>
//                       {delivery.customerConfirmation.customerNotes && (
//                         <div style={{ marginTop: "0.5rem" }}>
//                           <strong>Your Notes:</strong>{" "}
//                           {delivery.customerConfirmation.customerNotes}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 <div className="adm-card-footer">
//                   <div className="adm-delivery-meta">
//                     {delivery.retryCount > 0 && (
//                       <div style={{ color: "#f39c12", fontSize: "0.9rem" }}>
//                         Retry attempt: {delivery.retryCount}
//                       </div>
//                     )}
//                   </div>

//                   {delivery.status === "delivered" &&
//                     !delivery.customerConfirmation?.confirmed && (
//                       <button
//                         className="adm-btn adm-btn-success"
//                         onClick={() => {
//                           setSelectedDelivery(delivery);
//                           setConfirmDialogOpen(true);
//                         }}
//                       >
//                         <FaCheckCircle className="adm-icon" />
//                         Confirm Delivery
//                       </button>
//                     )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}

//         {currentDeliveries.length === 0 && (
//           <div className="adm-empty-state">
//             <div className="adm-empty-state-icon">
//               {activeTab === "upcoming" ? (
//                 <FaCalendarAlt size={48} />
//               ) : activeTab === "delivered" ? (
//                 <FaCheckCircle size={48} />
//               ) : (
//                 <FaExclamationTriangle size={48} />
//               )}
//             </div>
//             <h3>No deliveries found</h3>
//             <p>
//               {activeTab === "upcoming"
//                 ? "You don't have any upcoming deliveries scheduled."
//                 : activeTab === "delivered"
//                 ? "You don't have any delivered orders."
//                 : activeTab === "overdue"
//                 ? "You don't have any overdue deliveries."
//                 : "You don't have any delivery records for the selected filter."}
//             </p>
//             {(statusFilter !== "all" || dateFilter) && (
//               <button
//                 className="adm-btn adm-btn-outline"
//                 onClick={clearFilters}
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="adm-pagination">
//           <div className="adm-pagination-info">
//             Page {page} of {totalPages} • Showing {currentDeliveries.length}{" "}
//             deliveries • Sorted:{" "}
//             {sortOrder === "asc" ? "Nearest First" : "Furthest First"}
//             {dateFilter && ` • Date: ${dateFilter}`}
//             {statusFilter !== "all" && ` • Status: ${statusFilter}`}
//           </div>
//           <div className="adm-pagination-buttons">
//             <button
//               className="adm-page-btn"
//               disabled={page === 1}
//               onClick={() => handlePageChange(page - 1)}
//             >
//               Previous
//             </button>

//             {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//               const pageNumber = i + Math.max(1, page - 2);
//               if (pageNumber > totalPages) return null;

//               return (
//                 <button
//                   key={pageNumber}
//                   className={`adm-page-btn ${
//                     page === pageNumber ? "active" : ""
//                   }`}
//                   onClick={() => handlePageChange(pageNumber)}
//                 >
//                   {pageNumber}
//                 </button>
//               );
//             })}

//             <button
//               className="adm-page-btn"
//               disabled={page >= totalPages}
//               onClick={() => handlePageChange(page + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Dialog */}
//       {confirmDialogOpen && (
//         <div className="adm-dialog-overlay">
//           <div className="adm-dialog">
//             <div className="adm-dialog-header">
//               <h2 className="adm-dialog-title">Confirm Delivery</h2>
//             </div>
//             <div className="adm-dialog-content">
//               <p style={{ marginBottom: "1rem", color: "#7f8c8d" }}>
//                 Please confirm that you have received your{" "}
//                 {selectedDelivery?.subscriptionId?.planName} delivery.
//               </p>
//               <div className="adm-form-group">
//                 <label className="adm-form-label">
//                   Delivery Notes (Optional)
//                 </label>
//                 <textarea
//                   className="adm-form-textarea"
//                   value={confirmationNotes}
//                   onChange={(e) => setConfirmationNotes(e.target.value)}
//                   placeholder="Add any comments about the delivery service..."
//                   rows={3}
//                 />
//               </div>
//             </div>
//             <div className="adm-dialog-footer">
//               <button
//                 className="adm-btn adm-btn-outline"
//                 onClick={() => setConfirmDialogOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="adm-btn adm-btn-success"
//                 onClick={handleConfirmDelivery}
//               >
//                 <FaCheckCircle className="adm-icon" />
//                 Confirm Receipt
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Snackbar */}
//       {snackbar.open && (
//         <div className={`adm-snackbar ${snackbar.severity}`}>
//           {snackbar.severity === "success" ? (
//             <FaCheckCircle className="adm-icon" />
//           ) : (
//             <FaTimesCircle className="adm-icon" />
//           )}
//           {snackbar.message}
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomerDeliveryHistory;





// components/CustomerDeliveryHistory.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaClock,
  FaTruck,
  FaFilter,
  FaSort,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaGasPump,
  FaPauseCircle,
  FaPlayCircle,
  FaSync,
} from "react-icons/fa";
import "./CustomerDeliverySchedule.css";

const CustomerDeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [confirmationNotes, setConfirmationNotes] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // State for tabs, filtering and sorting
  const [activeTab, setActiveTab] = useState("upcoming");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  // Fetch subscriptions to check pause status
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [page, activeTab, statusFilter, dateFilter, sortOrder]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch(
        `https://egas-server-1.onrender.com/api/v1/subscriptions/my-subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.data);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      setLoading(true);

      // Build query parameters
      let queryParams = `page=${page}&limit=20&sortBy=deliveryDate&sortOrder=${sortOrder}`;

      // Apply date filter if selected
      if (dateFilter) {
        queryParams += `&deliveryDate=${dateFilter}`;
      }

      // Apply status filter if not "all"
      if (statusFilter !== "all") {
        queryParams += `&status=${statusFilter}`;
      }

      const response = await fetch(
        `https://egas-server-1.onrender.com/api/v1/admin/delivery/my-deliveries?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        // Sort deliveries: today first, then upcoming, then past
        const sortedDeliveries = sortDeliveriesByPriority(data.data);
        setDeliveries(sortedDeliveries);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      showSnackbar("Error fetching delivery history", "error");
    } finally {
      setLoading(false);
    }
  };

  // Get subscription for a delivery
  const getDeliverySubscription = (delivery) => {
    return subscriptions.find(sub => sub._id === delivery.subscriptionId?._id);
  };

  // Check if delivery should be paused based on subscription
  const checkDeliverySyncStatus = (delivery) => {
    const subscription = getDeliverySubscription(delivery);
    if (!subscription) return { shouldBeSynced: false };

    const shouldBePaused = subscription.status === "paused" && delivery.status !== "paused";
    const shouldBeActive = subscription.status === "active" && delivery.status === "paused";

    return {
      shouldBeSynced: shouldBePaused || shouldBeActive,
      subscriptionStatus: subscription.status,
      deliveryStatus: delivery.status,
      action: shouldBePaused ? "pause" : "resume"
    };
  };

  // Sync delivery with subscription
  const syncDeliveryWithSubscription = async (deliveryId) => {
    try {
      const response = await fetch(
        `https://egas-server-1.onrender.com/api/v1/deliveries/${deliveryId}/sync-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showSnackbar(`Delivery synced: ${data.data.action}`, "success");
        fetchDeliveries();
      } else {
        showSnackbar(data.message || "Sync failed", "error");
      }
    } catch (error) {
      showSnackbar("Error syncing delivery", "error");
    }
  };

  // NEW: Pause subscription and its deliveries
  const handlePauseSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(
        `https://egas-server-1.onrender.com/api/v1/subscriptions/${subscriptionId}/pause`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showSnackbar("Subscription and deliveries paused successfully", "success");
        fetchSubscriptions();
        fetchDeliveries();
      } else {
        showSnackbar(data.message, "error");
      }
    } catch (error) {
      showSnackbar("Error pausing subscription", "error");
    }
  };

  // NEW: Resume subscription and its deliveries
  const handleResumeSubscription = async (subscriptionId) => {
    try {
      const response = await fetch(
        `https://egas-server-1.onrender.com/api/v1/subscriptions/${subscriptionId}/resume`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        showSnackbar("Subscription and deliveries resumed successfully", "success");
        fetchSubscriptions();
        fetchDeliveries();
      } else {
        showSnackbar(data.message, "error");
      }
    } catch (error) {
      showSnackbar("Error resuming subscription", "error");
    }
  };

  // Sort deliveries with priority
  const sortDeliveriesByPriority = (deliveries) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return deliveries.sort((a, b) => {
      const dateA = new Date(a.deliveryDate);
      const dateB = new Date(b.deliveryDate);
      
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);
      
      const isAToday = dateA.getTime() === now.getTime();
      const isBToday = dateB.getTime() === now.getTime();
      
      const isATomorrow = dateA.getTime() === tomorrow.getTime();
      const isBTomorrow = dateB.getTime() === tomorrow.getTime();
      
      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;
      
      if (isATomorrow && !isBTomorrow) return -1;
      if (!isATomorrow && isBTomorrow) return 1;
      
      if (dateA.getTime() === dateB.getTime()) {
        const statusOrder = {
          'out_for_delivery': 1,
          'accepted': 2,
          'assigned': 3,
          'pending': 4,
          'failed': 5,
          'cancelled': 6,
          'delivered': 7,
          'paused': 8,
        };
        
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      }
      
      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const handleConfirmDelivery = async () => {
    try {
      const response = await fetch(
        `https://egas-server-1.onrender.com/api/v1/admin/delivery/${selectedDelivery._id}/confirm`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ notes: confirmationNotes }),
        }
      );

      const data = await response.json();

      if (data.success) {
        showSnackbar("Delivery confirmed successfully", "success");
        setConfirmDialogOpen(false);
        setConfirmationNotes("");
        setSelectedDelivery(null);
        fetchDeliveries();
      } else {
        showSnackbar(data.message, "error");
      }
    } catch (error) {
      showSnackbar("Error confirming delivery", "error");
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
      pending: "adm-status-pending",
      assigned: "adm-status-assigned",
      accepted: "adm-status-accepted",
      out_for_delivery: "adm-status-out_for_delivery",
      delivered: "adm-status-delivered",
      failed: "adm-status-failed",
      cancelled: "adm-status-cancelled",
      paused: "adm-status-paused",
    };
    return `adm-status-chip ${statusMap[status] || "adm-status-pending"}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const deliveryDate = new Date(date);
    deliveryDate.setHours(0, 0, 0, 0);
    
    if (deliveryDate.getTime() === now.getTime()) {
      return "Today " + date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (deliveryDate.getTime() === tomorrow.getTime()) {
      return "Tomorrow " + date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeliveryTimeContext = (delivery) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const deliveryDate = new Date(delivery.deliveryDate);
    deliveryDate.setHours(0, 0, 0, 0);
    
    const timeDiff = deliveryDate - now;
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    if (delivery.status === "paused") {
      return {
        type: "paused",
        text: "Paused",
        icon: <FaPauseCircle className="adm-icon-sm" />
      };
    } else if (delivery.status === "delivered") {
      return {
        type: "delivered",
        text: `Delivered`,
        icon: <FaCheckCircle className="adm-icon-sm" />
      };
    } else if (daysDiff === 0) {
      return { 
        type: "today", 
        text: "Today",
        icon: <FaExclamationTriangle className="adm-icon-sm" />
      };
    } else if (daysDiff === 1) {
      return { 
        type: "tomorrow", 
        text: "Tomorrow",
        icon: <FaClock className="adm-icon-sm" />
      };
    } else if (daysDiff > 1 && daysDiff <= 7) {
      return { 
        type: "this-week", 
        text: `In ${daysDiff} days`,
        icon: <FaClock className="adm-icon-sm" />
      };
    } else if (daysDiff > 7) {
      return {
        type: "future",
        text: `${Math.floor(daysDiff / 7)} weeks`,
        icon: <FaCalendarAlt className="adm-icon-sm" />
      };
    } else if (daysDiff < 0) {
      return { 
        type: "overdue", 
        text: `${Math.abs(daysDiff)} days overdue`,
        icon: <FaExclamationTriangle className="adm-icon-sm" />
      };
    }

    return { 
      type: "scheduled", 
      text: "Scheduled",
      icon: <FaCalendarAlt className="adm-icon-sm" />
    };
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setStatusFilter("all");
    setDateFilter("");
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleDateFilterChange = (date) => {
    setDateFilter(date);
    setPage(1);
  };

  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setPage(1);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFilter("");
    setPage(1);
  };

  // Categorize deliveries
  const categorizedDeliveries = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return deliveries.reduce((acc, delivery) => {
      const deliveryDate = new Date(delivery.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      
      const isOverdue = deliveryDate < now && 
        !['delivered', 'cancelled', 'failed'].includes(delivery.status);
      
      if (delivery.status === 'delivered') {
        acc.delivered.push(delivery);
      } else if (isOverdue) {
        acc.overdue.push(delivery);
      } else if (deliveryDate >= now && delivery.status !== 'delivered') {
        acc.upcoming.push(delivery);
      } else {
        acc.other.push(delivery);
      }
      
      return acc;
    }, { upcoming: [], delivered: [], overdue: [], other: [] });
  }, [deliveries]);

  // Get deliveries for current tab
  const getTabDeliveries = () => {
    switch (activeTab) {
      case "upcoming":
        return categorizedDeliveries.upcoming;
      case "delivered":
        return categorizedDeliveries.delivered;
      case "overdue":
        return categorizedDeliveries.overdue;
      default:
        return deliveries;
    }
  };

  const currentDeliveries = getTabDeliveries();

  if (loading) {
    return (
      <div className="adm-customer-delivery">
        <div className="adm-loading">
          <div className="adm-spinner"></div>
          <p>Loading your deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-customer-delivery">
      <div className="adm-customer-header">
        <h1 className="adm-customer-title">My Delivery Schedule</h1>

        {/* Subscription Quick Actions */}
        <div className="adm-subscription-actions">
          {subscriptions
            .filter(sub => ["active", "paused"].includes(sub.status))
            .map(subscription => (
              <div key={subscription._id} className="adm-subscription-quick-action">
                <span className="adm-subscription-name">
                  {subscription.planName} - {subscription.size}
                </span>
                <span className={`adm-subscription-status status-${subscription.status}`}>
                  {subscription.status}
                </span>
                {subscription.status === "active" ? (
                  <button
                    className="adm-btn adm-btn-warning adm-btn-sm"
                    onClick={() => handlePauseSubscription(subscription._id)}
                  >
                    <FaPauseCircle /> Pause
                  </button>
                ) : (
                  <button
                    className="adm-btn adm-btn-success adm-btn-sm"
                    onClick={() => handleResumeSubscription(subscription._id)}
                  >
                    <FaPlayCircle /> Resume
                  </button>
                )}
              </div>
            ))}
        </div>

        {/* Tabs with counts */}
        <div className="adm-tabs">
          <button
            className={`adm-tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => handleTabChange("upcoming")}
          >
            Upcoming Deliveries
            <span className="adm-tab-count">
              {categorizedDeliveries.upcoming.length}
            </span>
          </button>
          <button
            className={`adm-tab ${activeTab === "delivered" ? "active" : ""}`}
            onClick={() => handleTabChange("delivered")}
          >
            Delivered
            <span className="adm-tab-count">
              {categorizedDeliveries.delivered.length}
            </span>
          </button>
          <button
            className={`adm-tab ${activeTab === "overdue" ? "active" : ""}`}
            onClick={() => handleTabChange("overdue")}
          >
            Overdue
            <span className="adm-tab-count">
              {categorizedDeliveries.overdue.length}
            </span>
          </button>

          <Link to="/dashboard/remnant" className="adm-tab adm-rem-tab">
            My Gas Remnant
          </Link>
        </div>

        {/* Filters and Sorting */}
        <div className="adm-controls">
          {/* Date Filter */}
          <div className="adm-filter-group">
            <FaCalendarAlt className="adm-control-icon" />
            <input
              type="date"
              className="adm-filter-input"
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          {activeTab !== "delivered" && (
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
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          )}

          {/* Sort Order */}
          <div className="adm-sort-group">
            <FaSort className="adm-control-icon" />
            <button className="adm-sort-btn" onClick={handleSortOrderChange}>
              {sortOrder === "asc" ? "Nearest First" : "Furthest First"}
            </button>
          </div>

          {/* Clear Filters */}
          {(statusFilter !== "all" || dateFilter) && (
            <button className="adm-clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="adm-deliveries-list">
        {currentDeliveries.map((delivery) => {
          const timeContext = getDeliveryTimeContext(delivery);
          const subscription = getDeliverySubscription(delivery);
          const syncStatus = checkDeliverySyncStatus(delivery);

          return (
            <div key={delivery._id} className="adm-delivery-card">
              {/* Sync Warning Banner */}
              {syncStatus.shouldBeSynced && (
                <div className="adm-sync-warning-banner">
                  <FaExclamationTriangle className="adm-icon" />
                  <span>
                    Delivery is out of sync with subscription ({subscription.status})
                  </span>
                  <button
                    className="adm-btn adm-btn-sm adm-btn-outline"
                    onClick={() => syncDeliveryWithSubscription(delivery._id)}
                  >
                    <FaSync /> Sync Now
                  </button>
                </div>
              )}

              <div className="adm-card-content">
                <div
                  className={`adm-time-context adm-time-${timeContext.type}`}
                >
                  {timeContext.icon}
                  <span>{timeContext.text}</span>
                </div>

                <div className="adm-card-header">
                  <span className={getStatusClass(delivery.status)}>
                    {delivery.status.replace(/_/g, " ").toUpperCase()}
                  </span>
                  <span className="adm-delivery-date">
                    {formatDateShort(delivery.deliveryDate)}
                    {/* Show original date if delivery was rescheduled */}
                    {delivery.originalDeliveryDate && (
                      <span className="adm-original-date">
                        (Originally: {formatDateShort(delivery.originalDeliveryDate)})
                      </span>
                    )}
                  </span>
                </div>

                <div className="adm-plan-info">
                  <div className="adm-plan-name">
                    {delivery.planDetails?.planName ||
                      delivery.subscriptionId?.planName ||
                      "N/A"}{" "}
                    -
                    {delivery.planDetails?.size ||
                      delivery.subscriptionId?.size ||
                      "N/A"}
                  </div>

                  {/* Show subscription status */}
                  {subscription && (
                    <div className="adm-subscription-status-indicator">
                      <span className={`status-${subscription.status}`}>
                        Subscription: {subscription.status}
                        {subscription.pausedAt && ` (since ${formatDate(subscription.pausedAt)})`}
                      </span>
                    </div>
                  )}

                  {/* Show delivery frequency */}
                  <div className="adm-plan-frequency">
                    Frequency:{" "}
                    {delivery.planDetails?.frequency ||
                      delivery.subscriptionId?.frequency ||
                      "N/A"}
                  </div>

                  {/* Show if this is initial delivery */}
                  {delivery.isInitialDelivery && (
                    <div className="adm-initial-badge">
                      <FaGasPump className="adm-icon-sm" /> Initial Delivery
                    </div>
                  )}
                </div>

                <div className="adm-delivery-details">
                  <div className="adm-detail-item">
                    <FaMapMarkerAlt className="adm-icon" />
                    <div className="adm-detail-text">{delivery.address}</div>
                  </div>

                  {/* Paused status details */}
                  {delivery.status === "paused" && (
                    <div className="adm-status-message adm-message-warning">
                      <FaPauseCircle className="adm-icon" />
                      <strong>
                        {" "}
                        Delivery paused {subscription ? "due to subscription pause" : ""}
                      </strong>
                      {delivery.pausedAt && (
                        <div>Paused on: {formatDate(delivery.pausedAt)}</div>
                      )}
                      {delivery.originalDeliveryDate && (
                        <div>
                          Will resume on: {formatDateShort(
                            new Date(delivery.originalDeliveryDate.getTime() + 
                            (subscription?.pauseHistory?.reduce((total, pause) => 
                              total + (pause.durationMs || 0), 0) || 0)
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {delivery.deliveryAgent && (
                    <div className="adm-agent-info">
                      <div className="adm-detail-item">
                        <FaUser className="adm-icon" />
                        <div className="adm-detail-text">
                          <span className="adm-detail-label">
                            Delivery Agent:
                          </span>{" "}
                          {delivery.deliveryAgent.firstName}{" "}
                          {delivery.deliveryAgent.lastName}
                        </div>
                      </div>
                      {delivery.deliveryAgent.phone && (
                        <div className="adm-detail-item">
                          <FaPhone className="adm-icon" />
                          <div className="adm-detail-text">
                            <span className="adm-detail-label">Phone:</span>{" "}
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
                        <span className="adm-detail-label">Delivered:</span>{" "}
                        {formatDate(delivery.deliveredAt)}
                      </div>
                    </div>
                  )}

                  {delivery.agentNotes && (
                    <div className="adm-detail-item">
                      <FaClock className="adm-icon" />
                      <div className="adm-detail-text">
                        <span className="adm-detail-label">Agent Notes:</span>{" "}
                        {delivery.agentNotes}
                      </div>
                    </div>
                  )}

                  {delivery.failedReason && (
                    <div className="adm-status-message adm-message-error">
                      <div>
                        <FaTimesCircle className="adm-icon" />
                        <strong> Failure Reason:</strong>{" "}
                        {delivery.failedReason}
                      </div>
                    </div>
                  )}

                  {delivery.customerConfirmation?.confirmed && (
                    <div className="adm-status-message adm-message-confirmed">
                      <div>
                        <FaCheckCircle className="adm-icon" />
                        <strong> Confirmed by you on:</strong>{" "}
                        {formatDate(delivery.customerConfirmation.confirmedAt)}
                      </div>
                      {delivery.customerConfirmation.customerNotes && (
                        <div style={{ marginTop: "0.5rem" }}>
                          <strong>Your Notes:</strong>{" "}
                          {delivery.customerConfirmation.customerNotes}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="adm-card-footer">
                  <div className="adm-delivery-meta">
                    {delivery.retryCount > 0 && (
                      <div style={{ color: "#f39c12", fontSize: "0.9rem" }}>
                        Retry attempt: {delivery.retryCount}
                      </div>
                    )}
                    {/* Show if delivery was extended due to pause */}
                    {delivery.resumedAt && (
                      <div style={{ color: "#27ae60", fontSize: "0.9rem" }}>
                        Resumed after pause: {formatDate(delivery.resumedAt)}
                      </div>
                    )}
                  </div>

                  {delivery.status === "delivered" &&
                    !delivery.customerConfirmation?.confirmed && (
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

                  {/* Sync button for out-of-sync deliveries */}
                  {syncStatus.shouldBeSynced && (
                    <button
                      className="adm-btn adm-btn-outline"
                      onClick={() => syncDeliveryWithSubscription(delivery._id)}
                    >
                      <FaSync className="adm-icon" />
                      Sync with Subscription
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {currentDeliveries.length === 0 && (
          <div className="adm-empty-state">
            <div className="adm-empty-state-icon">
              {activeTab === "upcoming" ? (
                <FaCalendarAlt size={48} />
              ) : activeTab === "delivered" ? (
                <FaCheckCircle size={48} />
              ) : (
                <FaExclamationTriangle size={48} />
              )}
            </div>
            <h3>No deliveries found</h3>
            <p>
              {activeTab === "upcoming"
                ? "You don't have any upcoming deliveries scheduled."
                : activeTab === "delivered"
                ? "You don't have any delivered orders."
                : activeTab === "overdue"
                ? "You don't have any overdue deliveries."
                : "You don't have any delivery records for the selected filter."}
            </p>
            {(statusFilter !== "all" || dateFilter) && (
              <button
                className="adm-btn adm-btn-outline"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="adm-pagination">
          <div className="adm-pagination-info">
            Page {page} of {totalPages} • Showing {currentDeliveries.length}{" "}
            deliveries • Sorted:{" "}
            {sortOrder === "asc" ? "Nearest First" : "Furthest First"}
            {dateFilter && ` • Date: ${dateFilter}`}
            {statusFilter !== "all" && ` • Status: ${statusFilter}`}
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
                  className={`adm-page-btn ${
                    page === pageNumber ? "active" : ""
                  }`}
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
              <p style={{ marginBottom: "1rem", color: "#7f8c8d" }}>
                Please confirm that you have received your{" "}
                {selectedDelivery?.subscriptionId?.planName} delivery.
              </p>
              <div className="adm-form-group">
                <label className="adm-form-label">
                  Delivery Notes (Optional)
                </label>
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
          {snackbar.severity === "success" ? (
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
