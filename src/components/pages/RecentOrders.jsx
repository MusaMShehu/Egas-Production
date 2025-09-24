// components/dashboard/RecentOrders.js
import React, { useState, useEffect } from 'react';
import { formatDate, getStatusClass, /*formatCurrency*/ } from '../../utils/helpers';
// import { EyeIcon, TruckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import '../../styles/RecentOrders.css';

const RecentOrders = ({ orders, onViewAll, isLoading = false }) => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [localOrders, setLocalOrders] = useState([]);

  // Sync local state with props
  useEffect(() => {
    if (orders && Array.isArray(orders)) {
      setLocalOrders(orders);
    } else {
      setLocalOrders([]);
    }
  }, [orders]);

  const handleActionClick = (orderId, status, event) => {
    event.stopPropagation();
    // Handle different actions based on status
    if (status === 'processing') {
      console.log('Tracking order:', orderId);
    } else {
      console.log('Viewing invoice for order:', orderId);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (isLoading) {
    return (
      <div className="recent-orders">
        <div className="orders-header">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <button className="view-all-button" onClick={onViewAll}>
            View All
          </button>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (!localOrders || localOrders.length === 0) {
    return (
      <div className="recent-orders">
        <div className="orders-header">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <button className="view-all-button" onClick={onViewAll}>
            View All
          </button>
        </div>
        <div className="empty-state">
          <p>No orders found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recent-orders">
      <div className="orders-header">
        <h2 className="text-xl font-bold">Recent Orders</h2>
        <button 
          className="view-all-button" 
          onClick={onViewAll}
          aria-label="View all orders"
        >
          View All
        </button>
      </div>
      
      <div className="orders-container">
        <div className="table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {localOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    className="order-row"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <td className="order-id">#{order.id}</td>
                    <td className="order-date">{formatDate(order.date)}</td>
                    <td className="order-product">{order.product}</td>
                    <td className="order-quantity">{order.quantity}</td>
                    <td className="order-amount">{/*formatCurrency*/(order.amount)}</td>
                    <td className="order-status">
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="order-action">
                      <button
                        className={`action-button ${order.status === 'processing' ? 'track' : 'view'}`}
                        onClick={(e) => handleActionClick(order.id, order.status, e)}
                        aria-label={order.status === 'processing' ? 'Track order' : 'View invoice'}
                      >
                        {/* {order.status === 'processing' ? (
                          <TruckIcon className="action-icon" />
                        ) : (
                          <DocumentTextIcon className="action-icon" />
                        )} */}
                        {order.status === 'processing' ? 'Track' : 'Invoice'}
                      </button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr className="order-details-row">
                      <td colSpan="7">
                        <div className="order-details">
                          <div className="detail-item">
                            <span className="detail-label">Customer:</span>
                            <span className="detail-value">{order.customerName || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Payment Method:</span>
                            <span className="detail-value">{order.paymentMethod || 'N/A'}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-label">Shipping Address:</span>
                            <span className="detail-value">{order.shippingAddress || 'N/A'}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;