// components/ActivityList.js
import React, { useState, useEffect } from "react";
import "./Admin.css"; 

const ActivityList = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/v1/admin/dashboard");
      const data = await response.json();
      setActivities(data.staffPerformance || []);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      order: "fas fa-shopping-cart icon-blue",
      payment: "fas fa-credit-card icon-green",
      delivery: "fas fa-truck icon-yellow",
      user: "fas fa-user icon-purple",
      system: "fas fa-cog icon-gray",
      alert: "fas fa-exclamation-circle icon-red",
    };
    return icons[type] || "fas fa-info-circle icon-gray";
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds} seconds ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? "" : "s"} ago`;
  };

  return (
    <div className="activity-list">
      <div className="activity-header">
        <h2>Recent Activity</h2>
      </div>
      <div className="activity-body">
        {activities.length === 0 ? (
          <div className="loading">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading activities...</span>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <i className={getActivityIcon(activity.type)}></i>
              </div>
              <div className="activity-content">
                <div className="activity-top">
                  <p className="activity-description">{activity.description}</p>
                  <span className="activity-time">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
                {activity.details && (
                  <p className="activity-details">{activity.details}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="activity-footer">
        <a href="#">View All Activity</a>
      </div>
    </div>
  );
};

export default ActivityList;
