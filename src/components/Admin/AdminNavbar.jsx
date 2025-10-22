// components/Navbar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Admin.css"; 

const Navbar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/overview", name: "Dashboard", icon: "fas fa-tachometer-alt" },
    { path: "/admin/users", name: "Users", icon: "fas fa-users" },
    { path: "/admin/orders", name: "Orders", icon: "fas fa-truck" },
    { path: "/admin/products", name: "Products", icon: "fas fa-boxes" },
    { path: "/admin/subscriptions", name: "Subscriptions", icon: "fas fa-calendar-check" },
    { path: "/admin/reports", name: "Reports", icon: "fas fa-chart-line" },
    { path: "/admin/support", name: "Support", icon: "fas fa-headset" },
    { path: "/admin/deliveries", name: "Delivery", icon: "fas fa-shipping-fast" },
    { path: "/admin/settings", name: "Settings", icon: "fas fa-cog" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <i className="fas fa-fire logo-icon"></i>
        <h1 className="logo-text">e-GAS Admin</h1>
      </div>
      <div className="navbar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-link ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <i className={`${item.icon} nav-icon`}></i> 
            <span className="nav-text">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;