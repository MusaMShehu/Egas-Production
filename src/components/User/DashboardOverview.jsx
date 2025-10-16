import React, { useState, useEffect } from 'react';
import { format, parseISO, isAfter } from 'date-fns';
import { 
  FaChartLine, // Replaced FaTrendingUp with FaChartLine
  FaShoppingCart, 
  FaFileInvoiceDollar, 
  FaWallet, 
  FaTruck,
  FaHistory,
  FaCheckCircle,
  FaRedo,
  FaExclamationTriangle
} from 'react-icons/fa';
import './Dashboard.css';

// API service
const dashboardAPI = {
  getDashboardStats: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('https://egas-ng.onrender.com/api/v1/dashboard/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    return response.json();
  }
};

// Status configuration
const statusConfig = {
  order: {
    paid: { className: 'status-success', label: 'Paid' },
    processing: { className: 'status-warning', label: 'Processing' },
    delivering: { className: 'status-info', label: 'Delivering' },
    active: { className: 'status-success', label: 'Active' }
  },
  subscription: {
    active: { className: 'status-success', label: 'Active' },
    paused: { className: 'status-warning', label: 'Paused' },
    expired: { className: 'status-error', label: 'Expired' }
  },
  wallet_topup: {
    successful: { className: 'status-success', label: 'Successful' },
    pending: { className: 'status-warning', label: 'Pending' },
    failed: { className: 'status-error', label: 'Failed' }
  }
};

// Activity type icons
const activityIcons = {
  order: FaShoppingCart,
  subscription: FaFileInvoiceDollar,
  wallet_topup: FaWallet
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return format(parseISO(dateString), 'MMM dd, yyyy');
};

// Get status chip
const StatusChip = ({ status, type }) => {
  const config = statusConfig[type]?.[status] || { className: 'status-default', label: status };
  return <span className={`status-chip ${config.className}`}>{config.label}</span>;
};

// Loading Component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading dashboard data...</p>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="error-container">
    <div className="error-icon">
      <FaExclamationTriangle />
    </div>
    <div className="error-content">
      <h3>Error Loading Dashboard</h3>
      <p>{message}</p>
      <button className="retry-button" onClick={onRetry}>
        <FaRedo /> Try Again
      </button>
    </div>
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon, color = 'primary' }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-content">
      <div className="stat-text">
        <h3 className="stat-title">{title}</h3>
        <div className="stat-value">{value}</div>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
      <div className="stat-icon">
        {icon}
      </div>
    </div>
  </div>
);

