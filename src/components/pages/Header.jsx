// components/Header.js
import React from 'react';

const Header = ({ user, onNotificationsClick, unreadNotifications }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      alert('You have been logged out. Redirecting to login page...');
      // In a real app, this would redirect to logout endpoint
      // window.location.href = 'login.html';
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-2xl font-bold" id="page-title">
        {user.firstName} {user.lastName}'s Dashboard
      </h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <i 
            className="fas fa-bell text-gray-600 text-xl cursor-pointer" 
            id="notification-bell"
            onClick={onNotificationsClick}
          ></i>
          {unreadNotifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </div>
        <span className="text-gray-700">
          Welcome, <span id="username">{user.firstName} {user.lastName}</span>
        </span>
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded" 
          id="logout-btn"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
    </header>
  );
};

export default Header;