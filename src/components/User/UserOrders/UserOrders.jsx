// components/Orders.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaSpinner, FaTimes } from "react-icons/fa";
import './UserOrders.css';

const Orders = () => {
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    deliveryAddress: '',
    deliveryOption: 'standard',
    paymentMethod: 'wallet'
  });
  const [error, setError] = useState('');

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  // ✅ Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const result = await response.json();
        if (result.success) {
          setOrders(result.data || []);
        } else {
          setError('Failed to load orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createNewOrder = () => {
    window.location.href = '/select_product';
  };

  const viewOrderDetails = (order) => setActiveOrder(order);
  const closeOrderDetails = () => {
    setActiveOrder(null);
    setEditingOrder(null);
  };

  const startEditOrder = (order) => {
    setEditingOrder(order._id);
    setEditForm({
      deliveryAddress: order.deliveryAddress,
      deliveryOption: order.deliveryOption,
      paymentMethod: order.paymentMethod
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Save changes to API
  const saveOrderChanges = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${editingOrder}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editForm)
      });

      const result = await response.json();
      if (result.success) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === editingOrder ? { ...order, ...editForm } : order
          )
        );
        if (activeOrder && activeOrder._id === editingOrder) {
          setActiveOrder({ ...activeOrder, ...editForm });
        }
        setEditingOrder(null);
      } else {
        setError('Failed to update order');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order. Please try again.');
    }
  };

  // ✅ Cancel order
 const cancelOrder = async (_id) => {
  if (!window.confirm('Are you sure you want to cancel this order?')) return;

  try {
    const response = await fetch(`${API_BASE_URL}/orders/${_id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    const result = await response.json();
    if (result.success) {
      setOrders(prev =>
        prev.map(order =>
          order._id === _id ? { ...order, orderStatus: 'cancelled' } : order
        )
      );

      if (activeOrder && activeOrder._id === _id) {
        setActiveOrder({ ...activeOrder, orderStatus: 'cancelled' });
      }
    } else {
      setError(result.message || 'Failed to cancel order');
    }
  } catch (err) {
    console.error('Error cancelling order:', err);
    setError('Failed to cancel order. Please try again.');
  }
};


  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "₦0.00";
    return value.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN"
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'in-transit': return 'status-in-transit';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-processing';
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'paid': return 'payment-status-paid';
      case 'pending': return 'payment-status-pending';
      case 'failed': return 'payment-status-failed';
      case 'refunded': return 'payment-status-refunded';
      default: return 'payment-status-pending';
    }
  };

  const getDeliveryOptionText = (option) => {
    switch (option) {
      case 'standard': return 'Standard Delivery';
      case 'express': return 'Express Delivery';
      case 'same-day': return 'Same Day Delivery';
      default: return option || 'Standard Delivery';
    }
  };

  // Helper function to get product names
  const getProductNames = (products) => {
    if (!products || products.length === 0) return 'No products';
    return products.map(product => product.name).join(', ');
  };

  // Helper function to get total quantity
  const getTotalQuantity = (products) => {
    if (!products || products.length === 0) return 0;
    return products.reduce((total, product) => total + (product.quantity || 1), 0);
  };

  const activeOrders = orders.filter(order =>
    ['processing', 'shipped', 'in-transit'].includes(order.orderStatus)
  );

  const previousOrders = orders.filter(order =>
    ['delivered', 'cancelled'].includes(order.orderStatus)
  );

  if (isLoading) return <div className="userorder-page-loading"> <FaSpinner className="loading-icon" /> Loading orders...</div>;

  return (
    <div className="userorder-orders-page">
      <div className="userorder-dashboard-header">
        <h1>Order Management</h1>
        <div className="userorder-header-actions">
          <div className="userorder-search-bar">
            <FaSearch className="userorder-search-icon" />
            <input type="text" placeholder="Search orders..." />
          </div>
          <button className="userorder-btn-primary" onClick={createNewOrder}>
            <FaPlus className="userorder-fas" /> Create New Order
          </button>
        </div>
      </div>

      {error && (
        <div className="userorder-error-message">
          {error}
          <button onClick={() => setError('')} className="userorder-close-error">
            <FaTimes className="userorder-fas" />
          </button>
        </div>
      )}

      <div className="userorder-content-section">
        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <>
            <div className="userorder-section-header">
              <h2>Active Orders</h2>
              <span className="userorder-count-badge">{activeOrders.length}</span>
            </div>
            <div className="userorder-orders-grid">
              {/* Table Header */}
              <div className="userorder-grid-header">
                <div className="userorder-grid-cell">Product Name</div>
                <div className="userorder-grid-cell">Quantity</div>
                <div className="userorder-grid-cell">Delivery Option</div>
                <div className="userorder-grid-cell">Payment Status</div>
                <div className="userorder-grid-cell">Order Status</div>
                <div className="userorder-grid-cell">Total Amount</div>
                <div className="userorder-grid-cell">Actions</div>
              </div>

              {/* Table Rows */}
              {activeOrders.map((order) => (
                <div key={order._id} className="userorder-grid-row">
                  <div className="userorder-grid-cell">
                    <div className="userorder-product-names">
                      {getProductNames(order.products)}
                    </div>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className="userorder-quantity-badge">
                      {getTotalQuantity(order.products)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className="userorder-delivery-option">
                      {getDeliveryOptionText(order.deliveryOption)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className={`userorder-payment-status ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className={`userorder-order-status ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className="userorder-total-amount">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <div className="userorder-grid-actions">
                      <button 
                        className="userorder-btn-primary userorder-btn-sm"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </button>
                      <button 
                        className="userorder-btn-warning userorder-btn-sm"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Previous Orders Section */}
        {previousOrders.length > 0 && (
          <>
            <div className="userorder-section-header">
              <h2>Order History</h2>
              <span className="userorder-count-badge">{previousOrders.length}</span>
            </div>
            <div className="userorder-orders-grid">
              {/* Table Header */}
              <div className="userorder-grid-header">
                <div className="userorder-grid-cell">Product Name</div>
                <div className="userorder-grid-cell">Quantity</div>
                <div className="userorder-grid-cell">Delivery Option</div>
                <div className="userorder-grid-cell">Payment Status</div>
                <div className="userorder-grid-cell">Order Status</div>
                <div className="userorder-grid-cell">Total Amount</div>
                <div className="userorder-grid-cell">Actions</div>
              </div>

              {/* Table Rows */}
              {previousOrders.map((order) => (
                <div key={order._id} className="userorder-grid-row">
                  <div className="userorder-grid-cell">
                    <div className="userorder-product-names">
                      {getProductNames(order.products)}
                    </div>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className="userorder-quantity-badge">
                      {getTotalQuantity(order.products)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className="userorder-delivery-option">
                      {getDeliveryOptionText(order.deliveryOption)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className={`userorder-payment-status ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className={`userorder-order-status ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <span className="userorder-total-amount">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell">
                    <div className="userorder-grid-actions">
                      <button 
                        className="userorder-btn-primary userorder-btn-sm"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </button>
                      {order.orderStatus === 'delivered' && (
                        <button className="userorder-btn-secondary userorder-btn-sm">
                          Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {orders.length === 0 && (
          <div className="userorder-no-orders">
            <p>You haven't placed any orders yet.</p>
            <button className="userorder-btn-primary" onClick={createNewOrder}>
              Create Your First Order
            </button>
          </div>
        )}
      </div>

      {activeOrder && (
        <div className="userorder-order-detail-modal">
          <div className="userorder-modal-content">
            <div className="userorder-modal-header">
              <h2>Order Details - #{activeOrder.orderId}</h2>
              <button className="userorder-close-btn" onClick={closeOrderDetails}>
                <FaTimes className="userorder-fas" />
              </button>
            </div>
            <div className="userorder-modal-body">
              <div className="userorder-detail-section">
                <h3>Order Summary</h3>
                <div className="userorder-summary-grid">
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Product Name:</span>
                    <span className="userorder-summary-value">
                      {getProductNames(activeOrder.products)}
                    </span>
                  </div>
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Total Quantity:</span>
                    <span className="userorder-summary-value">
                      {getTotalQuantity(activeOrder.products)}
                    </span>
                  </div>
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Delivery Option:</span>
                    <span className="userorder-summary-value">
                      {getDeliveryOptionText(activeOrder.deliveryOption)}
                    </span>
                  </div>
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Payment Status:</span>
                    <span className={`userorder-summary-value ${getPaymentStatusClass(activeOrder.paymentStatus)}`}>
                      {activeOrder.paymentStatus}
                    </span>
                  </div>
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Order Status:</span>
                    <span className={`userorder-summary-value ${getStatusClass(activeOrder.orderStatus)}`}>
                      {activeOrder.orderStatus}
                    </span>
                  </div>
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Total Amount:</span>
                    <span className="userorder-summary-value userorder-total-amount">
                      {formatCurrency(activeOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="userorder-detail-section">
                <h3>Products</h3>
                {activeOrder.products.map((product, idx) => (
                  <div key={idx} className="userorder-product-detail">
                    <div className="userorder-product-name">{product.name}</div>
                    <div className="userorder-product-quantity">Quantity: {product.quantity}</div>
                    <div className="userorder-product-price">Price: {formatCurrency(product.price)}</div>
                  </div>
                ))}
                <div className="userorder-order-summary">
                  <div>Subtotal: {formatCurrency(activeOrder.totalAmount - (activeOrder.deliveryFee || 0))}</div>
                  <div>Delivery Fee: {formatCurrency(activeOrder.deliveryFee || 0)}</div>
                  <div className="userorder-total-amount">Total: {formatCurrency(activeOrder.totalAmount)}</div>
                </div>
              </div>
              
              <div className="userorder-detail-section">
                <h3>Delivery Information</h3>
                {editingOrder === activeOrder._id ? (
                  <>
                    <div className="userorder-form-group">
                      <label>Delivery Address:</label>
                      <textarea 
                        name="deliveryAddress"
                        value={editForm.deliveryAddress}
                        onChange={handleEditChange}
                        rows="3"
                      />
                    </div>
                    <div className="userorder-form-group">
                      <label>Delivery Option:</label>
                      <select 
                        name="deliveryOption"
                        value={editForm.deliveryOption}
                        onChange={handleEditChange}
                      >
                        <option value="standard">Standard Delivery</option>
                        <option value="express">Express Delivery</option>
                        <option value="same-day">Same Day Delivery</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Delivery Address:</strong> {activeOrder.deliveryAddress}</p>
                    <p><strong>Delivery Option:</strong> {getDeliveryOptionText(activeOrder.deliveryOption)}</p>
                  </>
                )}
                <p><strong>Estimated Delivery:</strong> {formatDate(activeOrder.deliveryDate)}</p>
                <p><strong>Status:</strong> <span className={getStatusClass(activeOrder.orderStatus)}>{activeOrder.orderStatus}</span></p>
              </div>
              
              <div className="userorder-detail-section">
                <h3>Payment Information</h3>
                {editingOrder === activeOrder._id ? (
                  <div className="userorder-form-group">
                    <label>Payment Method:</label>
                    <select 
                      name="paymentMethod"
                      value={editForm.paymentMethod}
                      onChange={handleEditChange}
                    >
                      <option value="wallet">Wallet</option>
                      <option value="card">Card</option>
                      <option value="transfer">Transfer</option>
                    </select>
                  </div>
                ) : (
                  <p><strong>Payment Method:</strong> {activeOrder.paymentMethod}</p>
                )}
                <p><strong>Payment Status:</strong> <span className={getPaymentStatusClass(activeOrder.paymentStatus)}>{activeOrder.paymentStatus}</span></p>
                <p><strong>Total Amount:</strong> {formatCurrency(activeOrder.totalAmount)}</p>
              </div>
            </div>
            <div className="userorder-modal-footer">
              {editingOrder === activeOrder._id ? (
                <>
                  <button className="userorder-btn-secondary" onClick={() => setEditingOrder(null)}>
                    Cancel Edit
                  </button>
                  <button className="userorder-btn-primary" onClick={saveOrderChanges}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button className="userorder-btn-secondary" onClick={closeOrderDetails}>
                    Close
                  </button>
                  {activeOrder.orderStatus !== 'cancelled' && activeOrder.orderStatus !== 'delivered' && (
                    <button 
                      className="userorder-btn-warning" 
                      onClick={() => startEditOrder(activeOrder)}
                    >
                      Edit Order
                    </button>
                  )}
                  <button className="userorder-btn-primary">
                    Contact Support
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;