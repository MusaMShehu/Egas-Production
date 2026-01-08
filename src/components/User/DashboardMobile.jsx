
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaExclamationTriangle,
  FaHome,
  FaBox,
  FaUser,
  FaTags,
  FaChevronRight,
  FaFire,
  FaPercentage,
  FaClock,
  FaCogs,
  FaHeadset,
  FaCog
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
  },

  getNextDelivery: async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('https://egas-server-1.onrender.com/api/v1/admin/delivery/next-delivery', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching next delivery:', error);
      throw new Error('Failed to fetch next delivery');
    }
  }
};

// Status configuration
const statusConfig = {
  order: {
    completed: { className: 'mobdash-status-success', label: 'Completed' },
    processing: { className: 'mobdash-status-warning', label: 'Processing' },
    'in-transit': { className: 'mobdash-status-info', label: 'In Transit' },
    cancelled: { className: 'mobdash-status-error', label: 'Cancelled' }
  },
  subscription: {
    active: { className: 'mobdash-status-success', label: 'Active' },
    paused: { className: 'mobdash-status-warning', label: 'Paused' },
    expired: { className: 'mobdash-status-error', label: 'Expired' }
  },
  wallet_transaction: {
    Credit: { className: 'mobdash-status-success', label: 'Credit' },
    Debit: { className: 'mobdash-status-info', label: 'Debit' }
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
    return format(date, 'EEE, MMM dd, yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Loading Component
const LoadingSpinner = () => (
  <div className="mobdash-mobile-dashboard-loading">
    <div className="mobdash-mobile-loading-spinner"></div>
    <p>Loading dashboard...</p>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="mobdash-mobile-error-container">
    <div className="mobdash-mobile-error-icon">
      <FaExclamationTriangle />
    </div>
    <h3>Oops!</h3>
    <p>{message}</p>
    <button className="mobdash-mobile-retry-btn" onClick={onRetry}>
      <FaRedo /> Try Again
    </button>
  </div>
);

// UPDATED: Next Delivery Component for Mobile
const NextDeliveryMobile = () => {
  const navigate = useNavigate();
  const [nextDelivery, setNextDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNextDelivery = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getNextDelivery();
      
      if (response.success && response.data) {
        setNextDelivery(response.data);
      } else {
        setNextDelivery(null);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching next delivery:', err);
      setError('Failed to fetch delivery information');
      setNextDelivery(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextDelivery();
  }, []);

  const handleDeliveryClick = () => {
    if (nextDelivery) {
      infoToast(`Delivery scheduled for ${formatDate(nextDelivery.deliveryDate)}`);
      navigate('/tracking');
    } else {
      infoToast('No upcoming deliveries');
    }
  };

  const handleSubscriptionClick = () => {
    if (nextDelivery?.subscription) {
      infoToast(
        `Subscription: ${nextDelivery.subscription.name} - ` +
        `Size: ${nextDelivery.subscription.size} - ` +
        `Frequency: ${nextDelivery.subscription.frequency}`
      );
      navigate('/subscriptions');
    }
  };

  const handleRefresh = () => {
    infoToast('Refreshing delivery info...');
    fetchNextDelivery();
  };

  if (loading) {
    return (
      <div className="mobdash-mobile-delivery-card">
        <div className="mobdash-delivery-header">
          <FaTruck />
          <h3>Next Delivery</h3>
          <button 
            className="mobdash-view-all-btn"
            onClick={handleRefresh}
          >
            <FaRedo />
          </button>
        </div>
        <div className="mobdash-delivery-content">
          <div className="mobdash-loading-state">
            <div className="mobdash-loading-spinner-small"></div>
            <p>Loading delivery information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobdash-mobile-delivery-card">
        <div className="mobdash-delivery-header">
          <FaTruck />
          <h3>Next Delivery</h3>
          <button 
            className="mobdash-view-all-btn"
            onClick={handleRefresh}
          >
            <FaRedo />
          </button>
        </div>
        <div className="mobdash-delivery-content">
          <div className="mobdash-error-state">
            <FaExclamationTriangle className="mobdash-error-icon" />
            <p>Failed to load delivery</p>
            <button className="mobdash-retry-btn-small" onClick={fetchNextDelivery}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobdash-mobile-delivery-card">
      <div className="mobdash-delivery-header">
        <FaTruck />
        <h3>Next Delivery</h3>
        <button 
          className="mobdash-view-all-btn"
          onClick={handleRefresh}
        >
          <FaRedo />
        </button>
      </div>
      
      <div className="mobdash-delivery-content">
        {nextDelivery ? (
          <>
            <div 
              className={`mobdash-delivery-schedule ${nextDelivery.isUpcoming ? 'mobdash-upcoming' : 'mobdash-pending'}`}
              onClick={handleDeliveryClick}
            >
              <div className="mobdash-delivery-date-badge">
                <span className="mobdash-date-label">Delivery Date</span>
                <span className="mobdash-date-value">{formatDate(nextDelivery.deliveryDate)}</span>
              </div>
              <div className="mobdash-delivery-status">
                <span className={`mobdash-status-indicator ${nextDelivery.isUpcoming ? 'mobdash-status-upcoming' : 'mobdash-status-pending'}`}></span>
                {nextDelivery.isUpcoming ? 'Upcoming' : 'Pending'}
                <span className="mobdash-delivery-status-badge">
                  {nextDelivery.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            {/* Subscription Details */}
            <div className="mobdash-subscription-details">
              <h4>From this Subscription</h4>
              {nextDelivery.subscription ? (
                <div 
                  className="mobdash-subscription-item"
                  onClick={handleSubscriptionClick}
                >
                  <FaCheckCircle className="mobdash-subscription-icon" />
                  <div className="mobdash-subscription-content">
                    <div className="mobdash-subscription-name">
                      {nextDelivery.subscription.name || 'Subscription'}
                    </div>
                    <div className="mobdash-subscription-info">
                      <span className="mobdash-subscription-size">{nextDelivery.subscription.size || 'Standard'}</span>
                      <span className="mobdash-subscription-separator">•</span>
                      <span className="mobdash-subscription-frequency">{nextDelivery.subscription.frequency || 'Regular'}</span>
                    </div>
                    <div className="mobdash-subscription-status">
                      Status: <span className={`mobdash-status-${nextDelivery.subscription.status}`}>
                        {nextDelivery.subscription.status}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mobdash-no-subscription">
                  <p>No subscription information available</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="mobdash-no-delivery">
            <p>No upcoming deliveries scheduled</p>
            <small>When you have an active subscription, your next delivery will appear here.</small>
            <button 
              className="mobdash-explore-subscriptions"
              onClick={() => navigate('/dashboard/subscriptions')}
            >
              Explore Subscriptions
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Dashboard Component
const DashboardMobile = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        className: 'mobdash-action-btn mobdash-primary',
      },
      {
        id: 'subscriptions',
        title: 'Manage Subscription',
        icon: <FaFileInvoiceDollar />,
        path: '/dashboard/subscriptions',
        className: 'mobdash-action-btn mobdash-secondary',
      },
      {
        id: 'delivery',
        title: 'Delivery Schedules',
        icon: <FaTruck />,
        path: '/dashboard/delivery',
        className: 'mobdash-action-btn mobdash-tertiary',
      },
      {
        id: 'setting',
        title: 'Setting',
        icon: <FaCog />,
        path: '/dashboard/settings',
        className: 'mobdash-action-btn mobdash-quaternary',
      },
       {
        id: 'history',
        title: 'History',
        icon: <FaHistory />,
        path: '/dashboard/history',
        className: 'mobdash-action-btn mobdash-quaternary',
      },
       {
        id: 'support',
        title: 'Support',
        icon: <FaHeadset />,
        path: '/dashboard/support',
        className: 'mobdash-action-btn mobdash-quaternary',
      }
    ];

    const handleActionClick = (action) => {
      navigate(action.path);
    };

    return (
      <div className="mobdash-mobile-quick-actions">
        <div className="mobdash-action-grid">
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
      <div className="mobdash-mobile-dashboard-container">
        <div className="mobdash-mobile-warning-message">
          <FaExclamationTriangle />
          <span>No data available</span>
        </div>
        <button className="mobdash-mobile-refresh-btn" onClick={handleRefresh}>
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
    subscriptionCount,
    activeSubscriptions = [],
    walletBalance,
    spendingByMonth = [],
    recentActivities = []
  } = dashboardData;

  // Hero Banner Component
  const HeroBanner = () => (
    <div className="mobdash-mobile-hero-banner">
      <div className="mobdash-hero-content">
        <h1>Fast & Reliable Gas Delivery!</h1>
        <div className="mobdash-hero-features">
          <div className="mobdash-hero-feature">
            <FaPercentage />
            <span>Discounts Up to 20%</span>
          </div>
          <div className="mobdash-hero-feature">
            <FaClock />
            <span>24/7 Service Available</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Stats Cards Component
  const StatsCards = () => (
    <div className="mobdash-mobile-stats-cards">
      <div className="mobdash-stats-grid">
         <div 
          className="mobdash-stat-card mobdash-purple"
        >
          <div className="mobdash-stat-content">
            <h3>Wallet Balance</h3>
            <div className="mobdash-stat-value">{formatCurrency(walletBalance)}</div>
            <p className="mobdash-stat-subtitle">Total top-ups: {formatCurrency(topupTotal)}</p>
          </div>
        </div>

        <div 
          className="mobdash-stat-card mobdash-blue"
        >
          <div className="mobdash-stat-content">
            <h3>Total Spent</h3>
            <div className="mobdash-stat-value">{formatCurrency(totalSpent)}</div>
            <p className="mobdash-stat-subtitle">This month: {formatCurrency(thisMonthSpent)}</p>
          </div>
        </div>

        <div 
          className="mobdash-stat-card mobdash-green">
          <div className="mobdash-stat-content">
            <h3>Subscriptions</h3>
            <div className="mobdash-stat-value">{subscriptionCount}</div>
            <p className="mobdash-stat-subtitle">{activeSubscriptions.length} active</p>
          </div>
        </div>

        <div 
          className="mobdash-stat-card mobdash-orange"
        >
          <div className="mobdash-stat-content">
            <h3>Orders</h3>
            <div className="mobdash-stat-value">{orderCount}</div>
            <p className="mobdash-stat-subtitle">{activeOrderCount} active</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Promotions Banner
  const PromotionsBanner = () => {
    if (!showPromo) return null;
    
    return (
      <div className="mobdash-mobile-promo-banner">
        <div className="mobdash-promo-header">
          <FaFire className="mobdash-promo-icon" />
          <h3>Flash Sale!</h3>
          <button 
            className="mobdash-promo-close"
            onClick={() => setShowPromo(false)}
          >
            ×
          </button>
        </div>
        <p>Up to 30% off on refills this week!</p>
        <button 
          className="mobdash-promo-action-btn"
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

  // Recent Activities Component
  const RecentActivities = () => (
    <div className="mobdash-mobile-activities-card">
      <div className="mobdash-activities-header">
        <FaHistory />
        <h3>Recent Activities</h3>
        <button 
          className="mobdash-view-all-btn"
          onClick={() => {
            infoToast('Viewing all activities...');
            navigate('/orders/history');
          }}
        >
          View All <FaChevronRight />
        </button>
      </div>
      
      <div className="mobdash-activities-list">
        {recentActivities.slice(0, 3).map((activity, index) => {
          const IconComponent = activityIcons[activity.type];
          const statusConfigItem = statusConfig[activity.type]?.[activity.status] || { className: '', label: activity.status };
          
          return (
            <div 
              key={index} 
              className="mobdash-activity-item"
              onClick={() => {
                infoToast(`Activity: ${activity.title}`);
                if (activity.type === 'order') navigate('/orders/history');
                if (activity.type === 'subscription') navigate('/subscriptions');
              }}
            >
              <div className="mobdash-activity-icon">
                {IconComponent ? <IconComponent /> : <FaHistory />}
              </div>
              <div className="mobdash-activity-content">
                <div className="mobdash-activity-title">{activity.title}</div>
                <div className="mobdash-activity-details">
                  <span className="mobdash-activity-amount">{formatCurrency(activity.amount)}</span>
                  <span className={`mobdash-activity-status ${statusConfigItem.className}`}>
                    {statusConfigItem.label}
                  </span>
                </div>
              </div>
              <div className="mobdash-activity-date">{formatDate(activity.createdAt)}</div>
            </div>
          );
        })}
        
        {recentActivities.length === 0 && (
          <div className="mobdash-no-activities">
            No recent activities
          </div>
        )}
      </div>
    </div>
  );

  // Monthly Spending Component
  const MonthlySpending = () => (
    <div className="mobdash-mobile-spending-card">
      <div className="mobdash-spending-header">
        <h3>This Month's Spending</h3>
        <div className="mobdash-spending-total">
          {formatCurrency(orderMonthly + subscriptionMonthly + topupMonthly)}
        </div>
      </div>
      
      <div className="mobdash-spending-breakdown">
        <div className="mobdash-breakdown-item">
          <div className="mobdash-breakdown-label">
            <FaShoppingCart />
            <span>Orders</span>
          </div>
          <div className="mobdash-breakdown-amount">{formatCurrency(orderMonthly)}</div>
        </div>
        
        <div className="mobdash-breakdown-item">
          <div className="mobdash-breakdown-label">
            <FaFileInvoiceDollar />
            <span>Subscriptions</span>
          </div>
          <div className="mobdash-breakdown-amount">{formatCurrency(subscriptionMonthly)}</div>
        </div>
        
        <div className="mobdash-breakdown-item">
          <div className="mobdash-breakdown-label">
            <FaWallet />
            <span>Top-ups</span>
          </div>
          <div className="mobdash-breakdown-amount">{formatCurrency(topupMonthly)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mobdash-mobile-dashboard-container">
      {/* Header */}
      <div className="mobdash-mobile-dashboard-header">
        <div className="mobdash-header-content">
          <h1>e-Gas Dashboard</h1>
          <button className="mobdash-mobile-refresh-btn" onClick={handleRefresh}>
            <FaRedo />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mobdash-mobile-dashboard-content">
        {/* Hero Banner */}
        <HeroBanner />
        
        {/* Quick Actions - Now with real navigation */}
        <QuickActions />
        
        {/* Stats Cards */}
        <StatsCards />
        
        {/* Promotions */}
        <PromotionsBanner />
        
        {/* UPDATED: Next Delivery Component */}
        <NextDeliveryMobile />
        
        {/* Recent Activities */}
        <RecentActivities />
        
        {/* Monthly Spending */}
        <MonthlySpending />
      </div>

      {/* Bottom Navigation */}
      <div className="mobdash-mobile-bottom-nav">
        <button className="mobdash-nav-btn mobdash-active">
          <FaHome />
          <span>Home</span>
        </button>
        <button 
          className="mobdash-nav-btn"
          onClick={() => navigate('/orders/new')}
        >
          <FaBox />
          <span>Order</span>
        </button>
        <button 
          className="mobdash-nav-btn"
          onClick={() => navigate('/subscriptions')}
        >
          <FaFileInvoiceDollar />
          <span>Subscriptions</span>
        </button>
        <button 
          className="mobdash-nav-btn"
          onClick={() => navigate('/orders/history')}
        >
          <FaHistory />
          <span>History</span>
        </button>
        <button 
          className="mobdash-nav-btn"
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