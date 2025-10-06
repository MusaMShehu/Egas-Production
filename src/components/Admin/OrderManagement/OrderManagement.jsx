// components/OrderManagement.js
import React, { useState, useEffect } from 'react';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails';
import OrderFilters from './OrderFilters';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [view, setView] = useState('list'); 
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    search: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://egas-server.onrender.com/api/v1/orders');
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders);
      } else {
        setError(data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
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

  const filteredOrders = orders.filter(order => {
    // Filter by order status
    if (filters.status !== 'all' && order.orderStatus !== filters.status) {
      return false;
    }
    
    // Filter by payment status
    if (filters.paymentStatus !== 'all' && order.paymentStatus !== filters.paymentStatus) {
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
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          if (orderDate < weekStart) return false;
          break;
        case 'month':
          if (orderDate.getMonth() !== today.getMonth() || orderDate.getFullYear() !== today.getFullYear()) return false;
          break;
        default:
          break;
      }
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = 
        order.orderId.toLowerCase().includes(searchTerm) ||
        order.user?.firstName?.toLowerCase().includes(searchTerm) ||
        order.user?.lastName?.toLowerCase().includes(searchTerm) ||
        order.user?.email?.toLowerCase().includes(searchTerm) ||
        order.deliveryAddress.toLowerCase().includes(searchTerm);
      
      if (!matchesSearch) return false;
    }
    
    return true;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedOrder(null);
  };

  if (view === 'details' && selectedOrder) {
    return (
      <OrderDetails
        order={selectedOrder}
        onBack={handleBackToList}
        onUpdateOrderStatus={updateOrderStatus}
        onUpdatePaymentStatus={updatePaymentStatus}
      />
    );
  }

  return (
    <div className="order-management">
      <div className="order-header">
        <h1>Order Management</h1>
        <button onClick={fetchOrders} className="btn-refresh">
          <i className="fas fa-sync-alt"></i> Refresh
        </button>
      </div>

      <OrderFilters filters={filters} onFilterChange={setFilters} />
      
      <OrderList
        orders={filteredOrders}
        loading={loading}
        error={error}
        onViewOrder={handleViewOrder}
        onUpdateOrderStatus={updateOrderStatus}
      />
    </div>
  );
};

export default OrderManagement;