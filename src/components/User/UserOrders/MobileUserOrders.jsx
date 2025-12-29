// components/mobile/MobileOrders.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobileUserOrders.css';
import { FaPlus, FaSearch, FaTimes, FaBox, FaShippingFast, FaCheckCircle, FaTimesCircle, FaTruck, FaGasPump, FaCalendar, FaMapMarkerAlt } from 'react-icons/fa';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const MobileOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchQuery, activeFilter]);

  const fetchOrders = async () => {
    setIsLoading(true);
    infoToast('Loading your orders...');
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data || []);
        successToast(`Loaded ${result.data?.length || 0} orders`);
      } else {
        throw new Error(result.message || 'Failed to load orders');
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

  const filterOrders = () => {
    let filtered = orders;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.products?.some(p => 
          p.productName?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(order => order.orderStatus === activeFilter);
    }

    setFilteredOrders(filtered);
  };

  const createNewOrder = () => {
    infoToast('Redirecting to order page...');
    navigate('/order');
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    infoToast(`Viewing order #${order.orderId}`);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const cancelOrder = async (orderId) => {
    const orderToCancel = orders.find(o => o._id === orderId);
    if (!orderToCancel) return;

    if (!window.confirm(`Cancel order #${orderToCancel.orderId}?`)) {
      infoToast('Cancellation cancelled');
      return;
    }

    warningToast(`Cancelling order #${orderToCancel.orderId}...`);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const result = await response.json();
      if (result.success) {
        setOrders(prev => prev.map(order =>
          order._id === orderId ? { ...order, orderStatus: 'cancelled' } : order
        ));
        successToast(`Order #${orderToCancel.orderId} cancelled`);
      } else {
        throw new Error(result.message || 'Failed to cancel order');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      errorToast('Failed to cancel order. Please try again.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₦${(amount || 0).toLocaleString()}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing': return <FaBox className="status-icon processing" />;
      case 'shipped': return <FaShippingFast className="status-icon shipped" />;
      case 'in-transit': return <FaTruck className="status-icon transit" />;
      case 'delivered': return <FaCheckCircle className="status-icon delivered" />;
      case 'cancelled': return <FaTimesCircle className="status-icon cancelled" />;
      default: return <FaBox className="status-icon processing" />;
    }
  };

  const getStatusText = (status) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Processing';
  };

  const getProductNames = (products) => {
    if (!products || !products.length) return 'No products';
    const names = products.map(p => p.productName || 'Product').slice(0, 2);
    return names.join(', ') + (products.length > 2 ? '...' : '');
  };

  const filters = [
    { id: 'all', label: 'All Orders' },
    { id: 'processing', label: 'Processing' },
    { id: 'in-transit', label: 'In Transit' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' }
  ];

  if (isLoading) {
    return (
      <div className="mobile-orders loading">
        <div className="loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="mobile-orders">
      {/* Header */}
      <div className="orders-header">
        <h1>Order History</h1>
        <button className="new-order-btn" onClick={createNewOrder}>
          <FaPlus /> New Order
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-id">#{order.orderId}</div>
                <div className={`order-status-badge ${order.orderStatus}`}>
                  {getStatusIcon(order.orderStatus)}
                  <span>{getStatusText(order.orderStatus)}</span>
                </div>
              </div>

              <div className="order-body">
                <div className="order-products">
                  <FaGasPump className="product-icon" />
                  <div className="product-info">
                    <h4>{getProductNames(order.products)}</h4>
                    <p>{order.products?.length || 0} items</p>
                  </div>
                </div>

                <div className="order-meta">
                  <div className="meta-item">
                    <FaCalendar className="meta-icon" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="meta-item">
                      <FaMapMarkerAlt className="meta-icon" />
                      <span className="truncate">{order.deliveryAddress.split(',')[0]}</span>
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <span>Total:</span>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                  <div className="order-actions">
                    <button 
                      className="view-details-btn"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </button>
                    {!['delivered', 'cancelled'].includes(order.orderStatus) && (
                      <button 
                        className="cancel-btn"
                        onClick={() => cancelOrder(order._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-orders">
            <FaBox className="no-orders-icon" />
            <h3>No orders found</h3>
            <p>{searchQuery ? 'Try a different search' : 'Create your first order'}</p>
            <button className="create-order-btn" onClick={createNewOrder}>
              Create New Order
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-modal" onClick={closeOrderDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              {/* Order Summary */}
              <div className="details-section">
                <div className="section-header">
                  <h3>Order Summary</h3>
                  <div className={`status-display ${selectedOrder.orderStatus}`}>
                    {getStatusIcon(selectedOrder.orderStatus)}
                    {getStatusText(selectedOrder.orderStatus)}
                  </div>
                </div>
                
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="label">Order ID:</span>
                    <span className="value">#{selectedOrder.orderId}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Date:</span>
                    <span className="value">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Payment:</span>
                    <span className={`value ${selectedOrder.paymentStatus}`}>
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="details-section">
                <h3>Order Items</h3>
                <div className="products-list">
                  {selectedOrder.products?.map((item, idx) => (
                    <div key={idx} className="product-item">
                      <div className="product-info">
                        <h4>{item.productName || 'Product'}</h4>
                        <div className="product-meta">
                          <span>Qty: {item.quantity || 1}</span>
                          <span>Price: {formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <div className="product-total">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="details-section">
                <h3>Delivery Information</h3>
                <div className="delivery-info">
                  <div className="info-item">
                    <FaMapMarkerAlt className="info-icon" />
                    <div className="info-content">
                      <strong>Address:</strong>
                      <p>{selectedOrder.deliveryAddress || 'Not specified'}</p>
                    </div>
                  </div>
                  {selectedOrder.deliveryOption && (
                    <div className="info-item">
                      <FaTruck className="info-icon" />
                      <div className="info-content">
                        <strong>Delivery Option:</strong>
                        <p>{selectedOrder.deliveryOption}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="details-section totals">
                <h3>Order Total</h3>
                <div className="totals-grid">
                  <div className="total-item">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="total-item">
                    <span>Delivery Fee:</span>
                    <span>{formatCurrency(selectedOrder.deliveryFee || 0)}</span>
                  </div>
                  <div className="total-item grand-total">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeOrderDetails}>
                Close
              </button>
              {selectedOrder.orderStatus === 'delivered' && (
                <button className="btn-primary">
                  Order Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileOrders;