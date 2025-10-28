import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaUsers, 
  FaChartLine, 
  FaShoppingCart, 
  FaTruck, 
  FaDollarSign, 
  FaClipboardList,
  FaBell
} from 'react-icons/fa';
import { IoIosTrendingUp } from 'react-icons/io';
import './AdminDashboard.css';

const StatCard = ({ title, value, growth, icon, color }) => {
  const getGrowthColor = (value) => {
    if (value > 0) return 'growth-positive';
    if (value < 0) return 'growth-negative';
    return 'growth-neutral';
  };

  const formatGrowth = (value) => {
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return '0%';
  };

  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div>
          <div className="stat-header">{title}</div>
          <div className="stat-value">{value?.toLocaleString()}</div>
          <div className={`stat-growth ${getGrowthColor(growth?.day)}`}>
            <IoIosTrendingUp className="growth-icon" />
            <span>{formatGrowth(growth?.day)} today</span>
          </div>
        </div>
        <div className="stat-icon-container" style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const GrowthChip = ({ growth, period }) => {
  const getChipClass = (value) => {
    if (value > 0) return 'growth-chip chip-success';
    if (value < 0) return 'growth-chip chip-error';
    return 'growth-chip chip-default';
  };

  const formatGrowth = (value) => {
    if (value > 0) return `+${value.toFixed(1)}%`;
    if (value < 0) return `${value.toFixed(1)}%`;
    return '0%';
  };

  return (
    <span className={getChipClass(growth)}>
      {period}: {formatGrowth(growth)}
    </span>
  );
};

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'user':
        return <FaUsers />;
      case 'order':
        return <FaShoppingCart />;
      case 'payment':
        return <FaDollarSign />;
      default:
        return <FaBell />;
    }
  };

  const getActivityClass = (type) => {
    switch (type) {
      case 'user':
        return 'activity-avatar activity-user';
      case 'order':
        return 'activity-avatar activity-order';
      case 'payment':
        return 'activity-avatar activity-payment';
      default:
        return 'activity-avatar activity-default';
    }
  };

  return (
    <li className="activity-item">
      <div className={getActivityClass(activity.type)}>
        {getActivityIcon(activity.type)}
      </div>
      <div className="activity-content">
        <div className="activity-description">{activity.description}</div>
        <div className="activity-meta">
          {new Date(activity.createdAt).toLocaleString()}
          {activity.user && ` • By ${activity.user.name}`}
        </div>
      </div>
    </li>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Fetching dashboard data...');

      const [statsResponse, activitiesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/v1/admin/dashboard/stats', config),
        axios.get('http://localhost:5000/api/v1/admin/dashboard/recent-activities', config)
      ]);

      console.log('Stats response:', statsResponse.data);
      console.log('Activities response:', activitiesResponse.data);

      // Check if the response structure matches what we expect
      if (statsResponse.data && statsResponse.data.data && statsResponse.data.data.stats) {
        setStats(statsResponse.data.data.stats);
      } else {
        console.error('Unexpected stats response structure:', statsResponse.data);
        setError('Unexpected data format from server');
      }

      if (activitiesResponse.data && activitiesResponse.data.data) {
        setRecentActivities(activitiesResponse.data.data.activities || []);
      } else {
        setRecentActivities([]);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      let errorMessage = 'Failed to load dashboard data';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = 'Network error: Could not connect to server';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-bar"></div>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="error-container">
        <div className="error-text">{error}</div>
        <button 
          onClick={fetchDashboardData}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Show message if no stats data
  if (!stats) {
    return (
      <div className="error-container">
        <div className="error-text">No dashboard data available</div>
        <button 
          onClick={fetchDashboardData}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  // Fallback empty state for stats
  const safeStats = stats || {};

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={safeStats.totalUsers?.value || 0}
          growth={safeStats.totalUsers?.growth || { day: 0, week: 0, month: 0, year: 0 }}
          icon={<FaUsers size={24} />}
          color="#2196f3"
        />
        <StatCard
          title="Active Users"
          value={safeStats.activeUsers?.value || 0}
          growth={safeStats.activeUsers?.growth || { day: 0, week: 0, month: 0, year: 0 }}
          icon={<FaChartLine size={24} />}
          color="#4caf50"
        />
        <StatCard
          title="Active Subscriptions"
          value={safeStats.activeSubscriptions?.value || 0}
          growth={safeStats.activeSubscriptions?.growth || { day: 0, week: 0, month: 0, year: 0 }}
          icon={<FaClipboardList size={24} />}
          color="#ff9800"
        />
        <StatCard
          title="Total Orders"
          value={safeStats.totalOrders?.value || 0}
          growth={safeStats.totalOrders?.growth || { day: 0, week: 0, month: 0, year: 0 }}
          icon={<FaShoppingCart size={24} />}
          color="#9c27b0"
        />
        <StatCard
          title="Today's Deliveries"
          value={safeStats.todaysDeliveries?.value || 0}
          growth={safeStats.todaysDeliveries?.growth || { day: 0, week: 0, month: 0, year: 0 }}
          icon={<FaTruck size={24} />}
          color="#00bcd4"
        />
        <StatCard
          title="Today's Revenue"
          value={`$${(safeStats.todaysRevenue?.value || 0).toLocaleString()}`}
          growth={safeStats.todaysRevenue?.growth || { day: 0, week: 0, month: 0, year: 0 }}
          icon={<FaDollarSign size={24} />}
          color="#4caf50"
        />
      </div>

      {/* Detailed Growth Stats and Recent Activities */}
      <div className="main-grid">
        {/* Growth Details */}
        <div className="growth-paper">
          <h2 className="growth-title">Growth Analytics</h2>
          <div className="growth-grid">
            {Object.entries(safeStats).map(([key, stat]) => (
              <div className="growth-card" key={key}>
                <h3 className="growth-card-title">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()}
                </h3>
                <div className="growth-chips">
                  <GrowthChip growth={stat?.growth?.day || 0} period="Today" />
                  <GrowthChip growth={stat?.growth?.week || 0} period="This Week" />
                  <GrowthChip growth={stat?.growth?.month || 0} period="This Month" />
                  <GrowthChip growth={stat?.growth?.year || 0} period="This Year" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="activities-paper">
          <h2 className="activities-title">Recent Activities</h2>
          <ul className="activities-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <ActivityItem key={index} activity={activity} />
              ))
            ) : (
              <li className="empty-state">No recent activities</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;