// components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Admin.css"; 

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/overview", name: "Dashboard", icon: "fas fa-tachometer-alt" },
    { path: "/admin/users", name: "Users", icon: "fas fa-users" },
    { path: "/admin/orders", name: "Orders", icon: "fas fa-truck" },
    { path: "/admin/products", name: "Products", icon: "fas fa-boxes" },
    { path: "/admin/subscriptions", name: "Subscriptions", icon: "fas fa-calendar-check" },
    { path: "/admin/reports", name: "Reports", icon: "fas fa-chart-line" },
    { path: "/admin/settings", name: "Settings", icon: "fas fa-cog" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <i className="fas fa-fire logo-icon"></i>
        <h1 className="logo-text">e-GAS Admin</h1>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <i className={`${item.icon} sidebar-icon`}></i> {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
