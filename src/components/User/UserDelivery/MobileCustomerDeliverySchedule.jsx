
// components/MobileCustomerDeliveryHistory.jsx
import React, { useState, useEffect, useMemo } from "react";
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
  FaChevronLeft,
  FaChevronRight,
  FaExclamationTriangle,
  FaGasPump,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./MobileCustomerDeliverySchedule.css";

const MobileCustomerDeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [confirmationNotes, setConfirmationNotes] = useState("");
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
  const [showFilters, setShowFilters] = useState(false);

  // Categorize deliveries based on status and date
  const categorizedDeliveries = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    return deliveries.reduce((acc, delivery) => {
      const deliveryDate = new Date(delivery.deliveryDate);
      deliveryDate.setHours(0, 0, 0, 0);
      
      // Determine if delivery is overdue
      const isOverdue = deliveryDate < now && 
        !['delivered', 'cancelled', 'failed'].includes(delivery.status);
      
      // Categorize
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

  useEffect(() => {
    fetchDeliveries();
  }, [page, activeTab, statusFilter, dateFilter, sortOrder]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);

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

  // Sort deliveries with priority: Today's deliveries first
  const sortDeliveriesByPriority = (deliveries) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return deliveries.sort((a, b) => {
      const dateA = new Date(a.deliveryDate);
      const dateB = new Date(b.deliveryDate);
      
      // Get day comparison
      dateA.setHours(0, 0, 0, 0);
      dateB.setHours(0, 0, 0, 0);
      
      // Check if today
      const isAToday = dateA.getTime() === now.getTime();
      const isBToday = dateB.getTime() === now.getTime();
      
      // Check if tomorrow
      const isATomorrow = dateA.getTime() === tomorrow.getTime();
      const isBTomorrow = dateB.getTime() === tomorrow.getTime();
      
      // Priority: Today > Tomorrow > Upcoming > Overdue > Past
      if (isAToday && !isBToday) return -1;
      if (!isAToday && isBToday) return 1;
      
      if (isATomorrow && !isBTomorrow) return -1;
      if (!isATomorrow && isBTomorrow) return 1;
      
      // For same day, sort by status priority
      if (dateA.getTime() === dateB.getTime()) {
        const statusOrder = {
          'out_for_delivery': 1,
          'accepted': 2,
          'assigned': 3,
          'pending': 4,
          'failed': 5,
          'cancelled': 6,
          'delivered': 7
        };
        
        return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
      }
      
      // Sort by date
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
      pending: "mobdel-status-pending",
      assigned: "mobdel-status-assigned",
      accepted: "mobdel-status-accepted",
      out_for_delivery: "mobdel-status-out_for_delivery",
      delivered: "mobdel-status-delivered",
      failed: "mobdel-status-failed",
      cancelled: "mobdel-status-cancelled",
    };
    return `mobdel-status-chip ${statusMap[status] || "mobdel-status-pending"}`;
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

    if (delivery.status === "delivered") {
      return {
        type: "delivered",
        text: `Delivered`,
        icon: <FaCheckCircle className="mobdel-icon-sm" />
      };
    } else if (daysDiff === 0) {
      return { 
        type: "today", 
        text: "Today",
        icon: <FaExclamationTriangle className="mobdel-icon-sm" />
      };
    } else if (daysDiff === 1) {
      return { 
        type: "tomorrow", 
        text: "Tomorrow",
        icon: <FaClock className="mobdel-icon-sm" />
      };
    } else if (daysDiff > 1 && daysDiff <= 7) {
      return { 
        type: "this-week", 
        text: `In ${daysDiff}d`,
        icon: <FaClock className="mobdel-icon-sm" />
      };
    } else if (daysDiff > 7) {
      return {
        type: "future",
        text: `${Math.floor(daysDiff / 7)}w`,
        icon: <FaCalendarAlt className="mobdel-icon-sm" />
      };
    } else if (daysDiff < 0) {
      return { 
        type: "overdue", 
        text: `${Math.abs(daysDiff)}d ago`,
        icon: <FaExclamationTriangle className="mobdel-icon-sm" />
      };
    }

    return { 
      type: "scheduled", 
      text: "Scheduled",
      icon: <FaCalendarAlt className="mobdel-icon-sm" />
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
    setShowFilters(false);
  };

  // Get deliveries for current tab
  const currentDeliveries = getTabDeliveries();

  if (loading) {
    return (
      <div className="mobdel-customer-delivery">
        <div className="mobdel-loading">
          <div className="mobdel-spinner"></div>
          <p>Loading deliveries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobdel-customer-delivery">
      {/* Mobile Header */}
      <div className="mobdel-mobile-header">
        <div className="mobdel-mobile-header-top">
          <h1 className="mobdel-customer-title">My Deliveries</h1>
          <button
            className="mobdel-mobile-filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            {(statusFilter !== "all" || dateFilter) && (
              <span className="mobdel-filter-indicator"></span>
            )}
          </button>
        </div>

        {/* Mobile Tabs - Scrollable */}
        <div className="mobdel-mobile-tabs">
          <button
            className={`mobdel-mobile-tab ${
              activeTab === "upcoming" ? "active" : ""
            }`}
            onClick={() => handleTabChange("upcoming")}
          >
            Upcoming
            <span className="mobdel-mobile-tab-count">
              {categorizedDeliveries.upcoming.length}
            </span>
          </button>
          <button
            className={`mobdel-mobile-tab ${
              activeTab === "delivered" ? "active" : ""
            }`}
            onClick={() => handleTabChange("delivered")}
          >
            Delivered
            <span className="mobdel-mobile-tab-count">
              {categorizedDeliveries.delivered.length}
            </span>
          </button>
          <button
            className={`mobdel-mobile-tab ${
              activeTab === "overdue" ? "active" : ""
            }`}
            onClick={() => handleTabChange("overdue")}
          >
            Overdue
            <span className="mobdel-mobile-tab-count">
              {categorizedDeliveries.overdue.length}
            </span>
          </button>
        </div>
        <div className="mobdel-remnant">
           <Link to="/dashboard/remnant" className="mobdel-mobile-tab mobdel-rem-tab">
            My Gas Remnant
          </Link>
        </div>
      </div>

      {/* Desktop Header (Hidden on mobile) */}
      <div className="mobdel-desktop-header">
        <h1 className="mobdel-customer-title">My Delivery Schedule</h1>

        {/* Desktop Tabs */}
        <div className="mobdel-desktop-tabs">
          <button
            className={`mobdel-tab ${activeTab === "upcoming" ? "active" : ""}`}
            onClick={() => handleTabChange("upcoming")}
          >
            Upcoming Deliveries
            <span className="mobdel-tab-count">
              {categorizedDeliveries.upcoming.length}
            </span>
          </button>
          <button
            className={`mobdel-tab ${
              activeTab === "delivered" ? "active" : ""
            }`}
            onClick={() => handleTabChange("delivered")}
          >
            Delivered
            <span className="mobdel-tab-count">
              {categorizedDeliveries.delivered.length}
            </span>
          </button>
          <button
            className={`mobdel-tab ${
              activeTab === "overdue" ? "active" : ""
            }`}
            onClick={() => handleTabChange("overdue")}
          >
            Overdue
            <span className="mobdel-tab-count">
              {categorizedDeliveries.overdue.length}
            </span>
          </button>

          <Link to="/dashboard/remnant" className="mobdel-tab">
            My Gas Remnant
          </Link>
        </div>

        {/* Desktop Controls */}
        <div className="mobdel-desktop-controls">
          <div className="mobdel-filter-group">
            <FaCalendarAlt className="mobdel-control-icon" />
            <input
              type="date"
              className="mobdel-filter-input"
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
            />
          </div>

          {activeTab !== "delivered" && (
            <div className="mobdel-filter-group">
              <FaFilter className="mobdel-control-icon" />
              <select
                className="mobdel-filter-select"
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
              </select>
            </div>
          )}

          <div className="mobdel-sort-group">
            <FaSort className="mobdel-control-icon" />
            <button className="mobdel-sort-btn" onClick={handleSortOrderChange}>
              {sortOrder === "asc" ? "Nearest First" : "Furthest First"}
            </button>
          </div>

          {(statusFilter !== "all" || dateFilter) && (
            <button className="mobdel-clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="mobdel-mobile-filter-panel">
          <div className="mobdel-filter-panel-header">
            <h3>Filters</h3>
            <button onClick={() => setShowFilters(false)}>
              <FaTimesCircle />
            </button>
          </div>

          <div className="mobdel-filter-panel-content">
            <div className="mobdel-mobile-filter-group">
              <label>Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => handleDateFilterChange(e.target.value)}
                className="mobdel-mobile-filter-input"
              />
            </div>

            {activeTab !== "delivered" && (
              <div className="mobdel-mobile-filter-group">
                <label>Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                  className="mobdel-mobile-filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="accepted">Accepted</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            )}

            <div className="mobdel-mobile-filter-group">
              <label>Sort Order</label>
              <button
                className="mobdel-mobile-sort-btn"
                onClick={handleSortOrderChange}
              >
                {sortOrder === "asc" ? "Nearest First" : "Furthest First"}
              </button>
            </div>

            {(statusFilter !== "all" || dateFilter) && (
              <button
                className="mobdel-mobile-clear-btn"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      )}

      <div className="mobdel-deliveries-list">
        {currentDeliveries.map((delivery) => {
          const timeContext = getDeliveryTimeContext(delivery);

          return (
            <div key={delivery._id} className="mobdel-delivery-card">
              {/* Mobile Card View */}
              <div className="mobdel-mobile-card">
                <div className="mobdel-mobile-card-header">
                  <div className="mobdel-mobile-card-left">
                    <div
                      className={`mobdel-mobile-time-badge mobdel-time-${timeContext.type}`}
                    >
                      {timeContext.icon}
                      <span>{timeContext.text}</span>
                    </div>
                    <span className={getStatusClass(delivery.status)}>
                      {delivery.status
                        .replace(/_/g, " ")
                        .charAt(0)
                        .toUpperCase() + delivery.status.slice(1)}
                    </span>
                  </div>
                  <span className="mobdel-mobile-date">
                    {formatDateShort(delivery.deliveryDate)}
                  </span>
                </div>

                <div className="mobdel-mobile-card-body">
                  <div className="mobdel-mobile-plan-info">
                    <h3>{delivery.subscriptionId?.planName || "N/A"}</h3>
                    <p>
                      {delivery.subscriptionId?.size || "N/A"} •{" "}
                      {delivery.subscriptionId?.frequency || "N/A"}
                    </p>
                  </div>

                  <div className="mobdel-mobile-details">
                    <div className="mobdel-mobile-detail-row">
                      <FaMapMarkerAlt className="mobdel-icon" />
                      <span className="mobdel-mobile-detail-text">
                        {delivery.address?.length > 40
                          ? delivery.address.substring(0, 40) + "..."
                          : delivery.address}
                      </span>
                    </div>

                    {delivery.deliveryAgent && (
                      <div className="mobdel-mobile-detail-row">
                        <FaUser className="mobdel-icon" />
                        <span className="mobdel-mobile-detail-text">
                          {delivery.deliveryAgent.firstName}{" "}
                          {delivery.deliveryAgent.lastName}
                        </span>
                      </div>
                    )}

                    {delivery.deliveredAt && (
                      <div className="mobdel-mobile-detail-row">
                        <FaTruck className="mobdel-icon" />
                        <span className="mobdel-mobile-detail-text">
                          Delivered: {formatDateShort(delivery.deliveredAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {delivery.failedReason && (
                    <div className="mobdel-mobile-error">
                      <FaTimesCircle /> {delivery.failedReason}
                    </div>
                  )}

                  {delivery.customerConfirmation?.confirmed && (
                    <div className="mobdel-mobile-confirmed">
                      <FaCheckCircle /> Confirmed
                    </div>
                  )}
                </div>

                <div className="mobdel-mobile-card-footer">
                  {delivery.retryCount > 0 && (
                    <div className="mobdel-mobile-retry">
                      Retry attempt: {delivery.retryCount}
                    </div>
                  )}
                  
                  {delivery.status === "delivered" &&
                    !delivery.customerConfirmation?.confirmed && (
                      <button
                        className="mobdel-mobile-confirm-btn"
                        onClick={() => {
                          setSelectedDelivery(delivery);
                          setConfirmDialogOpen(true);
                        }}
                      >
                        <FaCheckCircle /> Confirm Delivery
                      </button>
                    )}
                </div>
              </div>

              {/* Desktop Card View */}
              <div className="mobdel-desktop-card">
                <div className="mobdel-card-content">
                  <div
                    className={`mobdel-time-context mobdel-time-${timeContext.type}`}
                  >
                    {timeContext.icon}
                    <span>{timeContext.text}</span>
                  </div>

                  <div className="mobdel-card-header">
                    <span className={getStatusClass(delivery.status)}>
                      {delivery.status.replace(/_/g, " ").toUpperCase()}
                    </span>
                    <span className="mobdel-delivery-date">
                      {formatDateShort(delivery.deliveryDate)}
                    </span>
                  </div>

                  <div className="mobdel-plan-info">
                    <div className="mobdel-plan-name">
                      {delivery.subscriptionId?.planName || "N/A"} -{" "}
                      {delivery.subscriptionId?.size || "N/A"}
                    </div>
                    {delivery.subscriptionId?.frequency && (
                      <div className="mobdel-plan-frequency">
                        Frequency: {delivery.subscriptionId.frequency}
                      </div>
                    )}
                  </div>

                  <div className="mobdel-delivery-details">
                    <div className="mobdel-detail-item">
                      <FaMapMarkerAlt className="mobdel-icon" />
                      <div className="mobdel-detail-text">
                        {delivery.address}
                      </div>
                    </div>

                    {delivery.deliveryAgent && (
                      <div className="mobdel-agent-info">
                        <div className="mobdel-detail-item">
                          <FaUser className="mobdel-icon" />
                          <div className="mobdel-detail-text">
                            <span className="mobdel-detail-label">
                              Delivery Agent:
                            </span>{" "}
                            {delivery.deliveryAgent.firstName}{" "}
                            {delivery.deliveryAgent.lastName}
                          </div>
                        </div>
                        {delivery.deliveryAgent.phone && (
                          <div className="mobdel-detail-item">
                            <FaPhone className="mobdel-icon" />
                            <div className="mobdel-detail-text">
                              <span className="mobdel-detail-label">
                                Phone:
                              </span>{" "}
                              {delivery.deliveryAgent.phone}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {delivery.deliveredAt && (
                      <div className="mobdel-detail-item">
                        <FaTruck className="mobdel-icon" />
                        <div className="mobdel-detail-text">
                          <span className="mobdel-detail-label">
                            Delivered:
                          </span>{" "}
                          {formatDate(delivery.deliveredAt)}
                        </div>
                      </div>
                    )}

                    {delivery.agentNotes && (
                      <div className="mobdel-detail-item">
                        <FaClock className="mobdel-icon" />
                        <div className="mobdel-detail-text">
                          <span className="mobdel-detail-label">
                            Agent Notes:
                          </span>{" "}
                          {delivery.agentNotes}
                        </div>
                      </div>
                    )}

                    {delivery.failedReason && (
                      <div className="mobdel-status-message mobdel-message-error">
                        <div>
                          <FaTimesCircle className="mobdel-icon" />
                          <strong> Failure Reason:</strong>{" "}
                          {delivery.failedReason}
                        </div>
                      </div>
                    )}

                    {delivery.customerConfirmation?.confirmed && (
                      <div className="mobdel-status-message mobdel-message-confirmed">
                        <div>
                          <FaCheckCircle className="mobdel-icon" />
                          <strong> Confirmed by you on:</strong>{" "}
                          {formatDate(
                            delivery.customerConfirmation.confirmedAt
                          )}
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

                  <div className="mobdel-card-footer">
                    <div className="mobdel-delivery-meta">
                      {delivery.retryCount > 0 && (
                        <div style={{ color: "#f39c12", fontSize: "0.9rem" }}>
                          Retry attempt: {delivery.retryCount}
                        </div>
                      )}
                    </div>

                    {delivery.status === "delivered" &&
                      !delivery.customerConfirmation?.confirmed && (
                        <button
                          className="mobdel-btn mobdel-btn-success"
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setConfirmDialogOpen(true);
                          }}
                        >
                          <FaCheckCircle className="mobdel-icon" />
                          Confirm Delivery
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {currentDeliveries.length === 0 && (
          <div className="mobdel-empty-state">
            <div className="mobdel-empty-state-icon">
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
                className="mobdel-btn mobdel-btn-outline"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Mobile Pagination */}
      <div className="mobdel-mobile-pagination">
        <button
          className="mobdel-mobile-page-btn"
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          <FaChevronLeft />
        </button>
        <span className="mobdel-mobile-page-info">
          Page {page} of {totalPages}
        </span>
        <button
          className="mobdel-mobile-page-btn"
          disabled={page >= totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Desktop Pagination */}
      {totalPages > 1 && (
        <div className="mobdel-desktop-pagination">
          <div className="mobdel-pagination-info">
            Page {page} of {totalPages} • Showing {currentDeliveries.length} deliveries
            • Sorted: {sortOrder === "asc" ? "Nearest First" : "Furthest First"}
            {dateFilter && ` • Date: ${dateFilter}`}
            {statusFilter !== "all" && ` • Status: ${statusFilter}`}
          </div>
          <div className="mobdel-pagination-buttons">
            <button
              className="mobdel-page-btn"
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
                  className={`mobdel-page-btn ${
                    page === pageNumber ? "active" : ""
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              className="mobdel-page-btn"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Mobile Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="mobdel-mobile-dialog-overlay">
          <div className="mobdel-mobile-dialog">
            <div className="mobdel-mobile-dialog-header">
              <h2>Confirm Delivery</h2>
              <button onClick={() => setConfirmDialogOpen(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="mobdel-mobile-dialog-content">
              <p>
                Please confirm that you have received your{" "}
                {selectedDelivery?.subscriptionId?.planName} delivery.
              </p>
              <div className="mobdel-mobile-form-group">
                <label>Delivery Notes (Optional)</label>
                <textarea
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  placeholder="Add any comments..."
                  rows={3}
                />
              </div>
            </div>
            <div className="mobdel-mobile-dialog-footer">
              <button
                className="mobdel-mobile-dialog-btn secondary"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="mobdel-mobile-dialog-btn primary"
                onClick={handleConfirmDelivery}
              >
                <FaCheckCircle /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Confirmation Dialog */}
      {confirmDialogOpen && (
        <div className="mobdel-dialog-overlay">
          <div className="mobdel-dialog">
            <div className="mobdel-dialog-header">
              <h2 className="mobdel-dialog-title">Confirm Delivery</h2>
            </div>
            <div className="mobdel-dialog-content">
              <p style={{ marginBottom: "1rem", color: "#7f8c8d" }}>
                Please confirm that you have received your{" "}
                {selectedDelivery?.subscriptionId?.planName} delivery.
              </p>
              <div className="mobdel-form-group">
                <label className="mobdel-form-label">
                  Delivery Notes (Optional)
                </label>
                <textarea
                  className="mobdel-form-textarea"
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  placeholder="Add any comments about the delivery service..."
                  rows={3}
                />
              </div>
            </div>
            <div className="mobdel-dialog-footer">
              <button
                className="mobdel-btn mobdel-btn-outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </button>
              <button
                className="mobdel-btn mobdel-btn-success"
                onClick={handleConfirmDelivery}
              >
                <FaCheckCircle className="mobdel-icon" />
                Confirm Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Snackbar */}
      {snackbar.open && (
        <div className={`mobdel-mobile-snackbar ${snackbar.severity}`}>
          {snackbar.severity === "success" ? (
            <FaCheckCircle />
          ) : (
            <FaTimesCircle />
          )}
          <span>{snackbar.message}</span>
        </div>
      )}

      {/* Desktop Snackbar */}
      {snackbar.open && (
        <div className={`mobdel-snackbar ${snackbar.severity}`}>
          {snackbar.severity === "success" ? (
            <FaCheckCircle className="mobdel-icon" />
          ) : (
            <FaTimesCircle className="mobdel-icon" />
          )}
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default MobileCustomerDeliveryHistory;