// components/Orders.js
import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaSpinner, FaTimes, FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";
import './UserOrders.css';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

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
      infoToast('Loading your orders...');
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          warningToast('Please log in to view your orders');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        console.log('API Response:', result); // Debug log
        
        if (result.success) {
          setOrders(result.data || []);
          if (result.data && result.data.length === 0) {
            infoToast('No orders found. Create your first order!');
          } else {
            successToast(`Loaded ${result.data.length} orders successfully`);
          }
        } else {
          const errorMsg = result.message || 'Failed to load orders';
          setError(errorMsg);
          errorToast(errorMsg);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        const errorMsg = 'Failed to load orders. Please try again later.';
        setError(errorMsg);
        errorToast(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createNewOrder = () => {
    infoToast('Redirecting to product selection...');
    window.location.href = '/select_product';
  };

  const viewOrderDetails = (order) => {
    setActiveOrder(order);
    infoToast(`Viewing details for order #${order.orderId}`);
  };

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
    infoToast('Editing order details...');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // ✅ Save changes to API
  const saveOrderChanges = async () => {
    infoToast('Saving order changes...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${editingOrder}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
        successToast('Order updated successfully!');
      } else {
        const errorMsg = result.message || 'Failed to update order';
        setError(errorMsg);
        errorToast(errorMsg);
      }
    } catch (err) {
      console.error('Error updating order:', err);
      const errorMsg = 'Failed to update order. Please try again.';
      setError(errorMsg);
      errorToast(errorMsg);
    }
  };

  // ✅ Cancel order
  const cancelOrder = async (_id) => {
    const orderToCancel = orders.find(order => order._id === _id);
    if (!orderToCancel) return;

    if (!window.confirm(`Are you sure you want to cancel order #${orderToCancel.orderId}?`)) {
      infoToast('Order cancellation cancelled');
      return;
    }

    warningToast(`Cancelling order #${orderToCancel.orderId}...`);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
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
        
        successToast(`Order #${orderToCancel.orderId} cancelled successfully`);
      } else {
        const errorMsg = result.message || 'Failed to cancel order';
        setError(errorMsg);
        errorToast(errorMsg);
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      const errorMsg = 'Failed to cancel order. Please try again.';
      setError(errorMsg);
      errorToast(errorMsg);
    }
  };

  // Handle reorder functionality
  const handleReorder = async (order) => {
    infoToast(`Creating reorder for #${order.orderId}...`);
    
    try {
      // Add your reorder logic here
      // This could involve creating a new order with the same products
      successToast(`Reorder created for #${order.orderId}!`);
    } catch (err) {
      errorToast('Failed to create reorder. Please try again.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not scheduled';
    return new Date(date).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value) => {
    if (typeof value !== "number") return "₦0.00";
    return value.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN"
    });
  };

  // ✅ Enhanced helper function to get product names
  const getProductNames = (products) => {
    if (!products || products.length === 0) return 'No products';
    
    const productNames = products.map(item => {
      // Handle cases where product might be null or undefined
      if (!item.product) {
        return `Generic Product (${formatCurrency(item.price)})`;
      }
      return item.product.name || 'Unnamed Product';
    });
    
    return productNames.join(', ');
  };

  // ✅ Enhanced helper function to get total quantity
  const getTotalQuantity = (products) => {
    if (!products || products.length === 0) return 0;
    return products.reduce((total, item) => total + (item.quantity || 1), 0);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <FaBox />;
      case 'shipped': return <FaShippingFast />;
      case 'in-transit': return <FaTruck />;
      case 'delivered': return <FaCheckCircle />;
      case 'cancelled': return <FaTimesCircle />;
      default: return <FaBox />;
    }
  };

  const getPaymentStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'payment-status-paid';
      case 'pending': return 'payment-status-pending';
      case 'failed': return 'payment-status-failed';
      case 'refunded': return 'payment-status-refunded';
      default: return 'payment-status-pending';
    }
  };

  const activeOrders = orders.filter(order =>
    ['processing', 'shipped', 'in-transit'].includes(order.orderStatus)
  );

  const previousOrders = orders.filter(order =>
    ['delivered', 'cancelled'].includes(order.orderStatus)
  );

  if (isLoading) return (
    <div className="userorder-page-loading">
      <FaSpinner className="loading-icon" /> 
      Loading orders...
    </div>
  );

  return (
    <div className="userorder-orders-page">
      <div className="userorder-dashboard-header">
        <h1>Order Management</h1>
        <div className="userorder-header-actions">
          <div className="userorder-search-bar">
            <FaSearch className="userorder-search-icon" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  infoToast('Search functionality coming soon...');
                }
              }}
            />
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
              {/* Table Header - Visible on all devices */}
              <div className="userorder-grid-header">
                <div className="userorder-grid-cell">Product Name</div>
                <div className="userorder-grid-cell">Quantity</div>
                <div className="userorder-grid-cell">Payment Status</div>
                <div className="userorder-grid-cell">Order Status</div>
                <div className="userorder-grid-cell">Total Amount</div>
                <div className="userorder-grid-cell">Actions</div>
              </div>

              {/* Table Rows */}
              {activeOrders.map((order) => (
                <div key={order._id} className="userorder-grid-row">
                  <div className="userorder-grid-cell" data-label="Product Name">
                    <div className="userorder-product-names">
                      {getProductNames(order.products)}
                    </div>
                  </div>
                  <div className="userorder-grid-cell" data-label="Quantity">
                    <span className="userorder-quantity-badge">
                      {getTotalQuantity(order.products)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Payment Status">
                    <span className={`userorder-payment-status ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Order Status">
                    <span className={`userorder-order-status ${getStatusClass(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Total Amount">
                    <span className="userorder-total-amount">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Actions">
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
              {/* Table Header - Visible on all devices */}
              <div className="userorder-grid-header">
                <div className="userorder-grid-cell">Product Name</div>
                <div className="userorder-grid-cell">Quantity</div>
                <div className="userorder-grid-cell">Payment Status</div>
                <div className="userorder-grid-cell">Order Status</div>
                <div className="userorder-grid-cell">Total Amount</div>
                <div className="userorder-grid-cell">Actions</div>
              </div>

              {/* Table Rows */}
              {previousOrders.map((order) => (
                <div key={order._id} className="userorder-grid-row">
                  <div className="userorder-grid-cell" data-label="Product Name">
                    <div className="userorder-product-names">
                      {getProductNames(order.products)}
                    </div>
                  </div>
                  <div className="userorder-grid-cell" data-label="Quantity">
                    <span className="userorder-quantity-badge">
                      {getTotalQuantity(order.products)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Payment Status">
                    <span className={`userorder-payment-status ${getPaymentStatusClass(order.paymentStatus)}`}>
                      {order.paymentStatus || 'pending'}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Order Status">
                    <span className={`userorder-order-status ${getStatusClass(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Total Amount">
                    <span className="userorder-total-amount">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                  <div className="userorder-grid-cell" data-label="Actions">
                    <div className="userorder-grid-actions">
                      <button 
                        className="userorder-btn-primary userorder-btn-sm"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </button>
                      {order.orderStatus === 'delivered' && (
                        <button 
                          className="userorder-btn-secondary userorder-btn-sm"
                          onClick={() => handleReorder(order)}
                        >
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
            <div className="userorder-no-orders-icon">
              <FaBox />
            </div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping to see your orders here.</p>
            <button className="userorder-btn-primary" onClick={createNewOrder}>
              Create Your First Order
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
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
              {/* Order Summary */}
              <div className="userorder-detail-section">
                <h3>Order Summary</h3>
                <div className="userorder-summary-grid">
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Order Date:</span>
                    <span className="userorder-summary-value">
                      {formatDate(activeOrder.createdAt)}
                    </span>
                  </div>
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Order ID:</span>
                    <span className="userorder-summary-value">
                      {activeOrder.orderId}
                    </span>
                  </div>
                  <div className="userorder-summary-item">
                    <span className="userorder-summary-label">Total Items:</span>
                    <span className="userorder-summary-value">
                      {getTotalQuantity(activeOrder.products)}
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
                      {getStatusIcon(activeOrder.orderStatus)}
                      {activeOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products List */}
              <div className="userorder-detail-section">
                <h3>Order Items</h3>
                <div className="userorder-products-list">
                  {activeOrder.products.map((item, idx) => (
                    <div key={idx} className="userorder-product-item">
                      <div className="userorder-product-details">
                        <h4 className="userorder-product-name">
                          {item.product ? item.product.name : `Generic Product`}
                        </h4>
                        {item.product && item.product.description && (
                          <p className="userorder-product-description">
                            {item.product.description}
                          </p>
                        )}
                        <div className="userorder-product-meta">
                          <span className="userorder-product-quantity">
                            Quantity: {item.quantity}
                          </span>
                          <span className="userorder-product-price">
                            Price: {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="userorder-product-total">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="userorder-order-summary">
                  <div className="userorder-summary-row">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(activeOrder.totalAmount - (activeOrder.deliveryFee || 0))}</span>
                  </div>
                  <div className="userorder-summary-row">
                    <span>Delivery Fee:</span>
                    <span>{formatCurrency(activeOrder.deliveryFee || 0)}</span>
                  </div>
                  <div className="userorder-summary-row userorder-total-row">
                    <span>Total:</span>
                    <span>{formatCurrency(activeOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
              
              {/* Delivery Information */}
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
                        placeholder="Enter delivery address"
                      />
                    </div>
                  </>
                ) : (
                  <div className="userorder-info-group">
                    <strong>Delivery Address:</strong>
                    <p>{activeOrder.deliveryAddress}</p>
                  </div>
                )}
                <div className="userorder-info-group">
                  <strong>Estimated Delivery:</strong>
                  <p>{formatDate(activeOrder.deliveryDate)}</p>
                </div>
                {activeOrder.tracking && (
                  <div className="userorder-tracking-info">
                    <strong>Tracking Information:</strong>
                    <div className="userorder-tracking-progress">
                      <div 
                        className="userorder-tracking-bar"
                        style={{width: `${activeOrder.tracking.progress}%`}}
                      ></div>
                    </div>
                    <p>Status: {activeOrder.tracking.status}</p>
                    <p>Location: {activeOrder.tracking.location}</p>
                  </div>
                )}
              </div>
              
              {/* Payment Information */}
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
                      <option value="paystack">Paystack</option>
                    </select>
                  </div>
                ) : (
                  <div className="userorder-info-group">
                    <strong>Payment Method:</strong>
                    <p>{activeOrder.paymentMethod || 'Not specified'}</p>
                  </div>
                )}
                <div className="userorder-info-group">
                  <strong>Payment Status:</strong>
                  <p className={getPaymentStatusClass(activeOrder.paymentStatus)}>
                    {activeOrder.paymentStatus}
                  </p>
                </div>
                {activeOrder.reference && (
                  <div className="userorder-info-group">
                    <strong>Reference:</strong>
                    <p>{activeOrder.reference}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="userorder-modal-footer">
              {editingOrder === activeOrder._id ? (
                <>
                  <button 
                    className="userorder-btn-secondary" 
                    onClick={() => {
                      setEditingOrder(null);
                      infoToast('Edit cancelled');
                    }}
                  >
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
                  <button 
                    className="userorder-btn-primary"
                    onClick={() => infoToast('Contact support feature coming soon...')}
                  >
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