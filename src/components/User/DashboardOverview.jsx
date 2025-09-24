// components/Dashboard.js
import React, { useState } from 'react';
import "./DashboardOverview.css";

const DashboardOverview = () => {
  const [balance, setBalance] = useState(15250);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshBalance = () => {
    setBalance(prev => prev + 100);
    setTimeout(() => {
      alert('Balance refreshed successfully!');
    }, 500);
  };

  const orders = [
    {
      id: 'EG-1001',
      date: 'May 15, 2023',
      product: '12kg Gas Cylinder',
      quantity: 1,
      amount: '¥10,500',
      status: 'Processing',
      statusClass: 'status-processing'
    }
  ];

  const quickActions = [
    { icon: 'fa-fire-flame-curved', text: 'Order Gas' },
    { icon: 'fa-repeat', text: 'Manage Subscription' },
    { icon: 'fa-wallet', text: 'Top Up Wallet' },
    { icon: 'fa-headset', text: 'Contact Support' }
  ];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input 
            type="text" 
            placeholder="Type here to search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Active Orders</h3>
          <div className="value">1</div>
        </div>
        <div className="stat-card">
          <h3>Upcoming Deliveries</h3>
          <div className="value">1</div>
          <p>Next: May 25, 2023</p>
        </div>
        <div className="stat-card">
          <h3>Subscription Status</h3>
          <div className="value">Active</div>
          <span className="status status-active">Monthly Auto-Refill</span>
        </div>
        <div className="stat-card">
          <h3>Account Balance</h3>
          <div className="value">¥{balance.toLocaleString()}</div>
          <button className="refresh-btn" onClick={refreshBalance}>
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <div className="quick-actions">
        {quickActions.map((action, index) => (
          <button key={index} className="action-btn">
            <i className={`fas ${action.icon}`}></i>
            <span>{action.text}</span>
          </button>
        ))}
      </div>

      <div className="orders-container">
        <h2>Recent Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.id}</td>
                <td>{order.date}</td>
                <td>{order.product}</td>
                <td>{order.quantity}</td>
                <td>{order.amount}</td>
                <td className={order.statusClass}>{order.status}</td>
                <td><button className="track-btn">Track</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="delivery-status">
        <h2>Current Delivery Status</h2>
        <p>Order #EG-1001</p>
        <p>Estimated delivery: May 18, 2023</p>
        
        <div className="status-timeline">
          <div className="status-step completed">
            <div className="status-icon">
              <i className="fas fa-check"></i>
            </div>
            <div>Order Placed</div>
          </div>
          <div className="status-step completed">
            <div className="status-icon">
              <i className="fas fa-check"></i>
            </div>
            <div>Shipped</div>
          </div>
          <div className="status-step active">
            <div className="status-icon">
              <i className="fas fa-truck"></i>
            </div>
            <div>In Transit</div>
          </div>
          <div className="status-step">
            <div className="status-icon">
              <i className="fas fa-home"></i>
            </div>
            <div>Delivered</div>
          </div>
        </div>
        
        <div className="current-status">
          <strong>Current Status:</strong> In Transit - Near your location
        </div>
        
        <a href="#" className="view-tracking">View Full Tracking</a>
      </div>
    </div>
  );
};

export default DashboardOverview;