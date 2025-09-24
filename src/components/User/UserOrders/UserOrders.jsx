// components/Orders.js
import React, { useState, useEffect } from 'react';
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

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = 'http://localhost:5000/api/v1';

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would use your actual API endpoint
        // const response = await fetch(`${API_BASE_URL}/orders`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // For demonstration, we'll use a timeout to simulate API call
        setTimeout(() => {
          // Mock data that matches the schema (simulating API response)
          const mockOrders = [
            {
              _id: '1',
              user: 'user123',
              orderId: 'EG-1001',
              products: [
                { 
                  product: 'prod1', 
                  name: '12kg Gas Cylinder', 
                  quantity: 1, 
                  price: 10500 
                }
              ],
              deliveryAddress: '123 Main St, Apt 4B, City, State',
              deliveryOption: 'standard',
              deliveryFee: 500,
              totalAmount: 11000,
              paymentMethod: 'wallet',
              paymentStatus: 'completed',
              orderStatus: 'processing',
              tracking: {
                status: 'In Transit',
                location: 'Near your location',
                progress: 75
              },
              deliveryDate: new Date('2023-05-18'),
              createdAt: new Date('2023-05-15')
            },
            {
              _id: '2',
              user: 'user123',
              orderId: 'EG-1002',
              products: [
                { 
                  product: 'prod2', 
                  name: '6kg Gas Cylinder', 
                  quantity: 2, 
                  price: 6000 
                }
              ],
              deliveryAddress: '123 Main St, Apt 4B, City, State',
              deliveryOption: 'express',
              deliveryFee: 1000,
              totalAmount: 13000,
              paymentMethod: 'card',
              paymentStatus: 'completed',
              orderStatus: 'delivered',
              tracking: {
                status: 'Delivered',
                location: 'Delivered to address',
                progress: 100
              },
              deliveryDate: new Date('2023-05-12'),
              createdAt: new Date('2023-05-10')
            }
          ];
          setOrders(mockOrders);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const createNewOrder = () => {
    // Navigate to order creation page or open a modal
    // In a real app, this would redirect to a new order page
    window.location.href = '/select_product'; // or use React Router navigation
  };

  const viewOrderDetails = (order) => {
    setActiveOrder(order);
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
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveOrderChanges = async () => {
    try {
      // In a real app, this would be an API call to update the order
      // await fetch(`${API_BASE_URL}/orders/${editingOrder}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(editForm)
      // });
      
      // Update local state for demo purposes
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === editingOrder 
            ? { 
                ...order, 
                deliveryAddress: editForm.deliveryAddress,
                deliveryOption: editForm.deliveryOption,
                paymentMethod: editForm.paymentMethod
              } 
            : order
        )
      );
      
      if (activeOrder && activeOrder._id === editingOrder) {
        setActiveOrder({
          ...activeOrder,
          deliveryAddress: editForm.deliveryAddress,
          deliveryOption: editForm.deliveryOption,
          paymentMethod: editForm.paymentMethod
        });
      }
      
      setEditingOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order. Please try again.');
    }
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        // In a real app, this would be an API call to cancel the order
        // await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
        //   method: 'PUT',
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        
        // Update local state for demo purposes
        setOrders(prevOrders => 
          prevOrders.map(order => 
            order._id === orderId 
              ? { ...order, orderStatus: 'cancelled' } 
              : order
          )
        );
        
        if (activeOrder && activeOrder._id === orderId) {
          setActiveOrder({ ...activeOrder, orderStatus: 'cancelled' });
        }
      } catch (error) {
        console.error('Error cancelling order:', error);
        setError('Failed to cancel order. Please try again.');
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `¥${amount.toLocaleString()}`;
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

  // Filter orders
  const activeOrders = orders.filter(order => 
    ['processing', 'shipped', 'in-transit'].includes(order.orderStatus)
  );
  
  const previousOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.orderStatus)
  );

  if (isLoading) {
    return <div className="orders-page loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <div className="dashboard-header">
        <h1>Order Management</h1>
        <div className="header-actions">
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search orders..." />
          </div>
          <button className="btn-primary" onClick={createNewOrder}>
            <i className="fas fa-plus"></i> Create New Order
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      <div className="content-section">
        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <>
            <div className="section-header">
              <h2>Active Orders</h2>
              <span className="count-badge">{activeOrders.length}</span>
            </div>
            <div className="orders-list">
              {activeOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">Order #{order.orderId}</div>
                    <div className={`order-status ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </div>
                  </div>
                  <div className="order-details">
                    <div className="order-date">Placed on: {formatDate(order.createdAt)}</div>
                    <div className="order-products">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="product-item">
                          {product.quantity} x {product.name}
                        </div>
                      ))}
                    </div>
                    <div className="order-total">Total: {formatCurrency(order.totalAmount)}</div>
                  </div>
                  <div className="order-actions">
                    <button className="btn-primary" onClick={() => viewOrderDetails(order)}>
                      View Details
                    </button>
                    <button className="btn-secondary">
                      Track Order
                    </button>
                    <button 
                      className="btn-warning" 
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
            <div className="section-header">
              <h2>Order History</h2>
              <span className="count-badge">{previousOrders.length}</span>
            </div>
            <div className="orders-list">
              {previousOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">Order #{order.orderId}</div>
                    <div className={`order-status ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </div>
                  </div>
                  <div className="order-details">
                    <div className="order-date">Placed on: {formatDate(order.createdAt)}</div>
                    <div className="order-products">
                      {order.products.map((product, idx) => (
                        <div key={idx} className="product-item">
                          {product.quantity} x {product.name}
                        </div>
                      ))}
                    </div>
                    <div className="order-total">Total: {formatCurrency(order.totalAmount)}</div>
                  </div>
                  <div className="order-actions">
                    <button className="btn-primary" onClick={() => viewOrderDetails(order)}>
                      View Details
                    </button>
                    {order.orderStatus === 'delivered' && (
                      <button className="btn-secondary">
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
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
            <button className="btn-primary" onClick={createNewOrder}>
              Create Your First Order
            </button>
          </div>
        )}
      </div>

      {activeOrder && (
        <div className="order-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details - #{activeOrder.orderId}</h2>
              <button className="close-btn" onClick={closeOrderDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Products</h3>
                {activeOrder.products.map((product, idx) => (
                  <div key={idx} className="product-detail">
                    <div className="product-name">{product.name}</div>
                    <div className="product-quantity">Quantity: {product.quantity}</div>
                    <div className="product-price">Price: {formatCurrency(product.price)}</div>
                  </div>
                ))}
                <div className="order-summary">
                  <div>Subtotal: {formatCurrency(activeOrder.totalAmount - activeOrder.deliveryFee)}</div>
                  <div>Delivery Fee: {formatCurrency(activeOrder.deliveryFee)}</div>
                  <div className="total-amount">Total: {formatCurrency(activeOrder.totalAmount)}</div>
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Delivery Information</h3>
                {editingOrder === activeOrder._id ? (
                  <>
                    <div className="form-group">
                      <label>Delivery Address:</label>
                      <textarea 
                        name="deliveryAddress"
                        value={editForm.deliveryAddress}
                        onChange={handleEditChange}
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
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
              
              <div className="detail-section">
                <h3>Payment Information</h3>
                {editingOrder === activeOrder._id ? (
                  <div className="form-group">
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
              
              <div className="detail-section">
                <h3>Tracking Information</h3>
                <div className="tracking-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{width: `${activeOrder.tracking.progress}%`}}
                    ></div>
                  </div>
                  <div className="tracking-status">
                    {activeOrder.tracking.status} - {activeOrder.tracking.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {editingOrder === activeOrder._id ? (
                <>
                  <button className="btn-secondary" onClick={() => setEditingOrder(null)}>
                    Cancel Edit
                  </button>
                  <button className="btn-primary" onClick={saveOrderChanges}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-secondary" onClick={closeOrderDetails}>
                    Close
                  </button>
                  {activeOrder.orderStatus !== 'cancelled' && activeOrder.orderStatus !== 'delivered' && (
                    <button 
                      className="btn-warning" 
                      onClick={() => startEditOrder(activeOrder)}
                    >
                      Edit Order
                    </button>
                  )}
                  <button className="btn-primary">
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