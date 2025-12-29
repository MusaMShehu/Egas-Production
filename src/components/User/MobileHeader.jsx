import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaBell, FaMapMarkerAlt, FaChevronLeft, FaSearch } from 'react-icons/fa';
import './MobileHeader.css';

const MobileHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'eGas';
    if (path.includes('orders')) return 'Order Gas';
    if (path.includes('subscriptions')) return 'Subscriptions';
    if (path.includes('history')) return 'Order History';
    if (path.includes('profile')) return 'Profile';
    return 'eGas';
  };
  
  const showBackButton = !['/user/dashboard', '/user'].includes(location.pathname);

  return (
    <header className="mobile-header">
      <div className="header-top">
        {showBackButton ? (
          <button className="header-btn back-btn" onClick={() => navigate(-1)}>
            <FaChevronLeft />
          </button>
        ) : (
          <div className="location-info">
            <FaMapMarkerAlt className="location-icon" />
            <span className="location-text">Home • Lagos</span>
          </div>
        )}
        
        <h1 className="header-title">{getHeaderTitle()}</h1>
        
        <div className="header-actions">
          <button className="header-btn search-btn">
            <FaSearch />
          </button>
          <button className="header-btn notification-btn">
            <FaBell />
            <span className="notification-dot"></span>
          </button>
        </div>
      </div>
      
      {/* Time and welcome message for dashboard */}
      {location.pathname === '/user/dashboard' && (
        <div className="welcome-section">
          <div className="time-display">3:14 PM</div>
          <h2 className="welcome-text">Fast & Reliable Gas Delivery!</h2>
          <div className="features">
            <span className="feature-badge">Discounts Up to 20%</span>
            <span className="feature-badge">24/7 Service Available</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default MobileHeader;