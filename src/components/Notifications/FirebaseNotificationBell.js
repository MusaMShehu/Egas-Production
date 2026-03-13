// import React, { useState } from 'react';
// import { useNotification } from '../../contexts/FirebaseNotificationContext';
// import './FirebaseNotificationBell.css';

// const NotificationBell = () => {
//   const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleDropdown = () => setIsOpen(!isOpen);

//   const handleNotificationClick = (notification) => {
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }
//     // Handle navigation based on notification type
//     handleNotificationAction(notification);
//   };

//   const handleNotificationAction = (notification) => {
//     const { type, data } = notification;
    
//     switch (type) {
//       case 'ORDER_CREATED':
//       case 'ORDER_CONFIRMED':
//       case 'ORDER_DELIVERED':
//         // Navigate to orders page
//         window.location.href = `/orders/${data.orderId}`;
//         break;
//       case 'SUBSCRIPTION_CREATED':
//       case 'SUBSCRIPTION_FULFILLED':
//         // Navigate to subscriptions page
//         window.location.href = `/subscriptions/${data.subscriptionId}`;
//         break;
//       default:
//         // Default action or no action
//         break;
//     }
    
//     setIsOpen(false);
//   };

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'success': return '✅';
//       case 'warning': return '⚠️';
//       case 'info': return 'ℹ️';
//       case 'promo': return '🎁';
//       default: return '📢';
//     }
//   };

//   return (
//     <div className="notification-bell">
//       <button className="bell-icon" onClick={toggleDropdown}>
//         🔔
//         {unreadCount > 0 && (
//           <span className="notification-badge">{unreadCount}</span>
//         )}
//       </button>

//       {isOpen && (
//         <div className="notification-dropdown">
//           <div className="notification-header">
//             <h3>Notifications</h3>
//             {unreadCount > 0 && (
//               <button className="mark-all-read" onClick={markAllAsRead}>
//                 Mark all as read
//               </button>
//             )}
//           </div>

//           <div className="notification-list">
//             {notifications.length === 0 ? (
//               <div className="empty-notifications">
//                 No notifications yet
//               </div>
//             ) : (
//               notifications.slice(0, 10).map((notification) => (
//                 <div
//                   key={notification.id}
//                   className={`notification-item ${notification.read ? 'read' : 'unread'}`}
//                   onClick={() => handleNotificationClick(notification)}
//                 >
//                   <div className="notification-icon">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div className="notification-content">
//                     <div className="notification-title">
//                       {notification.title}
//                     </div>
//                     <div className="notification-message">
//                       {notification.message}
//                     </div>
//                     <div className="notification-time">
//                       {new Date(notification.timestamp).toLocaleDateString()}
//                     </div>
//                   </div>
//                   {!notification.read && (
//                     <div className="unread-dot"></div>
//                   )}
//                 </div>
//               ))
//             )}
//           </div>

//           {notifications.length > 10 && (
//             <div className="notification-footer">
//               <button className="view-all-btn">
//                 View All Notifications
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationBell;




import React, { useState, useEffect, useRef } from 'react';
import { toast } from "react-toastify";
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import notificationService from '../../services/firebaseNotificationService';
import './FirebaseNotificationBell.css';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    
    // Listen for new notifications
    const unsubscribe = notificationService.onMessage((payload) => {
      const newNotification = {
        id: payload.data?.id || Date.now().toString(),
        title: payload.notification.title,
        message: payload.notification.body,
        type: payload.data?.type || 'info',
        read: false,
        createdAt: new Date().toISOString(),
        data: payload.data
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast for new notification
      toast.info(payload.notification.body);
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="notification-icon success" />;
      case 'warning':
        return <FaExclamationTriangle className="notification-icon warning" />;
      case 'error':
        return <FaExclamationTriangle className="notification-icon error" />;
      default:
        return <FaInfoCircle className="notification-icon info" />;
    }
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="bell-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading && notifications.length === 0 ? (
              <div className="notification-loading">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                No notifications
              </div>
            ) : (
              notifications.slice(0, 10).map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="notification-icon-wrapper">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true
                      })}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="unread-dot" />
                  )}
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="notification-footer">
              <button className="view-all">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;