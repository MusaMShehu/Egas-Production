// components/OrderList.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faBoxOpen, 
  faSync 
} from '@fortawesome/free-solid-svg-icons';
import OrderCard from './OrderCard';

const OrderList = ({ 
  orders, 
  loading, 
  error, 
  selectedOrders,
  onViewOrder, 
  onUpdateOrderStatus, 
  onOrderSelect,
  onSelectAll,
  permissions 
}) => {
  const [updatingOrder, setUpdatingOrder] = useState(null);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    const result = await onUpdateOrderStatus(orderId, newStatus);
    setUpdatingOrder(null);
    
    if (result.success) {
      // Optional: Show success notification
    } else {
      // Optional: Show error notification
      alert(result.message);
    }
  };

  const allSelected = orders.length > 0 && orders.every(order => selectedOrders.has(order._id));

  if (loading) {
    return (
      <div className="aom-loading-container">
        <div className="aom-loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aom-error-container">
        <FontAwesomeIcon icon={faExclamationTriangle} className="aom-error-icon" />
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="aom-btn-retry">
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="aom-empty-state">
        <FontAwesomeIcon icon={faBoxOpen} className="aom-empty-icon" />
        <h3>No orders found</h3>
        <p>Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="aom-order-list-container">
      <div className="aom-order-list-header">
        <div className="aom-select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
            disabled={!permissions?.canBulkUpdate}
          />
          <span>Select All</span>
        </div>
        <div className="aom-header-columns">
          <span className="aom-col-order">Order</span>
          <span className="aom-col-customer">Customer</span>
          <span className="aom-col-amount">Amount</span>
          <span className="aom-col-status">Status</span>
          <span className="aom-col-payment">Payment</span>
          <span className="aom-col-date">Date</span>
          <span className="aom-col-actions">Actions</span>
        </div>
      </div>

      <div className="aom-order-list">
        {orders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            isSelected={selectedOrders.has(order._id)}
            onSelect={onOrderSelect}
            onView={onViewOrder}
            onStatusUpdate={handleStatusUpdate}
            updating={updatingOrder === order._id}
            permissions={permissions}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderList;