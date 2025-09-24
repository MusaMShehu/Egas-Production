// components/UserManagement.js
import React, { useState, useEffect } from "react";
import UserList from "./UserList";
import UserForm from "./UserForm";
import UserDetails from "./UserDetails";
import "./UserManagement.css"; 

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("list"); // 'list', 'create', 'edit', 'details'
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/v1/admin/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers([...users, data.user]);
        setView("list");
        return { success: true, message: "User created successfully" };
      } else {
        return {
          success: false,
          message: data.message || "Failed to create user",
        };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.map((user) => (user._id === userId ? data.user : user)));
        setView("list");
        return { success: true, message: "User updated successfully" };
      } else {
        return {
          success: false,
          message: data.message || "Failed to update user",
        };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        return { success: true, message: "User deleted successfully" };
      } else {
        return {
          success: false,
          message: data.message || "Failed to delete user",
        };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(users.map((user) => (user._id === userId ? data.user : user)));
        return {
          success: true,
          message: `User ${
            isActive ? "activated" : "deactivated"
          } successfully`,
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to update user status",
        };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      user.isActive === (filterStatus === "active");

    return matchesSearch && matchesRole && matchesStatus;
  });

  const renderView = () => {
    switch (view) {
      case "create":
        return (
          <UserForm
            onSubmit={handleCreateUser}
            onCancel={() => setView("list")}
            mode="create"
          />
        );
      case "edit":
        return (
          <UserForm
            user={selectedUser}
            onSubmit={(data) => handleUpdateUser(selectedUser._id, data)}
            onCancel={() => setView("list")}
            mode="edit"
          />
        );
      case "details":
        return (
          <UserDetails
            user={selectedUser}
            onEdit={() => setView("edit")}
            onBack={() => setView("list")}
            onToggleStatus={handleToggleStatus}
          />
        );
      default:
        return (
          <UserList
            users={filteredUsers}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterRole={filterRole}
            onFilterRoleChange={setFilterRole}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            onViewUser={(user) => {
              setSelectedUser(user);
              setView("details");
            }}
            onEditUser={(user) => {
              setSelectedUser(user);
              setView("edit");
            }}
            onDeleteUser={handleDeleteUser}
            onCreateUser={() => setView("create")}
            onRefresh={fetchUsers}
          />
        );
    }
  };

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1 className="user-management-title">User Management</h1>
        {view === "list" && (
          <button
            onClick={() => setView("create")}
            className="add-user-btn"
          >
            <i className="fas fa-plus"></i> Add New User
          </button>
        )}
      </div>

      {renderView()}
    </div>
  );
};

export default UserManagement;
