// components/OrderManagement.js
import React, { useState, useEffect, useMemo } from 'react';
import { FaChartBar, FaSyncAlt } from 'react-icons/fa';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import OrderFilters from './OrderFilters';
import BulkActions from './BulkActions';
import OrderAnalytics from './OrderAnalytics';
import RoleBasedAccess from './RoleBasedAccess';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [view, setView] = useState('list');
  const [userRole, setUserRole] = useState('admin'); // This would come from auth context
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    paymentMethod: 'all',
    deliveryOption: 'all',
    dateRange: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Permissions based on roles
  const permissions = {
    admin: {
      canEditOrder: true,
      canEditPayment: true,
      canDelete: true,
      canBulkUpdate: true,
      canViewAnalytics: true
    },
    manager: {
      canEditOrder: true,
      canEditPayment: false,
      canDelete: false,
      canBulkUpdate: true,
      canViewAnalytics: true
    },
    support: {
      canEditOrder: false,
      canEditPayment: false,
      canDelete: false,
      canBulkUpdate: false,
      canViewAnalytics: false
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
    if (token) {
      fetchOrders();
    } else {
      setError("No authentication token found. Please log in again.");
      setLoading(false);
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");

      const response = await fetch("http://localhost:5000/api/v1/admin/orders", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || data.data || []);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const updateOrderStatus = async (orderId, newStatus) => {
    if (!permissions[userRole]?.canEditOrder) {
      return { success: false, message: 'Unauthorized to update order status' };
    }

    try {
      const response = await fetch(`https://egas-server.onrender.com/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        ));
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus });
        }
        
        return { success: true, message: 'Order status updated successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to update order status' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const updatePaymentStatus = async (orderId, newStatus) => {
    if (!permissions[userRole]?.canEditPayment) {
      return { success: false, message: 'Unauthorized to update payment status' };
    }

    try {
      const response = await fetch(`https://egas-server.onrender.com/api/v1/admin/orders/${orderId}/payment-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, paymentStatus: newStatus } : order
        ));
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: newStatus });
        }
        
        return { success: true, message: 'Payment status updated successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to update payment status' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const updateTracking = async (orderId, trackingData) => {
    try {
      const response = await fetch(`https://egas-server.onrender.com/api/v1/orders/${orderId}/tracking`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tracking: trackingData }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, tracking: trackingData } : order
        ));
        
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, tracking: trackingData });
        }
        
        return { success: true, message: 'Tracking updated successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to update tracking' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const bulkUpdateStatus = async (orderIds, newStatus) => {
    if (!permissions[userRole]?.canBulkUpdate) {
      return { success: false, message: 'Unauthorized for bulk operations' };
    }

    try {
      const response = await fetch(`https://egas-server.onrender.com/api/v1/admin/orders/bulk-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderIds, orderStatus: newStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrders(orders.map(order => 
          orderIds.includes(order._id) ? { ...order, orderStatus: newStatus } : order
        ));
        setSelectedOrders(new Set());
        return { success: true, message: 'Orders updated successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to update orders' };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      // Filter by order status
      if (filters.status !== 'all' && order.orderStatus !== filters.status) {
        return false;
      }
      
      // Filter by payment status
      if (filters.paymentStatus !== 'all' && order.paymentStatus !== filters.paymentStatus) {
        return false;
      }

      // Filter by payment method
      if (filters.paymentMethod !== 'all' && order.paymentMethod !== filters.paymentMethod) {
        return false;
      }

      // Filter by delivery option
      if (filters.deliveryOption !== 'all' && order.deliveryOption !== filters.deliveryOption) {
        return false;
      }
      
      // Filter by date range
      if (filters.dateRange !== 'all') {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            if (orderDate.toDateString() !== today.toDateString()) return false;
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            if (orderDate < weekAgo) return false;
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            if (orderDate < monthAgo) return false;
            break;
          default:
            break;
        }
      }
      
      // Filter by search term
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          order.orderId?.toLowerCase().includes(searchTerm) ||
          order.reference?.toLowerCase().includes(searchTerm) ||
          order.user?.firstName?.toLowerCase().includes(searchTerm) ||
          order.user?.lastName?.toLowerCase().includes(searchTerm) ||
          order.user?.email?.toLowerCase().includes(searchTerm) ||
          order.deliveryAddress?.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }
      
      return true;
    });

    // Sort orders
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];

      if (filters.sortBy === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (filters.sortBy === 'totalAmount') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [orders, filters]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedOrder(null);
  };

  const handleOrderSelect = (orderId, isSelected) => {
    const newSelected = new Set(selectedOrders);
    if (isSelected) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedOrders(new Set(filteredAndSortedOrders.map(order => order._id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  if (view === 'details' && selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={handleBackToList}
        onUpdateOrderStatus={updateOrderStatus}
        onUpdatePaymentStatus={updatePaymentStatus}
        onUpdateTracking={updateTracking}
        permissions={permissions[userRole]}
      />
    );
  }

  if (view === 'analytics') {
    return (
      <OrderAnalytics
        orders={orders}
        onBack={() => setView('list')}
        permissions={permissions[userRole]}
      />
    );
  }

  return (
    <div className="aom-order-management">
      <div className="aom-order-header">
        <div className="aom-header-left">
          <h1>Order Management</h1>
          <span className="aom-order-count">
            {filteredAndSortedOrders.length} of {orders.length} orders
          </span>
        </div>
        <div className="aom-header-actions">
          <RoleBasedAccess permission={permissions[userRole]?.canViewAnalytics}>
            <button 
              onClick={() => setView('analytics')} 
              className="aom-btn-analytics"
            >
              <FaChartBar className="aom-icon" /> Analytics
            </button>
          </RoleBasedAccess>
          <button onClick={fetchOrders} className="aom-btn-refresh">
            <FaSyncAlt className="aom-icon" /> Refresh
          </button>
        </div>
      </div>

      <OrderFilters 
        filters={filters} 
        onFilterChange={setFilters}
        orderCount={filteredAndSortedOrders.length}
      />

      {selectedOrders.size > 0 && (
        <BulkActions
          selectedCount={selectedOrders.size}
          onBulkUpdateStatus={bulkUpdateStatus}
          selectedOrderIds={Array.from(selectedOrders)}
          onClearSelection={() => setSelectedOrders(new Set())}
          permissions={permissions[userRole]}
        />
      )}
      
      <OrderList
        orders={filteredAndSortedOrders}
        loading={loading}
        error={error}
        selectedOrders={selectedOrders}
        onViewOrder={handleViewOrder}
        onUpdateOrderStatus={updateOrderStatus}
        onOrderSelect={handleOrderSelect}
        onSelectAll={handleSelectAll}
        permissions={permissions[userRole]}
      />
    </div>
  );
};

export default OrderManagement;