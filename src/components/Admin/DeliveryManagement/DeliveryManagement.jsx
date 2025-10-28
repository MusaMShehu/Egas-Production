// components/AdminDeliveryManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaUserCheck, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSync, 
  FaPlus,
  FaEye,
  FaSearch
} from 'react-icons/fa';
import './DeliveryManagement.css';

const AdminDeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    deliveryDate: '',
    search: '',
  });
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDeliveries();
    fetchStats();
    fetchAgents();
  }, [page, rowsPerPage, filters]);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
        ...filters,
      }).toString();

      const response = await fetch(`http://localhost:5000/api/v1/admin/delivery?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setDeliveries(data.data);
        setTotal(data.total);
      }
    } catch (error) {
      showSnackbar('Error fetching deliveries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/delivery/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };


const fetchAgents = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/admin/users?role=delivery', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    console.log("Agents API response:", data);

    if (data.success) {
      const agentsArray = Array.isArray(data.data)
        ? data.data
        : data.data?.users || [];
      setAgents(agentsArray);
    } else {
      setAgents([]);
    }
  } catch (error) {
    console.error('Error fetching agents:', error);
    setAgents([]);
  }
};


  const handleAssignAgent = (delivery) => {
    setSelectedDelivery(delivery);
    setSelectedAgent('');
    setAssignDialogOpen(true);
  };

  const confirmAssignAgent = async () => {
    if (!selectedAgent) {
      showSnackbar('Please select an agent', 'error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/admin/delivery/${selectedDelivery._id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ deliveryAgentId: selectedAgent })
      });

      const data = await response.json();
      
      if (data.success) {
        showSnackbar('Delivery assigned successfully', 'success');
        setAssignDialogOpen(false);
        fetchDeliveries();
      } else {
        showSnackbar(data.message, 'error');
      }
    } catch (error) {
      showSnackbar('Error assigning delivery', 'error');
    }
  };

  const generateSchedules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/delivery/generate-schedules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ daysAhead: 7 })
      });

      const data = await response.json();
      
      if (data.success) {
        showSnackbar(`Generated ${data.generatedCount} delivery schedules`, 'success');
        fetchDeliveries();
      }
    } catch (error) {
      showSnackbar('Error generating schedules', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => {
      setSnackbar({ ...snackbar, open: false });
    }, 6000);
  };

  const getStatusClass = (status) => {
    const statusMap = {
      pending: 'adm-status-pending',
      assigned: 'adm-status-assigned',
      accepted: 'adm-status-accepted',
      out_for_delivery: 'adm-status-out_for_delivery',
      delivered: 'adm-status-delivered',
      failed: 'adm-status-failed',
      cancelled: 'adm-status-pending'
    };
    return `adm-status-chip ${statusMap[status] || 'adm-status-pending'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (filter, value) => {
    setFilters(prev => ({ ...prev, [filter]: value }));
    setPage(0);
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="adm-delivery-management">
      {/* Header and Stats */}
      <div className="adm-delivery-header">
        <h1 className="adm-delivery-title">Delivery Management</h1>
        <button
          className="adm-btn adm-btn-primary"
          onClick={generateSchedules}
        >
          <FaPlus className="adm-icon" />
          Generate Schedules
        </button>
      </div>

      {/* Stats Grid */}
      <div className="adm-stats-grid">
        <div className="adm-stat-card">
          <div className="adm-stat-label">Total Today</div>
          <div className="adm-stat-value">{stats.today?.total || 0}</div>
        </div>
        <div className="adm-stat-card success">
          <div className="adm-stat-label">Delivered Today</div>
          <div className="adm-stat-value">{stats.today?.delivered || 0}</div>
        </div>
        <div className="adm-stat-card warning">
          <div className="adm-stat-label">Pending Today</div>
          <div className="adm-stat-value">{stats.today?.pending || 0}</div>
        </div>
        <div className="adm-stat-card error">
          <div className="adm-stat-label">Failed Today</div>
          <div className="adm-stat-value">{stats.today?.failed || 0}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="adm-filters-card">
        <div className="adm-filters-grid">
          <div className="adm-form-group">
            <label className="adm-form-label">Search</label>
            <div style={{ position: 'relative' }}>
              <FaSearch className="adm-icon" style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#7f8c8d'
              }} />
              <input
                type="text"
                className="adm-form-input"
                style={{ paddingLeft: '40px' }}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by customer, address, or plan..."
              />
            </div>
          </div>
          
          <div className="adm-form-group">
            <label className="adm-form-label">Status</label>
            <select
              className="adm-form-select"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="accepted">Accepted</option>
              <option value="out_for_delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="adm-form-group">
            <label className="adm-form-label">Delivery Date</label>
            <input
              type="date"
              className="adm-form-input"
              value={filters.deliveryDate}
              onChange={(e) => handleFilterChange('deliveryDate', e.target.value)}
            />
          </div>
          
          <div className="adm-form-group">
            <button
              className="adm-btn adm-btn-outline"
              onClick={fetchDeliveries}
            >
              <FaSync className="adm-icon" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Delivery List */}
      {loading ? (
        <div className="adm-loading">
          <div className="adm-spinner"></div>
        </div>
      ) : (
        <div className="adm-table-container">
          <table className="adm-delivery-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Delivery Date</th>
                <th>Address</th>
                <th>Agent</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery._id}>
                  <td>
                    <div className="adm-customer-info">
                      <div className="adm-customer-name">{delivery.customerName}</div>
                      <div className="adm-customer-phone">{delivery.customerPhone}</div>
                    </div>
                  </td>
                  <td>
                    <div className="adm-plan-info">
                      <div className="adm-plan-name">{delivery.planDetails.planName}</div>
                      <div className="adm-plan-details">
                        {delivery.planDetails.size} • {delivery.planDetails.frequency}
                      </div>
                    </div>
                  </td>
                  <td>
                    {formatDate(delivery.deliveryDate)}
                  </td>
                  <td>
                    <div className="adm-address">
                      {delivery.address}
                    </div>
                  </td>
                  <td>
                    {delivery.deliveryAgent ? (
                      <div className="adm-agent-info">
                        {delivery.deliveryAgent.firstName} {delivery.deliveryAgent.lastName}
                      </div>
                    ) : (
                      <div className="adm-agent-unassigned">
                        Not assigned
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={getStatusClass(delivery.status)}>
                      {delivery.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    {!delivery.deliveryAgent && delivery.status === 'pending' && (
                      <button
                        className="adm-btn adm-btn-outline adm-btn-small"
                        onClick={() => handleAssignAgent(delivery)}
                      >
                        <FaUserCheck className="adm-icon" />
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="adm-pagination">
            <div className="adm-pagination-info">
              Showing {deliveries.length} of {total} deliveries
            </div>
            <div className="adm-pagination-controls">
              <select
                className="adm-pagination-select"
                value={rowsPerPage}
                onChange={handleChangeRowsPerPage}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
              </select>
              
              <div className="adm-pagination-buttons">
                <button
                  className="adm-page-btn"
                  disabled={page === 0}
                  onClick={() => handleChangePage(page - 1)}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = i + Math.max(0, page - 2);
                  if (pageNumber >= totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      className={`adm-page-btn ${page === pageNumber ? 'active' : ''}`}
                      onClick={() => handleChangePage(pageNumber)}
                    >
                      {pageNumber + 1}
                    </button>
                  );
                })}
                
                <button
                  className="adm-page-btn"
                  disabled={page >= totalPages - 1}
                  onClick={() => handleChangePage(page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && deliveries.length === 0 && (
        <div className="adm-empty-state">
          <h3>No deliveries found</h3>
          <p>No delivery orders match your current filters.</p>
        </div>
      )}

      {/* Assign Agent Dialog */}
      {assignDialogOpen && (
        <div className="adm-dialog-overlay">
          <div className="adm-dialog">
            <div className="adm-dialog-header">
              <h2 className="adm-dialog-title">Assign Delivery Agent</h2>
            </div>
            <div className="adm-dialog-content">
              <p style={{ marginBottom: '1rem', color: '#7f8c8d' }}>
                Assign delivery to {selectedDelivery?.customerName} for {selectedDelivery?.planDetails?.planName}
              </p>
              <div className="adm-form-group">
                <label className="adm-form-label">Select Agent</label>
                <select
                  className="adm-form-select"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  <option value="">Choose an agent...</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.firstName} {agent.lastName} - {agent.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="adm-dialog-footer">
              <button 
                className="adm-btn adm-btn-outline"
                onClick={() => setAssignDialogOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="adm-btn adm-btn-primary"
                onClick={confirmAssignAgent}
              >
                Assign Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      {snackbar.open && (
        <div className={`adm-snackbar ${snackbar.severity}`}>
          {snackbar.severity === 'success' ? (
            <FaCheckCircle className="adm-icon" />
          ) : (
            <FaTimesCircle className="adm-icon" />
          )}
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryManagement;