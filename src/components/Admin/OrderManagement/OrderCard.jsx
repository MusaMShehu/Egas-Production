// components/OrderCard.js
import React from 'react';
import { FaEye, FaEdit, FaCheck, FaTruck, FaBox, FaTimes, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const OrderCard = ({ 
  order, 
  isSelected, 
  onSelect, 
  onView, 
  onStatusUpdate, 
  updating, 
  permissions 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      'processing': 'aom-status-processing',
      'in-transit': 'aom-status-transit',
      'delivered': 'aom-status-delivered',
      'cancelled': 'aom-status-cancelled',
      'pending': 'aom-status-pending',
      'completed': 'aom-status-completed',
      'failed': 'aom-status-failed'
    };
    return statusClasses[status] || 'aom-status-default';
  };

  const getDeliveryOptionText = (option) => {
    return option === 'express' ? 'Express' : 'Standard';
  };

  const getStatusIcon = (status) => {
    const statusIcons = {
      'processing': <FaClock className="aom-icon" />,
      'in-transit': <FaTruck className="aom-icon" />,
      'delivered': <FaBox className="aom-icon" />,
      'cancelled': <FaTimes className="aom-icon" />,
      'completed': <FaCheck className="aom-icon" />,
      'pending': <FaClock className="aom-icon" />,
      'failed': <FaTimes className="aom-icon" />
    };
    return statusIcons[status] || <FaClock className="aom-icon" />;
  };

  return (
    <div className={`aom-order-card ${isSelected ? 'aom-selected' : ''}`}>
      <div className="aom-order-select">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(order._id, e.target.checked)}
          disabled={!permissions?.canBulkUpdate}
        />
      </div>

      <div className="aom-order-main-info">
        <div className="aom-order-id-section">
          <h4 className="aom-order-id">{order.orderId}</h4>
          {order.reference && (
            <span className="aom-order-reference">Ref: {order.reference}</span>
          )}
          <span className="aom-delivery-option">
            {getDeliveryOptionText(order.deliveryOption)}
          </span>
        </div>

        <div className="aom-customer-info">
          <p className="aom-customer-name">
            {order.user?.firstName} {order.user?.lastName}
          </p>
          <p className="aom-customer-email">{order.user?.email}</p>
        </div>

        <div className="aom-order-amount">
          <p className="aom-amount">
            <FaMoneyBillWave className="aom-icon" /> {formatCurrency(order.totalAmount)}
          </p>
          {order.deliveryFee > 0 && (
            <p className="aom-delivery-fee">Delivery: {formatCurrency(order.deliveryFee)}</p>
          )}
        </div>

        <div className="aom-status-section">
          <div className="aom-status-badges">
            <span className={`aom-status-badge ${getStatusBadgeClass(order.orderStatus)}`}>
              {getStatusIcon(order.orderStatus)} {order.orderStatus}
            </span>
            <span className={`aom-status-badge ${getStatusBadgeClass(order.paymentStatus)}`}>
              {getStatusIcon(order.paymentStatus)} {order.paymentStatus}
            </span>
          </div>
          
          {permissions?.canEditOrder && (
            <select
              value={order.orderStatus}
              onChange={(e) => onStatusUpdate(order._id, e.target.value)}
              disabled={updating}
              className="aom-status-dropdown"
            >
              <option value="processing">Processing</option>
              <option value="in-transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>

        <div className="aom-order-date">
          <p>{formatDate(order.createdAt)}</p>
          {order.deliveryDate && (
            <p className="aom-delivery-date">
              Deliver by: {formatDate(order.deliveryDate)}
            </p>
          )}
        </div>

        <div className="aom-order-actions">
          <button
            onClick={() => onView(order)}
            className="aom-btn-view"
            title="View Order Details"
          >
            <FaEye className="aom-icon" />
          </button>
          
          {permissions?.canEditOrder && (
            <button
              onClick={() => onView(order)}
              className="aom-btn-edit"
              title="Edit Order"
            >
              <FaEdit className="aom-icon" />
            </button>
          )}
        </div>
      </div>

      {order.tracking && (
        <div className="aom-tracking-info">
          <div className="aom-tracking-progress">
            <div 
              className="aom-progress-bar"
              style={{ width: `${order.tracking.progress || 0}%` }}
            ></div>
          </div>
          <span className="aom-tracking-location">
            {order.tracking.location || 'Tracking updated'}
          </span>
        </div>
      )}
    </div>
  );
};

export default OrderCard;