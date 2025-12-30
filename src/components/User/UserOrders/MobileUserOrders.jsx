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
      case 'processing': return <FaBox className="mobord-status-icon mobord-processing" />;
      case 'shipped': return <FaShippingFast className="mobord-status-icon mobord-shipped" />;
      case 'in-transit': return <FaTruck className="mobord-status-icon mobord-transit" />;
      case 'delivered': return <FaCheckCircle className="mobord-status-icon mobord-delivered" />;
      case 'cancelled': return <FaTimesCircle className="mobord-status-icon mobord-cancelled" />;
      default: return <FaBox className="mobord-status-icon mobord-processing" />;
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
      <div className="mobord-mobile-orders mobord-loading">
        <div className="mobord-loading-spinner"></div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="mobord-mobile-orders">
      {/* Header */}
      <div className="mobord-orders-header">
        <h1>Order History</h1>
        <button className="mobord-new-order-btn" onClick={createNewOrder}>
          <FaPlus /> New Order
        </button>
      </div>

      {/* Search Bar */}
      <div className="mobord-search-container">
        <div className="mobord-search-bar">
          <FaSearch className="mobord-search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="mobord-clear-search" onClick={() => setSearchQuery('')}>
              <FaTimes />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mobord-filter-tabs">
        {filters.map(filter => (
          <button
            key={filter.id}
            className={`mobord-filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="mobord-orders-list">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <div key={order._id} className="mobord-order-card">
              <div className="mobord-order-header">
                <div className="mobord-order-id">#{order.orderId}</div>
                <div className={`mobord-order-status-badge ${order.orderStatus}`}>
                  {getStatusIcon(order.orderStatus)}
                  <span>{getStatusText(order.orderStatus)}</span>
                </div>
              </div>

              <div className="mobord-order-body">
                <div className="mobord-order-products">
                  <FaGasPump className="mobord-product-icon" />
                  <div className="mobord-product-info">
                    <h4>{getProductNames(order.products)}</h4>
                    <p>{order.products?.length || 0} items</p>
                  </div>
                </div>

                <div className="mobord-order-meta">
                  <div className="mobord-meta-item">
                    <FaCalendar className="mobord-meta-icon" />
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                  {order.deliveryAddress && (
                    <div className="mobord-meta-item">
                      <FaMapMarkerAlt className="mobord-meta-icon" />
                      <span className="mobord-truncate">{order.deliveryAddress.split(',')[0]}</span>
                    </div>
                  )}
                </div>

                <div className="mobord-order-footer">
                  <div className="mobord-order-total">
                    <span>Total:</span>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </div>
                  <div className="mobord-order-actions">
                    <button 
                      className="mobord-view-details-btn"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </button>
                    {!['delivered', 'cancelled'].includes(order.orderStatus) && (
                      <button 
                        className="mobord-cancel-btn"
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
          <div className="mobord-no-orders">
            <FaBox className="mobord-no-orders-icon" />
            <h3>No orders found</h3>
            <p>{searchQuery ? 'Try a different search' : 'Create your first order'}</p>
            <button className="mobord-create-order-btn" onClick={createNewOrder}>
              Create New Order
            </button>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="mobord-order-details-modal">
          <div className="mobord-modal-content">
            <div className="mobord-modal-header">
              <h2>Order Details</h2>
              <button className="mobord-close-modal" onClick={closeOrderDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="mobord-modal-body">
              {/* Order Summary */}
              <div className="mobord-details-section">
                <div className="mobord-section-header">
                  <h3>Order Summary</h3>
                  <div className={`mobord-status-display ${selectedOrder.orderStatus}`}>
                    {getStatusIcon(selectedOrder.orderStatus)}
                    {getStatusText(selectedOrder.orderStatus)}
                  </div>
                </div>
                
                <div className="mobord-summary-grid">
                  <div className="mobord-summary-item">
                    <span className="mobord-label">Order ID:</span>
                    <span className="mobord-value">#{selectedOrder.orderId}</span>
                  </div>
                  <div className="mobord-summary-item">
                    <span className="mobord-label">Date:</span>
                    <span className="mobord-value">{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  <div className="mobord-summary-item">
                    <span className="mobord-label">Payment:</span>
                    <span className={`mobord-value ${selectedOrder.paymentStatus}`}>
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="mobord-details-section">
                <h3>Order Items</h3>
                <div className="mobord-products-list">
                  {selectedOrder.products?.map((item, idx) => (
                    <div key={idx} className="mobord-product-item">
                      <div className="mobord-product-info">
                        <h4>{item.productName || 'Product'}</h4>
                        <div className="mobord-product-meta">
                          <span>Qty: {item.quantity || 1}</span>
                          <span>Price: {formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <div className="mobord-product-total">
                        {formatCurrency((item.price || 0) * (item.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mobord-details-section">
                <h3>Delivery Information</h3>
                <div className="mobord-delivery-info">
                  <div className="mobord-info-item">
                    <FaMapMarkerAlt className="mobord-info-icon" />
                    <div className="mobord-info-content">
                      <strong>Address:</strong>
                      <p>{selectedOrder.deliveryAddress || 'Not specified'}</p>
                    </div>
                  </div>
                  {selectedOrder.deliveryOption && (
                    <div className="mobord-info-item">
                      <FaTruck className="mobord-info-icon" />
                      <div className="mobord-info-content">
                        <strong>Delivery Option:</strong>
                        <p>{selectedOrder.deliveryOption}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="mobord-details-section mobord-totals">
                <h3>Order Total</h3>
                <div className="mobord-totals-grid">
                  <div className="mobord-total-item">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                  <div className="mobord-total-item">
                    <span>Delivery Fee:</span>
                    <span>{formatCurrency(selectedOrder.deliveryFee || 0)}</span>
                  </div>
                  <div className="mobord-total-item mobord-grand-total">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mobord-modal-footer">
              <button className="mobord-btn-secondary" onClick={closeOrderDetails}>
                Close
              </button>
              {selectedOrder.orderStatus === 'delivered' && (
                <button className="mobord-btn-primary">
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