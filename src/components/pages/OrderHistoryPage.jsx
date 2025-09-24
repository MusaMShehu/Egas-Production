// components/pages/OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import { formatDate, getStatusClass } from '../../utils/helpers';
import '../../styles/OrderHistoryPage.css';

const OrderHistoryPage = ({ user }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch orders from backend API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const params = new URLSearchParams();
        if (statusFilter !== 'all') params.append('status', statusFilter);
        if (periodFilter !== 'all') params.append('period', periodFilter);
        params.append('page', currentPage);
        params.append('limit', 10); // Show 10 orders per page
        
        const response = await fetch(`/api/orders?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, periodFilter, currentPage, user.id]);

  const handleFilterApply = () => {
    // Reset to first page when filters change
    setCurrentPage(1);
    // The useEffect will automatically trigger a new fetch
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPeriodFilter('all');
    setCurrentPage(1);
  };

  const showOrderDetails = async (order) => {
    try {
      // Fetch detailed order information
      const response = await fetch(`/api/orders/${order.id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch order details: ${response.status}`);
      }
      
      const orderDetails = await response.json();
      
      alert(`Order Details:\n\nID: ${orderDetails.id}\nDate: ${formatDate(orderDetails.date)}\nProduct: ${orderDetails.product}\nQuantity: ${orderDetails.quantity}\nAmount: ₦${orderDetails.amount.toLocaleString()}\nStatus: ${orderDetails.status}\nDelivery Address: ${orderDetails.deliveryAddress || 'N/A'}`);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details. Please try again.');
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/invoice`);
      
      if (!response.ok) {
        throw new Error(`Failed to download invoice: ${response.status}`);
      }
      
      // Assuming the API returns a PDF blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="order-history-page">
        <div className="order-history-container">
          <div className="loading-spinner">Loading order history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="order-history-page">
        <div className="order-history-container">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <h2 className="text-xl font-bold mb-6">Order History</h2>
        
        <div className="filters-container">
          <select 
            className="filter-select" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select 
            className="filter-select" 
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="year">This Year</option>
          </select>
          <button 
            className="filter-button" 
            onClick={handleFilterApply}
          >
            Apply Filters
          </button>
          <button 
            className="reset-button" 
            onClick={handleResetFilters}
          >
            Reset
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.product}</td>
                    <td>{order.quantity}</td>
                    <td>₦{order.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="action-link" 
                        onClick={() => showOrderDetails(order)}
                      >
                        View
                      </button>
                      {order.status === 'delivered' && (
                        <button 
                          className="action-link" 
                          onClick={() => downloadInvoice(order.id)}
                        >
                          Invoice
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-orders">
                    No orders found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {orders.length > 0 && (
          <div className="table-footer">
            <div className="orders-count">
              Showing {orders.length} of {totalPages * 10} orders
            </div>
            <div className="pagination">
              <button 
                className="page-button" 
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={pageNum}
                    className={`page-button ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && <span className="page-ellipsis">...</span>}
              
              <button 
                className="page-button" 
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;