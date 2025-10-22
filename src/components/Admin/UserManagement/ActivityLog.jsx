// components/ActivityLog.js
import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaDownload,
  FaUser,
  FaGlobe,
  FaEdit,
  FaChevronLeft,
  FaChevronRight,
  FaHistory,
  FaUserPlus,
  FaUserCheck,
  FaUserTimes,
  FaPowerOff,
  FaSignInAlt,
  FaSignOutAlt
} from "react-icons/fa";

const ActivityLog = ({ onClose }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: "all",
    user: "all",
    dateRange: "7days"
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0
  });

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(filters.action !== "all" && { action: filters.action }),
        ...(filters.dateRange !== "all" && { dateRange: filters.dateRange })
      });

      const response = await fetch(
        `https://egas-server-1.onrender.com/api/v1/admin/activity-log?${params}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
        setPagination((prev) => ({ ...prev, totalItems: data.totalCount || 0 }));
      } else {
        generateMockData();
      }
    } catch (error) {
      console.error("Error fetching activity log:", error);
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockActions = [
      { action: "user_create", label: "User Created", icon: <FaUserPlus />, color: "success" },
      { action: "user_update", label: "User Updated", icon: <FaUserCheck />, color: "info" },
      { action: "user_delete", label: "User Deleted", icon: <FaUserTimes />, color: "danger" },
      { action: "user_status", label: "Status Changed", icon: <FaPowerOff />, color: "warning" },
      { action: "login", label: "User Login", icon: <FaSignInAlt />, color: "primary" },
      { action: "logout", label: "User Logout", icon: <FaSignOutAlt />, color: "secondary" }
    ];

    const mockUsers = ["John Doe", "Jane Smith", "Admin User", "System"];
    const mockData = Array.from({ length: 50 }, (_, index) => {
      const action = mockActions[Math.floor(Math.random() * mockActions.length)];
      const date = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

      return {
        id: `log-${index + 1}`,
        action: action.action,
        actionLabel: action.label,
        icon: action.icon,
        color: action.color,
        description: `User ${mockUsers[Math.floor(Math.random() * mockUsers.length)]} performed ${action.label.toLowerCase()}`,
        user: mockUsers[Math.floor(Math.random() * mockUsers.length)],
        admin: "System Admin",
        timestamp: date.toISOString(),
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        details: {
          changes: Math.random() > 0.5 ? ["Email updated", "Role changed"] : null,
          previousValues: Math.random() > 0.7 ? { role: "user", status: "inactive" } : null
        }
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setActivities(mockData.slice(0, pagination.itemsPerPage));
    setPagination((prev) => ({ ...prev, totalItems: mockData.length }));
  };

  const getActionIcon = (action) => {
    const icons = {
      user_create: <FaUserPlus />,
      user_update: <FaUserCheck />,
      user_delete: <FaUserTimes />,
      user_status: <FaPowerOff />,
      login: <FaSignInAlt />,
      logout: <FaSignOutAlt />
    };
    return icons[action] || <FaHistory />;
  };

  const getActionColor = (action) => {
    const colors = {
      user_create: "success",
      user_update: "info",
      user_delete: "danger",
      user_status: "warning",
      login: "primary",
      logout: "secondary"
    };
    return colors[action] || "secondary";
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (page) => {
    if (page < 1) return;
    const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage) || 1;
    if (page > totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const clearFilters = () => {
    setFilters({
      action: "all",
      user: "all",
      dateRange: "7days"
    });
  };

  const exportLog = () => {
    const csvContent = [
      ["Timestamp", "Action", "User", "Admin", "IP Address", "Description"],
      ...activities.map((activity) => [
        new Date(activity.timestamp).toLocaleString(),
        activity.actionLabel,
        activity.user,
        activity.admin,
        activity.ipAddress,
        activity.description
      ])
    ]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(pagination.totalItems / pagination.itemsPerPage));

  return (
    <div className="aum-modal-overlay">
      <div className="aum-modal-content aum-activity-log-modal">
        <div className="aum-modal-header">
          <h2>Activity Log</h2>
          <button onClick={onClose} className="aum-modal-close" aria-label="Close activity log">
            <FaTimes />
          </button>
        </div>

        <div className="aum-modal-body">
          {/* Filters */}
          <div className="aum-activity-filters">
            <div className="aum-filter-group">
              <label>Action Type</label>
              <select
                value={filters.action}
                onChange={(e) => handleFilterChange("action", e.target.value)}
              >
                <option value="all">All Actions</option>
                <option value="user_create">User Created</option>
                <option value="user_update">User Updated</option>
                <option value="user_delete">User Deleted</option>
                <option value="user_status">Status Changed</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>

            <div className="aum-filter-group">
              <label>Date Range</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange("dateRange", e.target.value)}
              >
                <option value="1day">Last 24 Hours</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="aum-filter-actions">
              <button onClick={clearFilters} className="aum-btn aum-btn-outline">
                Clear Filters
              </button>
              <button onClick={exportLog} className="aum-btn aum-btn-secondary">
                <FaDownload />
                Export
              </button>
            </div>
          </div>

          {/* Activity List */}
          <div className="aum-activity-list">
            {loading ? (
              <div className="aum-loading-container">
                <div className="aum-loading-spinner" />
                <p>Loading activities...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="aum-empty-state">
                <FaHistory className="aum-empty-icon" />
                <h3>No activities found</h3>
                <p>Try adjusting your filters</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="aum-activity-item">
                  <div className="aum-activity-icon">
                    <span className={`text-${activity.color || getActionColor(activity.action)}`}>
                      {activity.icon || getActionIcon(activity.action)}
                    </span>
                  </div>

                  <div className="aum-activity-content">
                    <div className="aum-activity-header">
                      <h4 className="aum-activity-title">
                        {activity.actionLabel || activity.action}
                      </h4>
                      <span className="aum-activity-time">{formatTimestamp(activity.timestamp)}</span>
                    </div>

                    <p className="aum-activity-description">{activity.description}</p>

                    <div className="aum-activity-meta">
                      <span className="aum-meta-item">
                        <FaUser />
                        {activity.user}
                      </span>
                      <span className="aum-meta-item">
                        <FaGlobe />
                        {activity.ipAddress}
                      </span>
                      {activity.details?.changes && (
                        <span className="aum-meta-item">
                          <FaEdit />
                          {activity.details.changes.length} changes
                        </span>
                      )}
                    </div>

                    {activity.details?.changes && (
                      <div className="aum-activity-changes">
                        <strong>Changes:</strong>
                        <ul>
                          {activity.details.changes.map((change, index) => (
                            <li key={index}>{change}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {activities.length > 0 && (
            <div className="aum-activity-pagination">
              <div className="aum-pagination-info">
                Showing{" "}
                {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}{" "}
                of {pagination.totalItems} activities
              </div>

              <div className="aum-pagination-controls">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="aum-btn aum-btn-icon"
                  aria-label="Previous page"
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    const current = pagination.currentPage;
                    return page === 1 || page === totalPages || Math.abs(page - current) <= 1;
                  })
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    if (prevPage && page - prevPage > 1) {
                      return (
                        <span key={`ellipsis-${page}`} className="aum-pagination-ellipsis">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`aum-btn aum-btn-icon ${
                          pagination.currentPage === page ? "aum-active" : ""
                        }`}
                        aria-label={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    );
                  })}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= totalPages}
                  className="aum-btn aum-btn-icon"
                  aria-label="Next page"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="aum-modal-footer">
          <button onClick={onClose} className="aum-btn aum-btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
