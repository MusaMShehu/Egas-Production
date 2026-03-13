
import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { 
  FaChartLine,
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
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

// API service
const dashboardAPI = {
  getDashboardStats: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('https://egas-server-1.onrender.com/api/v1/dashboard/overview', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    
    return response.json();
  },

  getNextDelivery: async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('https://egas-server-1.onrender.com/api/v1/admin/delivery/next-delivery', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  }
};

// Status configuration
const statusConfig = {
  order: {
    completed: { className: 'status-success', label: 'Completed' },
    processing: { className: 'status-warning', label: 'Processing' },
    'in-transit': { className: 'status-info', label: 'In Transit' },
    cancelled: { className: 'status-error', label: 'Cancelled' }
  },
  subscription: {
    active: { className: 'status-success', label: 'Active' },
    paused: { className: 'status-warning', label: 'Paused' },
    expired: { className: 'status-error', label: 'Expired' }
  },
  wallet_transaction: {
    Credit: { className: 'status-success', label: 'Credit' },
    Debit: { className: 'status-info', label: 'Debit' }
  }
};

// Activity type icons
const activityIcons = {
  order: FaShoppingCart,
  subscription: FaFileInvoiceDollar,
  wallet_transaction: FaWallet
};

// Format currency - UPDATED to Naira
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount || 0);
};

