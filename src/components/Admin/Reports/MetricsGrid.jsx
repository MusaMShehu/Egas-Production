// components/reports/MetricsGrid.js
import React from 'react';

const MetricsGrid = ({ metrics }) => {
  const getChangeColor = (change) => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const getChangeIcon = (change) => {
    if (change > 0) return 'fas fa-arrow-up';
    if (change < 0) return 'fas fa-arrow-down';
    return 'fas fa-minus';
  };

  return (
    <div className="metrics-grid">
      {metrics.map((metric, index) => (
        <div key={index} className="metric-card">
          <div className="metric-header">
            <div className={`metric-icon ${metric.color}`}>
              <i className={metric.icon}></i>
            </div>
            <div className={`metric-change ${getChangeColor(metric.change)}`}>
              <i className={getChangeIcon(metric.change)}></i>
              {Math.abs(metric.change)}%
            </div>
          </div>
          <div className="metric-content">
            <h3>{metric.value}</h3>
            <p>{metric.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;