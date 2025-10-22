// components/reports/RealTimeMetrics.js
import React, { useState, useEffect, useCallback } from 'react';
import './ReportStyles/RealTimeMetrics.css';

const RealTimeMetrics = ({ 
  data, 
  autoRefresh = false, 
  onAutoRefreshToggle,
  refreshInterval = 30000 
}) => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState({});

  const realTimeData = data || metrics;

  const fetchRealTimeData = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/reports/realtime-metrics');
      const result = await response.json();
      
      if (response.ok) {
        setMetrics(result);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchRealTimeData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchRealTimeData]);

  // Manual refresh
  const handleManualRefresh = () => {
    fetchRealTimeData();
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  const getTrendIndicator = (trend) => {
    if (trend > 0) return { icon: 'fas fa-arrow-up', color: 'text-green-500', label: 'up' };
    if (trend < 0) return { icon: 'fas fa-arrow-down', color: 'text-red-500', label: 'down' };
    return { icon: 'fas fa-minus', color: 'text-gray-500', label: 'stable' };
  };

  const realTimeMetrics = [
    {
      key: 'activeUsers',
      label: 'Active Users',
      value: realTimeData.activeUsers || 0,
      trend: realTimeData.activeUsersTrend || 0,
      icon: 'fas fa-users',
      color: 'blue'
    },
    {
      key: 'liveOrders',
      label: 'Live Orders',
      value: realTimeData.liveOrders || 0,
      trend: realTimeData.liveOrdersTrend || 0,
      icon: 'fas fa-shopping-cart',
      color: 'green'
    },
    {
      key: 'revenueToday',
      label: 'Revenue Today',
      value: realTimeData.revenueToday || 0,
      trend: realTimeData.revenueTrend || 0,
      icon: 'fas fa-money-bill-wave',
      color: 'purple',
      format: 'currency'
    },
    {
      key: 'subscriptionsActive',
      label: 'Active Subscriptions',
      value: realTimeData.subscriptionsActive || 0,
      trend: realTimeData.subscriptionsTrend || 0,
      icon: 'fas fa-calendar-check',
      color: 'orange'
    },
    {
      key: 'pendingDeliveries',
      label: 'Pending Deliveries',
      value: realTimeData.pendingDeliveries || 0,
      trend: realTimeData.deliveriesTrend || 0,
      icon: 'fas fa-truck',
      color: 'red'
    },
    {
      key: 'systemHealth',
      label: 'System Health',
      value: realTimeData.systemHealth || 100,
      trend: realTimeData.healthTrend || 0,
      icon: 'fas fa-heartbeat',
      color: 'teal',
      format: 'percentage'
    }
  ];

  const alerts = realTimeData.alerts || [];

  return (
    <div className="real-time-metrics">
      <div className="metrics-header">
        <div className="header-content">
          <h3>
            <i className="fas fa-broadcast-tower"></i>
            Real-Time Dashboard
          </h3>
          <div className="last-updated">
            <span className="status-indicator"></span>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="header-controls">
          <button 
            className={`btn-refresh ${isLoading ? 'loading' : ''}`}
            onClick={handleManualRefresh}
            disabled={isLoading}
          >
            <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-sync-alt'}`}></i>
            {isLoading ? 'Refreshing...' : 'Refresh Now'}
          </button>
          
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => onAutoRefreshToggle?.(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            Auto-refresh
          </label>
        </div>
      </div>

      {/* Critical Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-section">
          <div className="alerts-header">
            <i className="fas fa-exclamation-triangle"></i>
            <span>System Alerts</span>
            <span className="alerts-count">{alerts.length}</span>
          </div>
          <div className="alerts-list">
            {alerts.slice(0, 3).map((alert, index) => (
              <div key={index} className={`alert-item ${alert.severity}`}>
                <div className="alert-icon">
                  <i className={`fas ${
                    alert.severity === 'critical' ? 'fa-exclamation-circle' :
                    alert.severity === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle'
                  }`}></i>
                </div>
                <div className="alert-content">
                  <div className="alert-title">{alert.title}</div>
                  <div className="alert-message">{alert.message}</div>
                </div>
                <div className="alert-time">{alert.timestamp}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {realTimeMetrics.map((metric, index) => {
          const trend = getTrendIndicator(metric.trend);
          const displayValue = metric.format === 'currency' 
            ? `₦${formatNumber(metric.value)}`
            : metric.format === 'percentage'
            ? `${metric.value}%`
            : formatNumber(metric.value);

          return (
            <div key={metric.key} className="metric-card realtime">
              <div className="metric-header">
                <div className={`metric-icon ${metric.color}`}>
                  <i className={metric.icon}></i>
                </div>
                <div className={`metric-trend ${trend.color}`}>
                  <i className={trend.icon}></i>
                  {Math.abs(metric.trend)}%
                </div>
              </div>
              
              <div className="metric-content">
                <div className="metric-value">{displayValue}</div>
                <div className="metric-label">{metric.label}</div>
              </div>

              {/* Sparkline for trend visualization */}
              <div className="metric-sparkline">
                <svg viewBox="0 0 100 20" className="sparkline">
                  <polyline
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    points={realTimeData[`${metric.key}Sparkline`] || "0,10 100,10"}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Activity Feed */}
      <div className="activity-feed">
        <div className="feed-header">
          <h4>
            <i className="fas fa-stream"></i>
            Live Activity
          </h4>
          <span className="feed-indicator">
            <span className="pulse"></span>
            Live
          </span>
        </div>
        
        <div className="feed-content">
          {realTimeData.recentActivities?.map((activity, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <i className={`fas ${activity.icon}`}></i>
              </div>
              <div className="activity-details">
                <div className="activity-message">{activity.message}</div>
                <div className="activity-meta">
                  <span className="activity-time">{activity.time}</span>
                  <span className="activity-user">{activity.user}</span>
                </div>
              </div>
              <div className={`activity-badge ${activity.type}`}>
                {activity.type}
              </div>
            </div>
          )) || (
            <div className="no-activity">
              <i className="fas fa-wind"></i>
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="performance-indicators">
        <h4>Performance Metrics</h4>
        <div className="indicators-grid">
          <div className="indicator">
            <div className="indicator-label">Response Time</div>
            <div className="indicator-value">
              {realTimeData.responseTime || 0}ms
            </div>
            <div className="indicator-bar">
              <div 
                className={`indicator-fill ${
                  (realTimeData.responseTime || 0) < 100 ? 'excellent' :
                  (realTimeData.responseTime || 0) < 300 ? 'good' : 'poor'
                }`}
                style={{ 
                  width: `${Math.min((realTimeData.responseTime || 0) / 5, 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="indicator">
            <div className="indicator-label">Error Rate</div>
            <div className="indicator-value">
              {(realTimeData.errorRate || 0).toFixed(2)}%
            </div>
            <div className="indicator-bar">
              <div 
                className={`indicator-fill ${
                  (realTimeData.errorRate || 0) < 1 ? 'excellent' :
                  (realTimeData.errorRate || 0) < 5 ? 'good' : 'poor'
                }`}
                style={{ 
                  width: `${Math.min((realTimeData.errorRate || 0) * 10, 100)}%` 
                }}
              ></div>
            </div>
          </div>
          
          <div className="indicator">
            <div className="indicator-label">Uptime</div>
            <div className="indicator-value">
              {(realTimeData.uptime || 99.9).toFixed(1)}%
            </div>
            <div className="indicator-bar">
              <div 
                className="indicator-fill excellent"
                style={{ width: `${realTimeData.uptime || 99.9}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;