import React, { useState, useEffect } from 'react';
import { FaTimes, FaFilter, FaEye, FaRedo, FaShoppingCart, FaCreditCard, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import './UserHistory.css';

const History = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [activeItem, setActiveItem] = useState(null);

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  // Fetch all history data
  useEffect(() => {
    const fetchAllHistory = async () => {
      setIsLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setIsLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const [ordersRes, subsRes, paymentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/user/history/orders`, { headers }),
          fetch(`${API_BASE_URL}/user/history/subscriptions`, { headers }),
          fetch(`${API_BASE_URL}/user/history/payments`, { headers }),
        ]);

        if (!ordersRes.ok || !subsRes.ok || !paymentsRes.ok) {
          throw new Error('Failed to fetch history data');
        }

        const [ordersData, subsData, paymentsData] = await Promise.all([
          ordersRes.json(),
          subsRes.json(),
          paymentsRes.json(),
        ]);

        setOrders(ordersData.data || []);
        setSubscriptions(subsData.data || []);
        setPayments(paymentsData.data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError('Failed to load history. Please try again later.');
        setOrders([]);
        setSubscriptions([]);
        setPayments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllHistory();
  }, []);

  // Helpers
  const viewItemDetails = (item) => setActiveItem(item);
  const closeItemDetails = () => setActiveItem(null);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
    return `₦${num.toLocaleString()}`;
  };

  const getStatusClass = (status) => {
    if (!status) return 'his-status-pending';
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'completed':
      case 'active':
        return 'his-status-completed';
      case 'processing':
      case 'pending':
        return 'his-status-pending';
      case 'cancelled':
        return 'his-status-cancelled';
      case 'failed':
        return 'his-status-failed';
      case 'refunded':
        return 'his-status-refunded';
      default:
        return 'his-status-pending';
    }
  };

  const getStatusText = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getMethodName = (method) => {
    if (!method) return 'Unknown';
    switch (method.toLowerCase()) {
      case 'card': return 'Credit/Debit Card';
      case 'bank_transfer':
      case 'bank transfer': return 'Bank Transfer';
      case 'ussd': return 'USSD';
      case 'wallet': return 'Wallet';
      case 'auto_debit':
      case 'auto debit': return 'Auto-Debit';
      default: return method.charAt(0).toUpperCase() + method.slice(1);
    }
  };

  const getFilteredData = () => {
    const data =
      activeTab === 'orders' ? orders :
      activeTab === 'subscriptions' ? subscriptions : payments;

    if (!Array.isArray(data)) return [];
    if (filter === 'all') return data;

    return data.filter((item) =>
      item?.status?.toLowerCase() === filter.toLowerCase()
    );
  };

  const filteredData = getFilteredData();

  // Loading
  if (isLoading) {
    return (
      <div className="his-history-page his-loading">
        <div className="his-loading-spinner">
          <FaSpinner />
        </div>
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div className="his-history-page">
      {/* Header */}
      <div className="his-dashboard-header">
        <h1>History</h1>
        <div className="his-header-actions">
          <div className="his-filter-wrapper">
            <FaFilter className="his-filter-icon" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="his-filter-select"
            >
              <option value="all">All {activeTab}</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              {activeTab === 'payments' && <option value="failed">Failed</option>}
              {activeTab === 'payments' && <option value="pending">Pending</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="his-error-message">
          {error}
          <button onClick={() => setError('')} className="his-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="his-history-tabs">
        <button
          className={activeTab === 'orders' ? 'his-tab his-tab-active' : 'his-tab'}
          onClick={() => setActiveTab('orders')}
        >
          <FaShoppingCart className="his-tab-icon" />
          <span className="his-tab-text">Orders</span>
          <span className="his-count-badge">{orders.length}</span>
        </button>
        <button
          className={activeTab === 'subscriptions' ? 'his-tab his-tab-active' : 'his-tab'}
          onClick={() => setActiveTab('subscriptions')}
        >
          <FaCalendarAlt className="his-tab-icon" />
          <span className="his-tab-text">Subscriptions</span>
          <span className="his-count-badge">{subscriptions.length}</span>
        </button>
        <button
          className={activeTab === 'payments' ? 'his-tab his-tab-active' : 'his-tab'}
          onClick={() => setActiveTab('payments')}
        >
          <FaCreditCard className="his-tab-icon" />
          <span className="his-tab-text">Payments</span>
          <span className="his-count-badge">{payments.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="his-content-section">
        <div className="his-section-header">
          <h2>
            {activeTab === 'orders' && 'Past Orders'}
            {activeTab === 'subscriptions' && 'Subscription History'}
            {activeTab === 'payments' && 'Payment History'}
          </h2>
          <span className="his-count-badge">{filteredData.length} items</span>
        </div>

        {filteredData.length > 0 ? (
          <div className="his-table-container">
            <table className="his-history-table">
              <thead>
                <tr>
                  {activeTab === 'orders' && (
                    <>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </>
                  )}
                  {activeTab === 'subscriptions' && (
                    <>
                      <th>Plan</th>
                      <th>Size</th>
                      <th>Frequency</th>
                      <th>Price</th>
                      <th>Period</th>
                      <th>Status</th>
                      <th>Action</th>
                    </>
                  )}
                  {activeTab === 'payments' && (
                    <>
                      <th>Transaction ID</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                      <th>Action</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item._id}>
                    {activeTab === 'orders' && (
                      <>
                        <td data-label="Order ID">{item.orderId || 'N/A'}</td>
                        <td data-label="Date">{formatDate(item.createdAt)}</td>
                        <td data-label="Items">
                          {item.items?.length ? (
                            item.items.map((p, i) => (
                              <div key={i} className="his-product-item">
                                {p.quantity} × {p.name}
                              </div>
                            ))
                          ) : (
                            <div>No items</div>
                          )}
                        </td>
                        <td data-label="Amount">{formatCurrency(item.totalAmount)}</td>
                        <td data-label="Status" className={getStatusClass(item.status)}>
                          {getStatusText(item.status)}
                        </td>
                        <td data-label="Action">
                          <button
                            className="his-btn-secondary"
                            onClick={() => viewItemDetails(item)}
                          >
                            <FaEye className="his-btn-icon" />
                            View
                          </button>
                        </td>
                      </>
                    )}

                    {activeTab === 'subscriptions' && (
                      <>
                        <td data-label="Plan">{item.planName || 'N/A'}</td>
                        <td data-label="Size">{item.size || 'N/A'}</td>
                        <td data-label="Frequency">{item.frequency || 'N/A'}</td>
                        <td data-label="Price">{formatCurrency(item.price)}</td>
                        <td data-label="Period">
                          {formatDate(item.startDate)} -{' '}
                          {item.endDate ? formatDate(item.endDate) : 'Present'}
                        </td>
                        <td data-label="Status" className={getStatusClass(item.status)}>
                          {getStatusText(item.status)}
                        </td>
                        <td data-label="Action">
                          <button
                            className="his-btn-secondary"
                            onClick={() => viewItemDetails(item)}
                          >
                            <FaEye className="his-btn-icon" />
                            View
                          </button>
                        </td>
                      </>
                    )}

                    {activeTab === 'payments' && (
                      <>
                        <td data-label="Transaction ID">{item.transactionId || 'N/A'}</td>
                        <td data-label="Date">{formatDate(item.createdAt)}</td>
                        <td data-label="Description">{item.description || 'Payment'}</td>
                        <td data-label="Amount">{formatCurrency(item.amount)}</td>
                        <td data-label="Method">{getMethodName(item.method)}</td>
                        <td data-label="Status" className={getStatusClass(item.status)}>
                          {getStatusText(item.status)}
                          {item.failureReason && ` (${item.failureReason})`}
                        </td>
                        <td data-label="Action">
                          <button
                            className="his-btn-secondary"
                            onClick={() => viewItemDetails(item)}
                          >
                            <FaEye className="his-btn-icon" />
                            View
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="his-no-history">
            <p>No {activeTab} history found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeItem && (
        <div className="his-history-detail-modal">
          <div className="his-modal-content">
            <div className="his-modal-header">
              <h2>
                {activeTab === 'orders' && `Order #${activeItem.orderId}`}
                {activeTab === 'subscriptions' && `Subscription - ${activeItem.planName}`}
                {activeTab === 'payments' && `Payment #${activeItem.transactionId}`}
              </h2>
              <button className="his-close-btn" onClick={closeItemDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="his-modal-body">
              {/* Orders */}
              {activeTab === 'orders' && (
                <>
                  <p><b>Date:</b> {formatDate(activeItem.createdAt)}</p>
                  <p><b>Status:</b> {getStatusText(activeItem.status)}</p>
                  <p><b>Total:</b> {formatCurrency(activeItem.totalAmount)}</p>
                  <h3>Items</h3>
                  {activeItem.items?.map((p, i) => (
                    <div key={i}>{p.quantity} × {p.name} ({formatCurrency(p.price)})</div>
                  ))}
                </>
              )}

              {/* Subscriptions */}
              {activeTab === 'subscriptions' && (
                <>
                  <p><b>Plan:</b> {activeItem.planName}</p>
                  <p><b>Size:</b> {activeItem.size}</p>
                  <p><b>Frequency:</b> {activeItem.frequency}</p>
                  <p><b>Price:</b> {formatCurrency(activeItem.price)}</p>
                  <p><b>Status:</b> {getStatusText(activeItem.status)}</p>
                  <p><b>Period:</b> {formatDate(activeItem.startDate)} - {activeItem.endDate ? formatDate(activeItem.endDate) : 'Present'}</p>
                </>
              )}

              {/* Payments */}
              {activeTab === 'payments' && (
                <>
                  <p><b>Transaction ID:</b> {activeItem.transactionId}</p>
                  <p><b>Date:</b> {formatDate(activeItem.createdAt)}</p>
                  <p><b>Description:</b> {activeItem.description || 'Payment'}</p>
                  <p><b>Amount:</b> {formatCurrency(activeItem.amount)}</p>
                  <p><b>Method:</b> {getMethodName(activeItem.method)}</p>
                  <p><b>Status:</b> {getStatusText(activeItem.status)}</p>
                  {activeItem.failureReason && <p><b>Reason:</b> {activeItem.failureReason}</p>}
                </>
              )}
            </div>

            <div className="his-modal-footer">
              <button className="his-btn-secondary" onClick={closeItemDetails}>
                Close
              </button>
              {activeTab === 'orders' && activeItem.status === 'delivered' && (
                <button className="his-btn-primary">
                  <FaRedo className="his-btn-icon" />
                  Reorder
                </button>
              )}
              {activeTab === 'payments' && activeItem.status === 'failed' && (
                <button className="his-btn-primary">
                  <FaRedo className="his-btn-icon" />
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;