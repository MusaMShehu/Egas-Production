// DashboardMain.js - Fixed version with proper routing
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from "./components/pages/Sidebar";
import { userData } from "./components/pages/SampleData";
import './styles/AppD.css';
import './styles/NotificationPanel.css'

// Main App component
function DashboardLayout() {
  return <AppContent />;
}

// AppContent component that uses routing
function AppContent() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [user, setUser] = useState(userData);
  const [notifications, setNotifications] = useState(userData.notifications);
  const navigate = useNavigate();
  const location = useLocation();

  // Get current page from URL
  const currentPage = location.pathname.split('/').pop() || "overview";

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const updatedUser = { ...user };
      const activeOrder = updatedUser.recentOrders.find(
        (order) => order.status === "processing"
      );

      if (activeOrder && activeOrder.tracking) {
        if (activeOrder.tracking.progress < 100) {
          activeOrder.tracking.progress += Math.floor(Math.random() * 10);
          if (activeOrder.tracking.progress >= 100) {
            activeOrder.tracking.progress = 100;
            activeOrder.tracking.status = "delivered";
            activeOrder.status = "delivered";
            activeOrder.tracking.location = "Delivered to customer";
          } else if (activeOrder.tracking.progress > 80) {
            activeOrder.tracking.status = "in-transit-near";
            activeOrder.tracking.location = "Near your location";
          }
          setUser(updatedUser);
        }
      }

      if (Math.random() > 0.7) {
        const newNotification = {
          id: notifications.length + 1,
          title: ["System Update", "New Feature", "Special Offer"][
            Math.floor(Math.random() * 3)
          ],
          message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          date: new Date().toISOString().split("T")[0],
          read: false,
          type: "system",
        };
        setNotifications([newNotification, ...notifications]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user, notifications]);

  const handleNavigation = (page) => {
    navigate(`/dashboard/${page}`);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen) {
      const updatedNotifications = notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      setNotifications(updatedNotifications);
    }
  };

  return (
    <div className="App">
      <div className="app-container">
        <div className="main-content">
          <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
        </div>
        <div className="page-content">
          <Outlet context={{ user, setUser, notifications }} />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;