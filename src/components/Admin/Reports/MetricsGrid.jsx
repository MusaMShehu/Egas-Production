// components/reports/MetricsGrid.js
import React from 'react';

const MetricsGrid = ({ metrics, compact = false, animated = true }) => {
  const getChangeColor = (change, trend) => {
    if (change > 0) return trend === 'up' ? 'positive' : 'negative';
    if (change < 0) return trend === 'down' ? 'positive' : 'negative';
    return 'neutral';
  };

  const getChangeIcon = (change, trend) => {
    if (change > 0) return trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    if (change < 0) return trend === 'down' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
    return 'fas fa-minus';
  };

  const getTrendLabel = (change, trend) => {
    if (change > 0) return trend === 'up' ? 'increase' : 'decrease';
    if (change < 0) return trend === 'down' ? 'improvement' : 'decline';
    return 'no change';
  };

  return (
    <div className={`metrics-grid ${compact ? 'compact' : ''} ${animated ? 'animated' : ''}`}>
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`metric-card ${metric.color} ${getChangeColor(metric.change, metric.trend)}`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="metric-header">
            <div className="metric-icon">
              <i className={metric.icon}></i>
            </div>
            <div className={`metric-change ${getChangeColor(metric.change, metric.trend)}`}>
              <i className={getChangeIcon(metric.change, metric.trend)}></i>
              {Math.abs(metric.change)}%
              <span className="change-label">{getTrendLabel(metric.change, metric.trend)}</span>
            </div>
          </div>
          
          <div className="metric-content">
            <h3 className="metric-value">{metric.value}</h3>
            <p className="metric-title">{metric.title}</p>
          </div>

          {metric.subtitle && (
            <div className="metric-footer">
              <span className="metric-subtitle">{metric.subtitle}</span>
            </div>
          )}

          {/* Progress bar for some metrics */}
          {metric.progress !== undefined && (
            <div className="metric-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
              <span className="progress-label">{metric.progress}%</span>
            </div>
          )}

          {/* Sparkline mini chart */}
          {metric.sparkline && (
            <div className="metric-sparkline">
              <svg viewBox="0 0 100 20" className="sparkline">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  points={metric.sparkline}
                />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;