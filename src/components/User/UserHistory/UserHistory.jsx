// components/History.js
import React, { useState, useEffect } from 'react';
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

  // API base URL - replace with your actual API endpoint
  const API_BASE_URL = 'https://your-api-url.com/api';

  // Fetch all history data from API
  useEffect(() => {
    const fetchAllHistory = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would use your actual API endpoints
        // const [ordersRes, subscriptionsRes, paymentsRes] = await Promise.all([
        //   fetch(`${API_BASE_URL}/orders/history`, {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        //   }),
        //   fetch(`${API_BASE_URL}/subscriptions/history`, {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        //   }),
        //   fetch(`${API_BASE_URL}/payments/history`, {
        //     headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        //   })
        // ]);
        
        // For demonstration, we'll use a timeout to simulate API calls
        setTimeout(() => {
          // Mock order history data
          const mockOrders = [
            {
              _id: '1',
              orderId: 'EG-1001',
              date: new Date('2023-05-15'),
              products: [
                { name: '12kg Gas Cylinder', quantity: 1, price: 10500 }
              ],
              totalAmount: 11000,
              status: 'delivered',
              deliveryDate: new Date('2023-05-18')
            },
            {
              _id: '2',
              orderId: 'EG-1002',
              date: new Date('2023-05-10'),
              products: [
                { name: '6kg Gas Cylinder', quantity: 2, price: 6000 }
              ],
              totalAmount: 13000,
              status: 'delivered',
              deliveryDate: new Date('2023-05-12')
            },
            {
              _id: '3',
              orderId: 'EG-1003',
              date: new Date('2023-04-28'),
              products: [
                { name: '12kg Gas Cylinder', quantity: 1, price: 10500 }
              ],
              totalAmount: 11000,
              status: 'cancelled',
              cancellationDate: new Date('2023-04-29')
            }
          ];

          // Mock subscription history data
          const mockSubscriptions = [
            {
              _id: '1',
              name: 'Monthly Auto-Refill',
              size: '12kg',
              frequency: 'Monthly',
              price: 10500,
              startDate: new Date('2023-03-15'),
              endDate: new Date('2023-06-15'),
              status: 'completed',
              totalDeliveries: 3
            },
            {
              _id: '2',
              name: 'One-Time',
              size: '6kg',
              frequency: 'One-Time',
              price: 12000,
              startDate: new Date('2023-02-10'),
              endDate: new Date('2023-02-10'),
              status: 'completed',
              totalDeliveries: 1
            },
            {
              _id: '3',
              name: 'Weekly Auto-Refill',
              size: '12kg',
              frequency: 'Weekly',
              price: 10500,
              startDate: new Date('2023-05-01'),
              endDate: null,
              status: 'cancelled',
              cancellationDate: new Date('2023-05-15'),
              totalDeliveries: 2
            }
          ];

          // Mock payment history data
          const mockPayments = [
            {
              _id: '1',
              transactionId: 'TX-1001',
              date: new Date('2023-05-15'),
              description: '12kg Gas Cylinder Order',
              amount: 10500,
              method: 'wallet',
              status: 'completed',
              orderId: 'EG-1001'
            },
            {
              _id: '2',
              transactionId: 'TX-1002',
              date: new Date('2023-05-10'),
              description: 'Wallet Top-up',
              amount: 15000,
              method: 'bank_transfer',
              status: 'completed'
            },
            {
              _id: '3',
              transactionId: 'TX-1003',
              date: new Date('2023-04-28'),
              description: 'Monthly Subscription',
              amount: 10500,
              method: 'auto_debit',
              status: 'failed',
              failureReason: 'Insufficient funds'
            }
          ];

          setOrders(mockOrders);
          setSubscriptions(mockSubscriptions);
          setPayments(mockPayments);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching history:', error);
        setError('Failed to load history. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchAllHistory();
  }, []);

  const viewItemDetails = (item) => {
    setActiveItem(item);
  };

  const closeItemDetails = () => {
    setActiveItem(null);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
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
      case 'delivered':
      case 'completed':
      case 'active': return 'status-completed';
      case 'processing':
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      case 'failed': return 'status-failed';
      case 'refunded': return 'status-refunded';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered': return 'Delivered';
      case 'completed': return 'Completed';
      case 'active': return 'Active';
      case 'processing': return 'Processing';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'failed': return 'Failed';
      case 'refunded': return 'Refunded';
      default: return status;
    }
  };

  const getMethodName = (method) => {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'ussd': return 'USSD';
      case 'wallet': return 'Wallet';
      case 'auto_debit': return 'Auto-Debit';
      default: return method;
    }
  };

  // Filter data based on selected filter
  const getFilteredData = () => {
    const data = activeTab === 'orders' ? orders :
                activeTab === 'subscriptions' ? subscriptions :
                payments;

    if (filter === 'all') return data;

    return data.filter(item => {
      if (activeTab === 'payments') {
        return item.status.toLowerCase() === filter;
      }
      return item.status === filter;
    });
  };

  const filteredData = getFilteredData();

  if (isLoading) {
    return <div className="history-page loading">Loading history...</div>;
  }

  return (
    <div className="history-page">
      <div className="dashboard-header">
        <h1>History</h1>
        <div className="header-actions">
          <div className="filter-controls">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
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

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError('')} className="close-error">
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="history-tabs">
        <button 
          className={activeTab === 'orders' ? 'tab-active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Order History
          <span className="count-badge">{orders.length}</span>
        </button>
        <button 
          className={activeTab === 'subscriptions' ? 'tab-active' : ''}
          onClick={() => setActiveTab('subscriptions')}
        >
          Subscription History
          <span className="count-badge">{subscriptions.length}</span>
        </button>
        <button 
          className={activeTab === 'payments' ? 'tab-active' : ''}
          onClick={() => setActiveTab('payments')}
        >
          Payment History
          <span className="count-badge">{payments.length}</span>
        </button>
      </div>

      <div className="content-section">
        <div className="section-header">
          <h2>
            {activeTab === 'orders' && 'Past Orders'}
            {activeTab === 'subscriptions' && 'Subscription History'}
            {activeTab === 'payments' && 'Payment History'}
          </h2>
          <span className="count-badge">{filteredData.length} items</span>
        </div>

        {filteredData.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                {activeTab === 'orders' && (
                  <>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Products</th>
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
                      <td>{item.orderId}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>
                        {item.products.map((product, idx) => (
                          <div key={idx} className="product-item">
                            {product.quantity} x {product.name}
                          </div>
                        ))}
                      </td>
                      <td>{formatCurrency(item.totalAmount)}</td>
                      <td className={getStatusClass(item.status)}>
                        {getStatusText(item.status)}
                      </td>
                      <td>
                        <button 
                          className="btn-secondary"
                          onClick={() => viewItemDetails(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </>
                  )}
                  
                  {activeTab === 'subscriptions' && (
                    <>
                      <td>{item.name}</td>
                      <td>{item.size}</td>
                      <td>{item.frequency}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>
                        {formatDate(item.startDate)} - {item.endDate ? formatDate(item.endDate) : 'Present'}
                      </td>
                      <td className={getStatusClass(item.status)}>
                        {getStatusText(item.status)}
                      </td>
                      <td>
                        <button 
                          className="btn-secondary"
                          onClick={() => viewItemDetails(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </>
                  )}
                  
                  {activeTab === 'payments' && (
                    <>
                      <td>{item.transactionId}</td>
                      <td>{formatDate(item.date)}</td>
                      <td>{item.description}</td>
                      <td>{formatCurrency(item.amount)}</td>
                      <td>{getMethodName(item.method)}</td>
                      <td className={getStatusClass(item.status)}>
                        {getStatusText(item.status)}
                        {item.failureReason && ` (${item.failureReason})`}
                      </td>
                      <td>
                        <button 
                          className="btn-secondary"
                          onClick={() => viewItemDetails(item)}
                        >
                          View Details
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-history">
            <p>No {activeTab} history found.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeItem && (
        <div className="history-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                {activeTab === 'orders' && `Order Details - #${activeItem.orderId}`}
                {activeTab === 'subscriptions' && `Subscription Details - ${activeItem.name}`}
                {activeTab === 'payments' && `Payment Details - #${activeItem.transactionId}`}
              </h2>
              <button className="close-btn" onClick={closeItemDetails}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {activeTab === 'orders' && (
                <>
                  <div className="detail-section">
                    <h3>Order Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Order ID:</span>
                        <span className="detail-value">{activeItem.orderId}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Order Date:</span>
                        <span className="detail-value">{formatDate(activeItem.date)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className={`detail-value ${getStatusClass(activeItem.status)}`}>
                          {getStatusText(activeItem.status)}
                        </span>
                      </div>
                      {activeItem.deliveryDate && (
                        <div className="detail-item">
                          <span className="detail-label">Delivery Date:</span>
                          <span className="detail-value">{formatDate(activeItem.deliveryDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="detail-section">
                    <h3>Products</h3>
                    {activeItem.products.map((product, idx) => (
                      <div key={idx} className="product-detail">
                        <div className="product-name">{product.name}</div>
                        <div className="product-quantity">Quantity: {product.quantity}</div>
                        <div className="product-price">Price: {formatCurrency(product.price)}</div>
                      </div>
                    ))}
                    <div className="order-total">
                      Total Amount: {formatCurrency(activeItem.totalAmount)}
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'subscriptions' && (
                <>
                  <div className="detail-section">
                    <h3>Subscription Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Plan Name:</span>
                        <span className="detail-value">{activeItem.name}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Cylinder Size:</span>
                        <span className="detail-value">{activeItem.size}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Frequency:</span>
                        <span className="detail-value">{activeItem.frequency}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Price:</span>
                        <span className="detail-value">{formatCurrency(activeItem.price)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className={`detail-value ${getStatusClass(activeItem.status)}`}>
                          {getStatusText(activeItem.status)}
                        </span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Period:</span>
                        <span className="detail-value">
                          {formatDate(activeItem.startDate)} - {activeItem.endDate ? formatDate(activeItem.endDate) : 'Present'}
                        </span>
                      </div>
                      {activeItem.totalDeliveries && (
                        <div className="detail-item">
                          <span className="detail-label">Total Deliveries:</span>
                          <span className="detail-value">{activeItem.totalDeliveries}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'payments' && (
                <>
                  <div className="detail-section">
                    <h3>Payment Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="detail-label">Transaction ID:</span>
                        <span className="detail-value">{activeItem.transactionId}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{formatDate(activeItem.date)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Description:</span>
                        <span className="detail-value">{activeItem.description}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Amount:</span>
                        <span className="detail-value">{formatCurrency(activeItem.amount)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Payment Method:</span>
                        <span className="detail-value">{getMethodName(activeItem.method)}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Status:</span>
                        <span className={`detail-value ${getStatusClass(activeItem.status)}`}>
                          {getStatusText(activeItem.status)}
                        </span>
                      </div>
                      {activeItem.failureReason && (
                        <div className="detail-item">
                          <span className="detail-label">Failure Reason:</span>
                          <span className="detail-value">{activeItem.failureReason}</span>
                        </div>
                      )}
                      {activeItem.orderId && (
                        <div className="detail-item">
                          <span className="detail-label">Order ID:</span>
                          <span className="detail-value">{activeItem.orderId}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeItemDetails}>
                Close
              </button>
              {activeTab === 'orders' && activeItem.status === 'delivered' && (
                <button className="btn-primary">
                  Reorder
                </button>
              )}
              {activeTab === 'payments' && activeItem.status === 'failed' && (
                <button className="btn-primary">
                  Retry Payment
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