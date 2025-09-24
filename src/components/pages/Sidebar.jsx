import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaCalendarCheck, 
  FaHistory, 
  FaWallet, 
  FaUser, 
  FaHeadset, 
  FaCog 
} from "react-icons/fa";
import "../../styles/Sidebar.css";

const Sidebar = ({ currentPage, onNavigate }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isExpanded, setIsExpanded] = useState(!isMobile);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menuItems = [
  { id: "overview", icon: <FaTachometerAlt />, label: "Overview" },
  { id: "orders", icon: <FaTachometerAlt />, label: "Order Gas" },
  { id: "subscriptions", icon: <FaCalendarCheck />, label: "Subscriptions" },
  { id: "order_history", icon: <FaHistory />, label: "Order History" },
  { id: "payment", icon: <FaWallet />, label: "Payments" },
  { id: "profile", icon: <FaUser />, label: "Profile" },
  { id: "support", icon: <FaHeadset />, label: "Support" },
  { id: "settings", icon: <FaCog />, label: "Settings" },
];

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.user) setUserData(data.user);
        else setError("No user data received");
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsExpanded(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  const getUserInitials = (firstName) => {
    if (!firstName) return "U";
    return firstName
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className={`hamburger ${isExpanded ? "active" : ""}`}
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay for mobile */}
      {isMobile && isExpanded && (
        <div className="sidebar-overlay" onClick={() => setIsExpanded(false)} />
      )}

      <div className={`sidebar ${isExpanded ? "expanded" : "collapsed"}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-gas-pump"></i>
            {isExpanded && <span className="logo-text">e-Gas</span>}
          </div>
          {isExpanded && (
            <button className="close-sidebar" onClick={toggleSidebar} aria-label="Close menu">
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        {/* Menu */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.id}
              to={`/dashboard/${item.id}`}
              className={({ isActive }) =>
                `nav-item ${isActive || currentPage === item.id ? "active" : ""}`
              }
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => {
                onNavigate(item.id);
                if (isMobile) setIsExpanded(false);
              }}
            >
              <i className={`${item.icon} nav-icon`}></i>
              {isExpanded && <span className="nav-label">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer with user */}
        <div className="sidebar-footer">
          {loading ? (
            <div className="user-loading">
              <div className="loading-spinner"></div>
              {isExpanded && <span>Loading user data...</span>}
            </div>
          ) : error ? (
            <div className="user-error">
              <i className="fas fa-exclamation-triangle"></i>
              {isExpanded && <span>{error}</span>}
            </div>
          ) : userData ? (
            <>
              <div className="user-avatar">
                {userData.avatar ? (
                  <img src={userData.avatar} alt="User avatar" />
                ) : (
                  <span className="user-initials">{getUserInitials(userData.firstName)}</span>
                )}
              </div>
              {isExpanded && (
                <div className="user-info">
                  <div className="user-name">{userData.firstName || "User"}</div>
                  <div className="user-role">{userData.role || "Customer"}</div>
                  <button className="logout-btn" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="user-placeholder">
              <i className="fas fa-user"></i>
              {isExpanded && <span>No user data</span>}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
