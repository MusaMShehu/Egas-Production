// components/dashboard/StatsCards.js
import React from 'react';
import { formatDate } from '../../utils/helperss';
// import '../../styles/StatsCards.css'

const StatsCards = ({ user }) => {
  const activeOrders = user.recentOrders.filter(order => order.status !== 'delivered').length;
  
  const handleRefreshBalance = () => {
    document.getElementById('refresh-balance').innerHTML = '<i class="fas fa-check mr-1"></i> Updated';
    setTimeout(() => {
      document.getElementById('refresh-balance').innerHTML = '<i class="fas fa-sync-alt mr-1"></i> Refresh';
    }, 2000);
  };

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h3 className="stat-label">Active Orders</h3>
        <p className="stat-value" id="active-orders-count">{activeOrders}</p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(activeOrders / user.recentOrders.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="stat-card">
        <h3 className="stat-label">Upcoming Deliveries</h3>
        <p className="stat-value" id="upcoming-deliveries">
          {user.subscription.active ? 1 : 0}
        </p>
        <div className="stat-label" id="next-delivery-date">
          {user.subscription.active ? `Next: ${formatDate(user.subscription.nextDelivery)}` : 'No upcoming deliveries'}
        </div>
      </div>
      
      <div className="stat-card">
        <h3 className="stat-label">Subscription Status</h3>
        <p className={`stat-value ${user.subscription.active ? 'text-green-500' : 'text-red-500'}`} id="subscription-status">
          {user.subscription.active ? 'Active' : 'Inactive'}
        </p>
        <div className="stat-label" id="subscription-type">
          {user.subscription.active ? `${user.subscription.type.replace(/^\w/, c => c.toUpperCase())} Auto-Refill` : 'No active subscription'}
        </div>
      </div>
      
      <div className="stat-card">
        <h3 className="stat-label">Account Balance</h3>
        <p className="stat-value" id="account-balance">₦{user.walletBalance.toLocaleString()}</p>
        <button className="stat-action" id="refresh-balance" onClick={handleRefreshBalance}>
          <i className="fas fa-sync-alt mr-1"></i> Refresh
        </button>
      </div>
    </div>
  );
};

export default StatsCards;