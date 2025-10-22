// components/OrderDetails.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft, 
  faPrint, 
  faDownload 
} from '@fortawesome/free-solid-svg-icons';

const OrderDetails = ({ 
  order, 
  onBack, 
  onUpdateOrderStatus, 
  onUpdatePaymentStatus, 
  onUpdateTracking,
  permissions 
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [trackingData, setTrackingData] = useState(order.tracking || {});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = async (newStatus, type) => {
    if (type === 'order') {
      await onUpdateOrderStatus(order._id, newStatus);
    } else {
      await onUpdatePaymentStatus(order._id, newStatus);
    }
  };

  const handleTrackingUpdate = async () => {
    await onUpdateTracking(order._id, trackingData);
  };

  return (
    <div className="aom-order-details">
      <div className="aom-details-header">
        <button onClick={onBack} className="aom-btn-back">
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Orders
        </button>
        <h1>Order Details: {order.orderId}</h1>
        <div className="aom-order-actions">
          <button className="aom-btn-print">
            <FontAwesomeIcon icon={faPrint} /> Print
          </button>
          <button className="aom-btn-export">
            <FontAwesomeIcon icon={faDownload} /> Export
          </button>
        </div>
      </div>

      <div className="aom-details-overview">
        <div className="aom-overview-card">
          <h3>Order Information</h3>
          <div className="aom-overview-grid">
            <div>
              <label>Order ID</label>
              <p>{order.orderId}</p>
            </div>
            <div>
              <label>Reference</label>
              <p>{order.reference || 'N/A'}</p>
            </div>
            <div>
              <label>Date</label>
              <p>{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <label>Delivery Option</label>
              <p className={`aom-delivery-option ${order.deliveryOption}`}>
                {order.deliveryOption === 'express' ? 'Express Delivery' : 'Standard Delivery'}
              </p>
            </div>
          </div>
        </div>

        <div className="aom-status-controls">
          {permissions?.canEditOrder && (
            <div className="aom-status-control">
              <label>Order Status</label>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusUpdate(e.target.value, 'order')}
              >
                <option value="processing">Processing</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {permissions?.canEditPayment && (
            <div className="aom-status-control">
              <label>Payment Status</label>
              <select
                value={order.paymentStatus}
                onChange={(e) => handleStatusUpdate(e.target.value, 'payment')}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="aom-details-tabs">
        <nav className="aom-tab-nav">
          <button
            className={activeTab === 'details' ? 'aom-active' : ''}
            onClick={() => setActiveTab('details')}
          >
            Order Details
          </button>
          <button
            className={activeTab === 'products' ? 'aom-active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products ({order.products?.length || 0})
          </button>
          <button
            className={activeTab === 'tracking' ? 'aom-active' : ''}
            onClick={() => setActiveTab('tracking')}
          >
            Tracking
          </button>
          <button
            className={activeTab === 'customer' ? 'aom-active' : ''}
            onClick={() => setActiveTab('customer')}
          >
            Customer
          </button>
        </nav>

        <div className="aom-tab-content">
          {activeTab === 'details' && (
            <div className="aom-details-content">
              <div className="aom-details-section">
                <h3>Delivery Address</h3>
                <p>{order.deliveryAddress}</p>
              </div>

              <div className="aom-details-section">
                <h3>Payment Information</h3>
                <div className="aom-payment-info">
                  <p><strong>Method:</strong> {order.paymentMethod}</p>
                  <p><strong>Status:</strong> 
                    <span className={`aom-status-badge ${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                  <p><strong>Total Amount:</strong> {formatCurrency(order.totalAmount)}</p>
                  <p><strong>Delivery Fee:</strong> {formatCurrency(order.deliveryFee)}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="aom-products-content">
              <table className="aom-products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="aom-product-info">
                          <span className="aom-product-name">
                            {item.product?.name || 'Product Name'}
                          </span>
                        </div>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{formatCurrency(item.quantity * item.price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3">Subtotal</td>
                    <td>{formatCurrency(order.totalAmount - order.deliveryFee)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3">Delivery Fee</td>
                    <td>{formatCurrency(order.deliveryFee)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3"><strong>Total</strong></td>
                    <td><strong>{formatCurrency(order.totalAmount)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {activeTab === 'tracking' && (
            <div className="aom-tracking-content">
              <div className="aom-tracking-form">
                <h3>Update Tracking Information</h3>
                <div className="aom-form-group">
                  <label>Status</label>
                  <input
                    type="text"
                    value={trackingData.status || ''}
                    onChange={(e) => setTrackingData({
                      ...trackingData,
                      status: e.target.value
                    })}
                    placeholder="Current status"
                  />
                </div>
                <div className="aom-form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={trackingData.location || ''}
                    onChange={(e) => setTrackingData({
                      ...trackingData,
                      location: e.target.value
                    })}
                    placeholder="Current location"
                  />
                </div>
                <div className="aom-form-group">
                  <label>Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={trackingData.progress || 0}
                    onChange={(e) => setTrackingData({
                      ...trackingData,
                      progress: parseInt(e.target.value)
                    })}
                  />
                </div>
                <button onClick={handleTrackingUpdate} className="aom-btn-save">
                  Update Tracking
                </button>
              </div>

              {order.tracking && (
                <div className="aom-tracking-display">
                  <h3>Current Tracking</h3>
                  <div className="aom-tracking-progress">
                    <div className="aom-progress-bar">
                      <div 
                        className="aom-progress-fill"
                        style={{ width: `${order.tracking.progress || 0}%` }}
                      ></div>
                    </div>
                    <span>{order.tracking.progress || 0}% Complete</span>
                  </div>
                  <p><strong>Status:</strong> {order.tracking.status}</p>
                  <p><strong>Location:</strong> {order.tracking.location}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'customer' && (
            <div className="aom-customer-content">
              <div className="aom-customer-info">
                <h3>Customer Information</h3>
                <div className="aom-info-grid">
                  <div>
                    <label>Name</label>
                    <p>{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                  <div>
                    <label>Email</label>
                    <p>{order.user?.email}</p>
                  </div>
                  <div>
                    <label>Phone</label>
                    <p>{order.user?.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;