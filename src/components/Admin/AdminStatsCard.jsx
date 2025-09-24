// components/StatsCard.js
import React from "react";
import "./Admin.css"; // 👈 external css

const StatsCard = ({ title, value, change, icon, iconColor }) => {
  const getChangeClass = (change) => {
    if (change > 0) return "change-positive";
    if (change < 0) return "change-negative";
    return "change-neutral";
  };

  const getChangeIcon = (change) => {
    if (change > 0) return "fa-arrow-up";
    if (change < 0) return "fa-arrow-down";
    return "fa-minus";
  };

  return (
    <div className="stats-card">
      <div className="stats-card-content">
        <div className="stats-info">
          <p className="stats-title">{title}</p>
          <h3 className="stats-value">{value}</h3>
          <p className="stats-change">
            <span className={`change ${getChangeClass(change)}`}>
              <i className={`fas ${getChangeIcon(change)}`}></i>
              {Math.abs(change)}%
            </span>
            <span className="vs-text">vs yesterday</span>
          </p>
        </div>
        <div className={`stats-icon ${iconColor}`}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
