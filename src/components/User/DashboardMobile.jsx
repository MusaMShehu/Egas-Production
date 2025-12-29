import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter } from 'date-fns';
import { 
  FaChartLine,
  FaShoppingCart, 
  FaFileInvoiceDollar, 
  FaWallet, 
  FaTruck,
  FaHistory,
  FaCheckCircle,
  FaRedo,
  FaExclamationTriangle,
  FaHome,
  FaBox,
  FaUser,
  FaTags,
  FaChevronRight,
  FaFire,
  FaPercentage,
  FaClock
} from 'react-icons/fa';
import './DashboardMobile.css';
import { successToast, errorToast, infoToast, warningToast } from "../../utils/toast";

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

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount || 0);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Loading Component
const LoadingSpinner = () => (
  <div className="mobile-dashboard-loading">
    <div className="mobile-loading-spinner"></div>
    <p>Loading dashboard...</p>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="mobile-error-container">
    <div className="mobile-error-icon">
      <FaExclamationTriangle />
    </div>
    <h3>Oops!</h3>
    <p>{message}</p>
    <button className="mobile-retry-btn" onClick={onRetry}>
      <FaRedo /> Try Again
    </button>
  </div>
);

// Main Dashboard Component
const DashboardMobile = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, orders, subscriptions
  const [showPromo, setShowPromo] = useState(true);

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
      const errorMsg = err.message || 'Failed to load dashboard data';
      setError(errorMsg);
      errorToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    infoToast('Refreshing...');
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Quick Actions Component - UPDATED VERSION WITH REAL PATHS
  const QuickActions = () => {
    const quickActions = [
      {
        id: 'order-gas',
        title: 'Order for Refill',
        icon: <FaShoppingCart />,
        path: '/dashboard/orders/',
        className: 'action-btn primary',
      },
      {
        id: 'subscriptions',
        title: 'Manage Subscription',
        icon: <FaFileInvoiceDollar />,
        path: '/dashboard/subscriptions',
        className: 'action-btn secondary',
      },
      {
        id: 'delivery',
        title: 'Delivery Schedules',
        icon: <FaTruck />,
        path: '/dashboard/delivery',
        className: 'action-btn tertiary',
      },
      {
        id: 'history',
        title: 'History',
        icon: <FaHistory />,
        path: '/dashboard/history',
        className: 'action-btn quaternary',
      }
    ];

    const handleActionClick = (action) => {
      navigate(action.path);
    };

    return (
      <div className="mobile-quick-actions">
        <div className="action-grid">
          {quickActions.map((action) => (
            <button
              key={action.id}
              className={action.className}
              onClick={() => handleActionClick(action)}
            >
              {action.icon}
              <span>{action.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchDashboardData} />;
  }

  if (!dashboardData) {
    return (
      <div className="mobile-dashboard-container">
        <div className="mobile-warning-message">
          <FaExclamationTriangle />
          <span>No data available</span>
        </div>
        <button className="mobile-refresh-btn" onClick={handleRefresh}>
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
    nextDeliveryDate,
    subscriptionCount,
    activeSubscriptions = [],
    walletBalance,
    spendingByMonth = [],
    recentActivities = []
  } = dashboardData;

  // Hero Banner Component
  const HeroBanner = () => (
    <div className="mobile-hero-banner">
      <div className="hero-content">
        <h1>Fast & Reliable Gas Delivery!</h1>
        <div className="hero-features">
          <div className="hero-feature">
            <FaPercentage />
            <span>Discounts Up to 20%</span>
          </div>
          <div className="hero-feature">
            <FaClock />
            <span>24/7 Service Available</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Stats Cards Component
  const StatsCards = () => (
    <div className="mobile-stats-cards">
      <div className="stats-grid">
        <div 
          className="stat-card blue"
          onClick={() => infoToast(`Total spent: ${formatCurrency(totalSpent)}`)}
        >
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <h3>Total Spent</h3>
            <div className="stat-value">{formatCurrency(totalSpent)}</div>
            <p className="stat-subtitle">This month: {formatCurrency(thisMonthSpent)}</p>
          </div>
        </div>

        <div 
          className="stat-card orange"
          onClick={() => infoToast(`${orderCount} orders • ${activeOrderCount} active`)}
        >
          <div className="stat-icon">
            <FaShoppingCart />
          </div>
          <div className="stat-content">
            <h3>Orders</h3>
            <div className="stat-value">{orderCount}</div>
            <p className="stat-subtitle">{activeOrderCount} active</p>
          </div>
        </div>

        <div 
          className="stat-card green"
          onClick={() => infoToast(`${subscriptionCount} subscriptions • ${activeSubscriptions.length} active`)}
        >
          <div className="stat-icon">
            <FaFileInvoiceDollar />
          </div>
          <div className="stat-content">
            <h3>Subscriptions</h3>
            <div className="stat-value">{subscriptionCount}</div>
            <p className="stat-subtitle">{activeSubscriptions.length} active</p>
          </div>
        </div>

        <div 
          className="stat-card purple"
          onClick={() => infoToast(`Wallet balance: ${formatCurrency(walletBalance)}`)}
        >
          <div className="stat-icon">
            <FaWallet />
          </div>
          <div className="stat-content">
            <h3>Wallet Balance</h3>
            <div className="stat-value">{formatCurrency(walletBalance)}</div>
            <p className="stat-subtitle">Total top-ups: {formatCurrency(topupTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Promotions Banner
  const PromotionsBanner = () => {
    if (!showPromo) return null;
    
    return (
      <div className="mobile-promo-banner">
        <div className="promo-header">
          <FaFire className="promo-icon" />
          <h3>Flash Sale!</h3>
          <button 
            className="promo-close"
            onClick={() => setShowPromo(false)}
          >
            ×
          </button>
        </div>
        <p>Up to 30% off on refills this week!</p>
        <button 
          className="promo-action-btn"
          onClick={() => {
            infoToast('Claiming discount...');
            navigate('/orders/new');
          }}
        >
          Save Now
        </button>
      </div>
    );
  };

  // Next Delivery Component
  const NextDelivery = () => {
    const isUpcoming = nextDeliveryDate && isAfter(new Date(nextDeliveryDate), new Date());
    
    return (
      <div className="mobile-delivery-card">
        <div className="delivery-header">
          <FaTruck />
          <h3>Track Delivery</h3>
          <button 
            className="view-all-btn"
            onClick={() => {
              infoToast('Viewing all deliveries...');
              navigate('/tracking');
            }}
          >
            View All <FaChevronRight />
          </button>
        </div>
        
        <div className="delivery-content">
          {nextDeliveryDate ? (
            <div className="delivery-schedule">
              <div className="delivery-date-badge">
                <span className="date-label">Next Delivery</span>
                <span className="date-value">{formatDate(nextDeliveryDate)}</span>
              </div>
              <div className="delivery-status">
                <span className={`status-indicator ${isUpcoming ? 'upcoming' : 'pending'}`}></span>
                {isUpcoming ? 'Upcoming' : 'Pending'}
              </div>
            </div>
          ) : (
            <div className="no-delivery">
              <p>No upcoming deliveries scheduled</p>
            </div>
          )}
          
          {activeSubscriptions.length > 0 && (
            <div className="active-subscriptions">
              <h4>Active Subscriptions</h4>
              <div className="subscriptions-list">
                {activeSubscriptions.slice(0, 2).map((sub, index) => (
                  <div 
                    key={index} 
                    className="subscription-item"
                    onClick={() => {
                      infoToast(`Subscription: ${sub.name || 'Unnamed'}`);
                      navigate('/subscriptions');
                    }}
                  >
                    <FaCheckCircle />
                    <div className="subscription-details">
                      <span className="subscription-name">{sub.name || 'Subscription'}</span>
                      <span className="subscription-frequency">{sub.deliveryFrequency || 'Regular'}</span>
                    </div>
                    <span className="subscription-amount">{formatCurrency(sub.amount || 0)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Recent Activities Component
  const RecentActivities = () => (
    <div className="mobile-activities-card">
      <div className="activities-header">
        <FaHistory />
        <h3>Recent Activities</h3>
        <button 
          className="view-all-btn"
          onClick={() => {
            infoToast('Viewing all activities...');
            navigate('/orders/history');
          }}
        >
          View All <FaChevronRight />
        </button>
      </div>
      
      <div className="activities-list">
        {recentActivities.slice(0, 3).map((activity, index) => {
          const IconComponent = activityIcons[activity.type];
          const statusConfigItem = statusConfig[activity.type]?.[activity.status] || { className: '', label: activity.status };
          
          return (
            <div 
              key={index} 
              className="activity-item"
              onClick={() => {
                infoToast(`Activity: ${activity.title}`);
                if (activity.type === 'order') navigate('/orders/history');
                if (activity.type === 'subscription') navigate('/subscriptions');
              }}
            >
              <div className="activity-icon">
                {IconComponent ? <IconComponent /> : <FaHistory />}
              </div>
              <div className="activity-content">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-details">
                  <span className="activity-amount">{formatCurrency(activity.amount)}</span>
                  <span className={`activity-status ${statusConfigItem.className}`}>
                    {statusConfigItem.label}
                  </span>
                </div>
              </div>
              <div className="activity-date">{formatDate(activity.createdAt)}</div>
            </div>
          );
        })}
        
        {recentActivities.length === 0 && (
          <div className="no-activities">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );

  // Monthly Spending Component
  const MonthlySpending = () => (
    <div className="mobile-spending-card">
      <div className="spending-header">
        <h3>This Month's Spending</h3>
        <div className="spending-total">
          {formatCurrency(orderMonthly + subscriptionMonthly + topupMonthly)}
        </div>
      </div>
      
      <div className="spending-breakdown">
        <div className="breakdown-item">
          <div className="breakdown-label">
            <FaShoppingCart />
            <span>Orders</span>
          </div>
          <div className="breakdown-amount">{formatCurrency(orderMonthly)}</div>
        </div>
        
        <div className="breakdown-item">
          <div className="breakdown-label">
            <FaFileInvoiceDollar />
            <span>Subscriptions</span>
          </div>
          <div className="breakdown-amount">{formatCurrency(subscriptionMonthly)}</div>
        </div>
        
        <div className="breakdown-item">
          <div className="breakdown-label">
            <FaWallet />
            <span>Top-ups</span>
          </div>
          <div className="breakdown-amount">{formatCurrency(topupMonthly)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mobile-dashboard-container">
      {/* Header */}
      <div className="mobile-dashboard-header">
        <div className="header-content">
          <h1>eGas Dashboard</h1>
          <button className="mobile-refresh-btn" onClick={handleRefresh}>
            <FaRedo />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mobile-dashboard-content">
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Quick Actions - Now with real navigation */}
        <QuickActions />
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Promotions */}
        <PromotionsBanner />
        
        {/* Delivery Status */}
        <NextDelivery />
        
        {/* Recent Activities */}
        <RecentActivities />
        
        {/* Monthly Spending */}
        <MonthlySpending />
      </div>

      {/* Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button className="nav-btn active">
          <FaHome />
          <span>Home</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => navigate('/orders/new')}
        >
          <FaBox />
          <span>Order</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => navigate('/subscriptions')}
        >
          <FaFileInvoiceDollar />
          <span>Subscriptions</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => navigate('/orders/history')}
        >
          <FaHistory />
          <span>History</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => navigate('/profile')}
        >
          <FaUser />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardMobile;