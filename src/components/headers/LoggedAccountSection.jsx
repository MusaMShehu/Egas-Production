// src/components/AccountSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from '../Notifications/FirebaseNotificationBell';
import "../../styles/AccountSection.css";

const AccountSection = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // Don't render anything if not logged in

  const handleLogout = () => {
    logout();
    navigate("/"); // ✅ redirect to home after logout
  };

  return (
    <div className="account-section">
      <button className="acc-sec-logout-btn" onClick={handleLogout}>
        Logout
      </button>
      <NotificationBell />
    </div>
  );
};

export default AccountSection;
