import React, { useState, useEffect } from 'react';
import { FaTimes, FaFilter, FaEye, FaRedo, FaShoppingCart, FaCreditCard, FaCalendarAlt, FaSpinner, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import './UserHistory.css';
import { successToast, errorToast, infoToast, warningToast } from "../../../utils/toast";

const History = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  
  // Separate loading states for each tab
  const [loadingStates, setLoadingStates] = useState({
    orders: true,
    subscriptions: true,
    payments: true
  });

  // Pagination states for each tab
  const [pagination, setPagination] = useState({
    orders: { page: 1, limit: 10, total: 0, pages: 0 },
    subscriptions: { page: 1, limit: 10, total: 0, pages: 0 },
    payments: { page: 1, limit: 10, total: 0, pages: 0 }
  });

  // Track loaded data for each tab
  const [loadedData, setLoadedData] = useState({
    orders: false,
    subscriptions: false,
    payments: false
  });

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

  // Fetch history data with pagination
  const fetchHistoryData = async (type, page = 1, limit = 10, statusFilter = 'all', search = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        warningToast('Please log in to view your history');
        return null;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (statusFilter && statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (search) {
        params.append('q', search);
      }

      infoToast(`Loading ${type} history...`);

      const response = await fetch(
        `${API_BASE_URL}/user/history/${type}?${params}`,
        { headers }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${type} data: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching ${type}:`, err);
      throw err;
    }
  };

  // Load data for specific tab
  const loadTabData = async (tab, page = 1) => {
    setLoadingStates(prev => ({ ...prev, [tab]: true }));
    setError('');

    try {
      const currentPagination = pagination[tab];
      const limit = currentPagination.limit;
      
      const response = await fetchHistoryData(
        tab, 
        page, 
        limit, 
        filter,
        searchQuery
      );

      if (response && response.success) {
        // Update data based on tab
        switch (tab) {
          case 'orders':
            setOrders(response.data || []);
            break;
          case 'subscriptions':
            setSubscriptions(response.data || []);
            break;
          case 'payments':
            setPayments(response.data || []);
            break;
          default:
            break;
        }

        // Update pagination for the specific tab
        setPagination(prev => ({
          ...prev,
          [tab]: {
            page: response.page || page,
            limit: limit,
            total: response.total || 0,
            pages: response.pages || Math.ceil((response.total || 0) / limit) || 1
          }
        }));

        // Mark this tab as loaded
        setLoadedData(prev => ({ ...prev, [tab]: true }));

        // Show success toast for search/filter results
        if (searchQuery || filter !== 'all') {
          const resultCount = response.data?.length || 0;
          if (resultCount > 0) {
            successToast(`Found ${resultCount} ${tab} matching your criteria`);
          } else {
            infoToast(`No ${tab} found matching your criteria`);
          }
        } else if (page > 1) {
          infoToast(`Loaded page ${page} of ${tab}`);
        }

      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      const errorMessage = err.message || `Failed to load ${tab}. Please try again.`;
      setError(errorMessage);
      errorToast(errorMessage);
      
      // Clear data on error for this tab
      switch (tab) {
        case 'orders':
          setOrders([]);
          break;
        case 'subscriptions':
          setSubscriptions([]);
          break;
        case 'payments':
          setPayments([]);
          break;
        default:
          break;
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [tab]: false }));
    }
  };

  // Load data for active tab
  const loadActiveTabData = async (page = 1) => {
    await loadTabData(activeTab, page);
  };

  // Initial load when component mounts - load all tabs
  useEffect(() => {
    const loadAllTabs = async () => {
      setIsLoading(true);
      infoToast('Loading your history...');
      
      try {
        // Load all tabs initially but only show loading for active tab
        await Promise.all([
          loadTabData('orders', 1),
          loadTabData('subscriptions', 1),
          loadTabData('payments', 1)
        ]);
        
        successToast('History loaded successfully');
      } catch (err) {
        console.error('Error loading initial data:', err);
        errorToast('Failed to load history data');
      } finally {
        setIsLoading(false);
      }
    };

    loadAllTabs();
  }, []);

  // Load data when tab changes (only if not already loaded)
  useEffect(() => {
    if (!loadedData[activeTab]) {
      loadActiveTabData(1);
    }
  }, [activeTab]);

  // Reload active tab when filter or search changes
  useEffect(() => {
    if (loadedData[activeTab]) {
      loadActiveTabData(1);
    }
  }, [filter, searchQuery]);

  // Helpers
  const viewItemDetails = (item) => {
    setActiveItem(item);
    infoToast('Viewing item details');
  };

  const closeItemDetails = () => {
    setActiveItem(null);
  };

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
    return data;
  };

  const filteredData = getFilteredData();
  const currentPagination = pagination[activeTab];
  const currentLoading = loadingStates[activeTab];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= currentPagination.pages) {
      loadActiveTabData(newPage);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      infoToast(`Searching for "${searchQuery}" in ${activeTab}...`);
    }
    loadActiveTabData(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    infoToast('Search cleared');
    loadActiveTabData(1);
  };

  const clearFilters = () => {
    setFilter('all');
    setSearchQuery('');
    successToast('All filters cleared');
    loadActiveTabData(1);
  };

  // Action handlers for modal buttons
  const handleReorder = (item) => {
    successToast(`Reorder initiated for ${item.orderId || 'selected item'}`);
    closeItemDetails();
    // Add your reorder logic here
  };

  const handleRetryPayment = (item) => {
    infoToast(`Retrying payment for transaction ${item.transactionId}`);
    closeItemDetails();
    // Add your payment retry logic here
  };

  // Generate page numbers for pagination with ellipsis
  const getPageNumbers = () => {
    const { page, pages } = currentPagination;
    const pageNumbers = [];
    
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(pages);
      } else if (page >= pages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = pages - 4; i <= pages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(pages);
      }
    }
    
    return pageNumbers;
  };

  // Get total count for each tab badge
  const getTabBadgeCount = (tab) => {
    return pagination[tab].total;
  };

  // Loading state for initial page load
  if (isLoading && filteredData.length === 0) {
    return (
      <div className="his-history-page his-loading">
        <div className="his-loading-spinner">
          <FaSpinner className="his-spin" />
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
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="his-search-wrapper">
            <div className="his-search-input-wrapper">
              <FaSearch className="his-search-icon" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                className="his-search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={clearSearch} 
                  className="his-clear-search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className="his-search-btn">
              Search
            </button>
          </form>

          {/* Filter */}
          <div className="his-filter-wrapper">
            <FaFilter className="his-filter-icon" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                if (e.target.value !== 'all') {
                  infoToast(`Filtering by ${e.target.value} status`);
                }
              }}
              className="his-filter-select"
            >
              <option value="all">All {activeTab}</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              {activeTab === 'payments' && <option value="failed">Failed</option>}
              {activeTab === 'payments' && <option value="pending">Pending</option>}
              {activeTab === 'orders' && <option value="processing">Processing</option>}
              {activeTab === 'orders' && <option value="delivered">Delivered</option>}
              {activeTab === 'subscriptions' && <option value="active">Active</option>}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="his-error-message">
          <span>{error}</span>
          <button onClick={() => setError('')} className="his-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="his-history-tabs">
        <button
          className={activeTab === 'orders' ? 'his-tab his-tab-active' : 'his-tab'}
          onClick={() => {
            setActiveTab('orders');
            infoToast('Switching to order history');
          }}
        >
          <FaShoppingCart className="his-tab-icon" />
          <span className="his-tab-text">Orders</span>
          <span className="his-count-badge">{getTabBadgeCount('orders')}</span>
        </button>
        <button
          className={activeTab === 'subscriptions' ? 'his-tab his-tab-active' : 'his-tab'}
          onClick={() => {
            setActiveTab('subscriptions');
            infoToast('Switching to subscription history');
          }}
        >
          <FaCalendarAlt className="his-tab-icon" />
          <span className="his-tab-text">Subscriptions</span>
          <span className="his-count-badge">{getTabBadgeCount('subscriptions')}</span>
        </button>
        <button
          className={activeTab === 'payments' ? 'his-tab his-tab-active' : 'his-tab'}
          onClick={() => {
            setActiveTab('payments');
            infoToast('Switching to payment history');
          }}
        >
          <FaCreditCard className="his-tab-icon" />
          <span className="his-tab-text">Payments</span>
          <span className="his-count-badge">{getTabBadgeCount('payments')}</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="his-content-section">
        <div className="his-section-header">
          <h2>
            {activeTab === 'orders' && 'Order History'}
            {activeTab === 'subscriptions' && 'Subscription History'}
            {activeTab === 'payments' && 'Payment History'}
          </h2>
          <div className="his-pagination-info">
            <span className="his-count-badge">
              Showing {filteredData.length} of {currentPagination.total} items
              {currentPagination.pages > 1 && ` • Page ${currentPagination.page} of ${currentPagination.pages}`}
            </span>
          </div>
        </div>

        {/* Loading state for active tab */}
        {currentLoading ? (
          <div className="his-table-loading">
            <div className="his-loading-spinner">
              <FaSpinner className="his-spin" />
            </div>
            <p>Loading {activeTab}...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <>
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
                        <th>Actions</th>
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
                        <th>Actions</th>
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
                        <th>Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item._id || item.id}>
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
                          <td data-label="Actions">
                            <button
                              className="his-btn-view"
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
                          <td data-label="Actions">
                            <button
                              className="his-btn-view"
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
                          <td data-label="Actions">
                            <button
                              className="his-btn-view"
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

            {/* Pagination Controls */}
            {currentPagination.pages > 1 && (
              <div className="his-pagination-controls">
                <button
                  className="his-pagination-btn his-pagination-prev"
                  onClick={() => handlePageChange(currentPagination.page - 1)}
                  disabled={currentPagination.page <= 1}
                >
                  <FaChevronLeft />
                  Previous
                </button>
                
                <div className="his-pagination-numbers">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="his-pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        className={`his-pagination-number ${
                          currentPagination.page === pageNum ? 'his-pagination-active' : ''
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="his-pagination-btn his-pagination-next"
                  onClick={() => handlePageChange(currentPagination.page + 1)}
                  disabled={currentPagination.page >= currentPagination.pages}
                >
                  Next
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="his-no-history">
            <div className="his-no-history-content">
              <p>No {activeTab} history found.</p>
              {(filter !== 'all' || searchQuery) && (
                <button 
                  className="his-btn-clear-filters"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {activeItem && (
        <div className="his-history-detail-modal">
          <div className="his-modal-overlay" onClick={closeItemDetails}></div>
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
              {/* Modal content remains the same */}
              <div className="his-modal-details">
                <p>Detailed view of {activeTab.slice(0, -1)} information...</p>
                {/* Add your detailed content here */}
              </div>
            </div>

            <div className="his-modal-footer">
              <button className="his-btn-close" onClick={closeItemDetails}>
                Close
              </button>
              {activeTab === 'orders' && activeItem.status === 'delivered' && (
                <button 
                  className="his-btn-reorder"
                  onClick={() => handleReorder(activeItem)}
                >
                  <FaRedo className="his-btn-icon" />
                  Reorder
                </button>
              )}
              {activeTab === 'payments' && activeItem.status === 'failed' && (
                <button 
                  className="his-btn-retry"
                  onClick={() => handleRetryPayment(activeItem)}
                >
                  <FaRedo className="his-btn-icon" />
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