// components/DashboardNavbar.js
import React, { useState } from "react";
import {
  FaBars,
  FaUserCircle,
  FaSignOutAlt,
  FaBell,
  FaHome,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import LoggedAccountSection from "./LoggedAccountSection";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../images/logos.png";
import "./LoggedinNavbar.css";

const DashboardNavbar = ({ onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="logged-navbar">
      <div className="logged-navbar-container">
        {/* Left section: Logo */}
        <div className="logged-navbar-brand">
          <Link to="/" className="logged-navbar-logo">
            <div className="logo">
              <img
                src={logo}
                alt="logo"
                style={{ width: "50px", height: "50px" }}
              />
            </div>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="logged-navbar-menu">
          <Link to="/" className="logged-nav-link">
            <FaHome className="logged-nav-icon" /> Home
          </Link>
          {/* <Link to="/notifications" className="logged-nav-link">
            <FaBell className="logged-nav-icon" /> Notifications
          </Link> */}
          <Link to="/dashboard/profile" className="logged-nav-link">
            <FaUserCircle className="logged-nav-icon" /> Profile
          </Link>
          <LoggedAccountSection/>
        </div>

        {/* Mobile menu button */}
        <div className="logged-mobile-menu-toggle">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="logged-mobile-menu-btn"
            aria-label="Toggle menu">
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="logged-mobile-menu">
          <Link
            to="/"
            className="logged-mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <FaHome className="logged-nav-icon" /> Home
          </Link>
          {/* <Link
            to="/notifications"
            className="logged-mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <FaBell className="logged-nav-icon" /> Notifications
          </Link> */}
          <Link
            to="/profile"
            className="logged-mobile-nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <FaUserCircle className="logged-nav-icon" /> Profile
          </Link>
          <button
            onClick={() => {
              onLogout();
              setMenuOpen(false);
            }}
            className="logged-mobile-logout-btn"
          >
            <FaSignOutAlt className="logged-nav-icon" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
