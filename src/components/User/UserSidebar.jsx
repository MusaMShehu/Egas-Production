import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaRedo,
  FaShippingFast,
  FaHistory,
  FaCreditCard,
  FaUser,
  FaHeadset,
  FaCog,
  FaArrowLeft,
  FaArrowRight,
  FaBars,
} from "react-icons/fa";
import "./UserSidebar.css";

const UserSidebar = () => {
  const [hidden, setHidden] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle screen resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setHidden(mobile); // hide on mobile
      setExpanded(!mobile); // expanded on desktop
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Dispatch sidebar state to layout (for responsive content width)
  useEffect(() => {
    const event = new CustomEvent("sidebarStateChange", {
      detail: { hidden, collapsed: !expanded && !hidden },
    });
    window.dispatchEvent(event);
  }, [hidden, expanded]);

  // NEW: Switch button functions
  const toggleExpandCollapse = () => setExpanded((prev) => !prev); // for arrows
  const toggleShowHide = () => setHidden((prev) => !prev); // for hamburger

  const menuItems = [
    { path: "overview", icon: <FaTachometerAlt />, label: "Overview" },
    { path: "/subscription-plan", icon: <FaShoppingCart />, label: "Refill" },
    { path: "subscriptions", icon: <FaRedo />, label: "Subscriptions" },
    { path: "delivery", icon: <FaShippingFast />, label: "Delivery" },
    { path: "history", icon: <FaHistory />, label: "History" },
    { path: "payments", icon: <FaCreditCard />, label: "Payments" },
    { path: "profile", icon: <FaUser />, label: "Profile" },
    { path: "support", icon: <FaHeadset />, label: "Support" },
    { path: "settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <>
      <aside
        className={`user-sidebar ${hidden ? "hidden" : ""} ${
          expanded ? "expanded" : "collapsed"
        }`}
      >
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
                {(expanded || !isMobile) && (
                  <span className="user-label">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      {/* Toggle Controls */}
      <div className="sidebar-toggle-container">
       

        {/* HAMBURGER now hides/shows */}
        {isMobile && (
          <button
            className={`hamburger-toggle ${hidden ? "collapsed" : "open"}`}
            onClick={toggleShowHide}
            aria-label="Hide/Show Sidebar"
          >
            <FaBars />
          </button>
        )}
        
         {/* ARROW now expands/collapses */}
        <button
          className={`sidebar-toggle ${expanded ? "" : "collapsed"}`}
          onClick={toggleExpandCollapse}
          aria-label="Expand/Collapse Sidebar"
        >
          {expanded ? <FaArrowLeft /> : <FaArrowRight />}
        </button>
      </div>
    </>
  );
};

export default UserSidebar;