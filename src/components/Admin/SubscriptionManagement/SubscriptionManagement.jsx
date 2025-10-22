// components/SubscriptionManagement.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaSyncAlt, FaChartBar, FaPlus, FaEye, FaEdit, FaTrash, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import SubscriptionList from './SubscriptionList';
import SubscriptionForm from './SubscriptionForm';
import SubscriptionDetails from './SubscriptionDetails';
import BulkActions from './BulkActions';
import RoleBasedAccess from './RoleBasedAccess';
import ExportTools from './ExportTools';
import AnalyticsDashboard from './AnalyticsDashboard';
import SubscriptionFilters from './SubscriptionFilters';
import { useAdminSubscription } from '../../../hooks/useAdminSubscription';
import { usePermissions } from '../../../hooks/usePermissions';
import './SubscriptionManagement.css';

const SubscriptionManagement = () => {
  const [view, setView] = useState('list');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState(new Set());
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filters, setFilters] = useState({
    frequency: 'all',
    size: 'all',
    status: 'all',
    planType: 'all',
    search: '',
    dateRange: { start: null, end: null }
  });

  const {
    subscriptions,
    loading,
    error,
    fetchSubscriptions,
    createSubscription,
    updateSubscription,
    deleteSubscription,
    bulkUpdateSubscriptions,
    bulkDeleteSubscriptions,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    exportSubscriptions
  } = useAdminSubscription();

  const { hasPermission, userRole } = usePermissions();

  // Load subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Memoized filtered and sorted subscriptions
  const processedSubscriptions = useMemo(() => {
    let filtered = subscriptions.filter(subscription => {
      // Frequency filter
      if (filters.frequency !== 'all' && subscription.frequency !== filters.frequency) {
        return false;
      }
      
      // Size filter
      if (filters.size !== 'all' && subscription.size !== filters.size) {
        return false;
      }
      
      // Status filter
      if (filters.status !== 'all' && subscription.status !== filters.status) {
        return false;
      }

      // Plan type filter
      if (filters.planType !== 'all' && subscription.planType !== filters.planType) {
        return false;
      }
      
      // Date range filter
      if (filters.dateRange.start && filters.dateRange.end) {
        const subDate = new Date(subscription.createdAt);
        const start = new Date(filters.dateRange.start);
        const end = new Date(filters.dateRange.end);
        if (subDate < start || subDate > end) return false;
      }
      
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          subscription.planName?.toLowerCase().includes(searchTerm) ||
          subscription.userId?.firstName?.toLowerCase().includes(searchTerm) ||
          subscription.userId?.lastName?.toLowerCase().includes(searchTerm) ||
          subscription.userId?.email?.toLowerCase().includes(searchTerm) ||
          subscription._id?.toLowerCase().includes(searchTerm) ||
          subscription.reference?.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }
      
      return true;
    });

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key.includes('.')) {
          const keys = sortConfig.key.split('.');
          aValue = keys.reduce((obj, key) => obj?.[key], a);
          bValue = keys.reduce((obj, key) => obj?.[key], b);
        }

        // Handle date fields
        if (sortConfig.key === 'createdAt' || sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
          aValue = new Date(aValue || 0);
          bValue = new Date(bValue || 0);
        }

        // Handle different data types
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // Handle null/undefined values
        if (aValue == null) aValue = '';
        if (bValue == null) bValue = '';

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [subscriptions, filters, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleBulkAction = async (action, data) => {
    const subscriptionIds = Array.from(selectedSubscriptions);
    
    try {
      switch (action) {
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${subscriptionIds.length} subscriptions?`)) {
            await bulkDeleteSubscriptions(subscriptionIds);
          }
          break;
        case 'updateStatus':
          await bulkUpdateSubscriptions(subscriptionIds, { status: data.status });
          break;
        case 'updateFrequency':
          await bulkUpdateSubscriptions(subscriptionIds, { frequency: data.frequency });
          break;
        case 'pause':
          for (const id of subscriptionIds) {
            await pauseSubscription(id);
          }
          break;
        case 'resume':
          for (const id of subscriptionIds) {
            await resumeSubscription(id);
          }
          break;
        case 'cancel':
          for (const id of subscriptionIds) {
            await cancelSubscription(id);
          }
          break;
        default:
          console.warn('Unknown bulk action:', action);
          break;
      }
      
      setSelectedSubscriptions(new Set());
    } catch (error) {
      console.error('Bulk action failed:', error);
      // Error is handled in the hook
    }
  };

  const handleSubscriptionSelect = useCallback((subscriptionId, isSelected) => {
    setSelectedSubscriptions(prev => {
      const newSelection = new Set(prev);
      if (isSelected) {
        newSelection.add(subscriptionId);
      } else {
        newSelection.delete(subscriptionId);
      }
      return newSelection;
    });
  }, []);

  const handleSelectAll = useCallback((isSelected) => {
    if (isSelected) {
      setSelectedSubscriptions(new Set(processedSubscriptions.map(sub => sub._id)));
    } else {
      setSelectedSubscriptions(new Set());
    }
  }, [processedSubscriptions]);

  const handleViewSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setSelectedSubscription(null);
  };

  const handleCreateSubscription = async (subscriptionData) => {
    const result = await createSubscription(subscriptionData);
    if (result.success) {
      handleBackToList();
    }
    return result;
  };

  const handleUpdateSubscription = async (id, subscriptionData) => {
    const result = await updateSubscription(id, subscriptionData);
    if (result.success) {
      handleBackToList();
    }
    return result;
  };

  const handleDeleteSubscription = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      const result = await deleteSubscription(id);
      if (result.success) {
        handleBackToList();
      }
      return result;
    }
  };

  // Calculate statistics
  const stats = useMemo(() => ({
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    paused: subscriptions.filter(s => s.status === 'paused').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
    expired: subscriptions.filter(s => s.status === 'expired').length,
    pending: subscriptions.filter(s => s.status === 'pending').length,
  }), [subscriptions]);

  if (view === 'details' && selectedSubscription) {
    return (
      <RoleBasedAccess permission="subscriptions:read">
        <SubscriptionDetails
          subscription={selectedSubscription}
          onBack={handleBackToList}
          onUpdateSubscription={handleUpdateSubscription}
          onDeleteSubscription={handleDeleteSubscription}
          onPauseSubscription={pauseSubscription}
          onResumeSubscription={resumeSubscription}
          onCancelSubscription={cancelSubscription}
          userRole={userRole}
        />
      </RoleBasedAccess>
    );
  }

  if (view === 'create') {
    return (
      <RoleBasedAccess permission="subscriptions:create">
        <SubscriptionForm
          onSubmit={handleCreateSubscription}
          onCancel={handleBackToList}
          mode="create"
        />
      </RoleBasedAccess>
    );
  }

  if (view === 'analytics') {
    return (
      <RoleBasedAccess permission="subscriptions:analytics">
        <AnalyticsDashboard
          subscriptions={subscriptions}
          onBack={() => setView('list')}
        />
      </RoleBasedAccess>
    );
  }

  return (
    <div className="asm-subscription-management">
      <div className="asm-subscription-header">
        <div className="asm-header-main">
          <h1>Subscription Management</h1>
          <div className="asm-header-stats">
            <span className="asm-stat-item">
              Total: <strong>{stats.total}</strong>
            </span>
            <span className="asm-stat-item">
              Active: <strong>{stats.active}</strong>
            </span>
            <span className="asm-stat-item">
              Paused: <strong>{stats.paused}</strong>
            </span>
            <span className="asm-stat-item">
              Cancelled: <strong>{stats.cancelled}</strong>
            </span>
            <span className="asm-stat-item">
              Pending: <strong>{stats.pending}</strong>
            </span>
          </div>
        </div>
        
        <div className="asm-header-actions">
          <button 
            onClick={() => fetchSubscriptions()} 
            className="asm-btn asm-btn-refresh" 
            disabled={loading}
          >
            <FaSyncAlt className="asm-icon" /> {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          
          <ExportTools 
            subscriptions={processedSubscriptions} 
            onExport={exportSubscriptions}
          />
          
          {hasPermission('subscriptions:analytics') && (
            <button onClick={() => setView('analytics')} className="asm-btn asm-btn-analytics">
              <FaChartBar className="asm-icon" /> Analytics
            </button>
          )}
          
          {hasPermission('subscriptions:create') && (
            <button onClick={() => setView('create')} className="asm-btn asm-btn-create">
              <FaPlus className="asm-icon" /> New Subscription
            </button>
          )}
        </div>
      </div>

      <SubscriptionFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({
          frequency: 'all',
          size: 'all',
          status: 'all',
          planType: 'all',
          search: '',
          dateRange: { start: null, end: null }
        })}
      />

      {selectedSubscriptions.size > 0 && (
        <BulkActions
          selectedCount={selectedSubscriptions.size}
          onBulkAction={handleBulkAction}
          userRole={userRole}
        />
      )}

      <SubscriptionList
        subscriptions={processedSubscriptions}
        loading={loading}
        error={error}
        selectedSubscriptions={selectedSubscriptions}
        sortConfig={sortConfig}
        onSort={handleSort}
        onViewSubscription={handleViewSubscription}
        onEditSubscription={(subscription) => {
          setSelectedSubscription(subscription);
          setView('details');
        }}
        onDeleteSubscription={handleDeleteSubscription}
        onPauseSubscription={pauseSubscription}
        onResumeSubscription={resumeSubscription}
        onCancelSubscription={cancelSubscription}
        onSubscriptionSelect={handleSubscriptionSelect}
        onSelectAll={handleSelectAll}
        userRole={userRole}
      />
    </div>
  );
};

export default SubscriptionManagement;