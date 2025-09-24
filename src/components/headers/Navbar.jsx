import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ isMenuOpen, location, user, authLoading }) => {
  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className={`nav-links ${isMenuOpen ? "active" : ""}`}>
      <Link to="/" className={isActive("/")}>
        Home
      </Link>
      <Link to="/products" className={isActive("/products")}>
        Products
      </Link>
      <Link to="/services" className={isActive("/services")}>
        Services
      </Link>
      <Link to="/contact" className={isActive("/contact")}>
        Contact
      </Link>
      <Link to="/about" className={isActive("/about")}>
        About
      </Link>
      {!authLoading && user && (
        <Link to="/dashboard" className={isActive("/dashboard")}>
          Dashboard
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
