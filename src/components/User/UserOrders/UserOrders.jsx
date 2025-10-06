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
  const cancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      if (result.success) {
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, orderStatus: 'cancelled' } : order
          )
        );
        if (activeOrder && activeOrder._id === orderId) {
          setActiveOrder({ ...activeOrder, orderStatus: 'cancelled' });
        }
      } else {
        setError('Failed to cancel order');
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

  // const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;
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

  const activeOrders = orders.filter(order =>
    ['processing', 'shipped', 'in-transit'].includes(order.orderStatus)
  );

  const previousOrders = orders.filter(order =>
    ['delivered', 'cancelled'].includes(order.orderStatus)
  );

  if (isLoading) return <div className="userorder-page-oading"> <FaSpinner className="loading-icon" /> Loading orders...</div>;
  

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
            <div className="userorder-orders-list">
              {activeOrders.map((order) => (
                <div key={order._id} className="userorder-order-card">
                  <div className="userorder-order-header">
                    <div className="userorder-order-id">Order #{order.orderId}</div>
                    <div className={`userorder-order-status ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </div>
                  </div>
                  <div className="userorder-order-details">
                    <div className="userorder-order-date">Placed on: {formatDate(order.createdAt)}</div>
                    <div className="userorder-order-products">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="userorder-product-item">
                          {product.quantity} x {product.name}
                        </div>
                      ))}
                    </div>
                    <div className="userorder-order-total">Total: {formatCurrency(order.totalAmount)}</div>
                  </div>
                  <div className="userorder-order-actions">
                    <button className="userorder-btn-primary" onClick={() => viewOrderDetails(order)}>
                      View Details
                    </button>
                    <button className="userorder-btn-secondary">
                      Track Order
                    </button>
                    <button 
                      className="userorder-btn-warning" 
                      onClick={() => cancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
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
            <div className="userorder-orders-list">
              {previousOrders.map((order) => (
                <div key={order._id} className="userorder-order-card">
                  <div className="userorder-order-header">
                    <div className="userorder-order-id">Order #{order.orderId}</div>
                    <div className={`userorder-order-status ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </div>
                  </div>
                  <div className="userorder-order-details">
                    <div className="userorder-order-date">Placed on: {formatDate(order.createdAt)}</div>
                    <div className="userorder-order-products">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="userorder-product-item">
                          {product.quantity} x {product.name}
                        </div>
                      ))}
                    </div>
                    <div className="userorder-order-total">Total: {formatCurrency(order.totalAmount)}</div>
                  </div>
                  <div className="userorder-order-actions">
                    <button className="userorder-btn-primary" onClick={() => viewOrderDetails(order)}>
                      View Details
                    </button>
                    {order.orderStatus === 'delivered' && (
                      <button className="userorder-btn-secondary">
                        Reorder
                      </button>
                    )}
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
                <h3>Products</h3>
                {activeOrder.products.map((product, idx) => (
                  <div key={idx} className="userorder-product-detail">
                    <div className="userorder-product-name">{product.name}</div>
                    <div className="userorder-product-quantity">Quantity: {product.quantity}</div>
                    <div className="userorder-product-price">Price: {formatCurrency(product.price)}</div>
                  </div>
                ))}
                <div className="userorder-order-summary">
                  <div>Subtotal: {formatCurrency(activeOrder.totalAmount - activeOrder.deliveryFee)}</div>
                  <div>Delivery Fee: {formatCurrency(activeOrder.deliveryFee)}</div>
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
                        <option value="standard">Standard</option>
                        <option value="express">Express</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Delivery Address:</strong> {activeOrder.deliveryAddress}</p>
                    <p><strong>Delivery Option:</strong> {activeOrder.deliveryOption}</p>
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
                <p><strong>Payment Status:</strong> {activeOrder.paymentStatus}</p>
                <p><strong>Total Amount:</strong> {formatCurrency(activeOrder.totalAmount)}</p>
              </div>
              
              <div className="userorder-detail-section">
                <h3>Tracking Information</h3>
                <div className="userorder-tracking-progress">
                  <div className="userorder-progress-bar">
                    <div 
                      className="userorder-progress-fill" 
                      style={{width: `${activeOrder.tracking.progress}%`}}
                    ></div>
                  </div>
                  <div className="userorder-tracking-status">
                    {activeOrder.tracking.status} - {activeOrder.tracking.location}
                  </div>
                </div>
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