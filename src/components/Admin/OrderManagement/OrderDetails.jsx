// components/OrderDetails.js
import React, { useState } from 'react';

const OrderDetails = ({ order, onBack, onUpdateOrderStatus, onUpdatePaymentStatus }) => {
  const [updatingOrder, setUpdatingOrder] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const handleOrderStatusChange = async (newStatus) => {
    setUpdatingOrder(true);
    const result = await onUpdateOrderStatus(order._id, newStatus);
    setUpdatingOrder(false);
    
    if (!result.success) {
      alert(result.message);
    }
  };

  const handlePaymentStatusChange = async (newStatus) => {
    setUpdatingPayment(true);
    const result = await onUpdatePaymentStatus(order._id, newStatus);
    setUpdatingPayment(false);
    
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button onClick={onBack} className="btn-back">
          <i className="fas fa-arrow-left"></i> Back to Orders
        </button>
        <h2>Order Details: #{order.orderId}</h2>
      </div>

      <div className="order-details-content">
        <div className="order-info-grid">
          {/* Customer Information */}
          <div className="info-card">
            <h3>Customer Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{order.user?.firstName} {order.user?.lastName}</span>
              </div>
              <div className="info-item">
                <span className="label">Email:</span>
                <span className="value">{order.user?.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{order.user?.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="info-card">
            <h3>Order Status</h3>
            <div className="status-controls">
              <div className={`status-badge large ${getStatusBadgeClass(order.orderStatus)}`}>
                {order.orderStatus}
              </div>
              
              <select
                value={order.orderStatus}
                onChange={(e) => handleOrderStatusChange(e.target.value)}
                disabled={updatingOrder}
                className="status-select"
              >
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in-transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              {updatingOrder && <i className="fas fa-spinner fa-spin"></i>}
            </div>
          </div>

          {/* Payment Information */}
          <div className="info-card">
            <h3>Payment Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Method:</span>
                <span className="value">{order.paymentMethod}</span>
              </div>
              <div className="info-item">
                <span className="label">Status:</span>
                <span className={`payment-badge ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Total Amount:</span>
                <span className="value">₦{order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="payment-controls">
              <select
                value={order.paymentStatus}
                onChange={(e) => handlePaymentStatusChange(e.target.value)}
                disabled={updatingPayment}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
              
              {updatingPayment && <i className="fas fa-spinner fa-spin"></i>}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="info-card">
            <h3>Delivery Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Address:</span>
                <span className="value">{order.deliveryAddress}</span>
              </div>
              <div className="info-item">
                <span className="label">Option:</span>
                <span className="value">{order.deliveryOption}</span>
              </div>
              <div className="info-item">
                <span className="label">Fee:</span>
                <span className="value">₦{order.deliveryFee?.toLocaleString()}</span>
              </div>
              {order.deliveryDate && (
                <div className="info-item">
                  <span className="label">Estimated Delivery:</span>
                  <span className="value">{formatDate(order.deliveryDate)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="info-card full-width">
            <h3>Order Items</h3>
            <div className="order-items-table">
              <div className="table-header">
                <div className="col-product">Product</div>
                <div className="col-quantity">Quantity</div>
                <div className="col-price">Price</div>
                <div className="col-total">Total</div>
              </div>
              
              {order.products?.map((item, index) => (
                <div key={index} className="table-row">
                  <div className="col-product">
                    {item.product?.name || `Product ${index + 1}`}
                  </div>
                  <div className="col-quantity">{item.quantity}</div>
                  <div className="col-price">₦{item.price?.toLocaleString()}</div>
                  <div className="col-total">
                    ₦{(item.quantity * item.price)?.toLocaleString()}
                  </div>
                </div>
              ))}
              
              <div className="table-footer">
                <div className="col-product"></div>
                <div className="col-quantity"></div>
                <div className="col-price">Subtotal:</div>
                <div className="col-total">
                  ₦{(order.totalAmount - order.deliveryFee)?.toLocaleString()}
                </div>
              </div>
              
              <div className="table-footer">
                <div className="col-product"></div>
                <div className="col-quantity"></div>
                <div className="col-price">Delivery Fee:</div>
                <div className="col-total">₦{order.deliveryFee?.toLocaleString()}</div>
              </div>
              
              <div className="table-footer total">
                <div className="col-product"></div>
                <div className="col-quantity"></div>
                <div className="col-price">Total:</div>
                <div className="col-total">₦{order.totalAmount?.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Tracking Information */}
          {order.tracking && (
            <div className="info-card">
              <h3>Tracking Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span className="value">{order.tracking.status}</span>
                </div>
                <div className="info-item">
                  <span className="label">Location:</span>
                  <span className="value">{order.tracking.location}</span>
                </div>
                <div className="info-item">
                  <span className="label">Progress:</span>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${order.tracking.progress}%` }}
                    ></div>
                  </div>
                  <span className="value">{order.tracking.progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="info-card">
            <h3>Order Timeline</h3>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Order Created</h4>
                  <p>{formatDate(order.createdAt)}</p>
                </div>
              </div>
              
              {order.orderStatus !== 'processing' && (
                <div className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>Order Processed</h4>
                    <p>{formatDate(order.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;