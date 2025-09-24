// components/Sidebar.js
import React from "react";
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
  FaFireAlt,
} from "react-icons/fa";
import "./UserSidebar.css";

const Sidebar = () => {
  const menuItems = [
    { path: "dashboard", icon: <FaTachometerAlt />, label: "Overview" },
    { path: "orders", icon: <FaShoppingCart />, label: "Orders" },
    { path: "subscriptions", icon: <FaRedo />, label: "Subscriptions" },
    { path: "history", icon: <FaHistory />, label: "History" },
    { path: "payments", icon: <FaCreditCard />, label: "Payments" },
    { path: "profile", icon: <FaUser />, label: "Profile" },
    { path: "support", icon: <FaHeadset />, label: "Support" },
    { path: "settings", icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>
          <FaFireAlt className="brand-icon" /> GasDelivery
        </h2>
      </div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="menu-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `menu-link ${isActive ? "active" : ""}`
              }
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