// Format currency without symbol - for clean display
const formatCurrencyClean = (amount) => {
  return new Intl.NumberFormat('en-NG').format(amount || 0);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'EEE, MMM dd, yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
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

// Stat Card Component - UPDATED to show ₦ symbol
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

// NEW: Next Delivery Component with API call
const NextDeliveryComponent = () => {
  const [nextDelivery, setNextDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNextDelivery();
  }, []);

  const fetchNextDelivery = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getNextDelivery();
      
      if (response.success && response.data) {
        setNextDelivery(response.data);
      } else {
        setNextDelivery(null);
      }
    } catch (err) {
      console.error('Error fetching next delivery:', err);
      setError('Failed to fetch delivery information');
      setNextDelivery(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryClick = () => {
    if (nextDelivery) {
      infoToast(`Delivery scheduled for ${formatDate(nextDelivery.deliveryDate)} - Status: ${nextDelivery.status}`);
    }
  };

  const handleSubscriptionClick = () => {
    if (nextDelivery?.subscription) {
      infoToast(
        `Subscription: ${nextDelivery.subscription.name || 'Unnamed'} - ` +
        `Size: ${nextDelivery.subscription.size || 'Standard'} - ` +
        `Frequency: ${nextDelivery.subscription.frequency || 'Regular'}`
      );
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <FaTruck className="card-icon" />
          <h3>Next Delivery</h3>
        </div>
        <div className="card-content">
          <div className="loading-state">Loading delivery information...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <FaTruck className="card-icon" />
          <h3>Next Delivery</h3>
        </div>
        <div className="card-content">
          <div className="error-state">
            <FaExclamationTriangle /> {error}
            <button className="small-retry-button" onClick={fetchNextDelivery}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <FaTruck className="card-icon" />
        <h3>Next Delivery</h3>
        <button className="refresh-icon-button" onClick={fetchNextDelivery}>
          <FaRedo />
        </button>
      </div>
      <div className="card-content">
        {nextDelivery ? (
          <>
            <div 
              className={`delivery-banner ${nextDelivery.isUpcoming ? 'upcoming' : 'pending'}`}
              onClick={handleDeliveryClick}
              style={{ cursor: 'pointer' }}
            >
              <div className="delivery-date">{formatDate(nextDelivery.deliveryDate)}</div>
              <div className="delivery-status">
                {nextDelivery.isUpcoming ? 'Upcoming delivery' : 'Delivery pending'}
              </div>
              <div className="delivery-status-badge">
                {nextDelivery.status.replace('_', ' ')}
              </div>
            </div>
            
            <div className="subscription-details">
              <h4>From This Subscription</h4>
              {nextDelivery.subscription ? (
                <div 
                  className="subscription-item"
                  onClick={handleSubscriptionClick}
                  style={{ cursor: 'pointer' }}
                >
                  <FaCheckCircle className="subscription-icon" />
                  <div className="subscription-details-content">
                    <div className="subscription-name">
                      {nextDelivery.subscription.name || 'Subscription'}
                    </div>
                    <div className="subscription-info">
                      <span className="subscription-size">{nextDelivery.subscription.size || 'Standard'}</span>
                      <span className="separator">•</span>
                      <span className="subscription-frequency">{nextDelivery.subscription.frequency || 'Regular'}</span>
                    </div>
                    <div className="subscription-status">
                      Status: <span className={`status-${nextDelivery.subscription.status}`}>
                        {nextDelivery.subscription.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-subscription">
                  <p>No subscription information available for this delivery</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-deliveries">
            <p>No upcoming deliveries scheduled</p>
            <small>When you have an active subscription, your next delivery will appear here.</small>
          </div>
        )}
      </div>
    </div>
  );
};

// Recent Activities Component
const RecentActivities = ({ activities }) => {
  const handleActivityClick = (activity) => {
    infoToast(`Activity: ${activity.title} - ${formatCurrency(activity.amount)}`);
  };

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
              <div 
                key={index} 
                className="activity-item"
                onClick={() => handleActivityClick(activity)}
                style={{ cursor: 'pointer' }}
              >
                <div className="activity-icon">
                  {IconComponent ? <IconComponent /> : <FaHistory />}
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
  
  const handleMonthClick = (item) => {
    const monthName = format(new Date(item._id.year, item._id.month - 1), 'MMM yyyy');
    infoToast(`Spent ${formatCurrency(item.total)} in ${monthName}`);
  };

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
              <div 
                key={index} 
                className="spending-item"
                onClick={() => handleMonthClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <div className="spending-header">
                  <span className="spending-month">{monthName}</span>
                  <span className="spending-amount">₦{formatCurrencyClean(item.total)}</span>
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

// Quick Stats Component
const QuickStats = ({ 
  activeOrderCount, 
  activeSubscriptions, 
  orderMonthly, 
  subscriptionMonthly, 
  topupMonthly 
}) => {
  const handleStatClick = (statName, value) => {
    infoToast(`${statName}: ${value}`);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h3>Quick Stats</h3>
      </div>
      <div className="card-content">
        <div className="quick-stats">
          <div 
            className="quick-stat"
            onClick={() => handleStatClick('Active Orders', activeOrderCount)}
            style={{ cursor: 'pointer' }}
          >
            <span>Active Orders</span>
            <span className="stat-badge info">{activeOrderCount}</span>
          </div>
          <div 
            className="quick-stat"
            onClick={() => handleStatClick('Active Subscriptions', activeSubscriptions.length)}
            style={{ cursor: 'pointer' }}
          >
            <span>Active Subscriptions</span>
            <span className="stat-badge success">{activeSubscriptions.length}</span>
          </div>
          <div 
            className="quick-stat"
            onClick={() => handleStatClick('Monthly Orders', formatCurrency(orderMonthly))}
            style={{ cursor: 'pointer' }}
          >
            <span>Monthly Orders</span>
            <span className="stat-amount">{formatCurrency(orderMonthly)}</span>
          </div>
          <div 
            className="quick-stat"
            onClick={() => handleStatClick('Monthly Subscriptions', formatCurrency(subscriptionMonthly))}
            style={{ cursor: 'pointer' }}
          >
            <span>Monthly Subscriptions</span>
            <span className="stat-amount">{formatCurrency(subscriptionMonthly)}</span>
          </div>
          <div 
            className="quick-stat"
            onClick={() => handleStatClick('Monthly Top-ups', formatCurrency(topupMonthly))}
            style={{ cursor: 'pointer' }}
          >
            <span>Monthly Top-ups</span>
            <span className="stat-amount">{formatCurrency(topupMonthly)}</span>
          </div>
        </div>
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
      infoToast('Loading dashboard data...');

      const response = await dashboardAPI.getDashboardStats();
      
      if (response.success) {
        setDashboardData(response.data);
        successToast('Dashboard data loaded successfully!');
        
        // Additional info toasts for key metrics
        if (response.data) {
          const { totalSpent, thisMonthSpent, walletBalance, activeOrderCount, activeSubscriptions } = response.data;
          
          setTimeout(() => {
            if (totalSpent > 0) {
              infoToast(`Total spent: ${formatCurrency(totalSpent)}`);
            }
            if (thisMonthSpent > 0) {
              infoToast(`This month: ${formatCurrency(thisMonthSpent)}`);
            }
            if (activeOrderCount > 0) {
              infoToast(`${activeOrderCount} active orders`);
            }
            if (activeSubscriptions.length > 0) {
              infoToast(`${activeSubscriptions.length} active subscriptions`);
            }
          }, 1000);
        }
      } else {
        throw new Error('Failed to load dashboard data');
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to load dashboard data';
      setError(errorMsg);
      errorToast(errorMsg);
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    infoToast('Refreshing dashboard data...');
    fetchDashboardData();
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
        <button className="refresh-button" onClick={handleRefresh}>
          <FaRedo /> Refresh
        </button>
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
    nextDeliveryDate, // This is from old API, kept for backward compatibility
    subscriptionCount,
    activeSubscriptions = [],
    walletBalance,
    spendingByMonth = [],
    recentActivities = []
  } = dashboardData;

  const handleStatCardClick = (title, value, subtitle) => {
    infoToast(`${title}: ${value} - ${subtitle}`);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <button className="refresh-button" onClick={handleRefresh}>
          <FaRedo /> Refresh
        </button>
      </div>

      {/* Main Stats Grid - UPDATED to show Naira */}
      <div className="stats-grid">
        <div onClick={() => handleStatCardClick('Total Spent', formatCurrency(totalSpent), `${formatCurrency(thisMonthSpent)} this month`)}>
          <StatCard
            title="Total Spent"
            value={formatCurrency(totalSpent)}
            subtitle={`${formatCurrency(thisMonthSpent)} this month`}
            icon={<FaChartLine />}
            color="primary"
          />
        </div>
        <div onClick={() => handleStatCardClick('Orders', orderCount, `${activeOrderCount} active • ${formatCurrency(orderTotal)} total`)}>
          <StatCard
            title="Orders"
            value={orderCount}
            subtitle={`${activeOrderCount} active • ${formatCurrency(orderTotal)} total`}
            icon={<FaShoppingCart />}
            color="secondary"
          />
        </div>
        <div onClick={() => handleStatCardClick('Subscriptions', subscriptionCount, `${activeSubscriptions.length} active • ${formatCurrency(subscriptionTotal)} total`)}>
          <StatCard
            title="Subscriptions"
            value={subscriptionCount}
            subtitle={`${activeSubscriptions.length} active • ${formatCurrency(subscriptionTotal)} total`}
            icon={<FaFileInvoiceDollar />}
            color="info"
          />
        </div>
        <div onClick={() => handleStatCardClick('Wallet Balance', formatCurrency(walletBalance), `${formatCurrency(topupTotal)} total top-ups`)}>
          <StatCard
            title="Wallet Balance"
            value={formatCurrency(walletBalance)}
            subtitle={`${formatCurrency(topupTotal)} total top-ups`}
            icon={<FaWallet />}
            color="success"
          />
        </div>
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
                <div 
                  className="breakdown-item"
                  onClick={() => infoToast(`Orders this month: ${formatCurrency(orderMonthly)}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Orders</span>
                  <span className="breakdown-amount">{formatCurrency(orderMonthly)}</span>
                </div>
                <div 
                  className="breakdown-item"
                  onClick={() => infoToast(`Subscriptions this month: ${formatCurrency(subscriptionMonthly)}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Subscriptions</span>
                  <span className="breakdown-amount">{formatCurrency(subscriptionMonthly)}</span>
                </div>
                <div 
                  className="breakdown-item"
                  onClick={() => infoToast(`Wallet top-ups this month: ${formatCurrency(topupMonthly)}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Wallet Top-ups</span>
                  <span className="breakdown-amount">{formatCurrency(topupMonthly)}</span>
                </div>
                <div className="breakdown-divider"></div>
                <div 
                  className="breakdown-total"
                  onClick={() => infoToast(`Total this month: ${formatCurrency(orderMonthly + subscriptionMonthly + topupMonthly)}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <span>Total</span>
                  <span className="total-amount">
                    {formatCurrency(orderMonthly + subscriptionMonthly + topupMonthly)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Status - REPLACED with new component */}
        <div className="content-column">
          <NextDeliveryComponent />
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
          <QuickStats 
            activeOrderCount={activeOrderCount}
            activeSubscriptions={activeSubscriptions}
            orderMonthly={orderMonthly}
            subscriptionMonthly={subscriptionMonthly}
            topupMonthly={topupMonthly}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
















// pages/DashboardOverview.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';
// import { 
//   FaChartLine, 
//   FaShoppingCart, 
//   FaFileInvoiceDollar, 
//   FaWallet, 
//   FaTruck,
//   FaHistory,
//   FaExclamationTriangle,
//   FaRedo
// } from 'react-icons/fa';
// import { dashboardAPI } from '../../../api/dashboardApi';
// import { useAuth } from '../../../contexts/AuthContext';
// import LoadingSpinner from '../../Common/LoadingSpinner';
// import ErrorMessage from '../../Common/ErrorBoundary';
// import { formatCurrency, formatDate } from '../../../utils/helpers';
// import './Dashboard.css';

// // Fetch dashboard data
// const fetchDashboardData = async () => {
//   const response = await dashboardAPI.getDashboardStats();
//   return response;
// };

// // Fetch next delivery
// const fetchNextDelivery = async () => {
//   const response = await dashboardAPI.getNextDelivery();
//   return response;
// };

// // Stat Card Component
// const StatCard = ({ title, value, subtitle, icon, color = 'primary', onClick }) => (
//   <div className={`stat-card stat-card-${color}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
//     <div className="stat-content">
//       <div>
//         <h3 className="stat-title">{title}</h3>
//         <div className="stat-value">{value}</div>
//         {subtitle && <p className="stat-subtitle">{subtitle}</p>}
//       </div>
//       <div className="stat-icon">{icon}</div>
//     </div>
//   </div>
// );

// // Recent Activity Item
// const ActivityItem = ({ activity, onClick }) => {
//   const getIcon = () => {
//     switch (activity.type) {
//       case 'order': return <FaShoppingCart />;
//       case 'subscription': return <FaFileInvoiceDollar />;
//       case 'wallet_transaction': return <FaWallet />;
//       default: return <FaHistory />;
//     }
//   };

//   const getStatusClass = () => {
//     const status = activity.status?.toLowerCase();
//     if (status === 'completed' || status === 'credit' || status === 'active') {
//       return 'status-success';
//     }
//     if (status === 'pending' || status === 'processing') {
//       return 'status-warning';
//     }
//     if (status === 'failed' || status === 'cancelled') {
//       return 'status-error';
//     }
//     return '';
//   };

//   return (
//     <div className="activity-item" onClick={onClick} style={{ cursor: 'pointer' }}>
//       <div className="activity-icon">{getIcon()}</div>
//       <div className="activity-content">
//         <div className="activity-header">
//           <span className="activity-title">{activity.title}</span>
//           <span className="activity-amount">
//             {activity.type === 'wallet_transaction' && activity.status?.toLowerCase() === 'credit' ? '+' : ''}
//             {formatCurrency(activity.amount)}
//           </span>
//         </div>
//         <div className="activity-footer">
//           <span className={`activity-status ${getStatusClass()}`}>
//             {activity.status}
//           </span>
//           <span className="activity-date">{formatDate(activity.createdAt)}</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Next Delivery Component
// const NextDelivery = ({ onRefresh }) => {
//   const navigate = useNavigate();
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['nextDelivery'],
//     queryFn: fetchNextDelivery,
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     retry: 1
//   });

//   if (isLoading) {
//     return (
//       <div className="card">
//         <div className="card-header">
//           <FaTruck className="card-icon" />
//           <h3>Next Delivery</h3>
//         </div>
//         <div className="card-content">
//           <div className="loading-state">Loading delivery info...</div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card">
//         <div className="card-header">
//           <FaTruck className="card-icon" />
//           <h3>Next Delivery</h3>
//           <button className="refresh-button" onClick={() => refetch()}>
//             <FaRedo />
//           </button>
//         </div>
//         <div className="card-content">
//           <div className="error-state">
//             <FaExclamationTriangle />
//             <span>Failed to load delivery info</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!data?.data) {
//     return (
//       <div className="card">
//         <div className="card-header">
//           <FaTruck className="card-icon" />
//           <h3>Next Delivery</h3>
//           <button className="refresh-button" onClick={() => refetch()}>
//             <FaRedo />
//           </button>
//         </div>
//         <div className="card-content">
//           <div className="empty-state">
//             No upcoming deliveries scheduled
//           </div>
//         </div>
//       </div>
//     );
//   }

//   const delivery = data.data;

//   return (
//     <div className="card">
//       <div className="card-header">
//         <FaTruck className="card-icon" />
//         <h3>Next Delivery</h3>
//         <button className="refresh-button" onClick={() => refetch()}>
//           <FaRedo />
//         </button>
//       </div>
//       <div className="card-content">
//         <div 
//           className="delivery-banner"
//           onClick={() => navigate('/tracking')}
//           style={{ cursor: 'pointer' }}
//         >
//           <div className="delivery-date">{formatDate(delivery.deliveryDate)}</div>
//           <div className="delivery-status-badge">{delivery.status?.replace(/_/g, ' ')}</div>
//         </div>
//         {delivery.subscription && (
//           <div className="subscription-details">
//             <h4>From Subscription</h4>
//             <div 
//               className="subscription-item"
//               onClick={() => navigate('/subscriptions')}
//               style={{ cursor: 'pointer' }}
//             >
//               <div className="subscription-name">{delivery.subscription.name || 'Subscription'}</div>
//               <div className="subscription-info">
//                 <span>{delivery.subscription.size || 'Standard'}</span>
//                 <span className="separator">•</span>
//                 <span>{delivery.subscription.frequency || 'Regular'}</span>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // Main Dashboard Component
// const DashboardOverview = () => {
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();
  
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['dashboard'],
//     queryFn: fetchDashboardData,
//     staleTime: 2 * 60 * 1000, // 2 minutes
//   });

//   React.useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/auth');
//     }
//   }, [isAuthenticated]);

//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return (
//       <ErrorMessage 
//         message="Failed to load dashboard" 
//         onRetry={() => refetch()} 
//       />
//     );
//   }

//   if (!data?.data) {
//     return (
//       <div className="dashboard-empty">
//         <p>No dashboard data available</p>
//         <button onClick={() => refetch()} className="retry-button">
//           Refresh
//         </button>
//       </div>
//     );
//   }

//   const dashboardData = data.data;
  
//   const {
//     totalSpent,
//     thisMonthSpent,
//     orderCount,
//     activeOrderCount,
//     subscriptionCount,
//     activeSubscriptions = [],
//     walletBalance,
//     spendingByMonth = [],
//     recentActivities = [],
//     orderTotal,
//     subscriptionTotal,
//     topupTotal,
//     orderMonthly,
//     subscriptionMonthly,
//     topupMonthly
//   } = dashboardData;

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Dashboard Overview</h1>
//         <button className="refresh-button" onClick={() => refetch()}>
//           <FaRedo /> Refresh
//         </button>
//       </div>

//       {/* Stats Grid */}
//       <div className="stats-grid">
//         <StatCard
//           title="Total Spent"
//           value={formatCurrency(totalSpent)}
//           subtitle={`${formatCurrency(thisMonthSpent)} this month`}
//           icon={<FaChartLine />}
//           color="primary"
//           onClick={() => navigate('/analytics')}
//         />
//         <StatCard
//           title="Orders"
//           value={orderCount}
//           subtitle={`${activeOrderCount} active • ${formatCurrency(orderTotal)} total`}
//           icon={<FaShoppingCart />}
//           color="secondary"
//           onClick={() => navigate('/orders')}
//         />
//         <StatCard
//           title="Subscriptions"
//           value={subscriptionCount}
//           subtitle={`${activeSubscriptions.length} active • ${formatCurrency(subscriptionTotal)} total`}
//           icon={<FaFileInvoiceDollar />}
//           color="info"
//           onClick={() => navigate('/subscriptions')}
//         />
//         <StatCard
//           title="Wallet Balance"
//           value={formatCurrency(walletBalance)}
//           subtitle={`${formatCurrency(topupTotal)} total top-ups`}
//           icon={<FaWallet />}
//           color="success"
//           onClick={() => navigate('/wallet')}
//         />
//       </div>

//       {/* Detailed Grid */}
//       <div className="content-grid">
//         {/* Monthly Spending */}
//         <div className="card">
//           <div className="card-header">
//             <h3>This Month's Spending</h3>
//           </div>
//           <div className="card-content">
//             <div className="spending-breakdown">
//               <div className="breakdown-item">
//                 <span>Orders</span>
//                 <span className="breakdown-amount">{formatCurrency(orderMonthly)}</span>
//               </div>
//               <div className="breakdown-item">
//                 <span>Subscriptions</span>
//                 <span className="breakdown-amount">{formatCurrency(subscriptionMonthly)}</span>
//               </div>
//               <div className="breakdown-item">
//                 <span>Wallet Top-ups</span>
//                 <span className="breakdown-amount">{formatCurrency(topupMonthly)}</span>
//               </div>
//               <div className="breakdown-divider"></div>
//               <div className="breakdown-total">
//                 <span>Total</span>
//                 <span className="total-amount">
//                   {formatCurrency(orderMonthly + subscriptionMonthly + topupMonthly)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Next Delivery */}
//         <NextDelivery />

//         {/* Spending Chart */}
//         {spendingByMonth.length > 0 && (
//           <div className="card">
//             <div className="card-header">
//               <h3>Monthly Spending</h3>
//             </div>
//             <div className="card-content">
//               <div className="spending-chart">
//                 {spendingByMonth.map((item, index) => {
//                   const maxAmount = Math.max(...spendingByMonth.map(i => i.total));
//                   const percentage = maxAmount > 0 ? (item.total / maxAmount) * 100 : 0;
                  
//                   return (
//                     <div key={index} className="chart-bar">
//                       <div className="chart-label">
//                         <span>{item.month}</span>
//                         <span>{formatCurrency(item.total)}</span>
//                       </div>
//                       <div className="chart-track">
//                         <div 
//                           className="chart-fill"
//                           style={{ width: `${percentage}%` }}
//                         />
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Recent Activities */}
//       {recentActivities.length > 0 && (
//         <div className="card">
//           <div className="card-header">
//             <FaHistory className="card-icon" />
//             <h3>Recent Activities</h3>
//           </div>
//           <div className="card-content">
//             <div className="activities-list">
//               {recentActivities.map((activity, index) => (
//                 <ActivityItem 
//                   key={index} 
//                   activity={activity} 
//                   onClick={() => {
//                     if (activity.type === 'order') navigate('/orders/history');
//                     if (activity.type === 'subscription') navigate('/subscriptions');
//                     if (activity.type === 'wallet_transaction') navigate('/wallet/transactions');
//                   }}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardOverview;