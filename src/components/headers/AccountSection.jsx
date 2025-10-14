import React from "react";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/AccountSection.css";

const AccountSection = ({ onLoginClick }) => {
  const { user, logout } = useAuth();

  return (
    <div className="account-section">
      {user ? (
        <div className="account-info">
          {user.profilePic && user.profilePic !== "default.jpg" ? (
            <img src={user.profilePic} alt="profile" className="profile-pic" />
          ) : (
            <div className="profile-placeholder">
              <FaUser className="user-icon" />
            </div>
          )}

          <span className="user-name">{user.firstName || user.email}</span>

          <button className="acc-sec-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <button className="login-btn" onClick={onLoginClick}>
          Sign in
        </button>
      )}
    </div>
  );
};

export default AccountSection;