// Delivery Status Component
const DeliveryStatus = ({ nextDeliveryDate, activeSubscriptions }) => {
  const isUpcoming = nextDeliveryDate && isAfter(parseISO(nextDeliveryDate), new Date());
  
  return (
    <div className="card">
      <div className="card-header">
        <FaTruck className="card-icon" />
        <h3>Next Delivery</h3>
      </div>
      <div className="card-content">
        {nextDeliveryDate ? (
          <>
            <div className={`delivery-banner ${isUpcoming ? 'upcoming' : 'pending'}`}>
              <div className="delivery-date">{formatDate(nextDeliveryDate)}</div>
              <div className="delivery-status">
                {isUpcoming ? 'Upcoming delivery' : 'Delivery pending'}
              </div>
            </div>
            
            <div className="subscriptions-list">
              <h4>Active Subscriptions ({activeSubscriptions.length})</h4>
              <div className="subscriptions">
                {activeSubscriptions.slice(0, 3).map((sub, index) => (
                  <div key={index} className="subscription-item">
                    <FaCheckCircle className="subscription-icon" />
                    <div className="subscription-details">
                      <div className="subscription-name">{sub.name}</div>
                      <div className="subscription-info">
                        {sub.deliveryFrequency} • {formatDate(sub.nextDeliveryDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="no-deliveries">
            No upcoming deliveries
          </div>
        )}
      </div>
    </div>
  );
};

// Recent Activities Component
const RecentActivities = ({ activities }) => {
  return (
    <div className="card">
      <div className="card-header">
        <FaHistory className="card-icon" />
        <h3>Recent Activities</h3>
      </div>
      <div className="card-content">
        <div className="activities-list">
          {activities.map((activity, index) => {
            const IconComponent = activityIcons[activity.type];
            return (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <IconComponent />
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <span className="activity-title">{activity.title}</span>
                    <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                  </div>
                  <div className="activity-footer">
                    <StatusChip status={activity.status} type={activity.type} />
                    <span className="activity-date">{formatDate(activity.createdAt)}</span>
                  </div>
                </div>
                {index < activities.length - 1 && <div className="activity-divider"></div>}
              </div>
            );
          })}
        </div>
        
        {activities.length === 0 && (
          <div className="empty-state">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );
};

// Spending Chart Component
const SpendingChart = ({ spendingByMonth }) => {
  const maxSpending = Math.max(...spendingByMonth.map(item => item.total), 0);
  
  return (
    <div className="card">
      <div className="card-header">
        <h3>Monthly Spending</h3>
      </div>
      <div className="card-content">
        <div className="spending-chart">
          {spendingByMonth.map((item, index) => {
            const percentage = maxSpending > 0 ? (item.total / maxSpending) * 100 : 0;
            const monthName = format(new Date(item._id.year, item._id.month - 1), 'MMM yyyy');
            
            return (
              <div key={index} className="spending-item">
                <div className="spending-header">
                  <span className="spending-month">{monthName}</span>
                  <span className="spending-amount">{formatCurrency(item.total)}</span>
                </div>
                <div className="spending-bar">
                  <div 
                    className="spending-progress" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
        
        {spendingByMonth.length === 0 && (
          <div className="empty-state">
            No spending data available
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardAPI.getDashboardStats();
      
      if (response.success) {
        setDashboardData(response.data);
      } else {
        throw new Error('Failed to load dashboard data');
      }
    } catch (err) {
      setError(err.message);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="warning-message">
          <FaExclamationTriangle />
          <span>No dashboard data available</span>
        </div>
      </div>
    );
  }

  const {
    totalSpent,
    thisMonthSpent,
    orderTotal,
    subscriptionTotal,
    topupTotal,
    orderMonthly,
    subscriptionMonthly,
    topupMonthly,
    orderCount,
    activeOrderCount,
    nextDeliveryDate,
    subscriptionCount,
    activeSubscriptions,
    walletBalance,
    spendingByMonth,
    recentActivities
  } = dashboardData;

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <button className="refresh-button" onClick={fetchDashboardData}>
          <FaRedo /> Refresh
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          subtitle={`${formatCurrency(thisMonthSpent)} this month`}
          icon={<FaChartLine />}
          color="primary"
        />
        <StatCard
          title="Orders"
          value={orderCount}
          subtitle={`${activeOrderCount} active • ${formatCurrency(orderTotal)} total`}
          icon={<FaShoppingCart />}
          color="secondary"
        />
        <StatCard
          title="Subscriptions"
          value={subscriptionCount}
          subtitle={`${activeSubscriptions.length} active • ${formatCurrency(subscriptionTotal)} total`}
          icon={<FaFileInvoiceDollar />}
          color="info"
        />
        <StatCard
          title="Wallet Balance"
          value={formatCurrency(walletBalance)}
          subtitle={`${formatCurrency(topupTotal)} total top-ups`}
          icon={<FaWallet />}
          color="success"
        />
      </div>

      {/* Detailed Stats and Charts */}
      <div className="content-grid">
        {/* Monthly Breakdown */}
        <div className="content-column">
          <div className="card">
            <div className="card-header">
              <h3>This Month's Spending</h3>
            </div>
            <div className="card-content">
              <div className="spending-breakdown">
                <div className="breakdown-item">
                  <span>Orders</span>
                  <span className="breakdown-amount">{formatCurrency(orderMonthly)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Subscriptions</span>
                  <span className="breakdown-amount">{formatCurrency(subscriptionMonthly)}</span>
                </div>
                <div className="breakdown-item">
                  <span>Wallet Top-ups</span>
                  <span className="breakdown-amount">{formatCurrency(topupMonthly)}</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-total">
                  <span>Total</span>
                  <span className="total-amount">
                    {formatCurrency(thisMonthSpent + topupMonthly)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Status */}
        <div className="content-column">
          <DeliveryStatus 
            nextDeliveryDate={nextDeliveryDate}
            activeSubscriptions={activeSubscriptions}
          />
        </div>

        {/* Spending Chart */}
        <div className="content-column">
          <SpendingChart spendingByMonth={spendingByMonth} />
        </div>
      </div>

      {/* Recent Activities and Quick Stats */}
      <div className="bottom-grid">
        <div className="activities-column">
          <RecentActivities activities={recentActivities} />
        </div>
        
        {/* Quick Stats Sidebar */}
        <div className="stats-sidebar">
          <div className="card">
            <div className="card-header">
              <h3>Quick Stats</h3>
            </div>
            <div className="card-content">
              <div className="quick-stats">
                <div className="quick-stat">
                  <span>Active Orders</span>
                  <span className="stat-badge info">{activeOrderCount}</span>
                </div>
                <div className="quick-stat">
                  <span>Active Subscriptions</span>
                  <span className="stat-badge success">{activeSubscriptions.length}</span>
                </div>
                <div className="quick-stat">
                  <span>Monthly Orders</span>
                  <span className="stat-amount">{formatCurrency(orderMonthly)}</span>
                </div>
                <div className="quick-stat">
                  <span>Monthly Subscriptions</span>
                  <span className="stat-amount">{formatCurrency(subscriptionMonthly)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;