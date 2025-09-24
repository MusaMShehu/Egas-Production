// components/NotificationPanel.js
import React from 'react';
import { formatDate } from '../utils/helpers';
import '../styles/NotificationPanel.css';

const NotificationPanel = ({ isOpen, onClose, notifications }) => {
  return (
    <>
      <div 
        className={`modal-overlay ${isOpen ? '' : 'hidden'}`}
        onClick={onClose}
      ></div>
      <div 
        className={`notification-panel ${isOpen ? 'open' : ''}`}
      >
        <div className="panel-header">
          <h3 className="panel-title">Notifications</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="notification-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? '' : 'unread'}`}
            >
              <div className="notification-header">
                <h4 className="notification-title">{notification.title}</h4>
                <span className="notification-time">{formatDate(notification.date, true)}</span>
              </div>
              <p className="notification-message">{notification.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;