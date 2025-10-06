// components/OrderList.js
import React, { useState } from 'react';

const OrderList = ({ orders, loading, error, onViewOrder, onUpdateOrderStatus }) => {
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    const result = await onUpdateOrderStatus(orderId, newStatus);
    setUpdatingOrderId(null);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'in-transit': return 'status-in-transit';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  const getPaymentStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed': return 'payment-completed';
      case 'pending': return 'payment-pending';
      case 'failed': return 'payment-failed';
      default: return 'payment-default';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-retry">
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-box-open"></i>
        <h3>No orders found</h3>
        <p>Try adjusting your filters or check back later for new orders.</p>
      </div>
    );
  }

  return (
    <div className="order-list-container">
      <div className="order-grid">
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-card-header">
              <div className="order-id">#{order.orderId}</div>
              <div className="order-date">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="order-card-body">
              <div className="customer-info">
                <div className="customer-name">
                  {order.user?.firstName} {order.user?.lastName}
                </div>
                <div className="customer-email">{order.user?.email}</div>
              </div>
              
              <div className="order-details">
                <div className="order-item">
                  <span className="label">Items:</span>
                  <span className="value">{order.products.length} product(s)</span>
                </div>
                <div className="order-item">
                  <span className="label">Total:</span>
                  <span className="value">₦{order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="order-item">
                  <span className="label">Payment:</span>
                  <span className={`payment-badge ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="order-status-section">
                <div className={`status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </div>
                
                <div className="status-actions">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updatingOrderId === order._id}
                    className="status-select"
                  >
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  {updatingOrderId === order._id && (
                    <i className="fas fa-spinner fa-spin updating-spinner"></i>
                  )}
                </div>
              </div>
            </div>
            
            <div className="order-card-footer">
              <button
                onClick={() => onViewOrder(order)}
                className="btn-view-details"
              >
                <i className="fas fa-eye"></i> View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;