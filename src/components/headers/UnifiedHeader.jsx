import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaBars, FaChevronDown, FaSignOutAlt, FaUserCircle, FaTachometerAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import NotificationBell from '../Notifications/FirebaseNotificationBell';
import logo from "../../images/logo.png";
import "./UnifiedHeader.css";


const UnifiedHeader = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLoginClick = () => navigate("/auth");
  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  // Get profile image URL from user object (supports various formats)
  const getProfileImageUrl = () => {
    if (!user || !user.profileImage) return null;
    if (typeof user.profileImage === 'string') {
      if (user.profileImage.startsWith('http')) return user.profileImage;
      return user.profileImage === "default.jpg" ? null : user.profileImage;
    }
    return user.profileImage.secure_url || user.profileImage.url || null;
  };

  // Get user display name for dropdown
  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.name) return user.name;
    return user.email ? user.email.split('@')[0] : "User";
  };

  const profileImageUrl = getProfileImageUrl();
  const isAuthenticated = !authLoading && user;

  return (
    <header className="unified-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <Link to="/" className="logo-link">
            <img src={logo} alt="Company Logo" className="logo-image" />
            <span className="logo-text">e-GAS</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav desktop-nav">
          <Link to="/" className={`nav-link ${isActive("/")}`}>Home</Link>
          <Link to="/products" className={`nav-link ${isActive("/products")}`}>Products & Services</Link>
          <Link to="/contact" className={`nav-link ${isActive("/contact")}`}>Contact</Link>
          <Link to="/about" className={`nav-link ${isActive("/about")}`}>About</Link>
          
          {/* My Account - only shows when authenticated */}
          {isAuthenticated && (
            <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
              My Account
            </Link>
          )}
        </nav>

        {/* Right Section: Auth & Notifications */}
        <div className="header-actions">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <NotificationBell />

              {/* Profile Dropdown - only logout here */}
              <div className="profile-dropdown" ref={dropdownRef}>
                <button 
                  className={`profile-trigger ${isProfileDropdownOpen ? 'open' : ''}`}
                  onClick={toggleProfileDropdown}
                  aria-label="Profile menu"
                >
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="profile-avatar" />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      <FaUser />
                    </div>
                  )}
                  <span className="profile-name">{getUserDisplayName()}</span>
                  <FaChevronDown className={`dropdown-arrow ${isProfileDropdownOpen ? 'rotated' : ''}`} />
                </button>

                {/* Dropdown Menu - only logout */}
                {isProfileDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      {profileImageUrl ? (
                        <img src={profileImageUrl} alt="Profile" className="dropdown-avatar" />
                      ) : (
                        <div className="dropdown-avatar-placeholder">
                          <FaUserCircle />
                        </div>
                      )}
                      <div className="dropdown-user-info">
                        <span className="dropdown-user-name">{getUserDisplayName()}</span>
                        <span className="dropdown-user-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FaSignOutAlt className="dropdown-icon" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button className="signin-btn" onClick={handleLoginClick}>
              Sign In
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            <FaBars />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Products & Services</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          
          {/* My Account in mobile menu when authenticated */}
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                My Account
              </Link>
              <div className="mobile-divider" />
              <button className="mobile-logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default UnifiedHeader;