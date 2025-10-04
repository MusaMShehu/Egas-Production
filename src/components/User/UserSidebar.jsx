// components/Sidebar.js
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaRedo,
  FaHistory,
  FaCreditCard,
  FaUser,
  FaHeadset,
  FaCog,
  FaBars,
} from "react-icons/fa";
import "./UserSidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detect screen resize to switch between mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setCollapsed(false); // always expanded on desktop
      } else {
        setCollapsed(true); // collapsed by default on mobile
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { path: "overview", icon: <FaTachometerAlt />, label: "Overview" },
    { path: "orders", icon: <FaShoppingCart />, label: "Orders" },
    { path: "subscriptions", icon: <FaRedo />, label: "Subscriptions" },
    { path: "history", icon: <FaHistory />, label: "History" },
    { path: "payments", icon: <FaCreditCard />, label: "Payments" },
    { path: "profile", icon: <FaUser />, label: "Profile" },
    { path: "support", icon: <FaHeadset />, label: "Support" },
    { path: "settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className={`user-sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Show hamburger only on mobile */}
      {isMobile && (
        <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <FaBars />
        </div>
      )}

      <ul className="user-sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="user-menu-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `user-menu-link ${isActive ? "active" : ""}`
              }
            >
              <span className="user-icon">{item.icon}</span>
              {!collapsed && <span className="user-label">{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
