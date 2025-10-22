// components/UserManagement.js
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FaPlus, FaHistory } from "react-icons/fa";
import UserList from "./UserList";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";
import BulkActions from "./BulkActions";
import ExportModal from "./ExportModal";
import ImportModal from "./ImportModal";
import ActivityLog from "./ActivityLog";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    role: "all",
    status: "all",
    city: "all",
    state: "all",
    gender: "all",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Available roles based on your model
  const availableRoles = [
    { value: "user", label: "User" },
    { value: "admin", label: "Administrator" },
    { value: "delivery", label: "Delivery" },
    { value: "customer_care", label: "Customer Care" },
  ];

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem("token") || localStorage.getItem("adminToken");
  };

  useEffect(() => {
    fetchUsers();
  }, [filters, sortConfig, pagination.currentPage, pagination.itemsPerPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.role !== "all" && { role: filters.role }),
        ...(filters.status !== "all" && {
          status: filters.status === "active" ? "true" : "false",
        }),
        ...(filters.city !== "all" && { city: filters.city }),
        ...(filters.state !== "all" && { state: filters.state }),
        ...(filters.gender !== "all" && { gender: filters.gender }),
        ...(sortConfig.key && { sortBy: sortConfig.key }),
        ...(sortConfig.key && { sortOrder: sortConfig.direction }),
      });

      const response = await fetch(
        `http://localhost:5000/api/v1/admin/users?${params}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setUsers(data.data.users || []);
        setPagination((prev) => ({
          ...prev,
          totalItems:
            data.total || data.count || (data.data.users?.length ?? 0),
        }));
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      setError(error.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addNotification = useCallback((message, type = "info") => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date() };
    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      const token = getAuthToken();
      const response = await fetch("http://localhost:5000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => [...prev, data.data.user]);
        setView("list");
        addNotification("User created successfully", "success");
        return { success: true, message: "User created successfully" };
      } else {
        addNotification(data.message || "Failed to create user", "error");
        return {
          success: false,
          message: data.message || "Failed to create user",
        };
      }
    } catch (error) {
      addNotification("Network error. Please try again.", "error");
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/v1/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) => (user._id === userId ? data.data.user : user))
        );
        setView("list");
        addNotification("User updated successfully", "success");
        return { success: true, message: "User updated successfully" };
      } else {
        addNotification(data.message || "Failed to update user", "error");
        return {
          success: false,
          message: data.message || "Failed to update user",
        };
      }
    } catch (error) {
      addNotification("Network error. Please try again.", "error");
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return { success: false, message: "Deletion cancelled" };
    }

    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        addNotification("User deleted successfully", "success");
        return { success: true, message: "User deleted successfully" };
      } else {
        addNotification(data.message || "Failed to delete user", "error");
        return {
          success: false,
          message: data.message || "Failed to delete user",
        };
      }
    } catch (error) {
      addNotification("Network error. Please try again.", "error");
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedUsers.size} users?`
      )
    ) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(
        "http://localhost:5000/api/v1/users/bulk/delete",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userIds: Array.from(selectedUsers) }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => !selectedUsers.has(user._id)));
        setSelectedUsers(new Set());
        addNotification(
          `${selectedUsers.size} users deleted successfully`,
          "success"
        );
        fetchUsers(); // Refresh the list
      } else {
        addNotification(data.message || "Failed to delete users", "error");
      }
    } catch (error) {
      addNotification("Network error. Please try again.", "error");
    }
  };

  const handleBulkStatusUpdate = async (isActive) => {
    if (selectedUsers.size === 0) return;

    try {
      const token = getAuthToken();
      const response = await fetch(
        "http://localhost:5000/api/v1/users/bulk/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userIds: Array.from(selectedUsers),
            isActive,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        addNotification(
          `${selectedUsers.size} users ${
            isActive ? "activated" : "deactivated"
          } successfully`,
          "success"
        );
        fetchUsers(); // Refresh the list
        setSelectedUsers(new Set());
      } else {
        addNotification(data.message || "Failed to update users", "error");
      }
    } catch (error) {
      addNotification("Network error. Please try again.", "error");
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/v1/users/${userId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) => (user._id === userId ? data.data.user : user))
        );
        addNotification(
          `User ${isActive ? "activated" : "deactivated"} successfully`,
          "success"
        );
        return { success: true };
      } else {
        addNotification(
          data.message || "Failed to update user status",
          "error"
        );
        return { success: false, message: data.message };
      }
    } catch (error) {
      addNotification("Network error. Please try again.", "error");
      return { success: false, message: "Network error" };
    }
  };

  const handleUpdateWalletBalance = async (userId, amount, operation) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:5000/api/v1/users/${userId}/wallet`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, operation }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((user) => (user._id === userId ? data.data.user : user))
        );
        addNotification("Wallet balance updated successfully", "success");
        return { success: true };
      } else {
        addNotification(
          data.message || "Failed to update wallet balance",
          "error"
        );
        return { success: false, message: data.message };
      }
    } catch (error) {
      addNotification("Network error. Please try again.", "error");
      return { success: false, message: "Network error" };
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users;

    // Client-side filtering for better UX (server does main filtering)
    filtered = filtered.filter((user) => {
      const matchesSearch = searchTerm
        ? user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone?.includes(searchTerm)
        : true;

      return matchesSearch;
    });

    // Client-side sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === "createdAt" || sortConfig.key === "dob") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [users, searchTerm, sortConfig]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage) => {
    setPagination({
      currentPage: 1,
      itemsPerPage,
      totalItems: pagination.totalItems,
    });
  };

  const handleUserSelect = (userId, isSelected) => {
    setSelectedUsers((prev) => {
      const newSelection = new Set(prev);
      if (isSelected) {
        newSelection.add(userId);
      } else {
        newSelection.delete(userId);
      }
      return newSelection;
    });
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedUsers(new Set(filteredAndSortedUsers.map((user) => user._id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const renderView = () => {
    switch (view) {
      case "create":
        return (
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setView("list")}
            mode="create"
            availableRoles={availableRoles}
          />
        );
      case "edit":
        return (
          <UserForm
            user={selectedUser}
            onSubmit={(data) => handleUpdateUser(selectedUser._id, data)}
            onCancel={() => setView("list")}
            mode="edit"
            availableRoles={availableRoles}
          />
        );
      case "details":
        return (
          <UserDetails
            user={selectedUser}
            onEdit={() => setView("edit")}
            onBack={() => setView("list")}
            onToggleStatus={handleToggleStatus}
            onUpdateWalletBalance={handleUpdateWalletBalance}
            availableRoles={availableRoles}
          />
        );
      default:
        return (
          <>
            <BulkActions
              selectedCount={selectedUsers.size}
              onBulkDelete={handleBulkDelete}
              onBulkActivate={() => handleBulkStatusUpdate(true)}
              onBulkDeactivate={() => handleBulkStatusUpdate(false)}
              onExport={() => setShowExportModal(true)}
              onImport={() => setShowImportModal(true)}
            />

            <UserList
              users={filteredAndSortedUsers}
              loading={loading}
              error={error}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filters={filters}
              onFiltersChange={setFilters}
              sortConfig={sortConfig}
              onSort={handleSort}
              pagination={pagination}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              selectedUsers={selectedUsers}
              onUserSelect={handleUserSelect}
              onSelectAll={handleSelectAll}
              onViewUser={(user) => {
                setSelectedUser(user);
                setView("details");
              }}
              onEditUser={(user) => {
                setSelectedUser(user);
                setView("edit");
              }}
              onDeleteUser={handleDeleteUser}
              onToggleStatus={handleToggleStatus}
              onCreateUser={() => setView("create")}
              onRefresh={fetchUsers}
              availableRoles={availableRoles}
            />
          </>
        );
    }
  };

  // Unique className prefix =aum (admin user management)
  return (
    <div className="aum-user-management">
      {/* Notifications */}
      <div className="aum-notifications-container">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`aum-notification ${notification.type}`}
          >
            <span>{notification.message}</span>
            <button
              onClick={() =>
                setNotifications((prev) =>
                  prev.filter((n) => n.id !== notification.id)
                )
              }
              className="aum-notification-close"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="aum-user-management-header">
        <div className="aum-header-left">
          <h1 className="aum-user-management-title">User Management</h1>
          <span className="aum-user-count">({pagination.totalItems} users)</span>
        </div>

        <div className="aum-header-actions">
          {view === "list" && (
            <>
              <button
                onClick={() => setShowActivityLog(true)}
                className="aum-btn aum-btn-secondary"
              >
                <FaHistory /> Activity Log
              </button>
              <button
                onClick={() => setView("create")}
                className="aum-btn aum-btn-primary"
              >
                <FaPlus /> Add New User
              </button>
            </>
          )}
        </div>
      </div>

      {renderView()}

      {/* Modals */}
      {showExportModal && (
        <ExportModal
          users={filteredAndSortedUsers}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImportSuccess={fetchUsers}
        />
      )}

      {showActivityLog && (
        <ActivityLog onClose={() => setShowActivityLog(false)} />
      )}
    </div>
  );
};

export default UserManagement;