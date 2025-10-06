// components/Header.js
import React from "react";
import "./Admin.css"; // 👈 external CSS

const Header = () => {
  return (
    <header className="panel-header">
      <h1 className="panel-header-title">Dashboard Overview</h1>
      <div className="panel-header-actions">
        <div className="notification">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">0</span>
        </div>
        <span className="username">Administrator</span>
        <button className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
