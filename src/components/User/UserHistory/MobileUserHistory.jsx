// components/UserHistory.jsx - Mobile-First Design
import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaFilter, FaEye, FaRedo, FaShoppingCart, FaCreditCard, 
  FaCalendarAlt, FaSpinner, FaChevronLeft, FaChevronRight, 
  FaSearch, FaBox, FaTruck, FaCheckCircle, FaExclamationTriangle, 
  FaClock, FaPause, FaExclamationCircle, FaEllipsisH, FaList 
} from 'react-icons/fa';
import './MobileUserHistory.css';
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
  const [showFilters, setShowFilters] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  
  const [loadingStates, setLoadingStates] = useState({
    orders: true,
    subscriptions: true,
    payments: true
  });

  const [pagination, setPagination] = useState({
    orders: { page: 1, limit: 10, total: 0, pages: 0 },
    subscriptions: { page: 1, limit: 10, total: 0, pages: 0 },
    payments: { page: 1, limit: 10, total: 0, pages: 0 }
  });

  const [loadedData, setLoadedData] = useState({
    orders: false,
    subscriptions: false,
    payments: false
  });

  const API_BASE_URL = 'https://egas-server-1.onrender.com/api/v1';

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

        setPagination(prev => ({
          ...prev,
          [tab]: {
            page: response.page || page,
            limit: limit,
            total: response.total || 0,
            pages: response.pages || Math.ceil((response.total || 0) / limit) || 1
          }
        }));

        setLoadedData(prev => ({ ...prev, [tab]: true }));

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

  const loadActiveTabData = async (page = 1) => {
    await loadTabData(activeTab, page);
  };

  useEffect(() => {
    const loadAllTabs = async () => {
      setIsLoading(true);
      infoToast('Loading your history...');
      
      try {
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

  useEffect(() => {
    if (!loadedData[activeTab]) {
      loadActiveTabData(1);
    }
  }, [activeTab]);

  useEffect(() => {
    if (loadedData[activeTab]) {
      loadActiveTabData(1);
    }
  }, [filter, searchQuery]);

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
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatDateShort = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
    if (!status) {
      if (activeTab === 'orders') return 'mobhis-status-processing';
      if (activeTab === 'subscriptions') return 'mobhis-status-pending';
      if (activeTab === 'payments') return 'mobhis-status-pending';
      return 'mobhis-status-pending';
    }
    
    const statusLower = status.toLowerCase();
    
    if (activeTab === 'subscriptions') {
      switch (statusLower) {
        case 'active': return 'mobhis-status-active';
        case 'paused': return 'mobhis-status-paused';
        case 'pending': return 'mobhis-status-pending';
        case 'expired': return 'mobhis-status-expired';
        case 'cancelled': return 'mobhis-status-cancelled';
        default: return 'mobhis-status-pending';
      }
    }
    
    if (activeTab === 'orders') {
      switch (statusLower) {
        case 'processing': return 'mobhis-status-processing';
        case 'in-transit':
        case 'in_transit':
        case 'intransit': return 'mobhis-status-in-transit';
        case 'delivered': return 'mobhis-status-delivered';
        case 'cancelled': return 'mobhis-status-cancelled';
        default: return 'mobhis-status-processing';
      }
    }
    
    if (activeTab === 'payments') {
      switch (statusLower) {
        case 'pending': return 'mobhis-status-pending';
        case 'completed': return 'mobhis-status-completed';
        case 'failed': return 'mobhis-status-failed';
        default: return 'mobhis-status-pending';
      }
    }
    
    return 'mobhis-status-pending';
  };

  const getStatusIcon = (status) => {
    if (!status) {
      if (activeTab === 'orders') return <FaSpinner />;
      if (activeTab === 'subscriptions') return <FaClock />;
      if (activeTab === 'payments') return <FaClock />;
      return <FaClock />;
    }
    
    const statusLower = status.toLowerCase();
    
    if (activeTab === 'subscriptions') {
      switch (statusLower) {
        case 'active': return <FaCheckCircle />;
        case 'paused': return <FaPause />;
        case 'pending': return <FaClock />;
        case 'expired': return <FaExclamationTriangle />;
        case 'cancelled': return <FaTimes />;
        default: return <FaClock />;
      }
    }
    
    if (activeTab === 'orders') {
      switch (statusLower) {
        case 'processing': return <FaSpinner />;
        case 'in-transit':
        case 'in_transit':
        case 'intransit': return <FaTruck />;
        case 'delivered': return <FaCheckCircle />;
        case 'cancelled': return <FaTimes />;
        default: return <FaSpinner />;
      }
    }
    
    if (activeTab === 'payments') {
      switch (statusLower) {
        case 'pending': return <FaClock />;
        case 'completed': return <FaCheckCircle />;
        case 'failed': return <FaExclamationCircle />;
        default: return <FaClock />;
      }
    }
    
    return <FaClock />;
  };

  const getStatusText = (status) => {
    if (!status) {
      if (activeTab === 'orders') return 'Processing';
      if (activeTab === 'subscriptions') return 'Pending';
      if (activeTab === 'payments') return 'Pending';
      return 'Pending';
    }
    
    const statusLower = status.toLowerCase();
    
    if (activeTab === 'orders' && (statusLower === 'in-transit' || statusLower === 'in_transit' || statusLower === 'intransit')) {
      return 'In Transit';
    }
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
    setShowSearch(false);
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
    setShowFilters(false);
  };

  const handleReorder = (item) => {
    successToast(`Reorder initiated for ${item.orderId || 'selected item'}`);
    closeItemDetails();
  };

  const handleRetryPayment = (item) => {
    infoToast(`Retrying payment for transaction ${item.transactionId}`);
    closeItemDetails();
  };

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

  const getTabBadgeCount = (tab) => {
    return pagination[tab].total;
  };

  if (isLoading && filteredData.length === 0) {
    return (
      <div className="mobhis-history-page mobhis-loading">
        <div className="mobhis-loading-spinner">
          <FaSpinner className="mobhis-spin" />
        </div>
        <p>Loading history...</p>
      </div>
    );
  }

  return (
    <div className="mobhis-history-page">
      {/* Mobile Header */}
      <div className="mobhis-mobile-header">
        <div className="mobhis-mobile-header-top">
          <h1>History</h1>
          <div className="mobhis-mobile-header-actions">
            <button 
              className="mobhis-mobile-search-btn"
              onClick={() => setShowSearch(!showSearch)}
            >
              <FaSearch />
            </button>
            <button 
              className="mobhis-mobile-filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="mobhis-mobile-search-bar">
            <form onSubmit={handleSearchSubmit}>
              <div className="mobhis-mobile-search-input-wrapper">
                <FaSearch className="mobhis-search-icon" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="mobhis-mobile-search-input"
                  autoFocus
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={clearSearch} 
                    className="mobhis-mobile-clear-search"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Mobile Tabs */}
        <div className="mobhis-mobile-tabs">
          <button
            className={`mobhis-mobile-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('orders');
              infoToast('Switching to order history');
            }}
          >
            <FaShoppingCart className="mobhis-tab-icon" />
            <span className="mobhis-tab-text">Orders</span>
            <span className="mobhis-count-badge">{getTabBadgeCount('orders')}</span>
          </button>
          <button
            className={`mobhis-mobile-tab ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('subscriptions');
              infoToast('Switching to subscription history');
            }}
          >
            <FaCalendarAlt className="mobhis-tab-icon" />
            <span className="mobhis-tab-text">Subs</span>
            <span className="mobhis-count-badge">{getTabBadgeCount('subscriptions')}</span>
          </button>
          <button
            className={`mobhis-mobile-tab ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('payments');
              infoToast('Switching to payment history');
            }}
          >
            <FaCreditCard className="mobhis-tab-icon" />
            <span className="mobhis-tab-text">Payments</span>
            <span className="mobhis-count-badge">{getTabBadgeCount('payments')}</span>
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="mobhis-desktop-header">
        <h1>History</h1>
        <div className="mobhis-desktop-header-actions">
          <form onSubmit={handleSearchSubmit} className="mobhis-desktop-search-wrapper">
            <div className="mobhis-desktop-search-input-wrapper">
              <FaSearch className="mobhis-search-icon" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={handleSearchChange}
                className="mobhis-desktop-search-input"
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={clearSearch} 
                  className="mobhis-desktop-clear-search"
                >
                  <FaTimes />
                </button>
              )}
            </div>
            <button type="submit" className="mobhis-desktop-search-btn">
              Search
            </button>
          </form>

          <div className="mobhis-desktop-filter-wrapper">
            <FaFilter className="mobhis-filter-icon" />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                if (e.target.value !== 'all') {
                  infoToast(`Filtering by ${e.target.value} status`);
                }
              }}
              className="mobhis-desktop-filter-select"
            >
              <option value="all">All {activeTab}</option>
              {activeTab === 'subscriptions' && (
                <>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
              {activeTab === 'orders' && (
                <>
                  <option value="processing">Processing</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </>
              )}
              {activeTab === 'payments' && (
                <>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      {showFilters && (
        <div className="mobhis-mobile-filter-panel">
          <div className="mobhis-filter-panel-header">
            <h3>Filter Options</h3>
            <button onClick={() => setShowFilters(false)}>
              <FaTimes />
            </button>
          </div>
          <div className="mobhis-filter-panel-content">
            <div className="mobhis-mobile-filter-group">
              <label>Status Filter</label>
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  if (e.target.value !== 'all') {
                    infoToast(`Filtering by ${e.target.value} status`);
                  }
                }}
                className="mobhis-mobile-filter-select"
              >
                <option value="all">All {activeTab}</option>
                {activeTab === 'subscriptions' && (
                  <>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
                {activeTab === 'orders' && (
                  <>
                    <option value="processing">Processing</option>
                    <option value="in-transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </>
                )}
                {activeTab === 'payments' && (
                  <>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </>
                )}
              </select>
            </div>
            {filter !== 'all' && (
              <button className="mobhis-mobile-clear-filters" onClick={clearFilters}>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mobhis-error-message">
          <FaExclamationCircle className="mobhis-error-icon" />
          <span>{error}</span>
          <button onClick={() => setError('')} className="mobhis-close-error">
            <FaTimes />
          </button>
        </div>
      )}

      {/* Desktop Tabs */}
      <div className="mobhis-desktop-tabs">
        <button
          className={activeTab === 'orders' ? 'mobhis-desktop-tab active' : 'mobhis-desktop-tab'}
          onClick={() => {
            setActiveTab('orders');
            infoToast('Switching to order history');
          }}
        >
          <FaShoppingCart className="mobhis-tab-icon" />
          <span className="mobhis-tab-text">Orders</span>
          <span className="mobhis-count-badge">{getTabBadgeCount('orders')}</span>
        </button>
        <button
          className={activeTab === 'subscriptions' ? 'mobhis-desktop-tab active' : 'mobhis-desktop-tab'}
          onClick={() => {
            setActiveTab('subscriptions');
            infoToast('Switching to subscription history');
          }}
        >
          <FaCalendarAlt className="mobhis-tab-icon" />
          <span className="mobhis-tab-text">Subscriptions</span>
          <span className="mobhis-count-badge">{getTabBadgeCount('subscriptions')}</span>
        </button>
        <button
          className={activeTab === 'payments' ? 'mobhis-desktop-tab active' : 'mobhis-desktop-tab'}
          onClick={() => {
            setActiveTab('payments');
            infoToast('Switching to payment history');
          }}
        >
          <FaCreditCard className="mobhis-tab-icon" />
          <span className="mobhis-tab-text">Payments</span>
          <span className="mobhis-count-badge">{getTabBadgeCount('payments')}</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="mobhis-content-section">
        {/* Desktop Section Header */}
        <div className="mobhis-desktop-section-header">
          <h2>
            {activeTab === 'orders' && 'Order History'}
            {activeTab === 'subscriptions' && 'Subscription History'}
            {activeTab === 'payments' && 'Payment History'}
          </h2>
          <div className="mobhis-desktop-pagination-info">
            <span className="mobhis-count-badge">
              Showing {filteredData.length} of {currentPagination.total} items
              {currentPagination.pages > 1 && ` • Page ${currentPagination.page} of ${currentPagination.pages}`}
            </span>
          </div>
        </div>

        {/* Mobile Section Header */}
        <div className="mobhis-mobile-section-header">
          <div className="mobhis-mobile-section-title">
            <h2>
              {activeTab === 'orders' && 'Orders'}
              {activeTab === 'subscriptions' && 'Subscriptions'}
              {activeTab === 'payments' && 'Payments'}
            </h2>
            <span className="mobhis-mobile-count">
              {filteredData.length} items
            </span>
          </div>
          <div className="mobhis-mobile-sort-options">
            <button 
              className="mobhis-mobile-sort-btn"
              onClick={() => infoToast('Sort options coming soon')}
            >
              <FaList /> Sort
            </button>
          </div>
        </div>

        {/* Loading state for active tab */}
        {currentLoading ? (
          <div className="mobhis-table-loading">
            <div className="mobhis-loading-spinner">
              <FaSpinner className="mobhis-spin" />
            </div>
            <p>Loading {activeTab}...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <>
            {/* Mobile List View */}
            <div className="mobhis-mobile-list">
              {filteredData.map((item) => (
                <div key={item._id || item.id} className="mobhis-mobile-card">
                  <div className="mobhis-mobile-card-header">
                    <div className="mobhis-mobile-card-left">
                      <div className="mobhis-mobile-card-title">
                        {activeTab === 'orders' && (
                          <>
                            <div className="mobhis-mobile-card-id">Order #{item.orderId?.slice(-8) || item._id?.slice(-8)}</div>
                            <div className="mobhis-mobile-card-date">{formatDateShort(item.createdAt)}</div>
                          </>
                        )}
                        {activeTab === 'subscriptions' && (
                          <>
                            <div className="mobhis-mobile-card-plan">{item.planName}</div>
                            <div className="mobhis-mobile-card-size">{item.size} • {item.frequency}</div>
                          </>
                        )}
                        {activeTab === 'payments' && (
                          <>
                            <div className="mobhis-mobile-card-id">TXN #{item.transactionId?.slice(-8) || item._id?.slice(-8)}</div>
                            <div className="mobhis-mobile-card-date">{formatDateShort(item.createdAt)}</div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="mobhis-mobile-card-right">
                      <span className={`mobhis-mobile-status ${getStatusClass(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span>{getStatusText(item.status)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mobhis-mobile-card-body">
                    {activeTab === 'orders' && (
                      <div className="mobhis-mobile-card-details">
                        <div className="mobhis-mobile-card-amount">{formatCurrency(item.totalAmount || item.amount || 0)}</div>
                        <div className="mobhis-mobile-card-items">
                          {item.items?.slice(0, 2).map((p, i) => (
                            <span key={i} className="mobhis-mobile-card-item">
                              {(p.quantity || 1)} × {p.name?.substring(0, 20) || 'Product'}
                              {item.items.length > 2 && i === 1 && ` +${item.items.length - 2} more`}
                            </span>
                          ))}
                          {(!item.items || item.items.length === 0) && (
                            <span className="mobhis-mobile-card-item">No items</span>
                          )}
                        </div>
                      </div>
                    )}
                    {activeTab === 'subscriptions' && (
                      <div className="mobhis-mobile-card-details">
                        <div className="mobhis-mobile-card-amount">{formatCurrency(item.price || 0)}</div>
                        <div className="mobhis-mobile-card-period">
                          {formatDateShort(item.startDate)} - {item.endDate ? formatDateShort(item.endDate) : 'Present'}
                        </div>
                      </div>
                    )}
                    {activeTab === 'payments' && (
                      <div className="mobhis-mobile-card-details">
                        <div className="mobhis-mobile-card-amount">{formatCurrency(item.amount || 0)}</div>
                        <div className="mobhis-mobile-card-method">{getMethodName(item.method)}</div>
                        {item.failureReason && (
                          <div className="mobhis-mobile-card-reason">{item.failureReason}</div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mobhis-mobile-card-footer">
                    <button
                      className="mobhis-mobile-view-btn"
                      onClick={() => viewItemDetails(item)}
                    >
                      <FaEye className="mobhis-btn-icon" />
                      View Details
                    </button>
                    {activeTab === 'orders' && item.status === 'delivered' && (
                      <button
                        className="mobhis-mobile-action-btn"
                        onClick={() => handleReorder(item)}
                      >
                        <FaRedo className="mobhis-btn-icon" />
                        Reorder
                      </button>
                    )}
                    {activeTab === 'payments' && item.status === 'failed' && (
                      <button
                        className="mobhis-mobile-action-btn"
                        onClick={() => handleRetryPayment(item)}
                      >
                        <FaRedo className="mobhis-btn-icon" />
                        Retry
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="mobhis-desktop-table-container">
              <table className="mobhis-desktop-history-table">
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
                          <td data-label="Order ID">{item.orderId || item._id || 'N/A'}</td>
                          <td data-label="Date">{formatDate(item.createdAt)}</td>
                          <td data-label="Items">
                            {item.items?.length ? (
                              item.items.map((p, i) => (
                                <div key={i} className="mobhis-product-item">
                                  {(p.quantity || 1)} × {p.name || 'Unnamed Product'}
                                </div>
                              ))
                            ) : (
                              <div>No items</div>
                            )}
                          </td>
                          <td data-label="Amount">{formatCurrency(item.totalAmount || item.amount || 0)}</td>
                          <td data-label="Status" className={getStatusClass(item.status)}>
                            <span className="mobhis-status-content">
                              {getStatusIcon(item.status)}
                              {getStatusText(item.status)}
                            </span>
                          </td>
                          <td data-label="Actions">
                            <button
                              className="mobhis-btn-view"
                              onClick={() => viewItemDetails(item)}
                            >
                              <FaEye className="mobhis-btn-icon" />
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
                          <td data-label="Price">{formatCurrency(item.price || 0)}</td>
                          <td data-label="Period">
                            {formatDate(item.startDate)} -{' '}
                            {item.endDate ? formatDate(item.endDate) : 'Present'}
                          </td>
                          <td data-label="Status" className={getStatusClass(item.status)}>
                            <span className="mobhis-status-content">
                              {getStatusIcon(item.status)}
                              {getStatusText(item.status)}
                            </span>
                          </td>
                          <td data-label="Actions">
                            <button
                              className="mobhis-btn-view"
                              onClick={() => viewItemDetails(item)}
                            >
                              <FaEye className="mobhis-btn-icon" />
                              View
                            </button>
                          </td>
                        </>
                      )}

                      {activeTab === 'payments' && (
                        <>
                          <td data-label="Transaction ID">{item.transactionId || item._id || 'N/A'}</td>
                          <td data-label="Date">{formatDate(item.createdAt)}</td>
                          <td data-label="Description">{item.description || 'Payment'}</td>
                          <td data-label="Amount">{formatCurrency(item.amount || 0)}</td>
                          <td data-label="Method">{getMethodName(item.method)}</td>
                          <td data-label="Status" className={getStatusClass(item.status)}>
                            <span className="mobhis-status-content">
                              {getStatusIcon(item.status)}
                              {getStatusText(item.status)}
                            </span>
                            {item.failureReason && (
                              <div className="mobhis-failure-reason">({item.failureReason})</div>
                            )}
                          </td>
                          <td data-label="Actions">
                            <button
                              className="mobhis-btn-view"
                              onClick={() => viewItemDetails(item)}
                            >
                              <FaEye className="mobhis-btn-icon" />
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

            {/* Mobile Pagination */}
            {currentPagination.pages > 1 && (
              <div className="mobhis-mobile-pagination">
                <button
                  className="mobhis-mobile-pagination-btn"
                  onClick={() => handlePageChange(currentPagination.page - 1)}
                  disabled={currentPagination.page <= 1}
                >
                  <FaChevronLeft />
                </button>
                <div className="mobhis-mobile-page-info">
                  Page {currentPagination.page} of {currentPagination.pages}
                </div>
                <button
                  className="mobhis-mobile-pagination-btn"
                  onClick={() => handlePageChange(currentPagination.page + 1)}
                  disabled={currentPagination.page >= currentPagination.pages}
                >
                  <FaChevronRight />
                </button>
              </div>
            )}

            {/* Desktop Pagination Controls */}
            {currentPagination.pages > 1 && (
              <div className="mobhis-desktop-pagination-controls">
                <button
                  className="mobhis-desktop-pagination-btn prev"
                  onClick={() => handlePageChange(currentPagination.page - 1)}
                  disabled={currentPagination.page <= 1}
                >
                  <FaChevronLeft />
                  Previous
                </button>
                
                <div className="mobhis-desktop-pagination-numbers">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span key={`ellipsis-${index}`} className="mobhis-desktop-pagination-ellipsis">
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        className={`mobhis-desktop-pagination-number ${
                          currentPagination.page === pageNum ? 'active' : ''
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                <button
                  className="mobhis-desktop-pagination-btn next"
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
          <div className="mobhis-no-history">
            <div className="mobhis-no-history-content">
              <div className="mobhis-no-history-icon">
                {activeTab === 'orders' && <FaShoppingCart />}
                {activeTab === 'subscriptions' && <FaCalendarAlt />}
                {activeTab === 'payments' && <FaCreditCard />}
              </div>
              <p>No {activeTab} history found.</p>
              {(filter !== 'all' || searchQuery) && (
                <button 
                  className="mobhis-btn-clear-filters"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Detail Modal */}
      {activeItem && (
        <div className="mobhis-mobile-detail-modal">
          <div className="mobhis-mobile-modal-overlay" onClick={closeItemDetails}></div>
          <div className="mobhis-mobile-modal-content">
            <div className="mobhis-mobile-modal-header">
              <h2>
                {activeTab === 'orders' && `Order #${activeItem.orderId || activeItem._id}`}
                {activeTab === 'subscriptions' && `Subscription - ${activeItem.planName}`}
                {activeTab === 'payments' && `Payment #${activeItem.transactionId || activeItem._id}`}
              </h2>
              <button className="mobhis-mobile-close-btn" onClick={closeItemDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="mobhis-mobile-modal-body">
              <div className="mobhis-mobile-modal-details">
                {activeTab === 'orders' && (
                  <>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Order ID:</span>
                      <span className="mobhis-mobile-detail-value">{activeItem.orderId || activeItem._id}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Date:</span>
                      <span className="mobhis-mobile-detail-value">{formatDate(activeItem.createdAt)}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Status:</span>
                      <span className={`mobhis-mobile-detail-value ${getStatusClass(activeItem.status)}`}>
                        {getStatusIcon(activeItem.status)} {getStatusText(activeItem.status)}
                      </span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Amount:</span>
                      <span className="mobhis-mobile-detail-value mobhis-amount">{formatCurrency(activeItem.totalAmount)}</span>
                    </div>
                    <div className="mobhis-mobile-detail-section">
                      <h3>Order Items</h3>
                      {activeItem.items?.map((item, index) => (
                        <div key={index} className="mobhis-mobile-order-item">
                          <div className="mobhis-mobile-item-name">{item.name}</div>
                          <div className="mobhis-mobile-item-details">
                            Quantity: {item.quantity} • Price: {formatCurrency(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'subscriptions' && (
                  <>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Plan:</span>
                      <span className="mobhis-mobile-detail-value">{activeItem.planName}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Status:</span>
                      <span className={`mobhis-mobile-detail-value ${getStatusClass(activeItem.status)}`}>
                        {getStatusIcon(activeItem.status)} {getStatusText(activeItem.status)}
                      </span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Size:</span>
                      <span className="mobhis-mobile-detail-value">{activeItem.size}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Frequency:</span>
                      <span className="mobhis-mobile-detail-value">{activeItem.frequency}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Price:</span>
                      <span className="mobhis-mobile-detail-value mobhis-amount">{formatCurrency(activeItem.price)}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Period:</span>
                      <span className="mobhis-mobile-detail-value">
                        {formatDate(activeItem.startDate)} to {formatDate(activeItem.endDate) || 'Present'}
                      </span>
                    </div>
                  </>
                )}

                {activeTab === 'payments' && (
                  <>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Transaction ID:</span>
                      <span className="mobhis-mobile-detail-value">{activeItem.transactionId || activeItem._id}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Date:</span>
                      <span className="mobhis-mobile-detail-value">{formatDate(activeItem.createdAt)}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Status:</span>
                      <span className={`mobhis-mobile-detail-value ${getStatusClass(activeItem.status)}`}>
                        {getStatusIcon(activeItem.status)} {getStatusText(activeItem.status)}
                      </span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Amount:</span>
                      <span className="mobhis-mobile-detail-value mobhis-amount">{formatCurrency(activeItem.amount)}</span>
                    </div>
                    <div className="mobhis-mobile-detail-row">
                      <span className="mobhis-mobile-detail-label">Method:</span>
                      <span className="mobhis-mobile-detail-value">{getMethodName(activeItem.method)}</span>
                    </div>
                    {activeItem.failureReason && (
                      <div className="mobhis-mobile-detail-row">
                        <span className="mobhis-mobile-detail-label">Reason:</span>
                        <span className="mobhis-mobile-detail-value mobhis-failure-reason">{activeItem.failureReason}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="mobhis-mobile-modal-footer">
              <button className="mobhis-mobile-btn-close" onClick={closeItemDetails}>
                Close
              </button>
              {activeTab === 'orders' && activeItem.status === 'delivered' && (
                <button 
                  className="mobhis-mobile-btn-reorder"
                  onClick={() => handleReorder(activeItem)}
                >
                  <FaRedo className="mobhis-btn-icon" />
                  Reorder
                </button>
              )}
              {activeTab === 'payments' && activeItem.status === 'failed' && (
                <button 
                  className="mobhis-mobile-btn-retry"
                  onClick={() => handleRetryPayment(activeItem)}
                >
                  <FaRedo className="mobhis-btn-icon" />
                  Retry Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Detail Modal */}
      {activeItem && (
        <div className="mobhis-desktop-detail-modal">
          <div className="mobhis-desktop-modal-overlay" onClick={closeItemDetails}></div>
          <div className="mobhis-desktop-modal-content">
            <div className="mobhis-desktop-modal-header">
              <h2>
                {activeTab === 'orders' && `Order #${activeItem.orderId || activeItem._id}`}
                {activeTab === 'subscriptions' && `Subscription - ${activeItem.planName}`}
                {activeTab === 'payments' && `Payment #${activeItem.transactionId || activeItem._id}`}
              </h2>
              <button className="mobhis-desktop-close-btn" onClick={closeItemDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="mobhis-desktop-modal-body">
              <div className="mobhis-desktop-modal-details">
                {/* Desktop modal content remains the same as original */}
                {activeTab === 'orders' && (
                  <>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Order ID:</span>
                      <span className="mobhis-detail-value">{activeItem.orderId || activeItem._id}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Order Date:</span>
                      <span className="mobhis-detail-value">{formatDate(activeItem.createdAt)}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Status:</span>
                      <span className={`mobhis-detail-value ${getStatusClass(activeItem.status)}`}>
                        {getStatusIcon(activeItem.status)} {getStatusText(activeItem.status)}
                      </span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Total Amount:</span>
                      <span className="mobhis-detail-value mobhis-amount">{formatCurrency(activeItem.totalAmount)}</span>
                    </div>
                    
                    <div className="mobhis-detail-section">
                      <h3>Order Items</h3>
                      {activeItem.items?.map((item, index) => (
                        <div key={index} className="mobhis-order-item">
                          <div className="mobhis-item-name">{item.name}</div>
                          <div className="mobhis-item-details">
                            Quantity: {item.quantity} • Price: {formatCurrency(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activeTab === 'subscriptions' && (
                  <>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Plan Name:</span>
                      <span className="mobhis-detail-value">{activeItem.planName}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Status:</span>
                      <span className={`mobhis-detail-value ${getStatusClass(activeItem.status)}`}>
                        {getStatusIcon(activeItem.status)} {getStatusText(activeItem.status)}
                      </span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Size:</span>
                      <span className="mobhis-detail-value">{activeItem.size}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Frequency:</span>
                      <span className="mobhis-detail-value">{activeItem.frequency}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Price:</span>
                      <span className="mobhis-detail-value mobhis-amount">{formatCurrency(activeItem.price)}</span>
                    </div>
                  </>
                )}

                {activeTab === 'payments' && (
                  <>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Transaction ID:</span>
                      <span className="mobhis-detail-value">{activeItem.transactionId || activeItem._id}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Payment Date:</span>
                      <span className="mobhis-detail-value">{formatDate(activeItem.createdAt)}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Status:</span>
                      <span className={`mobhis-detail-value ${getStatusClass(activeItem.status)}`}>
                        {getStatusIcon(activeItem.status)} {getStatusText(activeItem.status)}
                      </span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Amount:</span>
                      <span className="mobhis-detail-value mobhis-amount">{formatCurrency(activeItem.amount)}</span>
                    </div>
                    <div className="mobhis-detail-row">
                      <span className="mobhis-detail-label">Payment Method:</span>
                      <span className="mobhis-detail-value">{getMethodName(activeItem.method)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mobhis-desktop-modal-footer">
              <button className="mobhis-btn-close" onClick={closeItemDetails}>
                Close
              </button>
              {activeTab === 'orders' && activeItem.status === 'delivered' && (
                <button 
                  className="mobhis-btn-reorder"
                  onClick={() => handleReorder(activeItem)}
                >
                  <FaRedo className="mobhis-btn-icon" />
                  Reorder
                </button>
              )}
              {activeTab === 'payments' && activeItem.status === 'failed' && (
                <button 
                  className="mobhis-btn-retry"
                  onClick={() => handleRetryPayment(activeItem)}
                >
                  <FaRedo className="mobhis-btn-icon" />
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